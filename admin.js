/* ============================================================
 * 初麦 CHUXIAO BAKERY · 后台商品管理
 * 依赖 data.js 提供的 ChuxiaoData
 * ============================================================ */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var D = window.ChuxiaoData;

  var items = D.load();
  var editingId = null;   // 正在编辑的商品 id；null = 新增
  var draftImg = '';      // 抽屉内的临时图片
  var keyword = '';

  /* ---------- 图片压缩：localStorage 只有约 5MB，必须压 ----------
     上传原图常有几 MB，直接存会瞬间撑爆。
     统一压到最长边 720px 的 JPEG，质量 0.82，通常 40–90KB。 */
  var MAX_EDGE = 720;
  var QUALITY = 0.82;

  function compressImage(file) {
    return new Promise(function (resolve, reject) {
      if (!file || !/^image\//.test(file.type)) {
        reject(new Error('请选择图片文件'));
        return;
      }
      var reader = new FileReader();
      reader.onerror = function () { reject(new Error('读取文件失败')); };
      reader.onload = function () {
        var img = new Image();
        img.onerror = function () { reject(new Error('图片无法解码，可能不是有效图片')); };
        img.onload = function () {
          var w = img.naturalWidth, h = img.naturalHeight;
          if (!w || !h) { reject(new Error('图片尺寸异常')); return; }
          var scale = Math.min(1, MAX_EDGE / Math.max(w, h));
          var cw = Math.max(1, Math.round(w * scale));
          var ch = Math.max(1, Math.round(h * scale));
          var cv = document.createElement('canvas');
          cv.width = cw; cv.height = ch;
          var ctx = cv.getContext('2d');
          ctx.fillStyle = '#F6F1E8';
          ctx.fillRect(0, 0, cw, ch);
          ctx.drawImage(img, 0, 0, cw, ch);
          var out;
          try { out = cv.toDataURL('image/jpeg', QUALITY); }
          catch (e) { reject(new Error('图片处理失败')); return; }
          resolve({ data: out, w: cw, h: ch, ow: w, oh: h });
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function kb(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function money(n) { return '¥' + (Math.round(n * 100) / 100).toLocaleString('zh-CN'); }

  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg;
    t.classList.add('is-on');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove('is-on'); }, 2400);
  }

  /* ---------- 确认框 ---------- */
  var cfResolve = null;
  function confirmBox(title, text) {
    $('#cfTitle').textContent = title;
    $('#cfText').textContent = text;
    $('#confirmMask').classList.add('is-on');
    return new Promise(function (res) { cfResolve = res; });
  }
  function closeConfirm(v) {
    $('#confirmMask').classList.remove('is-on');
    if (cfResolve) { cfResolve(v); cfResolve = null; }
  }
  $('#cfYes').addEventListener('click', function () { closeConfirm(true); });
  $('#cfNo').addEventListener('click', function () { closeConfirm(false); });
  $('#confirmMask').addEventListener('click', function (e) { if (e.target.id === 'confirmMask') closeConfirm(false); });

  /* ---------- 保存 / 恢复 ---------- */
  function persist() {
    var r = D.save(items);
    if (!r.ok) {
      toast(r.message);
      return false;
    }
    updateUsage();
    return true;
  }
  function updateUsage() {
    var n = items.length;
    var withImg = items.filter(function (i) { return i.img; }).length;
    var u = D.usage();
    var warn = u > 3.2 * 1024 * 1024 ? ' ⚠️ 接近上限' : '';
    $('#usageInfo').textContent = n + ' 款 · ' + withImg + ' 张图 · ' + kb(u) + warn;
  }

  /* ---------- 统计 ---------- */
  function renderStats() {
    var on = items.filter(function (i) { return !i.soldOut; }).length;
    var low = items.filter(function (i) { return i.price < 30; }).length;
    var avg = items.length
      ? items.reduce(function (s, i) { return s + i.price; }, 0) / items.length : 0;
    $('#stats').innerHTML =
      '<div class="stat"><b>' + items.length + '</b><span>商品总数</span></div>' +
      '<div class="stat"><b>' + on + '</b><span>在售</span></div>' +
      '<div class="stat"><b>' + (items.length - on) + '</b><span>售罄</span></div>' +
      '<div class="stat"><b>' + low + '</b><span>30 元以下</span></div>' +
      '<div class="stat"><b>' + money(avg) + '</b><span>平均售价</span></div>';
  }

  /* ---------- 列表 ---------- */
  function figOf(it) {
    return it.img
      ? '<img src="' + esc(it.img) + '" alt="">'
      : (D.ART[it.art] || D.ART.sourdough);
  }

  function render() {
    var list = items;
    if (keyword) {
      var k = keyword.toLowerCase();
      list = items.filter(function (i) {
        return ((i.name || '') + (i.tags || '') + (i.tag || '') + (i.wt || '') + (i.desc || ''))
          .toLowerCase().indexOf(k) > -1;
      });
    }
    $('#empty').hidden = list.length > 0;
    $('#list').innerHTML = list.map(function (i) {
      var pills = '';
      if (i.tag) pills += '<span class="pill' + (i.hot ? ' pill--hot' : '') + '">' + esc(i.tag) + '</span>';
      if (i.soldOut) pills += '<span class="pill pill--sold">售罄</span>';
      var cat = D.CATS.filter(function (c) { return c.id === i.cat; })[0];
      return '<article class="row' + (i.soldOut ? ' is-sold' : '') + '" data-id="' + esc(i.id) + '">' +
        '<div class="row__fig">' + figOf(i) + '</div>' +
        '<div class="row__main">' +
          '<h3 class="row__name"><span class="n">' + esc(i.name) + '</span>' + pills + '</h3>' +
          '<div class="row__meta"><span>' + esc(cat ? cat.name : '未分类') + '</span>' +
            '<span>' + esc(i.wt || '—') + '</span>' +
            (i.img ? '<span>实拍图</span>' : '<span>插画</span>') + '</div>' +
          (i.desc ? '<p class="row__desc">' + esc(i.desc) + '</p>' : '') +
        '</div>' +
        '<div class="row__price">' + money(i.price) + '</div>' +
        '<button class="btn btn--sm row__edit" data-edit="' + esc(i.id) + '">编辑</button>' +
      '</article>';
    }).join('');

    renderStats();
    updateUsage();
  }

  /* ---------- 抽屉 ---------- */
  var drawer = $('#drawer'), mask = $('#mask');

  function fillArtSelect() {
    var s = $('#fArt');
    s.innerHTML = Object.keys(D.ART).map(function (k) {
      return '<option value="' + k + '">' + esc(D.ART_LABELS[k] || k) + '</option>';
    }).join('');
    s.value = 'sourdough';
  }
  function fillCatSelect() {
    $('#fCat').innerHTML = D.CATS.map(function (c) {
      return '<option value="' + c.id + '">' + esc(c.name) + '</option>';
    }).join('');
  }

  function setErr(field, msg) {
    var el = $('.fld [data-for="' + field + '"]');
    var fld = el ? el.closest('.fld') : null;
    if (!fld) return;
    fld.classList.toggle('is-err', !!msg);
    if (msg) el.textContent = msg;
  }
  function clearErrs() { $$('.fld.is-err').forEach(function (f) { f.classList.remove('is-err'); }); }

  function updatePreview() {
    var art = $('#fArt').value;
    $('#artPrev').innerHTML = D.ART[art] || D.ART.sourdough;
    $('#figPreview').innerHTML = draftImg
      ? '<img src="' + esc(draftImg) + '" alt="">'
      : (D.ART[art] || D.ART.sourdough);
    $('#imgClear').hidden = !draftImg;
  }

  function openDrawer(id) {
    editingId = id || null;
    clearErrs();

    var it = id ? items.filter(function (x) { return x.id === id; })[0] : null;
    $('#dTitle').textContent = it ? '编辑商品' : '新增面包';

    $('#fName').value = it ? it.name : '';
    $('#fPrice').value = it ? it.price : '';
    $('#fWt').value = it ? it.wt : '';
    $('#fDesc').value = it ? it.desc : '';
    $('#fCat').value = it ? it.cat : D.CATS[0].id;
    $('#fTag').value = it ? it.tag : '';
    $('#fTags').value = it ? it.tags : '';
    $('#fHot').checked = it ? !!it.hot : false;
    $('#fSold').checked = it ? !!it.soldOut : false;
    $('#fArt').value = it ? (it.art || 'sourdough') : 'sourdough';
    draftImg = it ? (it.img || '') : '';

    $('#imgHint').textContent = draftImg
      ? '已使用上传图片。移除后将回退为下方插画。'
      : '未上传图片时使用下方选中的插画。';

    $('#descCount').textContent = ($('#fDesc').value || '').length + ' / 200';
    $('#dDelete').style.visibility = it ? 'visible' : 'hidden';
    updatePreview();

    drawer.classList.add('is-on');
    mask.classList.add('is-on');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { $('#fName').focus(); }, 80);
  }

  function closeDrawer() {
    drawer.classList.remove('is-on');
    mask.classList.remove('is-on');
    document.body.style.overflow = '';
    editingId = null;
    draftImg = '';
  }
  $('#dClose').addEventListener('click', closeDrawer);
  $('#dCancel').addEventListener('click', closeDrawer);
  mask.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if ($('#confirmMask').classList.contains('is-on')) closeConfirm(false);
      else if (drawer.classList.contains('is-on')) closeDrawer();
    }
  });

  /* ---------- 图片上传 ---------- */
  $('#imgFile').addEventListener('change', function (e) {
    var f = e.target.files && e.target.files[0];
    if (!f) return;
    toast('图片处理中…');
    compressImage(f).then(function (r) {
      draftImg = r.data;
      updatePreview();
      $('#imgHint').textContent = '已压缩至 ' + r.w + '×' + r.h + '（原 ' + r.ow + '×' + r.oh +
        '，' + kb(Math.round(r.data.length * 0.75)) + '）';
      toast('图片已就绪，记得点保存');
    }).catch(function (err) {
      toast(err.message || '图片处理失败');
    }).then(function () {
      e.target.value = '';
    });
  });
  $('#imgClear').addEventListener('click', function () {
    draftImg = '';
    updatePreview();
    $('#imgHint').textContent = '未上传图片时使用下方选中的插画。';
  });
  $('#fArt').addEventListener('change', updatePreview);
  $('#fDesc').addEventListener('input', function () {
    $('#descCount').textContent = this.value.length + ' / 200';
  });

  /* ---------- 保存单个 ---------- */
  function validate() {
    var ok = true;
    clearErrs();
    var name = $('#fName').value.trim();
    if (!name) { setErr('name', '名称不能为空'); ok = false; }

    var pRaw = $('#fPrice').value.trim();
    var p = Number(pRaw);
    if (pRaw === '' || !isFinite(p)) { setErr('price', '请填写价格'); ok = false; }
    else if (p < 0) { setErr('price', '价格不能为负'); ok = false; }
    else if (p > 9999) { setErr('price', '价格过高'); ok = false; }
    return ok;
  }

  function readForm() {
    return {
      name: $('#fName').value.trim(),
      price: Number($('#fPrice').value) || 0,
      wt: $('#fWt').value.trim(),
      desc: $('#fDesc').value.trim(),
      cat: $('#fCat').value,
      tag: $('#fTag').value.trim(),
      tags: $('#fTags').value.trim(),
      art: $('#fArt').value,
      hot: $('#fHot').checked,
      soldOut: $('#fSold').checked,
      img: draftImg
    };
  }

  $('#dSave').addEventListener('click', function () {
    if (!validate()) { toast('请修正标红的字段'); return; }
    var data = readForm();

    if (editingId) {
      var idx = -1;
      items.forEach(function (x, i) { if (x.id === editingId) idx = i; });
      if (idx < 0) { toast('商品不存在，请刷新'); return; }
      data.id = editingId;
      items[idx] = D.normalizeItem(data);
    } else {
      data.id = 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
      items.push(D.normalizeItem(data));
    }

    if (!persist()) return;
    closeDrawer();
    render();
    toast(editingId ? '已保存修改' : '已添加「' + data.name + '」');
  });

  $('#dDelete').addEventListener('click', function () {
    if (!editingId) return;
    var it = items.filter(function (x) { return x.id === editingId; })[0];
    if (!it) return;
    confirmBox('删除商品', '确定删除「' + it.name + '」？此操作不可撤销。').then(function (ok) {
      if (!ok) return;
      items = items.filter(function (x) { return x.id !== editingId; });
      if (persist()) { closeDrawer(); render(); toast('已删除'); }
    });
  });

  /* ---------- 列表交互 ---------- */
  $('#list').addEventListener('click', function (e) {
    var b = e.target.closest('[data-edit]');
    if (b) openDrawer(b.dataset.edit);
  });
  $('#addBtn').addEventListener('click', function () { openDrawer(null); });
  $('#search').addEventListener('input', function (e) {
    keyword = e.target.value.trim();
    render();
  });

  /* ---------- 导入 / 导出 ---------- */
  $('#exportBtn').addEventListener('click', function () {
    var payload = {
      _app: 'chuxiao-bakery',
      _version: 1,
      _exportedAt: new Date().toISOString(),
      items: items
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'bakery-items-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
    toast('已导出 ' + items.length + ' 款商品');
  });

  $('#importBtn').addEventListener('click', function () { $('#importFile').click(); });
  $('#importFile').addEventListener('change', function (e) {
    var f = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!f) return;
    var reader = new FileReader();
    reader.onerror = function () { toast('文件读取失败'); };
    reader.onload = function () {
      var parsed;
      try { parsed = JSON.parse(reader.result); }
      catch (err) { toast('不是合法的 JSON 文件'); return; }

      var incoming = Array.isArray(parsed) ? parsed : parsed.items;
      if (!Array.isArray(incoming)) { toast('文件里找不到商品列表'); return; }
      var list = D.normalizeList(incoming);
      if (!list || !list.length) { toast('文件里没有有效商品'); return; }

      confirmBox('导入商品',
        '将用文件中的 ' + list.length + ' 款商品覆盖当前 ' + items.length + ' 款。当前数据会被替换，确定继续？'
      ).then(function (ok) {
        if (!ok) return;
        items = list;
        if (persist()) { render(); toast('已导入 ' + items.length + ' 款商品'); }
      });
    };
    reader.readAsText(f);
  });

  /* ---------- 恢复出厂 ---------- */
  $('#resetBtn').addEventListener('click', function () {
    confirmBox('恢复出厂设置',
      '将丢弃全部本地修改，恢复到内置的 8 款默认商品。此操作不可撤销。'
    ).then(function (ok) {
      if (!ok) return;
      items = D.reset();
      render();
      toast('已恢复默认商品');
    });
  });

  /* ---------- 跨标签页同步 ---------- */
  window.addEventListener('storage', function (e) {
    if (e.key !== D.STORE_KEY) return;
    items = D.load();
    render();
    toast('检测到另一窗口的修改，已同步');
  });

  /* ---------- 启动 ---------- */
  fillArtSelect();
  fillCatSelect();
  render();

  if (localStorage.getItem(D.STORE_KEY)) {
    setTimeout(function () { toast('已读取本地保存的商品数据'); }, 400);
  }
})();
