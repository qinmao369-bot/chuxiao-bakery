-- ============================================================
-- 初麦 CHUXIAO BAKERY · Supabase 建库脚本
--
-- 用法：Supabase 后台 → 左侧 SQL Editor → New query
--       整段粘进去 → Run
--       本脚本可重复执行（create table if not exists / drop policy if exists）
--
-- 字段说明见下方表结构注释，与前端 data.js 的商品字段一一对应。
-- 注意列名用 description 而非 desc —— desc 是 SQL 排序关键字，
-- 作为列名每次查询都得加双引号，容易踩坑。
-- ============================================================


-- ---------- 1. 建表 ----------
create table if not exists public.items (
  id          text        primary key,
  name        text        not null,
  price       numeric(10,2) not null default 0,
  wt          text        not null default '',
  description text        not null default '',
  tag         text        not null default '',
  tags        text        not null default '',
  cat         text        not null default 'bread',
  art         text        not null default 'sourdough',
  hot         boolean     not null default false,
  sold_out    boolean     not null default false,
  img         text        not null default '',
  sort        integer     not null default 0,
  updated_at  timestamptz not null default now()
);

-- 字段注释（Supabase 表编辑器里能看到，方便以后维护）
comment on table  public.items is '面包商品表';
comment on column public.items.img is '商品图片 URL；留空则前端回退为 SVG 插画';
comment on column public.items.art is 'SVG 插画库键名，无图时的占位图案';
comment on column public.items.sort is '前台展示顺序，小的在前';


-- ---------- 2. 约束（课程 10845：约束是数据库层面的数据验证规则）----------
-- 就算前端被绕过、有人直接调接口，脏数据也进不来。
do $$
begin
  -- 价格不能为负
  if not exists (select 1 from pg_constraint where conname = 'items_price_nonneg') then
    alter table public.items add constraint items_price_nonneg check (price >= 0);
  end if;

  -- 价格上限，防止误填
  if not exists (select 1 from pg_constraint where conname = 'items_price_max') then
    alter table public.items add constraint items_price_max check (price <= 9999);
  end if;

  -- 分类必须是四个合法值之一
  if not exists (select 1 from pg_constraint where conname = 'items_cat_check') then
    alter table public.items
      add constraint items_cat_check check (cat in ('bread','sweet','savory','drink'));
  end if;

  -- 名称不能是空串
  if not exists (select 1 from pg_constraint where conname = 'items_name_nonempty') then
    alter table public.items add constraint items_name_nonempty check (length(trim(name)) > 0);
  end if;
end $$;


-- ---------- 3. 索引（课程 10845：索引就像书的目录）----------
-- 前台按分类筛选，cat + sort 是主要查询路径。
create index if not exists items_cat_sort_idx on public.items (cat, sort);
-- 后台改价时按主键更新，主键本身已有索引，这里不用额外建。


-- ---------- 4. 行级安全 RLS ----------
alter table public.items enable row level security;

-- 4.1 读：完全公开 —— 访客要能看到商品，这是本站的全部意义
drop policy if exists "items_public_read" on public.items;
create policy "items_public_read"
  on public.items for select
  to anon, authenticated
  using (true);


-- 4.2 写：需要管理令牌（推荐）
--
-- 原理：PostgREST 会把请求头塞进 current_setting('request.headers')，
--       RLS 里能读出来。前端写操作必须带上 x-admin-token 头且值匹配才放行。
--
-- 这样即使 anon key 公开（纯静态站没法藏），写权限仍然收在你手里。
--
-- ⚠️ 把下面两处 YOUR_ADMIN_TOKEN_HERE 换成你自己生成的随机串。
--    生成方法：密码管理器随机 32 位，或终端跑 openssl rand -hex 16
--    换完记得在后台「数据库设置」里填同一个值（见 README）。
drop policy if exists "items_admin_write" on public.items;
create policy "items_admin_write"
  on public.items for all
  to anon
  using (
    current_setting('request.headers', true)::json->>'x-admin-token'
      = 'YOUR_ADMIN_TOKEN_HERE'
  )
  with check (
    current_setting('request.headers', true)::json->>'x-admin-token'
      = 'YOUR_ADMIN_TOKEN_HERE'
  );

-- 【备选：图省事就放开写】
-- 如果你觉得上面太麻烦（比如只是本地 demo），把 4.2 整段删掉，
-- 换成下面这两行。代价：任何人拿到 anon key 都能改你的商品价格。
--   drop policy if exists "items_open_write" on public.items;
--   create policy "items_open_write"
--     on public.items for all to anon using (true) with check (true);


-- ---------- 5. 初始数据（8 款出厂面包）----------
-- 已存在则跳过，不会覆盖你之后的修改。
insert into public.items
  (id, name, price, wt, description, tag, tags, cat, art, hot, sold_out, sort)
values
  ('b1','鲁邦乡村大列',42,'480g','36 小时低温发酵，撕开能看见密实的气孔组织，麦香厚重带微酸。','招牌','大列 乡村 招牌 麦香','bread','sourdough',true,false,1),
  ('b2','传统法棍',28,'250g','外壳薄脆到掉渣，内里蜂窝气孔清晰，直接法棍的经典形态。','现烤','法棍 欧包 脆','bread','baguette',true,false,2),
  ('b3','可颂 · 原味',18,'95g','发酵黄油起酥 27 层，出炉两小时内最酥。掉渣属正常，请用手接。','黄油','可颂 黄油 甜点 酥','sweet','croissant',false,false,3),
  ('b4','生吐司 · 牛奶',36,'400g','汤种配方，牛奶与淡奶油揉进面团，撕着吃拉丝，冷了也柔软。','','吐司 牛奶 甜点 早餐','sweet','toast',false,false,4),
  ('b5','恰巴塔 · 罗勒',32,'350g','意式乡村面包，拌入烘焙罗勒与橄榄油，烤后外脆内韧。','咸香','恰巴塔 罗勒 咸 欧包 咸味','savory','ciabatta',false,false,5),
  ('b6','核桃无花果',45,'400g','半核桃与无花果干，含水率偏高，适合配浓咖啡或茶。','限量','核桃 无花果 限量 欧包 果干','bread','nut',true,false,6),
  ('b7','手冲 · 今日豆',22,'240ml','埃塞俄比亚日晒或哥伦比亚水洗，每周五换豆，店员会问你要什么酸度。','现磨','咖啡 手冲 饮品 现磨','drink','coffee',false,false,7),
  ('b8','蜂蜜海盐蛋糕',26,'1 块','戚风胚体加本地百花蜜，表面一层薄盐霜。冷藏一夜更香。','新品','蛋糕 蜂蜜 海盐 甜点 新品','sweet','cake',false,false,8)
on conflict (id) do nothing;


-- ---------- 6. 验收：跑完看这三条 ----------
-- select count(*) from public.items;        -- 应为 8
-- select name, price from public.items order by sort limit 3;
-- select policyname, cmd from pg_policies where tablename = 'items';
