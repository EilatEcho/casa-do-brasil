/* ==========================================================================
   app.js - התנהגות כללית: הדר, ניווט, גילוי בגלילה, ספירה, וידאו, סרגל סושיאל
   נטען אחרון ומאתחל את כל המודולים.
   ========================================================================== */
(function () {

  /* בריחה מ-HTML. כרגע כל התוכן מגיע מ-config.js ונשלט על ידינו, אבל אם
     בעתיד יוזרם לכאן תוכן חיצוני (למשל ביקורות מ-Google) - בלי זה זו
     פרצת XSS. עדיף שהמעטפת תהיה בטוחה מראש. */
  const esc = s => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  /* ======================================================================
     1. הדר סטיקי - גלוי תמיד, מתכווץ בגלילה
     ====================================================================== */
  function initHeader() {
    const header = document.getElementById('siteHeader');
    if (!header) return;

    const setHeight = () =>
      document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
    setHeight();
    window.addEventListener('resize', debounce(setHeight, 150));

    /* ⚠️ ההדר מתכווץ בגלילה (is-stuck מקטין את הלוגו ואת הריפוד), ולכן
       --header-h חייב להתעדכן תוך כדי ההתכווצות ולא רק ב-resize.
       כל אלמנט שנצמד להדר - למשל סרגל הקטגוריות הדביק בדף התפריט -
       יושב על top: var(--header-h), ובלי זה נפער מתחת להדר רווח.
       ResizeObserver עוקב אחרי כל פריים של המעבר, ולא רק אחרי סופו. */
    if ('ResizeObserver' in window) new ResizeObserver(setHeight).observe(header);

    let ticking = false;

    /* ההדר נשאר גלוי תמיד. הוא רק מתכווץ ומקבל רקע אחרי גלילה קצרה -
       בלי הסתרה אוטומטית בגלילה למטה. */
    const onScroll = () => {
      header.classList.toggle('is-stuck', window.scrollY > 60);
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });

    onScroll();
  }

  /* ======================================================================
     2. ניווט אוברליי
     ====================================================================== */
  function initNav() {
    const burger  = document.getElementById('burger');
    const overlay = document.getElementById('navOverlay');
    const header  = document.getElementById('siteHeader');
    if (!burger || !overlay) return;

    let lastFocus = null;

    const open = () => {
      lastFocus = document.activeElement;
      overlay.hidden = false;
      requestAnimationFrame(() => overlay.classList.add('is-open'));
      burger.setAttribute('aria-expanded', 'true');
      if (window.I18n) burger.setAttribute('aria-label', window.I18n.t('header.menuClose'));
      header.classList.add('is-open');
      document.body.classList.add('is-locked');
      const first = overlay.querySelector('a, button');
      if (first) setTimeout(() => first.focus(), 260);
      document.addEventListener('keydown', onKey);
    };

    const close = () => {
      overlay.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      if (window.I18n) burger.setAttribute('aria-label', window.I18n.t('header.menuOpen'));
      header.classList.remove('is-open');
      document.body.classList.remove('is-locked');
      setTimeout(() => { overlay.hidden = true; }, 380);
      document.removeEventListener('keydown', onKey);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };

    function onKey(e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;
      const items = [...overlay.querySelectorAll('a[href], button:not([disabled])')];
      const all = [burger, ...items];
      const first = all[0], last = all[all.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }

    burger.addEventListener('click', () =>
      burger.getAttribute('aria-expanded') === 'true' ? close() : open());

    overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  }

  /* ======================================================================
     3. חשיפה בגלילה
     ====================================================================== */
  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    const show = el => {
      if (el.classList.contains('is-visible')) return;
      el.classList.add('is-visible');
      /* מחירי המסלולים והמונים - ספירה עולה */
      if (el.matches('.track, .stats')) countUp(el);
    };

    if (!('IntersectionObserver' in window)) {
      items.forEach(show);
      return;
    }

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        /* ⚠️ שני תנאים, לא אחד.
           isIntersecting לבדו נכשל בגלילה מהירה ובקפיצה לעוגן: אם האלמנט
           חצה את החלון בין שתי דגימות של ה-observer, הוא מדווח רק כשהוא
           כבר מעל הצג - ואז הוא נשאר ב-opacity:0 לנצח.
           boundingClientRect.top < 0 אומר "כבר חלפנו אותו", ולכן להציג. */
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          show(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    items.forEach(el => io.observe(el));

    /* רשת ביטחון אחרונה: אחרי כל גלילה, כל מה שכבר נכנס לתחום החלון
       נחשף - גם אם ה-observer פספס אותו לגמרי. */
    const sweep = () => {
      document.querySelectorAll('.reveal:not(.is-visible)').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
          show(el);
          io.unobserve(el);
        }
      });
    };
    window.addEventListener('scroll', debounce(sweep, 180), { passive: true });
    window.addEventListener('hashchange', () => setTimeout(sweep, 500));
    setTimeout(sweep, 800);
  }

  /* ---- ספירה עולה ----
     עובד על כל אלמנט עם data-count בתוך ה-scope.
     data-suffix  - מה שנשאר אחרי המספר ("+", "M+")
     data-grouped - "1" אם צריך פסיקים באלפים (5,000+)  */
  function countUp(scope) {
    scope.querySelectorAll('[data-count]').forEach((el, i) => {
      const target = parseFloat(el.dataset.count);
      if (isNaN(target)) return;

      const suffix  = el.dataset.suffix || '';
      const grouped = el.dataset.grouped === '1';
      const fmt = v => (grouped ? v.toLocaleString('en-US') : String(v)) + suffix;

      if (reducedMotion()) { el.textContent = fmt(target); return; }

      const duration = 1300;
      const delay = 380 + i * 130;   /* המונים נספרים בזה אחר זה */
      let start = null;

      const step = ts => {
        if (!start) start = ts;
        const p = Math.min(1, (ts - start) / duration);
        /* easeOutExpo - מהיר בהתחלה, נוחת רך */
        const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        el.textContent = fmt(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(step);
        else { el.textContent = fmt(target); burst(el); }
      };

      el.textContent = fmt(0);
      setTimeout(() => requestAnimationFrame(step), delay);
    });
  }

  /* ---- פיצוץ קונפטי מאחורי מונה שסיים לספור ----
     נורה מתוך countUp ברגע שהספירה נחתה. רק במוני הסטטיסטיקה: מחירי
     המסלולים משתמשים באותו countUp, ושם פיצוץ היה רועש מדי.

     הזוויות מחושבות ולא אקראיות - פיזור אחיד סביב המעגל עם הסטה קטנה
     לכל פיסה, כך שהפיצוץ נראה טבעי אבל זהה בכל טעינה וניתן לבדיקה.
     השכבה נמחקת בסוף האנימציה כדי לא לצבור אלמנטים ב-DOM. */
  const BURST_BITS = 20;

  function burst(el) {
    const host = el.closest('.stat');
    if (!host || reducedMotion()) return;

    const old = host.querySelector('.stat-burst');
    if (old) old.remove();

    const colors = ['--carnival-green', '--carnival-lime', '--carnival-yellow',
                    '--brand-gold', '--carnival-orange', '--carnival-red'];

    const layer = document.createElement('span');
    layer.className = 'stat-burst';
    layer.setAttribute('aria-hidden', 'true');
    layer.innerHTML = Array.from({ length: BURST_BITS }, (_, i) => {
      const angle = (i / BURST_BITS) * Math.PI * 2 + (i % 3) * 0.22;
      const dist  = 58 + (i % 5) * 16;
      const dx    = Math.round(Math.cos(angle) * dist);
      const dy    = Math.round(Math.sin(angle) * dist * 0.78);
      const size  = 5 + (i % 4) * 2;
      return `<i class="burst-bit" style="
        --c: var(${colors[i % colors.length]});
        --dx: ${dx}px; --dy: ${dy}px;
        --rot: ${(i % 2 ? 1 : -1) * (180 + i * 24)}deg;
        --size: ${size}px;
        --round: ${i % 3 === 0 ? '50%' : '1px'};
        animation-delay: ${i * 12}ms;
      "></i>`;
    }).join('');

    host.appendChild(layer);
    setTimeout(() => layer.remove(), 1500);
  }

  function reducedMotion() {
    return document.documentElement.classList.contains('a11y-no-motion') ||
           window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ---- כותרת ההירו רצה בלולאה, כמו השיפוד ----
     המשפט נבנה COPIES פעמים, והרצועה כולה מוכפלת. מכאן שהזזה של 50%
     נוחתת בדיוק על פריים זהה, והלולאה נראית אינסופית בלי תפר.
     העותק הראשון הוא הכותרת האמיתית; כל השאר aria-hidden, כדי שקורא
     מסך ישמע את המשפט פעם אחת.
     רץ מחדש בכל החלפת שפה, כי i18n כותב מחדש את התוכן. */
  const RUN_COPIES = 3;

  function buildRunner(el) {
    if (!el) return;
    const text = el.textContent.trim();
    if (!text) return;

    const sep  = `<span class="run-sep" aria-hidden="true">${window.ICON ? window.ICON.skewer : ''}</span>`;
    const item = hidden => `<span class="run-item"${hidden ? ' aria-hidden="true"' : ''}>${esc(text)}</span>`;

    let half = item(false);
    for (let i = 1; i < RUN_COPIES; i++) half += sep + item(true);
    half += sep;

    let hidden = '';
    for (let i = 0; i < RUN_COPIES; i++) hidden += item(true) + sep;

    el.innerHTML = `<span class="run-track">${half}${hidden}</span>`;
  }

  /* ---- קונפטי קרנבל בסקשן המסלולים ---- */
  function initConfetti() {
    const host = document.getElementById('tracksConfetti');
    if (!host || reducedMotion()) return;

    const COUNT = 22;
    const colors = ['--carnival-green', '--carnival-lime', '--carnival-yellow',
                    '--brand-gold', '--carnival-orange', '--carnival-red'];

    host.innerHTML = Array.from({ length: COUNT }, (_, i) => {
      const left  = (i * 4.6 + (i % 5) * 3.1) % 100;      /* פיזור קבוע, לא אקראי */
      const color = colors[i % colors.length];
      const size  = 5 + (i % 4) * 3;
      const dur   = 13 + (i % 7) * 2.4;
      const delay = -(i * 1.7);
      const round = i % 3 === 0;
      return `<span class="confetti-bit" style="
        --c: var(${color});
        --size: ${size}px;
        left: ${left}%;
        animation-duration: ${dur}s;
        animation-delay: ${delay}s;
        border-radius: ${round ? '50%' : '1px'};
      "></span>`;
    }).join('');
  }

  /* ======================================================================
     4. וידאו ההירו
     ====================================================================== */
  function initHeroVideo() {
    const video  = document.getElementById('heroVideo');
    if (!video) return;

    /* לא טוענים וידאו כשהמשתמש ביקש להפחית תנועה או כשהחיבור חסכוני */
    const saveData = navigator.connection && navigator.connection.saveData;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (saveData || reduced) {
      video.removeAttribute('autoplay');
      video.pause();
      return;
    }

    video.play().catch(() => { /* חסימת autoplay בדפדפן - הפוסטר יוצג */ });

    /* עצירת אנימציות מתוסף הנגישות → עצירת הווידאו */
    const mo = new MutationObserver(() => {
      const stop = document.documentElement.classList.contains('a11y-no-motion');
      stop ? video.pause() : video.play().catch(() => {});
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }

  /* ======================================================================
     5. סרגל סושיאל
     ====================================================================== */
  function initSocialBar() {
    const bar = document.getElementById('socialBar');
    const btn = document.getElementById('socialCollapse');
    if (!bar || !btn) return;

    const KEY = 'cdb-social-collapsed';
    try {
      if (localStorage.getItem(KEY) === '1') bar.classList.add('is-collapsed');
    } catch (e) {}

    btn.addEventListener('click', () => {
      bar.classList.toggle('is-collapsed');
      try { localStorage.setItem(KEY, bar.classList.contains('is-collapsed') ? '1' : '0'); } catch (e) {}
    });
  }

  /* ======================================================================
     6. רינדור המסלולים ומנות הפתיחה (מ-config)
     ====================================================================== */
  function renderTracks() {
    const host = document.getElementById('tracksGrid');
    if (!host) return;
    const lang = window.I18n ? window.I18n.get() : 'he';
    const I = window.ICON, S = window.SITE;
    const t = k => (window.I18n ? window.I18n.t(k) : k);

    host.innerHTML = S.tracks.map((track, i) => {
      const d = track[lang] || track.he;
      const img = track.featured ? S.media.premium : S.media.churrascaria;

      /* מסלול עם קליפ מקבל <video> מושתק בלולאה; אחרת תמונה.
         כשמבקשים פחות תנועה מציגים את הפוסטר כתמונה סטטית. */
      const clip = track.video || null;
      const media = (clip && !reducedMotion())
        ? `<video autoplay muted loop playsinline preload="metadata"
                  poster="${clip.poster}" disablepictureinpicture aria-hidden="true">
             <source src="${clip.webm}" type="video/webm">
             ${clip.mp4 ? `<source src="${clip.mp4}" type="video/mp4">` : ''}
           </video>`
        : `<img src="${clip ? clip.poster : img}" alt="${esc(d.title)}" loading="lazy" width="1080" height="540">`;

      /* "12 סוגי בשר" / "12 cuts of meat" → מספר גדול + תווית קטנה בחותמת */
      const sealMatch = String(d.count).match(/^(\d+)\s*(.*)$/);
      const sealNum   = sealMatch ? sealMatch[1] : d.count;
      const sealLabel = sealMatch ? sealMatch[2] : '';

      /* --i משמש להשהיית הכניסה של כל שורה בנפרד */
      const cuts = d.cuts.map((cut, ci) =>
        `<li class="${d.highlight === ci ? 'is-highlight' : ''}" style="--i:${ci}">${I.check}<span>${esc(cut)}</span></li>`).join('');

      return `
      <article class="track ${track.featured ? 'track--featured' : ''} reveal"
               style="--reveal-delay:${i * 110}ms">
        <figure class="track-figure">
          ${media}
          ${track.featured ? `<span class="track-badge">${I.crown}<span>${t('tracks.badge')}</span></span>` : ''}
        </figure>

        <div class="track-body">
          <p class="track-kicker">${esc(d.kicker)}</p>
          <h3 class="track-title">${esc(d.title)}</h3>
          <p class="track-tagline">${esc(d.tagline)}</p>

          <!-- המחיר כבלוק צבע מלא, ולצידו חותמת עגולה מסתובבת עם מספר הנתחים -->
          <div class="track-price">
            <span class="price-main">
              <span class="amount"><span class="currency">₪</span><span class="num" data-count="${d.price}">${d.price}</span></span>
              <span class="note">${esc(d.priceNote)}</span>
            </span>

            <span class="track-seal">
              <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
                <g class="seal-spin">
                  <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor"
                          stroke-width="2.5" stroke-dasharray="3 7" stroke-linecap="round"/>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor"
                          stroke-width="1" opacity=".45"/>
                </g>
              </svg>
              <span class="seal-text" aria-hidden="true">
                <b>${sealNum}</b><i>${sealLabel}</i>
              </span>
              <span class="sr-only">${esc(d.count)}</span>
            </span>
          </div>

          <ul class="track-cuts">${cuts}</ul>

          <div class="track-actions">
            <a class="btn ${track.featured ? 'btn--gold' : 'btn--ghost'}"
               href="${S.links.reserve}" target="_blank" rel="noopener noreferrer">
              ${I.calendar}<span>${t('tracks.cta')}</span>
            </a>
            <a class="link-underline" href="${window.ROOT || ''}menu.html">${t('tracks.menuLink')}${I.arrow}</a>
          </div>
        </div>
      </article>`;
    }).join('');
  }

  function renderStarters() {
    const host = document.getElementById('startersList');
    if (!host) return;
    const lang = window.I18n ? window.I18n.get() : 'he';
    host.innerHTML = (window.SITE.starters[lang] || window.SITE.starters.he)
      .map(item => `<li>${window.ICON.check}<span>${esc(item)}</span></li>`).join('');
  }

  function renderStats() {
    const host = document.getElementById('statsRow');
    if (!host) return;
    const lang = window.I18n ? window.I18n.get() : 'he';
    host.innerHTML = window.SITE.stats.map((s, i) => {
      const label = s[lang] || s.he;

      /* פירוק "5,000+" למספר לספירה + סיומת שנשארת קבועה */
      const m       = String(s.value).match(/^([\d.,]+)(.*)$/);
      const num     = m ? parseFloat(m[1].replace(/,/g, '')) : null;
      const suffix  = m ? m[2] : '';
      const grouped = !!(m && m[1].includes(','));

      const value = num === null || isNaN(num)
        ? `<span class="value">${s.value}</span>`
        : `<span class="value" data-count="${num}" data-suffix="${suffix}" data-grouped="${grouped ? 1 : 0}">${s.value}</span>`;

      const inner = `${value}<span class="label">${esc(label)}</span>`;
      return i === 2
        ? `<div class="stat"><a href="${window.SITE.links.reviews}" target="_blank" rel="noopener noreferrer">${inner}</a></div>`
        : `<div class="stat">${inner}</div>`;
    }).join('');
  }

  /* ⚠️ סדר קריטי: כל תוכן שנוצר דינמית חייב להיווצר כאן, לפני initReveal().
     אלמנט עם class="reveal" שנוסף ל-DOM אחרי שה-observer רץ לא ייצפה לעולם,
     יישאר ב-opacity:0 ופשוט לא יופיע. */
  function renderDynamic() {
    renderTracks();
    renderStarters();
    renderStats();
    if (window.Gallery) window.Gallery.render();
    if (window.Menu)    window.Menu.render();
    if (window.Pages)   window.Pages.render();
    buildRunner(document.getElementById('heroTitle'));
    initReveal();
  }

  /* ======================================================================
     עזר
     ====================================================================== */
  function debounce(fn, ms) {
    let t;
    return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
  }

  /* ======================================================================
     אתחול
     ====================================================================== */
  /* ⚠️ langchange נורה גם כשהשפה לא באמת השתנתה: כל קריאה ל-I18n.apply()
     יורה אותו, ובאתחול הוא נורה פעמיים. רינדור מחדש מחליף את הצמתים של
     המונים, והספירה שכבר רצה נשארת תקועה על צומת מנותק - המספר קופץ
     לערך הסופי בלי אנימציה, והקונפטי נוחת מחוץ למסמך.
     כאן נשמרת השפה האחרונה שרונדרה, ורינדור מחדש קורה רק כשהיא מתחלפת. */
  let lastLang = null;

  function onLangChange(e) {
    const next = (e && e.detail && e.detail.lang) ||
                 (window.I18n ? window.I18n.get() : 'he');
    if (next === lastLang) return;
    lastLang = next;
    renderDynamic();
  }

  function boot() {
    window.I18n.init();          /* קודם שפה - כדי שכל הרינדור יהיה בשפה הנכונה */
    lastLang = window.I18n.get();
    renderDynamic();
    initHeader();
    initNav();
    initHeroVideo();
    initConfetti();
    initSocialBar();
    /* ⚠️ כל מודול נבדק לפני האתחול. דפים פנימיים לא טוענים את כל הסקריפטים,
       וקריאה למודול חסר הייתה זורקת שגיאה ומפילה את כל מה שאחריה
       (הנגישות והקוקיז בפרט). */
    if (window.Reviews)        window.Reviews.init();
    if (window.Gallery)        window.Gallery.init();
    if (window.A11y)           window.A11y.init();
    if (window.CookieConsent)  window.CookieConsent.init();

    /* בהחלפת שפה - רינדור מחדש של התוכן הדינמי בלבד.
       אין לקרוא כאן ל-I18n.apply(): היא זו שיורה את האירוע ותיווצר לולאה.
       הרנדררים ממילא בונים את התוכן בשפה העדכנית. */
    document.addEventListener('langchange', onLangChange);
  }

  /* חשיפה לשימוש חיצוני (למשל הפעלה ידנית של הספירה בסביבת תצוגה מקדימה) */
  window.CasaAnim = { countUp, reveal: initReveal, burst };

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', boot)
    : boot();
})();
