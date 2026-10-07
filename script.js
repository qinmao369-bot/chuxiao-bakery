/* ============ 初麦 CHUXIAO BAKERY · 交互 ============ */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var FREE_SHIP = 88;

  /* ---------- SVG 面包插画库 ---------- */
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

  /* ---------- 商品数据 ---------- */
  var ITEMS = [
    { id: 'b1', name: '鲁邦乡村大列', price: 42, cat: 'bread', tag: '招牌', hot: true, desc: '36 小时低温发酵，撕开能看见密实的气孔组织，麦香厚重带微酸。', wt: '480g', art: 'sourdough', tags: '大列 乡村 招牌 麦香' },
    { id: 'b2', name: '传统法棍', price: 28, cat: 'bread', tag: '现烤', hot: true, desc: '外壳薄脆到掉渣，内里蜂窝气孔清晰，直接法棍的经典形态。', wt: '250g', art: 'baguette', tags: '法棍 欧包 脆' },
    { id: 'b3', name: '可颂 · 原味', price: 18, cat: 'sweet', tag: '黄油', desc: '发酵黄油起酥 27 层，出炉两小时内最酥。掉渣属正常，请用手接。', wt: '95g', art: 'croissant', tags: '可颂 黄油 甜点 酥' },
    { id: 'b4', name: '生吐司 · 牛奶', price: 36, cat: 'sweet', tag: '', desc: '汤种配方，牛奶与淡奶油揉进面团，撕着吃拉丝，冷了也柔软。', wt: '400g', art: 'toast', tags: '吐司 牛奶 甜点 早餐' },
    { id: 'b5', name: '恰巴塔 · 罗勒', price: 32, cat: 'savory', tag: '咸香', desc: '意式乡村面包，拌入烘焙罗勒与橄榄油，烤后外脆内韧。', wt: '350g', art: 'ciabatta', tags: '恰巴塔 罗勒 咸 欧包 咸味' },
    { id: 'b6', name: '核桃无花果', price: 45, cat: 'bread', tag: '限量', hot: true, desc: '半核桃与无花果干，含水率偏高，适合配浓咖啡或茶。', wt: '400g', art: 'nut', tags: '核桃 无花果 限量 欧包 果干' },
    { id: 'b7', name: '手冲 · 今日豆', price: 22, cat: 'drink', tag: '现磨', desc: '埃塞俄比亚日晒或哥伦比亚水洗，每周五换豆，店员会问你要什么酸度。', wt: '240ml', art: 'coffee', tags: '咖啡 手冲 饮品 现磨' },
    { id: 'b8', name: '蜂蜜海盐蛋糕', price: 26, cat: 'sweet', tag: '新品', desc: '戚风胚体加本地百花蜜，表面一层薄盐霜。冷藏一夜更香。', wt: '1 块', art: 'cake', tags: '蛋糕 蜂蜜 海盐 甜点 新品' }
  ];

  var CAT_NAME = { bread: '欧包', sweet: '甜点', savory: '咸味', drink: '饮品' };

  var cart = {};
  try { cart = JSON.parse(localStorage.getItem('chuxiao_cart') || '{}') || {}; } catch (e) { cart = {}; }

  function save() {
    try { localStorage.setItem('chuxiao_cart', JSON.stringify(cart)); } catch (e) {}
  }
  function money(n) { return '¥' + n.toFixed(0); }

  /* ---------- Toast ---------- */
  var toastEl = $('#toast'), toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2400);
  }

  /* ---------- 渲染商品 ---------- */
  var grid = $('#grid');
  function render(cat) {
    var list = ITEMS.filter(function (i) { return cat === 'all' || i.cat === cat; });
    if (!list.length) {
      grid.innerHTML = '<div class="grid__empty">' + ART.basket +
        '<p>这一类今天卖完了</p>' +
        '<span>换个分类看看，或者留下手机号，出炉我们叫你</span>' +
        '<a href="#subscribe" class="btn btn--ghost">去订阅提醒</a></div>';
      return;
    }
    grid.innerHTML = list.map(function (i) {
      return '<article class="card reveal is-in" data-id="' + i.id + '">' +
        '<div class="card__media">' +
          (i.tag ? '<span class="card__tag' + (i.hot ? ' card__tag--hot' : '') + '">' + i.tag + '</span>' : '') +
          ART[i.art] +
        '</div>' +
        '<div class="card__body">' +
          '<div class="card__top"><h3 class="card__name">' + i.name + '</h3>' +
          '<span class="card__price">' + money(i.price) + '</span></div>' +
          '<p class="card__desc">' + i.desc + '</p>' +
          '<div class="card__foot"><span class="card__wt">' + i.wt + '</span>' +
          '<button class="card__add" data-add="' + i.id + '" aria-label="加入购物袋">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>' +
          '</button></div>' +
        '</div></article>';
    }).join('');
  }
  render('all');

  $('#filters').addEventListener('click', function (e) {
    var b = e.target.closest('.chip');
    if (!b) return;
    $$('#filters .chip').forEach(function (c) { c.classList.remove('is-active'); });
    b.classList.add('is-active');
    render(b.dataset.cat);
  });

  grid.addEventListener('click', function (e) {
    var b = e.target.closest('[data-add]');
    if (!b) return;
    addToCart(b.dataset.add, true);
  });

  /* ---------- 购物袋 ---------- */
  var badge = $('#cartCount'), drawer = $('#drawer'), mask = $('#drawerMask');

  function addToCart(id, byUser) {
    cart[id] = (cart[id] || 0) + 1;
    save();
    renderCart();
    bump();
    if (byUser) {
      var it = ITEMS.filter(function (x) { return x.id === id; })[0];
      toast('已加入购物袋 · ' + it.name);
    }
  }
  function bump() {
    badge.classList.add('is-bump');
    setTimeout(function () { badge.classList.remove('is-bump'); }, 400);
  }
  function changeQty(id, d) {
    cart[id] = (cart[id] || 0) + d;
    if (cart[id] <= 0) delete cart[id];
    save();
    renderCart();
  }

  function renderCart() {
    var ids = Object.keys(cart);
    var count = ids.reduce(function (s, k) { return s + cart[k]; }, 0);
    var total = ids.reduce(function (s, k) {
      var it = ITEMS.filter(function (x) { return x.id === k; })[0];
      return it ? s + it.price * cart[k] : s;
    }, 0);

    badge.textContent = count;
    badge.classList.toggle('is-on', count > 0);
    $('#drawerCount').textContent = '(' + count + ')';
    $('#drawerTotal').textContent = money(total);

    var body = $('#drawerBody');
    if (!ids.length) {
      body.innerHTML = '<div class="drawer__empty">' + ART.basket + '<p>购物袋还是空的</p>' +
        '<p style="font-size:13px;margin-top:6px">面包出炉时间不等人，先挑两只？</p></div>';
    } else {
      body.innerHTML = ids.map(function (k) {
        var it = ITEMS.filter(function (x) { return x.id === k; })[0];
        if (!it) return '';
        return '<div class="ditem">' +
          '<div class="ditem__art">' + ART[it.art] + '</div>' +
          '<div><p class="ditem__name">' + it.name + '</p><p class="ditem__meta">' + money(it.price) + ' · ' + it.wt + '</p>' +
          '<div class="qty"><button data-minus="' + it.id + '" aria-label="减少">−</button>' +
          '<span>' + cart[k] + '</span>' +
          '<button data-plus="' + it.id + '" aria-label="增加">+</button></div></div>' +
          '<div class="ditem__right"><p class="ditem__price">' + money(it.price * cart[k]) + '</p>' +
          '<button class="ditem__del" data-del="' + it.id + '">移除</button></div></div>';
      }).join('');
    }

    var left = FREE_SHIP - total;
    $('#shipNote').textContent = left > 0 ? ('再买 ' + money(left) + ' 可免配送') : '已享免配送 ✓';
    $('#shipBar').style.width = Math.min(100, total / FREE_SHIP * 100) + '%';
    $('#checkout').disabled = count === 0;
  }

  $('#drawerBody').addEventListener('click', function (e) {
    var p = e.target.closest('[data-plus]'), m = e.target.closest('[data-minus]'), d = e.target.closest('[data-del]');
    if (p) changeQty(p.dataset.plus, 1);
    if (m) changeQty(m.dataset.minus, -1);
    if (d) { delete cart[d.dataset.del]; save(); renderCart(); }
  });

  function openDrawer() { drawer.classList.add('is-open'); mask.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
  function closeDrawer() { drawer.classList.remove('is-open'); mask.classList.remove('is-open'); document.body.style.overflow = ''; }
  $('#cartBtn').addEventListener('click', openDrawer);
  $('#drawerClose').addEventListener('click', closeDrawer);
  mask.addEventListener('click', closeDrawer);
  $('#checkout').addEventListener('click', function () {
    if (!Object.keys(cart).length) return;
    toast('已下单（演示站，不会真实扣款）· 到店自取或电话配送');
  });
  renderCart();

  /* ---------- 导航 / 公告 / 抽屉状态 ---------- */
  var nav = $('#nav');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('is-stuck', window.scrollY > 8);
  }, { passive: true });

  $('#announce').addEventListener('click', function (e) {
    if (e.target.closest('.announce__close')) $('#announce').classList.add('is-hidden');
  });

  var burger = $('#burger');
  burger.addEventListener('click', function () {
    nav.classList.toggle('is-open');
    burger.setAttribute('aria-label', nav.classList.contains('is-open') ? '关闭菜单' : '菜单');
  });
  $('#navLinks').addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { nav.classList.remove('is-open'); }
  });

  /* ---------- 搜索 ---------- */
  var sp = $('#searchPanel');
  function openSearch() { sp.classList.add('is-open'); document.body.style.overflow = 'hidden'; setTimeout(function () { $('#searchInput').focus(); }, 60); }
  function closeSearch() { sp.classList.remove('is-open'); document.body.style.overflow = ''; $('#searchInput').value = ''; $('#searchResults').innerHTML = ''; }
  $('#searchBtn').addEventListener('click', openSearch);
  sp.addEventListener('click', function (e) { if (e.target === sp) closeSearch(); });

  $('#searchInput').addEventListener('input', function (e) {
    var q = e.target.value.trim().toLowerCase(), box = $('#searchResults');
    if (!q) { box.innerHTML = ''; return; }
    var hits = ITEMS.filter(function (i) {
      return (i.name + i.desc + i.tags + CAT_NAME[i.cat]).toLowerCase().indexOf(q) > -1;
    });
    box.innerHTML = hits.length
      ? hits.map(function (i) {
          return '<button class="sr" data-add="' + i.id + '"><span class="sr__art">' + ART[i.art] + '</span>' +
            '<span><span class="sr__name">' + i.name + '</span><br><span class="sr__meta">' + CAT_NAME[i.cat] + ' · ' + i.wt + '</span></span>' +
            '<span class="sr__price">' + money(i.price) + '</span></button>';
        }).join('')
      : '<div class="sr-none">没有找到「' + q + '」，试试「可颂」或「咖啡」</div>';
  });
  $('#searchResults').addEventListener('click', function (e) {
    var b = e.target.closest('[data-add]');
    if (!b) return;
    addToCart(b.dataset.add, true);
    closeSearch();
  });

  /* ---------- 预留弹窗 ---------- */
  var rm = $('#reserveMask');
  $$('.js-reserve').forEach(function (b) {
    b.addEventListener('click', function () {
      $('#reserveTitle').textContent = '预留 · ' + b.dataset.store;
      rm.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      setTimeout(function () { $('#reservePhone').focus(); }, 60);
    });
  });
  function closeReserve() { rm.classList.remove('is-open'); document.body.style.overflow = ''; }
  $('#reserveClose').addEventListener('click', closeReserve);
  rm.addEventListener('click', function (e) { if (e.target === rm) closeReserve(); });
  $('#reserveSubmit').addEventListener('click', function () {
    var v = $('#reservePhone').value.trim();
    if (!/^1[3-9]\d{9}$/.test(v)) { toast('请填写正确的 11 位手机号'); $('#reservePhone').focus(); return; }
    closeReserve();
    toast('预留成功 · 出炉后我们电话通知你');
    $('#reservePhone').value = '';
  });

  /* ---------- 订阅表单 ---------- */
  $('#subscribeForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = $('#phone').parentElement, v = $('#phone').value.trim();
    if (!/^1[3-9]\d{9}$/.test(v)) {
      f.classList.add('is-err');
      f.querySelector('[data-hint]').textContent = '请填写正确的 11 位手机号';
      $('#phone').focus();
      return;
    }
    f.classList.remove('is-err');
    toast('订阅成功 · 每周五 16:00 前送达');
    $('#phone').value = '';
  });

  /* ---------- 键盘 / 滚动 ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeSearch(); closeDrawer(); closeReserve(); }
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
  });

  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
  }, { threshold: .12, rootMargin: '0px 0px -40px' }) : null;

  function watchReveal() {
    if (!io) { $$('.reveal').forEach(function (el) { el.classList.add('is-in'); }); return; }
    $$('.reveal:not(.is-in)').forEach(function (el) { io.observe(el); });
  }
  watchReveal();

  // 平滑锚点 + 移动端关闭菜单
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      var top = t.getBoundingClientRect().top + window.scrollY - 74;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();
