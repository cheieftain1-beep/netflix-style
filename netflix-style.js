(function () {
  'use strict';

  // ─── PLUGIN META ────────────────────────────────────────────────────────────
  var PLUGIN_NAME = 'NetflixStyle';
  var PLUGIN_VERSION = '1.0.0';

  // ─── DEFAULT SETTINGS ───────────────────────────────────────────────────────
  var DEFAULT_SETTINGS = {
    hero_autoplay: true,
    hero_interval: 7000,
    hero_blur: true,
    show_maturity: true,
    show_progress: true,
    show_continue: true,
    show_trending: true,
    show_new: true,
    show_top10: true,
    show_recommended: true,
    card_scale_hover: true,
    card_hover_delay: 400,
    animate_scroll: true,
    dark_vignette: true,
    row_count: 6,
    language: 'ru'
  };

  // ─── CSS ────────────────────────────────────────────────────────────────────
  var CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Netflix+Sans:wght@300;400;700&display=swap');

    :root {
      --nf-red:       #E50914;
      --nf-red-dark:  #B20710;
      --nf-black:     #141414;
      --nf-bg:        #141414;
      --nf-card-bg:   #1f1f1f;
      --nf-text:      #e5e5e5;
      --nf-muted:     #999;
      --nf-white:     #fff;
      --nf-radius:    4px;
      --nf-row-gap:   3vw;
      --nf-card-w:    16vw;
      --nf-card-h:    9vw;
      --nf-hero-h:    56.25vw;
      --nf-trans:     0.25s cubic-bezier(0.25,0.46,0.45,0.94);
    }

    /* ── RESET / BASE ── */
    #nf-root * { box-sizing: border-box; margin: 0; padding: 0; }
    #nf-root {
      position: fixed; inset: 0; z-index: 9999;
      background: var(--nf-black);
      color: var(--nf-text);
      font-family: 'Netflix Sans', 'Helvetica Neue', Arial, sans-serif;
      font-size: 16px;
      overflow: hidden;
    }

    /* ── SCROLLABLE CONTENT ── */
    #nf-scroll {
      height: 100%; overflow-y: auto; overflow-x: hidden;
      scroll-behavior: smooth;
      scrollbar-width: none;
    }
    #nf-scroll::-webkit-scrollbar { display: none; }

    /* ── HEADER ── */
    #nf-header {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      height: 68px;
      display: flex; align-items: center;
      padding: 0 4%;
      background: linear-gradient(to bottom, rgba(0,0,0,.85) 0%, transparent 100%);
      transition: background var(--nf-trans);
    }
    #nf-header.solid { background: var(--nf-black); }
    #nf-logo {
      color: var(--nf-red); font-size: 2rem; font-weight: 900;
      letter-spacing: -1px; text-transform: uppercase;
      user-select: none; cursor: default;
    }
    #nf-nav {
      display: flex; gap: 1.5rem; margin-left: 3rem;
      list-style: none;
    }
    #nf-nav li a {
      color: var(--nf-text); text-decoration: none; font-size: .9rem;
      opacity: .8; transition: opacity .2s;
      cursor: pointer;
    }
    #nf-nav li a:hover, #nf-nav li a.active { opacity: 1; }
    #nf-header-right {
      margin-left: auto; display: flex; align-items: center; gap: 1.2rem;
    }
    .nf-icon-btn {
      background: none; border: none; cursor: pointer;
      color: var(--nf-text); font-size: 1.2rem; padding: 6px;
      border-radius: 50%; transition: background .2s;
    }
    .nf-icon-btn:hover { background: rgba(255,255,255,.1); }

    /* ── HERO ── */
    #nf-hero {
      position: relative; height: var(--nf-hero-h); min-height: 480px;
      overflow: hidden; flex-shrink: 0;
    }
    #nf-hero-bg {
      position: absolute; inset: 0;
      background-size: cover; background-position: center top;
      transition: opacity 1s ease, transform 8s linear;
    }
    #nf-hero-vignette {
      position: absolute; inset: 0;
      background: linear-gradient(
        77deg, rgba(0,0,0,.8) 0%, transparent 50%
      ),
      linear-gradient(to top, var(--nf-black) 0%, transparent 30%),
      linear-gradient(to bottom, rgba(0,0,0,.5) 0%, transparent 20%);
    }
    #nf-hero-content {
      position: absolute; bottom: 25%; left: 4%;
      max-width: 40%; animation: nfFadeUp .8s ease both;
    }
    .nf-hero-logo-img {
      width: 380px; max-width: 100%;
      filter: drop-shadow(0 2px 8px rgba(0,0,0,.7));
      margin-bottom: 1.2rem;
    }
    .nf-hero-title {
      font-size: 3rem; font-weight: 700; line-height: 1.1;
      text-shadow: 2px 2px 8px rgba(0,0,0,.8);
      margin-bottom: .8rem;
    }
    .nf-hero-desc {
      font-size: 1.1rem; line-height: 1.5;
      color: rgba(255,255,255,.9);
      text-shadow: 1px 1px 4px rgba(0,0,0,.9);
      display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;
      overflow: hidden; margin-bottom: 1.4rem;
    }
    .nf-hero-meta {
      display: flex; align-items: center; gap: .8rem;
      margin-bottom: 1.2rem; font-size: .85rem; color: var(--nf-muted);
    }
    .nf-hero-rating {
      color: #46d369; font-weight: 700; font-size: .9rem;
    }
    .nf-hero-buttons { display: flex; gap: .8rem; }
    .nf-btn {
      display: inline-flex; align-items: center; gap: .5rem;
      padding: .6rem 1.8rem; border-radius: var(--nf-radius);
      font-size: 1rem; font-weight: 700; cursor: pointer;
      border: none; transition: all .15s; white-space: nowrap;
    }
    .nf-btn-play {
      background: var(--nf-white); color: #000;
    }
    .nf-btn-play:hover { background: rgba(255,255,255,.75); }
    .nf-btn-info {
      background: rgba(109,109,110,.7); color: var(--nf-white);
      backdrop-filter: blur(4px);
    }
    .nf-btn-info:hover { background: rgba(109,109,110,.4); }

    /* Hero dots */
    #nf-hero-dots {
      position: absolute; bottom: 8%; right: 4%;
      display: flex; gap: .4rem; align-items: center;
    }
    .nf-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: rgba(255,255,255,.4); cursor: pointer;
      transition: all .3s;
    }
    .nf-dot.active { background: var(--nf-white); transform: scale(1.3); }

    /* ── ROWS ── */
    #nf-rows { padding-bottom: 5vh; }

    .nf-row { margin-bottom: var(--nf-row-gap); padding: 0; position: relative; }
    .nf-row-header {
      display: flex; align-items: center; gap: .8rem;
      padding: 0 4%; margin-bottom: .6rem;
    }
    .nf-row-title {
      font-size: 1.35rem; font-weight: 700; color: var(--nf-text);
    }
    .nf-row-explore {
      font-size: .85rem; color: #54b9c5; cursor: pointer;
      opacity: 0; transform: translateX(-8px);
      transition: all .3s; white-space: nowrap;
    }
    .nf-row:hover .nf-row-explore { opacity: 1; transform: none; }
    .nf-row-rank {
      font-size: .75rem; font-weight: 700; color: var(--nf-red);
      text-transform: uppercase; letter-spacing: .05em;
    }

    /* ── SLIDER ── */
    .nf-slider-wrap { position: relative; }
    .nf-slider {
      display: flex; gap: .25vw;
      padding: 2.5vw 4%;
      overflow-x: auto; overflow-y: visible;
      scrollbar-width: none;
      scroll-behavior: smooth;
      /* leave room for card scale */
    }
    .nf-slider::-webkit-scrollbar { display: none; }

    .nf-slider-btn {
      position: absolute; top: 0; bottom: 0;
      width: 4%; background: rgba(20,20,20,.5);
      border: none; cursor: pointer; z-index: 10;
      color: var(--nf-white); font-size: 1.5rem;
      opacity: 0; transition: opacity .3s;
      display: flex; align-items: center; justify-content: center;
    }
    .nf-slider-btn.left { left: 0; border-radius: 0 var(--nf-radius) var(--nf-radius) 0; }
    .nf-slider-btn.right { right: 0; border-radius: var(--nf-radius) 0 0 var(--nf-radius); }
    .nf-slider-wrap:hover .nf-slider-btn { opacity: 1; }
    .nf-slider-btn:hover { background: rgba(20,20,20,.8); }

    /* ── CARDS ── */
    .nf-card {
      flex-shrink: 0;
      width: var(--nf-card-w);
      height: var(--nf-card-h);
      border-radius: var(--nf-radius);
      overflow: hidden;
      cursor: pointer;
      position: relative;
      transition: transform var(--nf-trans), box-shadow var(--nf-trans), z-index 0s;
      background: var(--nf-card-bg);
    }
    .nf-card:hover {
      transform: scale(1.35);
      box-shadow: 0 8px 40px rgba(0,0,0,.9);
      z-index: 50;
    }
    /* edge cards scale inward */
    .nf-card:first-child:hover { transform-origin: left center; transform: scale(1.35); }
    .nf-card:last-child:hover  { transform-origin: right center; transform: scale(1.35); }

    .nf-card-img {
      width: 100%; height: 100%;
      object-fit: cover; display: block;
      transition: transform var(--nf-trans);
    }

    .nf-card-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,.85) 0%, transparent 60%);
      opacity: 0; transition: opacity .3s;
      display: flex; flex-direction: column; justify-content: flex-end;
      padding: .6rem;
    }
    .nf-card:hover .nf-card-overlay { opacity: 1; }
    .nf-card-name {
      font-size: .75rem; font-weight: 700;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .nf-card-actions {
      display: flex; gap: .3rem; margin-bottom: .3rem;
    }
    .nf-card-btn {
      width: 26px; height: 26px; border-radius: 50%;
      border: 2px solid rgba(255,255,255,.7);
      background: rgba(0,0,0,.4);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; font-size: .7rem; color: var(--nf-white);
      transition: border-color .2s, background .2s;
    }
    .nf-card-btn:hover { border-color: var(--nf-white); background: rgba(255,255,255,.2); }
    .nf-card-btn.play { background: var(--nf-white); border-color: var(--nf-white); color: #000; }

    /* Progress bar */
    .nf-progress {
      position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
      background: rgba(255,255,255,.2);
    }
    .nf-progress-fill {
      height: 100%; background: var(--nf-red);
    }

    /* Top-10 number badge */
    .nf-top10-num {
      position: absolute; left: -1.5vw; bottom: -.5vw;
      font-size: 7vw; font-weight: 900; line-height: 1;
      color: var(--nf-black);
      -webkit-text-stroke: 3px rgba(255,255,255,.5);
      text-stroke: 3px rgba(255,255,255,.5);
      pointer-events: none; user-select: none;
    }

    /* New badge */
    .nf-badge {
      position: absolute; top: .4rem; left: .4rem;
      background: var(--nf-red); color: var(--nf-white);
      font-size: .6rem; font-weight: 700; padding: .15rem .4rem;
      border-radius: 2px; text-transform: uppercase; letter-spacing: .04em;
    }

    /* Maturity badge */
    .nf-maturity {
      display: inline-flex; align-items: center;
      border: 1px solid rgba(255,255,255,.5);
      font-size: .65rem; padding: .1rem .3rem;
      border-radius: 2px; color: var(--nf-muted);
    }

    /* ── SETTINGS PANEL ── */
    #nf-settings {
      position: fixed; inset: 0; z-index: 200;
      background: rgba(0,0,0,.75); backdrop-filter: blur(8px);
      display: none; align-items: center; justify-content: center;
      animation: nfFadeIn .2s ease;
    }
    #nf-settings.open { display: flex; }
    #nf-settings-box {
      background: #1a1a1a; border-radius: 8px;
      width: 540px; max-height: 80vh; overflow-y: auto;
      padding: 2rem; box-shadow: 0 20px 60px rgba(0,0,0,.9);
      scrollbar-width: thin; scrollbar-color: #444 transparent;
    }
    #nf-settings-box h2 {
      font-size: 1.4rem; font-weight: 700; margin-bottom: 1.5rem;
      border-bottom: 1px solid #333; padding-bottom: .8rem;
    }
    .nf-settings-section { margin-bottom: 1.5rem; }
    .nf-settings-section h3 {
      font-size: .75rem; text-transform: uppercase; letter-spacing: .1em;
      color: var(--nf-muted); margin-bottom: .8rem;
    }
    .nf-setting-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: .55rem 0; border-bottom: 1px solid #2a2a2a;
    }
    .nf-setting-row:last-child { border-bottom: none; }
    .nf-setting-label { font-size: .9rem; }
    .nf-setting-desc { font-size: .75rem; color: var(--nf-muted); margin-top: .1rem; }

    /* Toggle */
    .nf-toggle {
      width: 40px; height: 22px; border-radius: 11px;
      background: #555; cursor: pointer; position: relative;
      transition: background .25s; flex-shrink: 0;
    }
    .nf-toggle.on { background: var(--nf-red); }
    .nf-toggle::after {
      content: ''; position: absolute;
      width: 18px; height: 18px; border-radius: 50%;
      background: #fff; top: 2px; left: 2px;
      transition: transform .25s;
    }
    .nf-toggle.on::after { transform: translateX(18px); }

    /* Range */
    .nf-range {
      width: 140px; accent-color: var(--nf-red); cursor: pointer;
    }
    .nf-range-val {
      font-size: .8rem; color: var(--nf-muted);
      min-width: 2rem; text-align: right;
    }

    .nf-settings-close {
      margin-top: 1.5rem; width: 100%; padding: .7rem;
      background: var(--nf-red); color: #fff; border: none;
      border-radius: var(--nf-radius); font-size: 1rem; font-weight: 700;
      cursor: pointer; transition: background .2s;
    }
    .nf-settings-close:hover { background: var(--nf-red-dark); }

    /* ── DETAIL MODAL ── */
    #nf-detail {
      position: fixed; inset: 0; z-index: 150;
      background: rgba(0,0,0,.7); backdrop-filter: blur(6px);
      display: none; align-items: flex-end; justify-content: center;
      animation: nfFadeIn .2s ease;
    }
    #nf-detail.open { display: flex; }
    #nf-detail-box {
      width: 850px; max-width: 95vw;
      background: #141414; border-radius: 12px 12px 0 0;
      overflow: hidden; max-height: 92vh;
      animation: nfSlideUp .35s cubic-bezier(.25,.46,.45,.94) both;
    }
    #nf-detail-hero {
      height: 480px; position: relative;
      background-size: cover; background-position: center;
    }
    #nf-detail-hero::after {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(to top, #141414 0%, transparent 50%);
    }
    #nf-detail-content { padding: 1.5rem 2rem 2rem; overflow-y: auto; }
    #nf-detail-title { font-size: 2rem; font-weight: 700; margin-bottom: .6rem; }
    .nf-detail-meta {
      display: flex; gap: 1rem; align-items: center;
      font-size: .85rem; color: var(--nf-muted); margin-bottom: 1rem;
    }
    .nf-detail-desc { font-size: .95rem; line-height: 1.6; color: rgba(255,255,255,.85); }
    #nf-detail-btns { display: flex; gap: .8rem; margin-bottom: 1.2rem; }
    .nf-detail-close {
      position: absolute; top: 1rem; right: 1rem; z-index: 10;
      width: 36px; height: 36px; border-radius: 50%;
      background: rgba(20,20,20,.8); border: none; cursor: pointer;
      color: #fff; font-size: 1.1rem;
      display: flex; align-items: center; justify-content: center;
      transition: background .2s;
    }
    .nf-detail-close:hover { background: rgba(255,255,255,.2); }

    /* ── ANIMATIONS ── */
    @keyframes nfFadeIn {
      from { opacity: 0 } to { opacity: 1 }
    }
    @keyframes nfFadeUp {
      from { opacity: 0; transform: translateY(30px) }
      to   { opacity: 1; transform: none }
    }
    @keyframes nfSlideUp {
      from { transform: translateY(60px); opacity: 0 }
      to   { transform: none; opacity: 1 }
    }
    @keyframes nfPulse {
      0%,100% { opacity: 1 } 50% { opacity: .5 }
    }
    .nf-skeleton { animation: nfPulse 1.5s infinite; background: #2a2a2a; }

    /* ── SCROLL ARROWS (TV navigation hint) ── */
    .nf-chevron { display: inline-block; transition: transform .2s; }
    .nf-chevron.right { transform: rotate(-90deg); }
    .nf-chevron.left  { transform: rotate(90deg);  }
  `;

  // ─── PLACEHOLDER DATA (will be replaced by Lampa API) ──────────────────────
  var HERO_ITEMS = [
    {
      id: 1,
      title: 'Squid Game',
      desc: 'Отчаявшиеся игроки принимают странное приглашение поучаствовать в детских играх с огромным призом. Но ставки смертельные.',
      bg: 'https://occ-0-1432-1433.1.nflxso.net/dnm/api/v6/E8vDc_W8CLv7-yMQqFVTubVs_kc/AAAABXMTQX_EJC1oJ6KWL6H3E7p-d-aJSnqQYM9I5JR1LWqT.jpg?r=a6d',
      year: 2021, rating: 94, age: '18+', genre: 'Триллер'
    },
    {
      id: 2,
      title: 'Stranger Things',
      desc: 'Когда мальчик пропадает в маленьком городке, его друзья, семья и местный шериф начинают расследование, открывая сверхъестественные тайны.',
      bg: 'https://occ-0-1432-1433.1.nflxso.net/dnm/api/v6/6gmvu2hxdfnQ55LZZjyzYR4kzGk/AAAABcyd3hq3aNHH7EqbPNy5fH8aJKqVKuQXNQ8SrqFXyuK.jpg?r=db7',
      year: 2016, rating: 92, age: '16+', genre: 'Фантастика'
    },
    {
      id: 3,
      title: 'Wednesday',
      desc: 'Умная, саркастичная Уэнсдей Аддамс исследует свои экстрасенсорные способности в академии Nevermore, раскрывая мистические убийства.',
      bg: 'https://occ-0-1432-1433.1.nflxso.net/dnm/api/v6/6gmvu2hxdfnQ55LZZjyzYR4kzGk/AAAABa1rZQJlT2JWh1_b-bFz.jpg',
      year: 2022, rating: 88, age: '16+', genre: 'Мистика'
    }
  ];

  // ─── UTILITIES ──────────────────────────────────────────────────────────────
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html) e.innerHTML = html;
    return e;
  }
  function getSetting(key) {
    var s = JSON.parse(localStorage.getItem('nf_settings') || '{}');
    return (key in s) ? s[key] : DEFAULT_SETTINGS[key];
  }
  function setSetting(key, val) {
    var s = JSON.parse(localStorage.getItem('nf_settings') || '{}');
    s[key] = val;
    localStorage.setItem('nf_settings', JSON.stringify(s));
  }

  // ─── INJECT STYLES ──────────────────────────────────────────────────────────
  function injectStyles() {
    var style = document.createElement('style');
    style.id = 'nf-style';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  // ─── HERO ────────────────────────────────────────────────────────────────────
  var heroIdx = 0;
  var heroTimer = null;

  function buildHero() {
    var wrap = el('div', '');
    wrap.id = 'nf-hero';

    var bg = el('div', '');
    bg.id = 'nf-hero-bg';

    var vignette = el('div', '');
    vignette.id = 'nf-hero-vignette';

    var content = el('div', '');
    content.id = 'nf-hero-content';

    var dotsEl = el('div', '');
    dotsEl.id = 'nf-hero-dots';

    HERO_ITEMS.forEach(function(_, i) {
      var dot = el('div', 'nf-dot' + (i === 0 ? ' active' : ''));
      dot.addEventListener('click', function() { goHero(i); });
      dotsEl.appendChild(dot);
    });

    wrap.appendChild(bg);
    wrap.appendChild(vignette);
    wrap.appendChild(content);
    wrap.appendChild(dotsEl);

    renderHeroItem(bg, content, dotsEl, 0);

    if (getSetting('hero_autoplay')) startHeroTimer(bg, content, dotsEl);

    return wrap;
  }

  function renderHeroItem(bg, content, dotsEl, idx) {
    var item = HERO_ITEMS[idx];
    bg.style.backgroundImage = 'url(' + item.bg + ')';
    bg.style.transform = 'scale(1.04)';
    setTimeout(function() { bg.style.transform = 'scale(1)'; }, 100);

    content.innerHTML = `
      <div class="nf-hero-title">${item.title}</div>
      <div class="nf-hero-meta">
        <span class="nf-hero-rating">&#9654; ${item.rating}% совпадение</span>
        <span>${item.year}</span>
        <span class="nf-maturity">${item.age}</span>
        <span>${item.genre}</span>
      </div>
      <div class="nf-hero-desc">${item.desc}</div>
      <div class="nf-hero-buttons">
        <button class="nf-btn nf-btn-play" onclick="nfPlay(${item.id})">&#9654; Смотреть</button>
        <button class="nf-btn nf-btn-info" onclick="nfShowDetail(${item.id})">&#9432; Подробнее</button>
      </div>
    `;

    dotsEl.querySelectorAll('.nf-dot').forEach(function(d, i) {
      d.classList.toggle('active', i === idx);
    });
  }

  function goHero(idx) {
    var bg = document.getElementById('nf-hero-bg');
    var content = document.getElementById('nf-hero-content');
    var dotsEl = document.getElementById('nf-hero-dots');
    heroIdx = (idx + HERO_ITEMS.length) % HERO_ITEMS.length;
    bg.style.opacity = '0';
    setTimeout(function() {
      renderHeroItem(bg, content, dotsEl, heroIdx);
      bg.style.opacity = '1';
    }, 400);
  }

  function startHeroTimer(bg, content, dotsEl) {
    clearInterval(heroTimer);
    var interval = getSetting('hero_interval') || 7000;
    heroTimer = setInterval(function() {
      heroIdx = (heroIdx + 1) % HERO_ITEMS.length;
      goHero(heroIdx);
    }, interval);
  }

  // ─── CARD ────────────────────────────────────────────────────────────────────
  function buildCard(item, opts) {
    opts = opts || {};
    var card = el('div', 'nf-card');

    var img = el('img', 'nf-card-img');
    img.src = item.poster || item.backdrop || '';
    img.alt = item.title || '';
    img.loading = 'lazy';
    img.onerror = function() {
      this.style.display = 'none';
      card.style.background = '#' + Math.floor(Math.random()*0xaaaaaa+0x333333).toString(16);
    };

    var overlay = el('div', 'nf-card-overlay');
    overlay.innerHTML = `
      <div class="nf-card-actions">
        <div class="nf-card-btn play">&#9654;</div>
        <div class="nf-card-btn">+</div>
        <div class="nf-card-btn">&#128077;</div>
        <div class="nf-card-btn" style="margin-left:auto">&#8964;</div>
      </div>
      <div class="nf-card-name">${item.title || ''}</div>
    `;

    card.appendChild(img);

    if (opts.top10) {
      var num = el('div', 'nf-top10-num');
      num.textContent = opts.rank;
      card.appendChild(num);
    }
    if (opts.isNew) {
      var badge = el('div', 'nf-badge');
      badge.textContent = 'Новинка';
      card.appendChild(badge);
    }
    if (opts.progress) {
      var prog = el('div', 'nf-progress');
      var fill = el('div', 'nf-progress-fill');
      fill.style.width = opts.progress + '%';
      prog.appendChild(fill);
      card.appendChild(prog);
    }

    card.appendChild(overlay);

    card.addEventListener('click', function() { nfShowDetail(item.id || item); });

    // Delayed hover info card (Apple TV style)
    if (getSetting('card_scale_hover')) {
      var hoverTimeout;
      card.addEventListener('mouseenter', function() {
        hoverTimeout = setTimeout(function() {
          card.classList.add('nf-card-expanded');
        }, getSetting('card_hover_delay') || 400);
      });
      card.addEventListener('mouseleave', function() {
        clearTimeout(hoverTimeout);
        card.classList.remove('nf-card-expanded');
      });
    }

    return card;
  }

  // ─── ROW ─────────────────────────────────────────────────────────────────────
  function buildRow(title, items, opts) {
    opts = opts || {};
    var row = el('div', 'nf-row');

    var header = el('div', 'nf-row-header');
    var titleEl = el('div', 'nf-row-title');
    titleEl.textContent = title;
    var explore = el('div', 'nf-row-explore');
    explore.innerHTML = 'Смотреть всё <span class="nf-chevron right">&#8964;</span>';
    if (opts.rank) {
      var rankEl = el('div', 'nf-row-rank');
      rankEl.textContent = opts.rank;
      header.appendChild(rankEl);
    }
    header.appendChild(titleEl);
    header.appendChild(explore);

    var sliderWrap = el('div', 'nf-slider-wrap');
    var slider = el('div', 'nf-slider');

    var btnL = el('button', 'nf-slider-btn left');
    btnL.innerHTML = '&#10094;';
    var btnR = el('button', 'nf-slider-btn right');
    btnR.innerHTML = '&#10095;';

    btnL.addEventListener('click', function() {
      slider.scrollBy({ left: -slider.clientWidth * 0.8, behavior: 'smooth' });
    });
    btnR.addEventListener('click', function() {
      slider.scrollBy({ left: slider.clientWidth * 0.8, behavior: 'smooth' });
    });

    items.forEach(function(item, i) {
      var cardOpts = {};
      if (opts.top10) { cardOpts.top10 = true; cardOpts.rank = i + 1; }
      if (opts.isNew) cardOpts.isNew = true;
      if (opts.progress && item.progress) cardOpts.progress = item.progress;
      slider.appendChild(buildCard(item, cardOpts));
    });

    sliderWrap.appendChild(btnL);
    sliderWrap.appendChild(slider);
    sliderWrap.appendChild(btnR);

    row.appendChild(header);
    row.appendChild(sliderWrap);

    return row;
  }

  // ─── FAKE DATA GENERATOR ─────────────────────────────────────────────────────
  function fakeItems(n, withProgress) {
    var genres = ['Триллер','Комедия','Фантастика','Драма','Боевик','Ужасы','Мультфильм'];
    var colors = ['#1a1a2e','#16213e','#0f3460','#533483','#2b2d42','#1b4332','#370617'];
    return Array.from({ length: n }, function(_, i) {
      var item = {
        id: 1000 + i,
        title: genres[i % genres.length] + ' ' + (i + 1),
        poster: ''
      };
      if (withProgress) item.progress = Math.floor(Math.random() * 80 + 10);
      // We'll fill color in card onerror handler
      return item;
    });
  }

  // ─── ROWS ────────────────────────────────────────────────────────────────────
  function buildRows() {
    var container = el('div', '');
    container.id = 'nf-rows';

    var rows = [];

    if (getSetting('show_continue')) {
      rows.push(buildRow('Продолжить просмотр', fakeItems(8, true), { progress: true }));
    }
    if (getSetting('show_trending')) {
      rows.push(buildRow('Сейчас в тренде', fakeItems(10)));
    }
    if (getSetting('show_top10')) {
      rows.push(buildRow('Топ-10 сериалов в России сегодня', fakeItems(10), { top10: true }));
    }
    if (getSetting('show_new')) {
      rows.push(buildRow('Новинки недели', fakeItems(8), { isNew: true }));
    }
    rows.push(buildRow('Потому что вы смотрели «Игра в кальмара»', fakeItems(9)));
    rows.push(buildRow('Криминальные драмы', fakeItems(9)));
    if (getSetting('show_recommended')) {
      rows.push(buildRow('Только для вас', fakeItems(8)));
    }
    rows.push(buildRow('Дорамы', fakeItems(9)));
    rows.push(buildRow('Аниме', fakeItems(9)));

    var count = getSetting('row_count') || 6;
    rows.slice(0, count).forEach(function(r) { container.appendChild(r); });

    return container;
  }

  // ─── HEADER ──────────────────────────────────────────────────────────────────
  function buildHeader() {
    var header = el('div', '');
    header.id = 'nf-header';

    var logo = el('div', '');
    logo.id = 'nf-logo';
    logo.textContent = 'NETFLIX';

    var nav = el('ul', '');
    nav.id = 'nf-nav';
    ['Главная','Сериалы','Фильмы','Популярное','Мой список'].forEach(function(t, i) {
      var li = el('li', '');
      var a = el('a', i === 0 ? 'active' : '');
      a.textContent = t;
      li.appendChild(a);
      nav.appendChild(li);
    });

    var right = el('div', '');
    right.id = 'nf-header-right';

    var searchBtn = el('button', 'nf-icon-btn');
    searchBtn.innerHTML = '&#128269;';
    searchBtn.title = 'Поиск';

    var settingsBtn = el('button', 'nf-icon-btn');
    settingsBtn.innerHTML = '&#9881;';
    settingsBtn.title = 'Настройки';
    settingsBtn.addEventListener('click', openSettings);

    var closeBtn = el('button', 'nf-icon-btn');
    closeBtn.innerHTML = '&#10005;';
    closeBtn.title = 'Закрыть плагин';
    closeBtn.style.color = '#ff6b6b';
    closeBtn.addEventListener('click', destroyPlugin);

    right.appendChild(searchBtn);
    right.appendChild(settingsBtn);
    right.appendChild(closeBtn);

    header.appendChild(logo);
    header.appendChild(nav);
    header.appendChild(right);

    return header;
  }

  // ─── SETTINGS ────────────────────────────────────────────────────────────────
  function buildSettings() {
    var overlay = el('div', '');
    overlay.id = 'nf-settings';
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeSettings();
    });

    var box = el('div', '');
    box.id = 'nf-settings-box';

    box.innerHTML = `
      <h2>⚙️ Настройки Netflix Style</h2>

      <div class="nf-settings-section">
        <h3>Главный экран (Hero)</h3>
        ${toggle('hero_autoplay', 'Автосмена баннеров', 'Автоматически переключать баннеры')}
        ${rangeRow('hero_interval', 'Интервал баннера', 3000, 15000, 1000, ' мс')}
        ${toggle('hero_blur', 'Блюр фона', 'Размытие при переходах')}
        ${toggle('dark_vignette', 'Тёмная виньетка', 'Затемнение краёв')}
      </div>

      <div class="nf-settings-section">
        <h3>Разделы</h3>
        ${toggle('show_continue', 'Продолжить просмотр')}
        ${toggle('show_trending', 'В тренде')}
        ${toggle('show_top10', 'Топ-10')}
        ${toggle('show_new', 'Новинки')}
        ${toggle('show_recommended', 'Рекомендации')}
        ${rangeRow('row_count', 'Количество рядов', 3, 12, 1, '')}
      </div>

      <div class="nf-settings-section">
        <h3>Карточки</h3>
        ${toggle('card_scale_hover', 'Увеличение при наведении', 'Netflix-стиль масштабирования')}
        ${rangeRow('card_hover_delay', 'Задержка увеличения', 100, 1000, 100, ' мс')}
        ${toggle('show_maturity', 'Возрастной рейтинг')}
        ${toggle('show_progress', 'Прогресс просмотра')}
        ${toggle('animate_scroll', 'Плавная прокрутка')}
      </div>
    `;

    var closeBtn = el('button', 'nf-settings-close');
    closeBtn.textContent = 'Готово';
    closeBtn.addEventListener('click', function() {
      closeSettings();
      reloadContent();
    });
    box.appendChild(closeBtn);

    overlay.appendChild(box);

    // Bind toggles
    setTimeout(function() {
      box.querySelectorAll('.nf-toggle').forEach(function(t) {
        t.addEventListener('click', function() {
          var key = t.dataset.key;
          var val = !getSetting(key);
          setSetting(key, val);
          t.classList.toggle('on', val);
        });
      });
      box.querySelectorAll('.nf-range').forEach(function(r) {
        r.addEventListener('input', function() {
          var key = r.dataset.key;
          setSetting(key, parseInt(r.value));
          var valEl = r.parentElement.querySelector('.nf-range-val');
          if (valEl) valEl.textContent = r.value + (r.dataset.unit || '');
        });
      });
    }, 50);

    return overlay;
  }

  function toggle(key, label, desc) {
    var val = getSetting(key);
    return `
      <div class="nf-setting-row">
        <div>
          <div class="nf-setting-label">${label}</div>
          ${desc ? '<div class="nf-setting-desc">' + desc + '</div>' : ''}
        </div>
        <div class="nf-toggle ${val ? 'on' : ''}" data-key="${key}"></div>
      </div>
    `;
  }

  function rangeRow(key, label, min, max, step, unit) {
    var val = getSetting(key);
    return `
      <div class="nf-setting-row">
        <div class="nf-setting-label">${label}</div>
        <div style="display:flex;align-items:center;gap:.5rem">
          <input type="range" class="nf-range" data-key="${key}" data-unit="${unit}"
            min="${min}" max="${max}" step="${step}" value="${val}">
          <span class="nf-range-val">${val}${unit}</span>
        </div>
      </div>
    `;
  }

  function openSettings() {
    document.getElementById('nf-settings').classList.add('open');
  }
  function closeSettings() {
    document.getElementById('nf-settings').classList.remove('open');
  }

  // ─── DETAIL MODAL ────────────────────────────────────────────────────────────
  function buildDetail() {
    var overlay = el('div', '');
    overlay.id = 'nf-detail';
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeDetail();
    });

    var box = el('div', '');
    box.id = 'nf-detail-box';

    var heroDiv = el('div', '');
    heroDiv.id = 'nf-detail-hero';

    var closeBtn = el('button', 'nf-detail-close');
    closeBtn.innerHTML = '&#10005;';
    closeBtn.addEventListener('click', closeDetail);

    var content = el('div', '');
    content.id = 'nf-detail-content';

    box.appendChild(heroDiv);
    box.appendChild(closeBtn);
    box.appendChild(content);
    overlay.appendChild(box);
    return overlay;
  }

  window.nfShowDetail = function(id) {
    var item = HERO_ITEMS.find(function(x) { return x.id === id; }) || {
      id: id, title: 'Название', desc: 'Описание контента...', bg: '', year: 2024, rating: 85, age: '16+'
    };
    var heroDiv = document.getElementById('nf-detail-hero');
    heroDiv.style.backgroundImage = 'url(' + (item.bg || '') + ')';
    var content = document.getElementById('nf-detail-content');
    content.innerHTML = `
      <div id="nf-detail-btns">
        <button class="nf-btn nf-btn-play">&#9654; Смотреть</button>
        <button class="nf-btn nf-btn-info">+ Мой список</button>
        <button class="nf-btn nf-btn-info">&#128077;</button>
      </div>
      <div id="nf-detail-title">${item.title}</div>
      <div class="nf-detail-meta">
        <span class="nf-hero-rating">${item.rating}% совпадение</span>
        <span>${item.year || ''}</span>
        <span class="nf-maturity">${item.age || ''}</span>
      </div>
      <div class="nf-detail-desc">${item.desc || ''}</div>
    `;
    document.getElementById('nf-detail').classList.add('open');
  };

  window.nfPlay = function(id) {
    console.log('[NetflixStyle] Play:', id);
    // Интеграция с Lampa player
    if (window.Lampa && window.Lampa.Player) {
      // Lampa.Player.play({...})
    }
  };

  function closeDetail() {
    document.getElementById('nf-detail').classList.remove('open');
  }

  // ─── HEADER SCROLL EFFECT ────────────────────────────────────────────────────
  function initScrollEffect() {
    var scroll = document.getElementById('nf-scroll');
    var header = document.getElementById('nf-header');
    scroll.addEventListener('scroll', function() {
      header.classList.toggle('solid', scroll.scrollTop > 60);
    });
  }

  // ─── BUILD & MOUNT ────────────────────────────────────────────────────────────
  function buildUI() {
    var root = el('div', '');
    root.id = 'nf-root';

    var scroll = el('div', '');
    scroll.id = 'nf-scroll';

    scroll.appendChild(buildHero());
    scroll.appendChild(buildRows());

    root.appendChild(buildHeader());
    root.appendChild(scroll);
    root.appendChild(buildSettings());
    root.appendChild(buildDetail());

    document.body.appendChild(root);
    initScrollEffect();
  }

  function reloadContent() {
    var rows = document.getElementById('nf-rows');
    if (rows) rows.remove();
    var scroll = document.getElementById('nf-scroll');
    if (scroll) scroll.appendChild(buildRows());
  }

  function destroyPlugin() {
    clearInterval(heroTimer);
    var root = document.getElementById('nf-root');
    var style = document.getElementById('nf-style');
    if (root) root.remove();
    if (style) style.remove();
    console.log('[NetflixStyle] Plugin closed');
  }

  // ─── LAMPA INTEGRATION ───────────────────────────────────────────────────────
  function initLampa() {
    injectStyles();
    buildUI();

    // Fetch real data from Lampa/TMDB if available
    if (window.Lampa && window.Lampa.Api) {
      // Trending
      Lampa.Api.call('trending/all/week', {}, function(data) {
        console.log('[NetflixStyle] Got trending data', data);
        // Future: replace fake items with real ones
      });
    }

    console.log('[' + PLUGIN_NAME + ' v' + PLUGIN_VERSION + '] Loaded');
  }

  // ─── PLUGIN ENTRY ────────────────────────────────────────────────────────────
  if (window.Lampa) {
    // Lampa is ready
    Lampa.Listener.follow('start', function() {
      setTimeout(initLampa, 300);
    });

    // Register settings tab inside Lampa settings
    if (Lampa.Settings) {
      Lampa.Settings.add(PLUGIN_NAME, {
        title: 'Netflix Style',
        icon: '',
        items: [
          { title: 'Открыть настройки оформления', action: function() { openSettings(); } }
        ]
      });
    }

    // Register as component/page
    Lampa.Component && Lampa.Component.add({
      name: PLUGIN_NAME,
      title: 'Netflix Style',
      onStart: initLampa,
      onStop: destroyPlugin
    });
  } else {
    // Standalone / dev mode
    document.addEventListener('DOMContentLoaded', initLampa);
    // If DOM already loaded
    if (document.readyState !== 'loading') initLampa();
  }

})();
