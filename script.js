/* ============ 初麦 CHUXIAO BAKERY · 交互 ============ */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var FREE_SHIP = 66;

  /* ---------- 数据来源：data.js（可被后台修改并持久化） ---------- */
  var D = window.ChuxiaoData;
  var ART = D.ART;
  var CAT_NAME = {};
  D.CATS.forEach(function (c) { CAT_NAME[c.id] = c.name; });

  /* 商品统一走这个入口取图：优先后台上传的照片，回退到 SVG 插画 */
  function itemArt(it) {
    if (it.img) {
      return '<img class="item-img" src="' + it.img.replace(/"/g, '&quot;') + '" alt="' +
        it.name.replace(/[<>&"]/g, '') + '">';
    }
    return ART[it.art] || ART.sourdough;
  }

  /* ---------- 商品数据：从 data.js 读取（含后台修改） ---------- */
  var ITEMS = D.load();
  function refreshItems() { ITEMS = D.load(); }
  function findItem(id) {
    for (var i = 0; i < ITEMS.length; i++) if (ITEMS[i].id === id) return ITEMS[i];
    return null;
  }

  var cart = {};
  try { cart = JSON.parse(localStorage.getItem('chuxiao_cart') || '{}') || {}; } catch (e) { cart = {}; }

  function save() {
    try { localStorage.setItem('chuxiao_cart', JSON.stringify(cart)); } catch (e) {}
  }
  /* 金额显示：整数不带小数，有小数保留两位，与后台口径一致 */
  function money(n) {
    var v = Math.round(n * 100) / 100;
    return '¥' + (v % 1 === 0 ? v.toFixed(0) : v.toFixed(2));
  }

  /* ---------- Toast ---------- */
  var toastEl = $('#toast'), toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2400);
  }

  /* ---------- HTML 转义：后台可编辑内容必须防注入 ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* ---------- 渲染商品 ---------- */
  var grid = $('#grid');
  var curCat = 'all';

  function render(cat) {
    curCat = cat || 'all';
    var list = ITEMS.filter(function (i) { return curCat === 'all' || i.cat === curCat; });
    if (!list.length) {
      grid.innerHTML = '<div class="grid__empty">' + ART.basket +
        '<p>这一类今天卖完了</p>' +
        '<span>换个分类看看，或者留下手机号，出炉我们叫你</span>' +
        '<a href="#subscribe" class="btn btn--ghost">去订阅提醒</a></div>';
      return;
    }
    grid.innerHTML = list.map(function (i) {
      var sold = !!i.soldOut;
      return '<article class="card reveal is-in' + (sold ? ' is-sold' : '') + '" data-id="' + esc(i.id) + '">' +
        '<div class="card__media">' +
          (i.tag ? '<span class="card__tag' + (i.hot ? ' card__tag--hot' : '') + '">' + esc(i.tag) + '</span>' : '') +
          (sold ? '<span class="card__sold">售罄</span>' : '') +
          itemArt(i) +
        '</div>' +
        '<div class="card__body">' +
          '<div class="card__top"><h3 class="card__name">' + esc(i.name) + '</h3>' +
          '<span class="card__price">' + money(i.price) + '</span></div>' +
          '<p class="card__desc">' + esc(i.desc) + '</p>' +
          '<div class="card__foot"><span class="card__wt">' + esc(i.wt) + '</span>' +
          '<button class="card__add" data-add="' + esc(i.id) + '"' + (sold ? ' disabled aria-label="已售罄"' : ' aria-label="加入购物袋"') + '>' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round">' +
          (sold ? '<path d="M6 6l12 12M18 6L6 18"/>' : '<path d="M12 5v14M5 12h14"/>') +
          '</svg>' +
          '</button></div>' +
        '</div></article>';
    }).join('');
  }

  /* 按实际商品生成筛选按钮，避免出现空分类 */
  function buildFilters() {
    var used = {};
    ITEMS.forEach(function (i) { used[i.cat] = (used[i.cat] || 0) + 1; });
    var html = '<button class="chip' + (curCat === 'all' ? ' is-active' : '') + '" data-cat="all">全部</button>';
    D.CATS.forEach(function (c) {
      if (used[c.id]) {
        html += '<button class="chip' + (curCat === c.id ? ' is-active' : '') +
          '" data-cat="' + c.id + '">' + esc(c.name) + '</button>';
      }
    });
    $('#filters').innerHTML = html;
  }
  buildFilters();
  render(curCat);

  /* 供外部（如后台同页预览）调用 */
  function reload() { refreshItems(); buildFilters(); render(curCat); renderCart(); }  $('#filters').addEventListener('click', function (e) {
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
    var it = findItem(id);
    if (!it) { toast('该商品已下架'); refreshItems(); render(curCat); return; }
    if (it.soldOut) { toast(it.name + ' 今日已售罄'); return; }
    cart[id] = (cart[id] || 0) + 1;
    save();
    renderCart();
    bump();
    if (byUser) toast('已加入购物袋 · ' + it.name);
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
      var it = findItem(k);
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
        var it = findItem(k);
        if (!it) return '';
        return '<div class="ditem">' +
          '<div class="ditem__art">' + itemArt(it) + '</div>' +
          '<div><p class="ditem__name">' + esc(it.name) + '</p><p class="ditem__meta">' + money(it.price) + ' · ' + esc(it.wt) + '</p>' +
          '<div class="qty"><button data-minus="' + it.id + '" aria-label="减少">−</button>' +
          '<span>' + cart[k] + '</span>' +
          '<button data-plus="' + esc(it.id) + '" aria-label="增加">+</button></div></div>' +
          '<div class="ditem__right"><p class="ditem__price">' + money(it.price * cart[k]) + '</p>' +
          '<button class="ditem__del" data-del="' + esc(it.id) + '">移除</button></div></div>';
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
          return '<button class="sr" data-add="' + esc(i.id) + '"><span class="sr__art">' + itemArt(i) + '</span>' +
            '<span><span class="sr__name">' + esc(i.name) + '</span><br><span class="sr__meta">' + esc(CAT_NAME[i.cat] || '') + ' · ' + esc(i.wt) + '</span></span>' +
            '<span class="sr__price">' + money(i.price) + '</span></button>';
        }).join('')
      : '<div class="sr-none">没有找到「' + esc(q) + '」，试试「可颂」或「咖啡」</div>';
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

  /* 供外部调用：后台改动后或标签页同步时刷新视图 */
  window.ChuxiaoShop = { reload: reload, render: render };

  /* 后台在另一个标签页保存后，自动同步，无需手动刷新 */
  window.addEventListener('storage', function (e) {
    if (e.key !== D.STORE_KEY) return;
    reload();
    toast('商品已更新');
  });
})();
