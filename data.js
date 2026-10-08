/* ============================================================
 * 初麦 CHUXIAO BAKERY · 数据层
 * 商品数据与插画库的唯一来源。
 * 前台 index.html 与后台 admin.html 共用此文件。
 *
 * 后台修改会写入 localStorage，前台启动时优先读取覆盖默认值。
 * ============================================================ */
(function (global) {
  'use strict';

  var STORE_KEY = 'chuxiao_items_v1';

  /* ---------- SVG 面包插画库（后台可作为「无图」时的占位选项） ---------- */
  var ART = {
    sourdough: '<svg viewBox="0 0 120 120"><defs><linearGradient id="a1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E7A857"/><stop offset="1" stop-color="#AC5F27"/></linearGradient></defs><ellipse cx="60" cy="90" rx="40" ry="8" fill="#8A4A1B" opacity=".12"/><path d="M18 74c0-24 19-42 42-42s42 18 42 42c0 12-19 20-42 20s-42-8-42-20Z" fill="url(#a1)"/><g stroke="#7E421A" stroke-width="5" stroke-linecap="round" fill="none"><path d="M40 62c4-7 12-12 20-13"/><path d="M66 50c5-8 14-13 22-15"/></g><circle cx="46" cy="80" r="3" fill="#7E421A" opacity=".5"/><circle cx="72" cy="76" r="2.5" fill="#7E421A" opacity=".4"/></svg>',
    baguette: '<svg viewBox="0 0 120 120"><ellipse cx="60" cy="92" rx="38" ry="7" fill="#8A4A1B" opacity=".12"/><g transform="rotate(-28 60 60)"><rect x="26" y="44" width="68" height="32" rx="16" fill="#D89A4E"/><path d="M32 50h56a16 16 0 0 1 0 8H32Z" fill="#E3AF67" opacity=".8"/><g stroke="#A2631F" stroke-width="4.5" stroke-linecap="round" opacity=".8"><path d="M40 50c4 6 4 14 0 20"/><path d="M58 50c4 6 4 14 0 20"/><path d="M76 50c4 6 4 14 0 20"/></g></g></svg>',
    croissant: '<svg viewBox="0 0 120 120"><ellipse cx="60" cy="92" rx="36" ry="7" fill="#8A4A1B" opacity=".12"/><path d="M18 62c0-8 10-14 22-14 5 0 9 1 13 4 3-2 5-4 7-4 12 0 22 6 22 14 0 10-9 20-20 24-4 1-8-2-9-6-1-4-2-8-4-8s-3 4-4 8c-1 4-5 7-9 6-11-4-18-14-18-24Z" fill="#E5B061"/><path d="M40 48c-4 10-4 22 0 32M60 44c-5 12-5 26 0 38M80 48c4 10 4 22 0 32" stroke="#B5742A" stroke-width="3.4" stroke-linecap="round" fill="none"/></svg>',
    toast: '<svg viewBox="0 0 120 120"><ellipse cx="60" cy="94" rx="34" ry="6" fill="#8A4A1B" opacity=".12"/><path d="M30 58h60c0 18-13 32-30 32S30 76 30 58Z" fill="#E8C08A"/><path d="M30 58h60c0 6-1 11-3 16H33c-2-5-3-10-3-16Z" fill="#D9A85F"/><rect x="26" y="46" width="68" height="14" rx="7" fill="#EFD5A6"/><rect x="26" y="46" width="68" height="6" rx="3" fill="#F7E7C6"/></svg>',
    ciabatta: '<svg viewBox="0 0 120 120"><ellipse cx="60" cy="90" rx="36" ry="7" fill="#8A4A1B" opacity=".12"/><ellipse cx="60" cy="66" rx="40" ry="26" fill="#E0AE6B"/><ellipse cx="60" cy="62" rx="40" ry="24" fill="#EBBE7E"/><g fill="#C68B44" opacity=".65"><ellipse cx="44" cy="58" rx="5" ry="3.4"/><ellipse cx="70" cy="70" rx="5.5" ry="3.6"/><ellipse cx="78" cy="52" rx="4" ry="2.8"/><ellipse cx="50" cy="72" rx="3.6" ry="2.6"/></g></svg>',
    nut: '<svg viewBox="0 0 120 120"><ellipse cx="60" cy="92" rx="32" ry="6" fill="#8A4A1B" opacity=".12"/><path d="M60 20c18 12 28 28 28 44 0 16-12 28-28 28s-28-12-28-28c0-16 10-32 28-44Z" fill="#E3B273"/><path d="M60 26c14 10 22 24 22 38 0 13-9 23-22 23" fill="#EFD3A4" opacity=".7"/><g fill="#8A5A2B"><ellipse cx="52" cy="52" rx="4" ry="5"/><ellipse cx="66" cy="66" rx="4.5" ry="5.5"/><ellipse cx="56" cy="78" rx="3.6" ry="4.4"/><ellipse cx="70" cy="44" rx="3" ry="3.8"/></g></svg>',
    coffee: '<svg viewBox="0 0 120 120"><ellipse cx="60" cy="98" rx="30" ry="6" fill="#5A3A22" opacity=".12"/><path d="M32 46h52v28c0 13-12 24-26 24s-26-11-26-24V46Z" fill="#F6EFE4"/><path d="M32 46h52v10c-16 4-36 4-52 0V46Z" fill="#8B5A34"/><path d="M84 54h8c5 0 8 4 8 9s-3 9-8 9h-8V54Z" fill="none" stroke="#D9C6AE" stroke-width="4"/><g stroke="#C9B49A" stroke-width="3.4" stroke-linecap="round" fill="none" opacity=".7"><path d="M52 36c-4-5 4-8 0-14"/><path d="M66 34c-4-5 4-8 0-14"/></g></svg>',
    cake: '<svg viewBox="0 0 120 120"><ellipse cx="60" cy="96" rx="34" ry="6" fill="#8A4A1B" opacity=".12"/><path d="M26 62h68v20c0 8-15 14-34 14s-34-6-34-14V62Z" fill="#F0DCB4"/><path d="M26 62c0-6 6-10 12-10h44c6 0 12 4 12 10-14 6-54 6-68 0Z" fill="#F8ECD0"/><circle cx="60" cy="44" r="9" fill="#C8603F"/><path d="M60 44c-4-6 4-9 0-16" stroke="#C8603F" stroke-width="3" stroke-linecap="round" fill="none"/><g fill="#D98BA6"><circle cx="42" cy="54" r="3"/><circle cx="78" cy="54" r="3"/><circle cx="52" cy="50" r="2.4"/><circle cx="68" cy="50" r="2.4"/></g></svg>',
    basket: '<svg viewBox="0 0 160 160"><g fill="none" stroke="#C68B44" stroke-width="3.4"><path d="M40 66h80l-8 56H48l-8-56Z"/><path d="M58 66c0-18 10-30 22-30s22 12 22 30"/><path d="M56 88h48M54 104h52"/></g></svg>'
  };

  /* ---------- 插画库中文名（后台下拉用） ---------- */
  var ART_LABELS = {
    sourdough: '乡村大列',
    baguette: '法棍',
    croissant: '可颂',
    toast: '生吐司',
    ciabatta: '恰巴塔',
    nut: '坚果果干',
    coffee: '咖啡',
    cake: '蛋糕'
  };

  /* ---------- 分类 ---------- */
  var CATS = [
    { id: 'bread', name: '欧包' },
    { id: 'sweet', name: '甜点' },
    { id: 'savory', name: '咸味' },
    { id: 'drink', name: '饮品' }
  ];

  /* ---------- 默认商品（出厂数据） ---------- */
  var DEFAULTS = [
    { id: 'b1', name: '鲁邦乡村大列', price: 42, cat: 'bread', tag: '招牌', hot: true, desc: '36 小时低温发酵，撕开能看见密实的气孔组织，麦香厚重带微酸。', wt: '480g', art: 'sourdough', tags: '大列 乡村 招牌 麦香', img: '' },
    { id: 'b2', name: '传统法棍', price: 28, cat: 'bread', tag: '现烤', hot: true, desc: '外壳薄脆到掉渣，内里蜂窝气孔清晰，直接法棍的经典形态。', wt: '250g', art: 'baguette', tags: '法棍 欧包 脆', img: '' },
    { id: 'b3', name: '可颂 · 原味', price: 18, cat: 'sweet', tag: '黄油', desc: '发酵黄油起酥 27 层，出炉两小时内最酥。掉渣属正常，请用手接。', wt: '95g', art: 'croissant', tags: '可颂 黄油 甜点 酥', img: '' },
    { id: 'b4', name: '生吐司 · 牛奶', price: 36, cat: 'sweet', tag: '', desc: '汤种配方，牛奶与淡奶油揉进面团，撕着吃拉丝，冷了也柔软。', wt: '400g', art: 'toast', tags: '吐司 牛奶 甜点 早餐', img: '' },
    { id: 'b5', name: '恰巴塔 · 罗勒', price: 32, cat: 'savory', tag: '咸香', desc: '意式乡村面包，拌入烘焙罗勒与橄榄油，烤后外脆内韧。', wt: '350g', art: 'ciabatta', tags: '恰巴塔 罗勒 咸 欧包 咸味', img: '' },
    { id: 'b6', name: '核桃无花果', price: 45, cat: 'bread', tag: '限量', hot: true, desc: '半核桃与无花果干，含水率偏高，适合配浓咖啡或茶。', wt: '400g', art: 'nut', tags: '核桃 无花果 限量 欧包 果干', img: '' },
    { id: 'b7', name: '手冲 · 今日豆', price: 22, cat: 'drink', tag: '现磨', desc: '埃塞俄比亚日晒或哥伦比亚水洗，每周五换豆，店员会问你要什么酸度。', wt: '240ml', art: 'coffee', tags: '咖啡 手冲 饮品 现磨', img: '' },
    { id: 'b8', name: '蜂蜜海盐蛋糕', price: 26, cat: 'sweet', tag: '新品', desc: '戚风胚体加本地百花蜜，表面一层薄盐霜。冷藏一夜更香。', wt: '1 块', art: 'cake', tags: '蛋糕 蜂蜜 海盐 甜点 新品', img: '' }
  ];

  /* ---------- 字段校验与规范化 ---------- */
  var FIELDS = {
    name: { type: 'text', max: 30, required: true, def: '未命名面包' },
    price: { type: 'number', min: 0, max: 9999, required: true, def: 0 },
    wt: { type: 'text', max: 20, required: false, def: '' },
    desc: { type: 'textarea', max: 200, required: false, def: '' },
    tag: { type: 'text', max: 8, required: false, def: '' },
    tags: { type: 'text', max: 120, required: false, def: '' },
    cat: { type: 'enum', options: ['bread', 'sweet', 'savory', 'drink'], def: 'bread' },
    art: { type: 'enum', options: Object.keys(ART), def: 'sourdough' }
  };

  function str(v, max) {
    v = (v == null ? '' : String(v)).replace(/\s+/g, ' ').trim();
    if (max && v.length > max) v = v.slice(0, max);
    return v;
  }

  /* 图片字段规范化：
   * 1) data:image/...  —— 旧的本地上传（base64），保留兼容
   * 2) http(s)://...   —— 接数据库后的主流形态，图片存在对象存储/CDN
   * 3) / 开头的站内相对路径
   * 其余一律视为无图，前端回退 SVG 插画。
   * 注意不做 javascript: 等伪协议放行，避免 <img src="javascript:..."> 注入。 */
  function normImg(v) {
    if (typeof v !== 'string') return '';
    v = v.trim();
    if (!v) return '';
    if (v.indexOf('data:image/') === 0) return v;
    if (/^https?:\/\//i.test(v)) return v;
    if (v.charAt(0) === '/' && v.indexOf('//') !== 0) return v;
    return '';
  }

  /* 单条商品规范化：补齐缺失字段、丢弃非法值 */
  function normalizeItem(raw) {
    if (!raw || typeof raw !== 'object') return null;
    var id = str(raw.id, 24) || ('b' + Date.now().toString(36));
    var it = {
      id: id,
      name: str(raw.name, FIELDS.name.max) || FIELDS.name.def,
      price: 0,
      wt: str(raw.wt, FIELDS.wt.max),
      desc: str(raw.desc, FIELDS.desc.max),
      tag: str(raw.tag, FIELDS.tag.max),
      tags: str(raw.tags, FIELDS.tags.max),
      cat: FIELDS.cat.options.indexOf(raw.cat) > -1 ? raw.cat : FIELDS.cat.def,
      art: FIELDS.art.options.indexOf(raw.art) > -1 ? raw.art : FIELDS.art.def,
      hot: !!raw.hot,
      soldOut: !!raw.soldOut,
      img: normImg(raw.img)
    };
    var p = Number(raw.price);
    if (isFinite(p) && p >= 0) {
      it.price = Math.round(p * 100) / 100;
    }
    return it;
  }

  function normalizeList(list) {
    if (!Array.isArray(list)) return null;
    var out = [], seen = {};
    list.forEach(function (raw) {
      var it = normalizeItem(raw);
      if (!it) return;
      if (seen[it.id]) it.id = it.id + '-' + Math.random().toString(36).slice(2, 6);
      seen[it.id] = true;
      out.push(it);
    });
    return out;
  }

  /* ============================================================
   * 存储层
   *
   * 数据源优先级：Supabase 数据库 > 本地镜像 > 内置默认
   *
   * - 数据库是唯一权威数据源，后台保存即写库
   * - 本地镜像（localStorage）仅作断网/未配置时的兜底展示，
   *   每次成功同步后被覆盖，不算独立数据源
   * - 内置默认（DEFAULTS）保证仓库 clone 下来就能跑，不会白屏
   * ============================================================ */
  var CFG_KEY = 'chuxiao_db_cfg_v1';
  var cache = null;      // 内存缓存：本次页面会话内的数据源
  var lastError = null;  // 最近一次远程操作错误

  function defaults() {
    return DEFAULTS.map(function (o) { return normalizeItem(o); });
  }

  /* ---------- 连接配置 ----------
   *
   * url / key：公开的，写在 config.js 里随代码发布。
   *   访客的前台页面必须能拿到它，否则读不到数据库。
   *   安全性由数据库 RLS 保证，不靠保密。
   *
   * token：管理令牌，只存在管理者自己的浏览器 localStorage，
   *   不进代码、不进仓库。决定谁能改数据。
   *
   * 取值优先级：localStorage 覆盖 config.js（方便临时调试/换库）。 */
  function getConfig() {
    var c = { url: '', key: '', token: '' };
    var g = (typeof global.ChuxiaoDBConfig === 'object' && global.ChuxiaoDBConfig) || null;
    if (g) {
      c.url = String(g.url || '');
      c.key = String(g.key || '');
    }
    try {
      var raw = localStorage.getItem(CFG_KEY);
      if (raw) {
        var s = JSON.parse(raw);
        if (s && typeof s === 'object') {
          if (s.url) c.url = String(s.url);
          if (s.key) c.key = String(s.key);
          if (s.token) c.token = String(s.token);
        }
      }
    } catch (e) {}

    if (!c.url || !c.key) return null;
    return { url: c.url.replace(/\/+$/, ''), key: c.key, token: c.token };
  }

  /* 保存管理令牌（url/key 以 config.js 为准，这里只存 token 与可选的覆盖值） */
  function setConfig(cfg) {
    cfg = cfg || {};
    try {
      localStorage.setItem(CFG_KEY, JSON.stringify({
        url: String(cfg.url || ''),
        key: String(cfg.key || ''),
        token: String(cfg.token || '')
      }));
      return { ok: true };
    } catch (e) {
      return { ok: false, message: '配置保存失败：' + ((e && e.message) || '未知错误') };
    }
  }

  function clearConfig() {
    try { localStorage.removeItem(CFG_KEY); } catch (e) {}
  }

  function isConfigured() { return !!getConfig(); }

  /* ---------- 行 ↔ 商品 字段映射 ----------
   * 数据库列名 description / sold_out，前端用 desc / soldOut。 */
  function rowToItem(r) {
    return normalizeItem({
      id: r.id, name: r.name, price: r.price, wt: r.wt,
      desc: r.description, tag: r.tag, tags: r.tags,
      cat: r.cat, art: r.art, hot: r.hot, soldOut: r.sold_out,
      img: r.img
    });
  }

  function itemToRow(it, i) {
    return {
      id: it.id,
      name: it.name,
      price: it.price,
      wt: it.wt,
      description: it.desc,
      tag: it.tag,
      tags: it.tags,
      cat: it.cat,
      art: it.art,
      hot: !!it.hot,
      sold_out: !!it.soldOut,
      img: it.img || '',
      sort: i,
      updated_at: new Date().toISOString()
    };
  }

  /* ---------- PostgREST 请求封装 ----------
   * 直接走 Supabase 的 REST 接口，不引 SDK，保持零依赖。 */
  function req(path, opt) {
    var c = getConfig();
    if (!c) return Promise.reject(new Error('尚未配置数据库连接'));
    opt = opt || {};
    var headers = {
      'apikey': c.key,
      'Authorization': 'Bearer ' + c.key,
      'Content-Type': 'application/json'
    };
    if (c.token) headers['x-admin-token'] = c.token;
    if (opt.prefer) headers['Prefer'] = opt.prefer;

    var init = { method: opt.method || 'GET', headers: headers };
    if (opt.body !== undefined) init.body = JSON.stringify(opt.body);

    return fetch(c.url + '/rest/v1/' + path, init).then(function (res) {
      if (res.ok) {
        if (res.status === 204) return null;
        return res.text().then(function (t) {
          if (!t) return null;
          try { return JSON.parse(t); } catch (e) { return null; }
        });
      }
      return res.text().then(function (t) {
        var msg = t;
        try {
          var j = JSON.parse(t);
          msg = j.message || j.hint || j.details || t;
        } catch (e) {}
        if (res.status === 401 || res.status === 403) {
          throw new Error('（' + res.status + '）数据库拒绝了这次操作：' + msg +
            '。若为写入被拒，检查后台填写的管理令牌是否与建库 SQL 里的一致。');
        }
        throw new Error('（' + res.status + '）' + msg);
      });
    });
  }

  /* ---------- 同步 ---------- */

  /* 从数据库拉取，覆盖内存缓存并刷新本地镜像 */
  function sync() {
    if (!isConfigured()) {
      lastError = '尚未配置数据库连接，当前展示内置示例数据';
      return Promise.reject(new Error(lastError));
    }
    return req('items?select=*&order=sort.asc').then(function (rows) {
      if (!Array.isArray(rows)) throw new Error('数据库返回格式异常（期望数组）');
      cache = rows.map(rowToItem).filter(Boolean);
      lastError = null;
      mirror(cache);
      return cache;
    }).catch(function (e) {
      lastError = (e && e.message) || String(e);
      throw e;
    });
  }

  /* 把内存缓存整体写回数据库：
   * 先 upsert 现有商品，再删除库里有、本地已没有的。 */
  function push() {
    if (!isConfigured()) {
      lastError = '尚未配置数据库连接，改动只存在本地';
      return Promise.reject(new Error(lastError));
    }
    var list = (cache || load()).slice();
    var rows = list.map(itemToRow);

    return req('items', {
      method: 'POST',
      prefer: 'resolution=merge-duplicates,return=minimal',
      body: rows
    }).then(function () {
      // 删除本次不存在的 id
      var keep = rows.map(function (r) { return r.id; });
      if (!keep.length) {
        return req('items?id=neq.' + encodeURIComponent('__none__'), {
          method: 'DELETE', prefer: 'return=minimal'
        });
      }
      return req('items?id=not.in.(' + keep.map(encodeURIComponent).join(',') + ')', {
        method: 'DELETE', prefer: 'return=minimal'
      });
    }).then(function () {
      lastError = null;
      mirror(list);
      return { ok: true };
    }).catch(function (e) {
      lastError = (e && e.message) || String(e);
      throw e;
    });
  }

  /* 连通性自检：只读一条，用来在后台验证配置对不对 */
  function test() {
    if (!isConfigured()) return Promise.reject(new Error('尚未配置数据库连接'));
    return req('items?select=id&limit=1').then(function () { return { ok: true }; });
  }

  /* ---------- 本地镜像（兜底，非数据源）---------- */
  function mirror(list) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch (e) {}
  }

  function load() {
    if (cache) return cache;
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        var list = normalizeList(JSON.parse(raw));
        if (list && list.length) { cache = list; return cache; }
      }
    } catch (e) {}
    cache = defaults();
    return cache;
  }

  /* 同步更新内存缓存（编辑后立即生效，随后由 push() 落库） */
  function save(items) {
    var list = normalizeList(items);
    if (!list) return { ok: false, message: '数据格式不正确' };
    cache = list;
    mirror(list);
    return { ok: true };
  }

  function reset() {
    try { localStorage.removeItem(STORE_KEY); } catch (e) {}
    cache = defaults();
    return cache;
  }

  /* 恢复出厂：把内置默认写回数据库 */
  function resetRemote() {
    cache = defaults();
    return push().then(function () { return cache; });
  }

  /* 存储占用估算（字节）—— 本地镜像体积，供后台显示 */
  function usage() {
    try {
      var raw = localStorage.getItem(STORE_KEY) || '';
      return new Blob([raw]).size;
    } catch (e) { return 0; }
  }

  function source() {
    if (lastError) return 'fallback';
    return isConfigured() ? 'remote' : 'default';
  }

  global.ChuxiaoData = {
    ART: ART,
    ART_LABELS: ART_LABELS,
    CATS: CATS,
    DEFAULTS: DEFAULTS,
    FIELDS: FIELDS,
    STORE_KEY: STORE_KEY,
    CFG_KEY: CFG_KEY,
    load: load,
    save: save,
    reset: reset,
    resetRemote: resetRemote,
    usage: usage,
    normalizeItem: normalizeItem,
    normalizeList: normalizeList,
    // 数据库相关
    getConfig: getConfig,
    setConfig: setConfig,
    clearConfig: clearConfig,
    isConfigured: isConfigured,
    sync: sync,
    push: push,
    test: test,
    source: source,
    lastError: function () { return lastError; }
  };
})(window);
