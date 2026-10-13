/*!
 * LUMEN — Cafe24 Responsive Skin UI script
 * Vanilla JS (no jQuery dependency). IE 미지원, 최신 브라우저 기준.
 *
 * 기능: 상단 띠배너 닫기(localStorage) · sticky 헤더 축소 · 모바일 드로어 ·
 *       검색 패널 · 아코디언 · 슬라이더 · 탭 · 상세 갤러리 · 상품 이미지 hover 교체 ·
 *       수량 버튼 · 옵션 버튼 · 상세 탭 스크롤스파이 · 전체선택 · 맨 위로
 *
 * 재초기화: 비동기로 상품 목록이 추가된 경우 window.LUMEN.init(컨테이너) 호출
 */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  root.classList.remove('lm-no-js');
  root.classList.add('lm-js');

  /* ---------- helpers ---------- */
  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
  function on(el, ev, fn, opt) { if (el) el.addEventListener(ev, fn, opt || false); }
  function once(el, key) { if (el['_lm_' + key]) return false; el['_lm_' + key] = true; return true; }

  var store = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* private mode */ } }
  };

  var focusableSel = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  /* ---------- 1. Top notice banner ---------- */
  function initTopBanner(ctx) {
    $$('[data-lm-topbanner]', ctx).forEach(function (bar) {
      if (!once(bar, 'tb')) return;
      var key = 'lumen.topbanner.' + (bar.getAttribute('data-lm-topbanner') || 'default');
      var days = parseFloat(bar.getAttribute('data-lm-topbanner-days') || '1');
      var closedAt = parseInt(store.get(key) || '0', 10);
      if (closedAt && (Date.now() - closedAt) < days * 864e5) { bar.classList.add('is-closed'); return; }
      on($('[data-lm-topbanner-close]', bar), 'click', function () {
        bar.classList.add('is-closed');
        store.set(key, String(Date.now()));
      });
    });
  }

  /* ---------- 2. Sticky header ---------- */
  function initHeader() {
    var header = $('[data-lm-header]');
    if (!header || !once(header, 'hd')) return;
    var ticking = false;
    var threshold = 40;
    function update() {
      var y = window.pageYOffset || root.scrollTop;
      header.classList.toggle('is-compact', y > threshold);
      var totop = $('[data-lm-totop]');
      if (totop) totop.classList.toggle('is-visible', y > 600);
      ticking = false;
    }
    on(window, 'scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ---------- 3. Drawer (mobile menu) ---------- */
  var drawerState = { el: null, dim: null, lastFocus: null };
  function openDrawer(id, trigger) {
    var drawer = doc.getElementById(id);
    if (!drawer) return;
    var dim = $('[data-lm-dim]');
    drawerState.el = drawer; drawerState.dim = dim; drawerState.lastFocus = trigger || doc.activeElement;
    drawer.removeAttribute('aria-hidden');
    drawer.removeAttribute('inert');
    if (dim) { dim.hidden = false; void dim.offsetWidth; dim.classList.add('is-open'); }
    drawer.classList.add('is-open');
    doc.body.classList.add('is-locked');
    $$('[aria-controls="' + id + '"]').forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
    window.setTimeout(function () { var f = $('[data-lm-drawer-close]', drawer) || drawer; f.focus(); }, 60);
  }
  function closeDrawer() {
    var drawer = drawerState.el;
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.setAttribute('inert', '');
    doc.body.classList.remove('is-locked');
    $$('[aria-controls="' + drawer.id + '"]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    var dim = drawerState.dim;
    if (dim) { dim.classList.remove('is-open'); window.setTimeout(function () { dim.hidden = true; }, 320); }
    if (drawerState.lastFocus && drawerState.lastFocus.focus) drawerState.lastFocus.focus();
    drawerState.el = null;
  }
  function initDrawer() {
    if (!once(doc, 'drawer')) return;
    on(doc, 'click', function (e) {
      var t = e.target.closest ? e.target : null;
      if (!t) return;
      var openBtn = t.closest('[data-lm-drawer-open]');
      if (openBtn) { e.preventDefault(); openDrawer(openBtn.getAttribute('aria-controls') || 'lmDrawer', openBtn); return; }
      if (t.closest('[data-lm-drawer-close]') || t.closest('[data-lm-dim]')) { e.preventDefault(); closeDrawer(); }
    });
    on(doc, 'keydown', function (e) {
      if (!drawerState.el) return;
      if (e.key === 'Escape') { closeDrawer(); return; }
      if (e.key === 'Tab') { // focus trap
        var items = $$(focusableSel, drawerState.el).filter(function (el) { return el.offsetParent !== null; });
        if (!items.length) return;
        var first = items[0], last = items[items.length - 1];
        if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    on(window, 'resize', function () { if (drawerState.el && window.innerWidth >= 1024) closeDrawer(); });
  }

  /* ---------- 4. Search panel ---------- */
  function initSearch() {
    if (!once(doc, 'search')) return;
    var panel = $('[data-lm-search]');
    if (!panel) return;
    function open(trigger) {
      if (drawerState.el) closeDrawer();
      panel.hidden = false;
      $$('[data-lm-search-open]').forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
      var input = $('input[type="text"], input[type="search"]', panel);
      if (input) window.setTimeout(function () { input.focus(); }, 30);
      panel._lmTrigger = trigger;
    }
    function close() {
      panel.hidden = true;
      $$('[data-lm-search-open]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
      if (panel._lmTrigger) panel._lmTrigger.focus();
    }
    on(doc, 'click', function (e) {
      var openBtn = e.target.closest && e.target.closest('[data-lm-search-open]');
      if (openBtn) { e.preventDefault(); panel.hidden ? open(openBtn) : close(); return; }
      if (e.target.closest && e.target.closest('[data-lm-search-close]')) { e.preventDefault(); close(); return; }
      if (!panel.hidden && !panel.contains(e.target)) { panel.hidden = true; $$('[data-lm-search-open]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); }); }
    });
    on(doc, 'keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) close(); });
  }

  /* ---------- 5. Accordion ---------- */
  function initAccordion(ctx) {
    $$('[data-lm-accordion]', ctx).forEach(function (btn) {
      if (!once(btn, 'acc')) return;
      var panel = doc.getElementById(btn.getAttribute('aria-controls'));
      if (!panel) return;
      if (btn.getAttribute('aria-expanded') !== 'true') panel.hidden = true;
      on(btn, 'click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        panel.hidden = open;
      });
    });
  }

  /* ---------- 6. Slider ---------- */
  function Slider(el) {
    this.el = el;
    this.track = $('.lm-slider__track', el);
    this.slides = $$('.lm-slider__slide', el);
    this.count = this.slides.length;
    this.index = 0;
    this.interval = parseInt(el.getAttribute('data-lm-autoplay') || '0', 10);
    this.paused = false;
    this.timer = null;
    if (this.count < 1) return;
    this.build();
  }
  Slider.prototype.build = function () {
    var self = this, el = this.el;
    el.setAttribute('aria-roledescription', 'carousel');
    this.slides.forEach(function (s, i) {
      s.setAttribute('role', 'group');
      s.setAttribute('aria-roledescription', 'slide');
      s.setAttribute('aria-label', (i + 1) + ' / ' + self.count);
    });
    this.counterCur = $('[data-lm-slider-current]', el);
    var total = $('[data-lm-slider-total]', el);
    if (total) total.textContent = pad(this.count);
    this.progress = $('.lm-slider__progress i', el);
    if (this.interval) el.style.setProperty('--lm-autoplay', this.interval + 'ms');

    var dots = $('.lm-slider__dots', el);
    if (dots) {
      dots.innerHTML = '';
      this.slides.forEach(function (_, i) {
        var b = doc.createElement('button');
        b.type = 'button'; b.className = 'lm-slider__dot';
        b.setAttribute('aria-label', (i + 1) + '번 슬라이드로 이동');
        on(b, 'click', function () { self.go(i, true); });
        dots.appendChild(b);
      });
      this.dots = $$('.lm-slider__dot', dots);
    }
    on($('[data-lm-slider-prev]', el), 'click', function () { self.go(self.index - 1, true); });
    on($('[data-lm-slider-next]', el), 'click', function () { self.go(self.index + 1, true); });
    var pauseBtn = $('[data-lm-slider-pause]', el);
    if (pauseBtn) {
      on(pauseBtn, 'click', function () {
        self.paused = !self.paused;
        pauseBtn.setAttribute('aria-pressed', String(self.paused));
        pauseBtn.setAttribute('aria-label', self.paused ? '자동 재생 시작' : '자동 재생 정지');
        $$('use', pauseBtn).forEach(function (u) { u.setAttribute('href', self.paused ? '#lm-i-play' : '#lm-i-pause'); });
        self.paused ? self.stop() : self.play();
      });
    }
    if (this.count < 2) { var c = $('.lm-slider__controls', el); if (c) c.hidden = true; }

    // hover / focus pause
    on(el, 'mouseenter', function () { self.stop(); });
    on(el, 'mouseleave', function () { if (!self.paused) self.play(); });
    on(el, 'focusin', function () { self.stop(); });
    on(el, 'focusout', function () { if (!self.paused) self.play(); });
    on(el, 'keydown', function (e) {
      if (e.key === 'ArrowLeft') self.go(self.index - 1, true);
      if (e.key === 'ArrowRight') self.go(self.index + 1, true);
    });

    // swipe
    var startX = 0, startY = 0, dx = 0, dragging = false, vp = $('.lm-slider__viewport', el) || el;
    on(vp, 'pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true; startX = e.clientX; startY = e.clientY; dx = 0;
      self.track.style.transition = 'none';
    });
    on(vp, 'pointermove', function (e) {
      if (!dragging) return;
      dx = e.clientX - startX;
      if (Math.abs(e.clientY - startY) > Math.abs(dx)) return;
      self.track.style.transform = 'translate3d(calc(' + (-self.index * 100) + '% + ' + dx + 'px),0,0)';
    });
    function end() {
      if (!dragging) return;
      dragging = false;
      self.track.style.transition = '';
      if (Math.abs(dx) > 50) self.go(self.index + (dx < 0 ? 1 : -1), true); else self.go(self.index);
    }
    on(vp, 'pointerup', end); on(vp, 'pointercancel', end); on(vp, 'pointerleave', end);
    on(vp, 'click', function (e) { if (Math.abs(dx) > 8) { e.preventDefault(); e.stopPropagation(); } }, true);
    $$('img', el).forEach(function (img) { img.setAttribute('draggable', 'false'); });

    // 탭이 숨겨지면 정지
    on(doc, 'visibilitychange', function () { doc.hidden ? self.stop() : (!self.paused && self.play()); });

    this.go(0);
    if (reduceMotion) {
      this.paused = true;
      if (pauseBtn) { pauseBtn.setAttribute('aria-pressed', 'true'); pauseBtn.setAttribute('aria-label', '자동 재생 시작'); }
    } else this.play();
  };
  Slider.prototype.go = function (i, user) {
    var n = this.count;
    this.index = ((i % n) + n) % n;
    this.track.style.transform = 'translate3d(' + (-this.index * 100) + '%,0,0)';
    var cur = this.index;
    this.slides.forEach(function (s, k) {
      var active = k === cur;
      s.classList.toggle('is-active', active);
      s.setAttribute('aria-hidden', String(!active));
      $$('a, button, input', s).forEach(function (f) { active ? f.removeAttribute('tabindex') : f.setAttribute('tabindex', '-1'); });
    });
    if (this.dots) this.dots.forEach(function (d, k) { d.setAttribute('aria-current', String(k === cur)); });
    if (this.counterCur) this.counterCur.textContent = pad(cur + 1);
    if (user && !this.paused) this.play();
  };
  Slider.prototype.play = function () {
    var self = this;
    this.stop();
    if (!this.interval || this.count < 2 || this.paused) return;
    if (this.progress) { this.progress.classList.remove('is-running'); void this.progress.offsetWidth; this.progress.classList.add('is-running'); }
    this.timer = window.setTimeout(function () { self.go(self.index + 1); self.play(); }, this.interval);
  };
  Slider.prototype.stop = function () {
    window.clearTimeout(this.timer);
    if (this.progress) this.progress.classList.remove('is-running');
  };
  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function initSliders(ctx) {
    $$('[data-lm-slider]', ctx).forEach(function (el) { if (once(el, 'sl')) el._lmSlider = new Slider(el); });
  }

  /* ---------- 7. Tabs ---------- */
  function initTabs(ctx) {
    $$('[data-lm-tabs]', ctx).forEach(function (wrap) {
      if (!once(wrap, 'tabs')) return;
      var tabs = $$('[role="tab"]', wrap);
      function select(tab, focus) {
        tabs.forEach(function (t) {
          var sel = t === tab;
          t.setAttribute('aria-selected', String(sel));
          t.setAttribute('tabindex', sel ? '0' : '-1');
          var p = doc.getElementById(t.getAttribute('aria-controls'));
          if (p) p.hidden = !sel;
        });
        if (focus) tab.focus();
      }
      tabs.forEach(function (t, i) {
        on(t, 'click', function () { select(t); });
        on(t, 'keydown', function (e) {
          var k = e.key, n = tabs.length, j = null;
          if (k === 'ArrowRight') j = (i + 1) % n;
          else if (k === 'ArrowLeft') j = (i - 1 + n) % n;
          else if (k === 'Home') j = 0;
          else if (k === 'End') j = n - 1;
          if (j !== null) { e.preventDefault(); select(tabs[j], true); }
        });
      });
      var initial = tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0];
      if (initial) select(initial);
    });
  }

  /* ---------- 8. Detail gallery ---------- */
  function initGallery(ctx) {
    $$('[data-lm-gallery]', ctx).forEach(function (g) {
      if (!once(g, 'gal')) return;
      var main = $('[data-lm-gallery-main]', g);
      var thumbs = $$('[data-lm-gallery-thumb]', g);
      var count = $('[data-lm-gallery-count]', g);
      // Cafe24 추가이미지(product_addimage)는 <img>만 출력되므로 버튼으로 감싸 접근성 보강
      $$('.lm-gallery__thumbs img', g).forEach(function (img) {
        if (img.closest('[data-lm-gallery-thumb]')) return;
        var b = doc.createElement('button');
        b.type = 'button'; b.className = 'lm-gallery__thumb'; b.setAttribute('data-lm-gallery-thumb', '');
        b.setAttribute('data-src', img.getAttribute('data-big') || img.src);
        b.setAttribute('aria-label', '이미지 크게 보기');
        img.parentNode.insertBefore(b, img); b.appendChild(img);
        thumbs.push(b);
      });
      if (!main) return;
      var idx = 0;
      function show(i) {
        if (!thumbs.length) return;
        idx = (i + thumbs.length) % thumbs.length;
        var src = thumbs[idx].getAttribute('data-src') || ($('img', thumbs[idx]) || {}).src;
        if (src && main.getAttribute('src') !== src) {
          main.classList.add('is-fading');
          window.setTimeout(function () { main.src = src; main.onload = function () { main.classList.remove('is-fading'); }; window.setTimeout(function () { main.classList.remove('is-fading'); }, 400); }, reduceMotion ? 0 : 160);
        }
        thumbs.forEach(function (t, k) { t.setAttribute('aria-current', String(k === idx)); });
        if (count) count.textContent = (idx + 1) + ' / ' + thumbs.length;
      }
      thumbs.forEach(function (t, i) { on(t, 'click', function () { show(i); }); });
      on($('[data-lm-gallery-prev]', g), 'click', function () { show(idx - 1); });
      on($('[data-lm-gallery-next]', g), 'click', function () { show(idx + 1); });
      // swipe on main image (mobile)
      var sx = 0, sy = 0;
      var stage = main.parentNode;
      on(stage, 'touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
      on(stage, 'touchend', function (e) {
        var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) show(idx + (dx < 0 ? 1 : -1));
      }, { passive: true });
      if (thumbs.length) { thumbs.forEach(function (t, k) { t.setAttribute('aria-current', String(k === 0)); }); if (count) count.textContent = '1 / ' + thumbs.length; }
      else { $$('.lm-gallery__nav, [data-lm-gallery-count]', g).forEach(function (n) { n.hidden = true; }); }
    });
  }

  /* ---------- 9. Product image hover swap ---------- */
  function initHoverSwap(ctx) {
    $$('img[data-lm-hover-src]', ctx).forEach(function (img) {
      if (!once(img, 'hv')) return;
      var src = img.getAttribute('data-lm-hover-src');
      // Cafe24 변수가 비어 있거나 치환되지 않은 경우 무시
      if (!src || src.indexOf('{$') > -1 || src === img.getAttribute('src')) return;
      var hover = doc.createElement('img');
      hover.className = 'lm-card__img--hover';
      hover.alt = '';
      hover.setAttribute('aria-hidden', 'true');
      hover.loading = 'lazy';
      hover.decoding = 'async';
      hover.src = src;
      img.parentNode.insertBefore(hover, img.nextSibling);
    });
  }

  /* ---------- 10. Back to top ---------- */
  function initToTop() {
    var btn = $('[data-lm-totop]');
    if (!btn || !once(btn, 'tt')) return;
    on(btn, 'click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      var skip = $('#lmContents') || doc.body;
      if (skip && skip.focus) skip.focus({ preventScroll: true });
    });
  }

  /* ---------- 11. Quantity stepper ---------- */
  function initQty(ctx) {
    $$('[data-lm-qty]', ctx).forEach(function (box) {
      if (!once(box, 'qty')) return;
      var input = $('input', box);
      if (!input) return;
      var min = parseInt(input.getAttribute('min') || '1', 10);
      var max = parseInt(input.getAttribute('max') || '999', 10);
      function set(v) {
        v = Math.max(min, Math.min(max, v || min));
        input.value = v;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
      on($('[data-lm-qty-down]', box), 'click', function (e) { e.preventDefault(); set(parseInt(input.value, 10) - 1); });
      on($('[data-lm-qty-up]', box), 'click', function (e) { e.preventDefault(); set(parseInt(input.value, 10) + 1); });
    });
  }

  /* ---------- 12. Option buttons (aria-pressed, single select) ---------- */
  function initOptionButtons(ctx) {
    $$('[data-lm-choice]', ctx).forEach(function (group) {
      if (!once(group, 'opt')) return;
      var label = group.getAttribute('data-lm-choice') ? doc.getElementById(group.getAttribute('data-lm-choice')) : null;
      $$('button', group).forEach(function (b) {
        on(b, 'click', function () {
          $$('button', group).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
          if (label) label.textContent = b.getAttribute('data-label') || b.textContent.trim();
          var target = group.getAttribute('data-lm-select-target');
          var sel = target ? doc.querySelector(target) : null; // 실제 카페24 옵션 select와 동기화
          if (sel) { sel.value = b.getAttribute('data-value') || ''; sel.dispatchEvent(new Event('change', { bubbles: true })); }
        });
      });
    });
  }

  /* ---------- 13. Detail tab scrollspy ---------- */
  function initScrollSpy(ctx) {
    $$('[data-lm-spy]', ctx).forEach(function (nav) {
      if (!once(nav, 'spy')) return;
      var links = $$('a[href^="#"]', nav);
      var sections = links.map(function (a) { return doc.getElementById(a.getAttribute('href').slice(1)); }).filter(Boolean);
      if (!('IntersectionObserver' in window) || !sections.length) return;
      function activate(id) {
        links.forEach(function (a) {
          var act = a.getAttribute('href') === '#' + id;
          a.classList.toggle('is-active', act);
          act ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current');
        });
      }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) activate(en.target.id); });
      }, { rootMargin: '-35% 0px -60% 0px' });
      sections.forEach(function (s) { io.observe(s); });
      activate(sections[0].id);
      // 첫 섹션보다 위로 올라가면 첫 탭을 활성화
      on(window, 'scroll', function () {
        if (sections[0].getBoundingClientRect().top > window.innerHeight * .4) activate(sections[0].id);
      }, { passive: true });
    });
  }

  /* ---------- 14. Check all ---------- */
  function initCheckAll(ctx) {
    $$('[data-lm-checkall]', ctx).forEach(function (master) {
      if (!once(master, 'ca')) return;
      var name = master.getAttribute('data-lm-checkall');
      function items() { return $$('input[type="checkbox"][name="' + name + '"]'); }
      on(master, 'change', function () { items().forEach(function (c) { c.checked = master.checked; }); });
      on(doc, 'change', function (e) {
        if (e.target.name === name) { var all = items(); master.checked = all.length && all.every(function (c) { return c.checked; }); }
      });
    });
  }

  /* ---------- 15. Wish toggle (UI 피드백) ---------- */
  function initToggle(ctx) {
    $$('[data-lm-toggle]', ctx).forEach(function (b) {
      if (!once(b, 'tg')) return;
      on(b, 'click', function () {
        var p = b.getAttribute('aria-pressed') === 'true';
        b.setAttribute('aria-pressed', String(!p));
        var msg = b.getAttribute(p ? 'data-msg-off' : 'data-msg-on');
        if (msg) toast(msg);
      });
    });
  }
  function toast(msg) {
    var t = $('.lm-toast');
    if (!t) { t = doc.createElement('div'); t.className = 'lm-toast'; t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite'); doc.body.appendChild(t); }
    t.textContent = msg; t.classList.add('is-show');
    window.clearTimeout(t._h); t._h = window.setTimeout(function () { t.classList.remove('is-show'); }, 2000);
  }

  /* ---------- 16. Cafe24 하위 카테고리 (드로어/GNB 아코디언) ----------
     카페24 기본 스킨과 동일하게 /exec/front/Product/SubCategory 응답(JSON)을 받아
     data-lm-subcate="{cate_no}" 위치에 하위 분류를 그립니다.
     CHECK: 응답 필드(cate_no, parent_cate_no, name, design_page_url, param)는
            기본 스킨 /layout/basic/js/ 의 카테고리 스크립트와 대조하세요. */
  function initSubCategory() {
    var holders = $$('[data-lm-subcate]');
    if (!holders.length || location.protocol === 'file:' || !window.fetch) return;
    fetch('/exec/front/Product/SubCategory', { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (list) {
        if (!Array.isArray(list)) return;
        holders.forEach(function (h) {
          // data-lm-subcate 에는 cate_no 숫자 또는 카페24 {$param}(예: ?cate_no=24) 이 올 수 있음
          var raw = h.getAttribute('data-lm-subcate') || '';
          var m = raw.match(/cate_no=(\d+)/);
          var no = m ? m[1] : raw.replace(/\D/g, '');
          if (!no || h.children.length) return;
          var subs = list.filter(function (c) { return String(c.parent_cate_no) === String(no); });
          var wrap = h.closest('[data-lm-subwrap]');
          if (!subs.length) { if (wrap) { var t = $('[data-lm-accordion]', wrap); if (t) t.hidden = true; } return; }
          h.innerHTML = subs.map(function (c) {
            var url = (c.design_page_url || 'product/list.html') + (c.param || ('?cate_no=' + c.cate_no));
            return '<li><a href="/' + url.replace(/^\//, '') + '">' + escapeHtml(c.name) + '</a></li>';
          }).join('');
        });
      })['catch'](function () {});
  }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ---------- 17. 장바구니 수량 배지 0 숨김 ---------- */
  function initBadgeCount(ctx) {
    $$('.lm-badge-count', ctx).forEach(function (b) {
      var n = parseInt((b.textContent || '').replace(/\D/g, ''), 10) || 0;
      b.setAttribute('data-count', String(n));
    });
  }

  /* ---------- 18. 할인율 계산 (data-price / data-origin) ----------
     카페24 목록 변수로 판매가·소비자가를 받아 할인율을 표시합니다.
     값이 숫자가 아니거나 할인이 없으면 요소를 제거합니다. */
  function initDiscountRate(ctx) {
    $$('[data-lm-rate]', ctx).forEach(function (el) {
      if (!once(el, 'rate')) return;
      var num = function (v) { return parseInt(String(v || '').replace(/[^0-9]/g, ''), 10) || 0; };
      var price = num(el.getAttribute('data-price')), origin = num(el.getAttribute('data-origin'));
      if (price > 0 && origin > price) el.textContent = Math.round((1 - price / origin) * 100) + '%';
      else el.parentNode && el.parentNode.removeChild(el);
    });
  }

  /* ---------- 19. 현재 페이지 표시 (하단 탭바) + 상세 페이지 body 클래스 ---------- */
  function initCurrentPage() {
    var path = location.pathname.replace(/index\.html$/, '');
    $$('.lm-tabbar__link[href]').forEach(function (a) {
      var href = a.getAttribute('href').replace(/index\.html$/, '');
      var hit = href === '/' ? path === '/' : path.indexOf(href.replace(/\.html$/, '')) === 0;
      if (hit && !$('.lm-tabbar__link[aria-current]')) { a.classList.add('is-active'); a.setAttribute('aria-current', 'page'); }
    });
    if ($('.lm-buybar')) doc.body.classList.add('lm-page-detail');
  }

  /* ---------- 20. 목록 정렬 (현재 주소의 파라미터 유지) ---------- */
  function sortUrl(method) {
    var q = location.search.replace(/^\?/, '').split('&').filter(function (kv) { return kv && kv.indexOf('sort_method=') !== 0 && kv.indexOf('page=') !== 0; });
    q.push('sort_method=' + method);
    return location.pathname + '?' + q.join('&') + '#Product_ListMenu';
  }
  function initSort(ctx) {
    var cur = (location.search.match(/sort_method=(\d+)/) || [])[1];
    $$('[data-lm-sort]', ctx).forEach(function (a) {
      if (!once(a, 'sort')) return;
      var m = a.getAttribute('data-lm-sort');
      a.setAttribute('href', sortUrl(m));
      if (m === cur) { a.classList.add('is-current'); a.setAttribute('aria-current', 'true'); }
    });
    $$('[data-lm-sort-select]', ctx).forEach(function (sel) {
      if (!once(sel, 'sortsel')) return;
      if (cur) sel.value = cur;
      on(sel, 'change', function () { location.href = sortUrl(sel.value); });
    });
  }

  /* ---------- init ---------- */
  function init(ctx) {
    ctx = ctx || doc;
    initTopBanner(ctx);
    initAccordion(ctx);
    initSliders(ctx);
    initTabs(ctx);
    initGallery(ctx);
    initHoverSwap(ctx);
    initQty(ctx);
    initOptionButtons(ctx);
    initScrollSpy(ctx);
    initCheckAll(ctx);
    initToggle(ctx);
    initBadgeCount(ctx);
    initDiscountRate(ctx);
    initSort(ctx);
  }
  function boot() {
    initHeader();
    initDrawer();
    initSearch();
    initToTop();
    initCurrentPage();
    init(doc);
    initSubCategory();
  }

  window.LUMEN = { init: init, openDrawer: openDrawer, closeDrawer: closeDrawer, toast: toast, store: store };

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
