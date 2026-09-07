/* ==========================================================================
   reviews.js - קרוסלת המלצות 5 כוכבים
   --------------------------------------------------------------------------
   • נבנית דינמית מ-SITE.reviews
   • מספר כרטיסים נראים מתאים את עצמו לרוחב המסך
   • החלפה אוטומטית, עצירה בריחוף/מיקוד/כשהלשונית מוסתרת
   • גרירה בעכבר ובמגע, ניווט במקלדת (חיצים), נקודות ניווט
   • מכבדת "עצירת אנימציות" מתוסף הנגישות ו-prefers-reduced-motion
   ========================================================================== */
(function () {

  /* בריחה מ-HTML. כרגע כל התוכן מגיע מ-config.js ונשלט על ידינו, אבל אם
     בעתיד יוזרם לכאן תוכן חיצוני (למשל ביקורות מ-Google) - בלי זה זו
     פרצת XSS. עדיף שהמעטפת תהיה בטוחה מראש. */
  const esc = s => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const AUTOPLAY_MS = 5200;

  let track, viewport, dotsWrap, prevBtn, nextBtn, playBtn;
  let index = 0, perView = 1, timer = null, paused = false;
  let dragging = false, startX = 0, deltaX = 0, startTransform = 0;

  const reduced = () =>
    document.documentElement.classList.contains('a11y-no-motion') ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- בניית הכרטיסים ---------- */
  function build() {
    const lang = window.I18n ? window.I18n.get() : 'he';
    const I = window.ICON;

    track.innerHTML = window.SITE.reviews.map(r => {
      const name = lang === 'en' ? r.nameEn : r.name;
      const text = lang === 'en' ? r.en : r.he;
      const stars = Array.from({ length: r.stars }, () => I.star).join('');
      return `
      <article class="review-card">
        <div class="review-stars" role="img"
             aria-label="${window.I18n ? window.I18n.t('reviews.starsLabel') : '5/5'}">${stars}</div>
        <p class="review-text">${esc(text)}</p>
        <div class="review-meta">
          <span class="review-avatar" aria-hidden="true">${esc(name.charAt(0))}</span>
          <span>
            <span class="review-name">${esc(name)}</span>
            <span class="review-source">${I.google} Google</span>
          </span>
        </div>
      </article>`;
    }).join('');

    buildDots();
    measure();
  }

  function buildDots() {
    const pages = pageCount();
    dotsWrap.innerHTML = Array.from({ length: pages }, (_, i) =>
      `<button type="button" role="tab" aria-current="${i === 0}"
               aria-label="${i + 1}" data-page="${i}"></button>`).join('');
    dotsWrap.querySelectorAll('button').forEach(b =>
      b.addEventListener('click', () => goTo(Number(b.dataset.page) * perView)));
  }

  const total = () => window.SITE.reviews.length;
  const maxIndex = () => Math.max(0, total() - perView);
  const pageCount = () => Math.max(1, Math.ceil(total() / perView));

  /* ---------- חישוב מידות ---------- */
  function measure() {
    const w = window.innerWidth;
    const next = w >= 1080 ? 3 : w >= 700 ? 2 : 1;
    if (next !== perView) {
      perView = next;
      buildDots();
    }
    index = Math.min(index, maxIndex());
    update(false);
  }

  function cardStep() {
    const card = track.querySelector('.review-card');
    if (!card) return 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return card.getBoundingClientRect().width + gap;
  }

  /* ---------- תזוזה ---------- */
  function update(animate = true) {
    const dir = document.documentElement.dir === 'rtl' ? 1 : -1;
    const x = index * cardStep() * dir;
    track.style.transition = animate && !reduced() ? '' : 'none';
    track.style.transform = `translateX(${x}px)`;
    if (!animate) requestAnimationFrame(() => { track.style.transition = ''; });

    const page = Math.round(index / perView);
    dotsWrap.querySelectorAll('button').forEach((b, i) =>
      b.setAttribute('aria-current', String(i === page)));

    /* לולאה אינסופית - הכפתורים אף פעם לא מנוטרלים */
    prevBtn.disabled = false;
    nextBtn.disabled = false;
  }

  function goTo(i) {
    const max = maxIndex();
    if (i < 0) i = max;
    else if (i > max) i = 0;
    index = i;
    update();
  }

  const next = () => goTo(index + perView > maxIndex() ? 0 : index + 1);
  const prev = () => goTo(index - 1);

  /* ---------- החלפה אוטומטית ---------- */
  function start() {
    stop();
    if (reduced() || paused) return;
    timer = setInterval(next, AUTOPLAY_MS);
  }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  function setPaused(v) {
    paused = v;
    if (playBtn) {
      playBtn.setAttribute('aria-pressed', String(v));
      const key = v ? 'reviews.play' : 'reviews.pause';
      if (window.I18n) playBtn.setAttribute('aria-label', window.I18n.t(key));
      playBtn.innerHTML = v ? window.ICON.chevron : window.ICON.motion;
    }
    v ? stop() : start();
  }

  /* ---------- גרירה ---------- */
  function onDown(e) {
    dragging = true;
    startX = e.touches ? e.touches[0].clientX : e.clientX;
    deltaX = 0;
    startTransform = index * cardStep() * (document.documentElement.dir === 'rtl' ? 1 : -1);
    viewport.classList.add('is-dragging');
    stop();
  }
  function onMove(e) {
    if (!dragging) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    deltaX = x - startX;
    track.style.transform = `translateX(${startTransform + deltaX}px)`;
  }
  function onUp() {
    if (!dragging) return;
    dragging = false;
    viewport.classList.remove('is-dragging');
    const threshold = cardStep() * 0.22;
    const rtl = document.documentElement.dir === 'rtl';
    if (Math.abs(deltaX) > threshold) {
      const forward = rtl ? deltaX < 0 : deltaX > 0;
      forward ? prev() : next();
    } else {
      update();
    }
    if (!paused) start();
  }

  /* ---------- אתחול ---------- */
  function init() {
    const root = document.getElementById('reviewsCarousel');
    if (!root) return;

    viewport = root.querySelector('.carousel-viewport');
    track    = root.querySelector('.carousel-track');
    dotsWrap = root.querySelector('.carousel-dots');
    prevBtn  = root.querySelector('[data-carousel="prev"]');
    nextBtn  = root.querySelector('[data-carousel="next"]');
    playBtn  = root.querySelector('[data-carousel="play"]');

    build();

    prevBtn.addEventListener('click', () => { prev(); if (!paused) start(); });
    nextBtn.addEventListener('click', () => { next(); if (!paused) start(); });
    if (playBtn) playBtn.addEventListener('click', () => setPaused(!paused));

    /* מקלדת */
    root.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); document.documentElement.dir === 'rtl' ? prev() : next(); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); document.documentElement.dir === 'rtl' ? next() : prev(); }
    });

    /* עצירה בריחוף/מיקוד */
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', () => { if (!paused) start(); });
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', () => { if (!paused) start(); });

    /* גרירה */
    viewport.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    viewport.addEventListener('touchstart', onDown, { passive: true });
    viewport.addEventListener('touchmove', onMove, { passive: true });
    viewport.addEventListener('touchend', onUp);
    viewport.addEventListener('dragstart', e => e.preventDefault());

    /* אירועי מערכת */
    window.addEventListener('resize', debounce(measure, 160));
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : (!paused && start()));
    document.addEventListener('langchange', () => { build(); update(false); });

    setPaused(false);
  }

  function debounce(fn, ms) {
    let t;
    return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
  }

  window.Reviews = { init };
})();
