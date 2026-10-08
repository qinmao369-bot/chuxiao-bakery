/* ============================================================
 * 初麦 CHUXIAO BAKERY · 数据库连接配置
 *
 * ⚠️ 这两个值是【公开】的，会随代码一起进仓库 —— 这是设计如此，不是疏忽。
 *
 * 为什么可以公开？
 *   Supabase 的 anon key 本来就是给前端用的，官方教程也是直接写在前端代码里。
 *   它的安全性不靠"保密"，靠数据库侧的 RLS（行级安全）策略：
 *   - 读：对所有人开放（访客要能看到商品）
 *   - 写：必须带 x-admin-token 且值匹配 —— 那个令牌存在你自己的浏览器里，不进仓库
 *   详见 supabase/schema.sql 第 4 节。
 *
 * 反过来说：如果这两个值只存在你本地浏览器（localStorage），
 * 访客打开前台就读不到数据库，只能看到内置的默认商品 —— 你改的东西别人看不见。
 * 所以 url 和 key 必须放在这里。
 *
 * 取值位置：Supabase 后台 → Project Settings → Data API / API Keys
 * ============================================================ */
window.ChuxiaoDBConfig = {
  // 例：'https://abcdefghijklmnop.supabase.co'
  url: '',

  // anon public key，一长串 JWT，以 eyJ 开头
  key: ''
};
