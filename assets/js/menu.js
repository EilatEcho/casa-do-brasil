/* ==========================================================================
   menu.js - רינדור דף התפריט מתוך SITE.menu ו-SITE.tracks
   --------------------------------------------------------------------------
   הדף כולו נבנה מ-config.js. כדי להוסיף מנה, לשנות מחיר או להחליף תיאור -
   עורכים את SITE.menu בלבד. אין צורך לגעת כאן או ב-HTML.

   ⚠️ render() חייבת לרוץ לפני initReveal() שב-app.js, אחרת האלמנטים החדשים
   עם class="reveal" לא ייצפו על ידי ה-IntersectionObserver ויישארו שקופים.
   הקריאה מתבצעת מתוך renderDynamic() ב-app.js.
   ========================================================================== */
window.Menu = (function () {

  const esc = s => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const lang = () => (window.I18n ? window.I18n.get() : 'he');
  const t    = k => (window.I18n ? window.I18n.t(k) : k);

  /* טקסט דו-לשוני: מחזיר את המערך/המחרוזת בשפה הפעילה, עם נפילה לעברית */
  const L = obj => (obj ? (obj[lang()] || obj.he) : null);

  /* מחיר → "₪220" או "₪189 / ₪249" */
  function priceHtml(price) {
    const cur = t('menu.currency') || '₪';
    const parts = String(price).split('/').map(p => p.trim()).filter(Boolean);
    return parts.map(p => `<span class="menu-price-unit"><i>${cur}</i>${esc(p)}</span>`)
                .join('<em class="menu-price-sep">/</em>');
  }

  /* ======================================================================
     1. פריט תפריט בודד
     ====================================================================== */
  function itemHtml(item, i) {
    const d = L(item);                       /* [שם, תיאור] */
    const name = esc(d[0]);
    const desc = d[1] ? `<p class="menu-item-desc">${esc(d[1])}</p>` : '';

    const add = (item.add && item.add.length)
      ? `<ul class="menu-add" aria-label="${esc(t('menu.addTitle'))}">
           ${item.add.map(a => `
             <li><span>${esc(a[lang()] || a.he)}</span>
                 <b>${priceHtml(a.price)}</b></li>`).join('')}
         </ul>`
      : '';

    return `
    <li class="menu-item reveal" style="--reveal-delay:${Math.min(i, 7) * 45}ms">
      <p class="menu-item-head">
        <span class="menu-item-name">${name}</span>
        <span class="menu-dots" aria-hidden="true"></span>
        <span class="menu-price">${priceHtml(item.price)}</span>
      </p>
      ${desc}
      ${add}
    </li>`;
  }

  /* ======================================================================
     2. באנר הקרנבל - שני מסלולי הצ׳ורסקריה
     ====================================================================== */
  function featureHtml() {
    const S = window.SITE, I = window.ICON;
    const f = S.menu.feature;
    const head = L(f);                        /* [כותרת, אינטרו] */

    const starters = (S.starters[lang()] || S.starters.he)
      .map(s => `<li>${I.check}<span>${esc(s)}</span></li>`).join('');

    const cards = S.tracks.map((track, i) => {
      const d = track[lang()] || track.he;
      return `
      <article class="mtrack ${track.featured ? 'mtrack--featured' : ''} reveal"
               style="--reveal-delay:${i * 110}ms">
        ${track.featured ? `<span class="mtrack-badge">${I.crown}<span>${esc(t('tracks.badge'))}</span></span>` : ''}
        <p class="mtrack-kicker">${esc(d.kicker)}</p>
        <h3 class="mtrack-title">${esc(d.title)}</h3>
        <p class="mtrack-count">${esc(d.count)}</p>
        <p class="mtrack-price">
          <span class="amount"><i>₪</i>${esc(d.price)}</span>
          <span class="note">${esc(t('menu.perDiner'))}</span>
        </p>
        <p class="mtrack-cuts-label">${esc(t('menu.cutsLabel'))}</p>
        <ul class="mtrack-cuts">
          ${d.cuts.map(c => `<li>${I.check}<span>${esc(c)}</span></li>`).join('')}
        </ul>
        <a class="btn ${track.featured ? 'btn--gold' : 'btn--ghost'} btn--block"
           href="${S.links.reserve}" target="_blank" rel="noopener noreferrer">
          ${I.calendar}<span>${esc(t('menu.trackCta'))}</span>
        </a>
      </article>`;
    }).join('');

    const bread = f.bread ? `
      <p class="menu-feature-bread">
        <span class="menu-item-name">${esc(L(f.bread)[0])}</span>
        <span class="menu-dots" aria-hidden="true"></span>
        <span class="menu-price">${priceHtml(f.bread.price)}</span>
        <em>${esc(L(f.bread)[1] || '')}</em>
      </p>` : '';

    return `
    <section class="menu-feature" id="cat-carnival" aria-labelledby="catCarnival">
      <div class="container">
        <header class="menu-cat-head reveal">
          <h2 id="catCarnival">${esc(head[0])}</h2>
          <p>${esc(head[1])}</p>
        </header>

        <div class="mtracks">${cards}</div>

        <div class="menu-feature-foot reveal">
          <div class="menu-feature-starters">
            <h3>${esc(t('starters.title'))}</h3>
            <ul class="menu-starters">${starters}</ul>
          </div>
          <div class="menu-feature-side">
            ${bread}
            <p class="menu-feature-note">${esc(L(f.note))}</p>
          </div>
        </div>
      </div>
    </section>`;
  }

  /* ======================================================================
     3. קטגוריה
     ====================================================================== */
  function categoryHtml(cat) {
    const I = window.ICON;
    const head = L(cat);
    const hid  = 'cat' + cat.id.charAt(0).toUpperCase() + cat.id.slice(1);

    const items = cat.items.map(itemHtml).join('');

    const callout = cat.callout ? `
      <p class="menu-callout reveal">
        ${I.flame}
        <strong>${esc(L(cat.callout)[0])}</strong>
        <span>${esc(L(cat.callout)[1])}</span>
      </p>` : '';

    /* מסלול הילדים - כרטיס נפרד בסוף הקטגוריה */
    const kt = cat.kidsTrack;
    const kids = kt ? (() => {
      const d = L(kt);
      return `
      <article class="menu-kidstrack reveal">
        <p class="menu-kidstrack-kicker">${esc(t('menu.kidsTrack'))}</p>
        <h3>${esc(d[0])}</h3>
        <p class="menu-kidstrack-meta">${esc(d[1])}</p>
        <p class="menu-kidstrack-price"><i>₪</i>${esc(kt.price)}</p>
        <p class="menu-kidstrack-cuts">${esc(d[2])}</p>
      </article>`;
    })() : '';

    return `
    <section class="menu-cat menu-cat--${cat.tone || 'dark'} ${cat.boxed ? 'menu-cat--boxed' : ''}"
             id="cat-${cat.id}" aria-labelledby="${hid}">
      <div class="container">
        <header class="menu-cat-head reveal">
          <h2 id="${hid}">${esc(head[0])}</h2>
          ${head[1] ? `<p>${esc(head[1])}</p>` : ''}
        </header>
        <ul class="menu-list menu-list--${cat.cols || 2}">${items}</ul>
        ${callout}
        ${kids}
      </div>
    </section>`;
  }

  /* ======================================================================
     4. ניווט הקטגוריות הדביק
     ====================================================================== */
  function jumpHtml() {
    const cats = window.SITE.menu.categories;
    const chips = [{ id: 'carnival', label: L(window.SITE.menu.feature)[0] }]
      .concat(cats.map(c => ({ id: c.id, label: L(c)[0] })))
      .map(c => `<li><a href="#cat-${c.id}" data-jump="cat-${c.id}">${esc(c.label)}</a></li>`)
      .join('');

    return `
    <nav class="menu-jump" id="menuJump" aria-label="${esc(t('menu.jump'))}">
      <div class="container">
        <ul>${chips}</ul>
      </div>
    </nav>`;
  }

  /* ======================================================================
     5. הערות תחתונות
     ====================================================================== */
  function notesHtml() {
    const notes = L(window.SITE.menu.notes) || [];
    return `
    <section class="menu-notes">
      <div class="container">
        <div class="menu-notes-box reveal">
          <h2>${esc(t('menu.notesTitle'))}</h2>
          <ul>${notes.map(n => `<li>${esc(n)}</li>`).join('')}</ul>
          <p class="menu-notes-fine">${esc(t('menu.printedNote'))}</p>
        </div>
      </div>
    </section>`;
  }

  /* ======================================================================
     רינדור
     ====================================================================== */
  function render() {
    const host = document.getElementById('menuRoot');
    if (!host || !window.SITE || !window.SITE.menu) return;

    host.innerHTML =
      jumpHtml() +
      featureHtml() +
      window.SITE.menu.categories.map(categoryHtml).join('') +
      notesHtml();

    initSpy();
    trackJumpHeight();
  }

  /* גובה סרגל הקטגוריות נשמר ב---jump-h, כדי ש-scroll-margin של העוגנים
     יידע כמה מקום תופסים ההדר והסרגל יחד. משתנה עם השפה ועם רוחב המסך. */
  let jumpObserver = null;
  function trackJumpHeight() {
    const nav = document.getElementById('menuJump');
    if (!nav) return;
    const set = () =>
      document.documentElement.style.setProperty('--jump-h', nav.offsetHeight + 'px');
    set();
    if ('ResizeObserver' in window) {
      if (jumpObserver) jumpObserver.disconnect();
      jumpObserver = new ResizeObserver(set);
      jumpObserver.observe(nav);
    }
  }

  /* ---- הדגשת הקטגוריה הפעילה בניווט ---- */
  let spyObserver = null;
  function initSpy() {
    const nav = document.getElementById('menuJump');
    if (!nav || !('IntersectionObserver' in window)) return;

    if (spyObserver) spyObserver.disconnect();

    const links = [...nav.querySelectorAll('[data-jump]')];
    const map = new Map(links.map(a => [a.dataset.jump, a]));

    spyObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const link = map.get(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach(a => a.classList.remove('is-active'));
          link.classList.add('is-active');
          /* גלילת ה-chip הפעיל לתוך התצוגה בלי להזיז את הדף */
          const strip = nav.querySelector('ul');
          if (strip && strip.scrollWidth > strip.clientWidth) {
            strip.scrollTo({
              left: link.offsetLeft - strip.clientWidth / 2 + link.offsetWidth / 2,
              behavior: 'smooth'
            });
          }
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    document.querySelectorAll('[id^="cat-"]').forEach(s => spyObserver.observe(s));
  }

  return { render };
})();
