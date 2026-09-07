/* ==========================================================================
   gallery.js - רשת הגלריה והלייטבוקס
   --------------------------------------------------------------------------
   הרשת נבנית מ-SITE.gallery. הלייטבוקס נגיש במלואו: מקלדת (Esc / ← / →),
   לכידת מיקוד, החזרת המיקוד לתמונה שממנה נפתח, וגרירה במגע.
   ========================================================================== */
window.Gallery = (function () {
  const DIR = (window.ROOT || '') + 'assets/img/gallery/';
  let index = 0, lastFocus = null;

  const items = () => window.SITE.gallery || [];
  const lang  = () => (window.I18n ? window.I18n.get() : 'he');
  const t     = k => (window.I18n ? window.I18n.t(k) : k);

  /* ---------- בניית הרשת ---------- */
  function render() {
    const host = document.getElementById('galleryGrid');
    if (!host) return;

    host.innerHTML = items().map((item, i) => {
      const alt = item[lang()] || item.he;
      return `
      <li class="gallery-item reveal" style="--reveal-delay:${i * 80}ms">
        <button type="button" class="gallery-btn" data-index="${i}"
                aria-label="${t('gallery.open')}: ${alt}">
          <picture>
            <source srcset="${DIR}${item.base}-thumb.webp" type="image/webp">
            <img src="${DIR}${item.base}-thumb.jpg" alt="${alt}"
                 loading="lazy" width="${item.w || 560}" height="${item.h || 995}">
          </picture>
        </button>
      </li>`;
    }).join('');

    host.querySelectorAll('.gallery-btn').forEach(btn =>
      btn.addEventListener('click', () => open(Number(btn.dataset.index))));
  }

  /* ---------- לייטבוקס ---------- */
  const box = () => document.getElementById('lightbox');

  function show(i) {
    const list = items();
    index = (i + list.length) % list.length;      /* לולאה בשני הכיוונים */
    const item = list[index];
    const alt  = item[lang()] || item.he;

    const img = document.getElementById('lightboxImg');
    img.src = `${DIR}${item.base}.webp`;
    img.alt = alt;
    /* אם WebP לא נתמך - נופלים ל-JPG */
    img.onerror = () => { img.onerror = null; img.src = `${DIR}${item.base}.jpg`; };

    document.getElementById('lightboxCaption').textContent =
      `${alt} · ${t('gallery.counter')} ${index + 1}/${list.length}`;
  }

  function open(i) {
    const el = box();
    if (!el) return;
    lastFocus = document.activeElement;
    show(i);
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add('is-open'));
    document.body.classList.add('is-locked');
    document.getElementById('lightboxClose').focus();
    document.addEventListener('keydown', onKey);
  }

  function close() {
    const el = box();
    el.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    setTimeout(() => { el.hidden = true; }, 300);
    document.removeEventListener('keydown', onKey);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function onKey(e) {
    if (e.key === 'Escape')     { close(); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); document.documentElement.dir === 'rtl' ? show(index - 1) : show(index + 1); return; }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); document.documentElement.dir === 'rtl' ? show(index + 1) : show(index - 1); return; }
    if (e.key !== 'Tab') return;

    /* לכידת מיקוד בתוך הלייטבוקס */
    const focusable = [...box().querySelectorAll('button')];
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------- החלקה במגע ---------- */
  function initSwipe() {
    const stage = box();
    let x0 = null;
    stage.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) {
        const rtl = document.documentElement.dir === 'rtl';
        show(index + ((dx > 0) === rtl ? 1 : -1));
      }
      x0 = null;
    });
  }

  /* init מחווט את הלייטבוקס בלבד. הרינדור של הרשת נעשה מ-renderDynamic
     ב-app.js, כדי שהוא יקרה לפני שה-observer של החשיפה בגלילה רץ. */
  function init() {
    const el = box();
    if (!el) return;

    document.getElementById('lightboxClose').addEventListener('click', close);
    document.getElementById('lightboxPrev').addEventListener('click', () => show(index - 1));
    document.getElementById('lightboxNext').addEventListener('click', () => show(index + 1));
    /* לחיצה על הרקע סוגרת, לחיצה על התמונה עצמה לא */
    el.addEventListener('click', e => { if (e.target === el) close(); });

    initSwipe();
    /* renderDynamic כבר מרנדר מחדש בהחלפת שפה - כאן רק מרעננים לייטבוקס פתוח */
    document.addEventListener('langchange', () => { if (!el.hidden) show(index); });
  }

  return { init, render, open, close };
})();
