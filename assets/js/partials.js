/* ==========================================================================
   partials.js - הדר, ניווט, פוטר, סרגל סושיאל, קוקיז, תוסף נגישות
   --------------------------------------------------------------------------
   כל אלה נבנים ממקום אחד, כך ששינוי בהדר/פוטר משפיע על כל דפי האתר.
   ההזרקה מתבצעת מוקדם ככל האפשר (סקריפט defer בראש ה-body).
   ========================================================================== */
(function () {
  const S = window.SITE, I = window.ICON;

  /* ---- זיהוי הדף הנוכחי לצורך aria-current ---- */
  const currentFile = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  const navItems = S.nav.map((item, i) => {
    const isCurrent = item.href.toLowerCase() === currentFile;
    return `<li style="--i:${i}">
      <a href="${item.href}" data-i18n-nav="${item.key}"${isCurrent ? ' aria-current="page"' : ''}>${item.he}</a>
    </li>`;
  }).join('');

  const socialLinks = `
    <a href="${S.links.instagram}" target="_blank" rel="noopener noreferrer" aria-label="Instagram">${I.instagram}</a>
    <a href="${S.links.facebook}"  target="_blank" rel="noopener noreferrer" aria-label="Facebook">${I.facebook}</a>
    <a href="${S.links.tiktok}"    target="_blank" rel="noopener noreferrer" aria-label="TikTok">${I.tiktok}</a>`;

  /* ======================================================================
     1. הדר
     ====================================================================== */
  const header = `
  <header class="site-header" id="siteHeader">
    <div class="container header-inner">
      <div class="header-start">
        <button class="burger" id="burger" type="button"
                aria-expanded="false" aria-controls="navOverlay"
                data-i18n-aria-label="header.menuOpen" aria-label="פתיחת תפריט הניווט">
          <span></span><span></span>
        </button>
        <a class="header-link header-phone" href="${S.business.phoneHref}">${I.phone}<span>${S.business.phone}</span></a>
      </div>

      <a class="header-logo" href="index.html" data-i18n-aria-label="header.home" aria-label="לדף הבית">
        <img src="assets/img/logo.svg" alt="קאזה דו ברזיל" width="200" height="144"
             onerror="this.onerror=null;this.src='assets/img/logo-800.png'">
      </a>

      <div class="header-end">
        <button class="header-link" id="langToggle" type="button"
                data-i18n-aria-label="header.langLabel" aria-label="Switch to English">
          ${I.globe}<span data-i18n="header.lang">EN</span>
        </button>
        <a class="header-cta" href="${S.links.reserve}" target="_blank" rel="noopener noreferrer">
          ${I.calendar}<span data-i18n="header.reserve">הזמנת שולחן</span>
        </a>
      </div>
    </div>
  </header>

  <div class="nav-overlay" id="navOverlay" role="dialog" aria-modal="true"
       data-i18n-aria-label="header.menuOpen" aria-label="תפריט ניווט" hidden>
    <div class="nav-panel">
      <nav aria-label="ניווט ראשי">
        <ul class="nav-list">${navItems}</ul>
      </nav>
      <div class="nav-aside">
        <div class="nav-block">
          <h3 data-i18n="footer.contactTitle">צרו קשר</h3>
          <p><a href="${S.business.phoneHref}">${S.business.phone}</a></p>
          <p><a href="${S.business.waze}" target="_blank" rel="noopener noreferrer" data-i18n-text="address">${S.business.address}</a></p>
        </div>
        <div class="nav-block">
          <h3 data-i18n="footer.hoursTitle">שעות פעילות</h3>
          <p data-i18n-text="hours">${S.business.hours}</p>
        </div>
        <div class="nav-block">
          <h3 data-i18n="footer.social">עקבו אחרינו</h3>
          <div class="nav-social footer-social">${socialLinks}</div>
        </div>
        <a class="btn btn--gold" href="${S.links.reserve}" target="_blank" rel="noopener noreferrer">
          ${I.calendar}<span data-i18n="header.reserve">הזמנת שולחן</span>
        </a>
      </div>
    </div>
  </div>`;

  /* ======================================================================
     2. פוטר
     ====================================================================== */
  const footerNav = S.nav.map(item =>
    `<li><a href="${item.href}" data-i18n-nav="${item.key}">${item.he}</a></li>`).join('');

  const footer = `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <img src="assets/img/logo.svg" alt="קאזה דו ברזיל" width="160" height="115" loading="lazy"
               onerror="this.onerror=null;this.src='assets/img/logo-800.png'">
          <p data-i18n="footer.about">צ׳ורסקריה ברזילאית באילת - גריל, מוסיקה ואווירה, מאז 1999.</p>
          <div class="footer-social">${socialLinks}</div>
        </div>

        <nav class="footer-col" aria-labelledby="footerNavTitle">
          <h3 id="footerNavTitle" data-i18n="footer.navTitle">ניווט באתר</h3>
          <ul>${footerNav}</ul>
        </nav>

        <div class="footer-col">
          <h3 data-i18n="footer.contactTitle">צרו קשר</h3>
          <ul class="footer-contact">
            <li>${I.phone}<a href="${S.business.phoneHref}">${S.business.phone}</a></li>
            <li>${I.pin}<a href="${S.business.waze}" target="_blank" rel="noopener noreferrer" data-i18n-text="address">${S.business.address}</a></li>
            <li>${I.mail}<a href="mailto:${S.business.email}">${S.business.email}</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h3 data-i18n="footer.hoursTitle">שעות פעילות</h3>
          <ul class="footer-contact">
            <li>${I.clock}<span data-i18n-text="hours">${S.business.hours}</span></li>
          </ul>
          <a class="btn btn--ghost btn--sm" style="margin-top:1rem"
             href="${S.links.reserve}" target="_blank" rel="noopener noreferrer">
            ${I.calendar}<span data-i18n="header.reserve">הזמנת שולחן</span>
          </a>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© <span id="footerYear">2026</span> ${S.business.name} · <span data-i18n="footer.rights">כל הזכויות שמורות</span></p>
        <nav aria-label="קישורי מדיניות">
          <a href="privacy.html" data-i18n="footer.privacy">מדיניות פרטיות</a>
          <a href="accessibility.html" data-i18n="footer.accessibility">הצהרת נגישות</a>
          <a href="terms.html" data-i18n="footer.terms">תנאי שימוש</a>
        </nav>
      </div>
    </div>
  </footer>`;

  /* ======================================================================
     3. סרגל סושיאל צף
     ====================================================================== */
  const socialBar = `
  <aside class="social-bar" id="socialBar" data-i18n-aria-label="social.title" aria-label="רשתות חברתיות">
    <a href="${S.links.instagram}" target="_blank" rel="noopener noreferrer" aria-label="Instagram">${I.instagram}</a>
    <a href="${S.links.facebook}"  target="_blank" rel="noopener noreferrer" aria-label="Facebook">${I.facebook}</a>
    <a href="${S.links.tiktok}"    target="_blank" rel="noopener noreferrer" aria-label="TikTok">${I.tiktok}</a>
    <a href="${S.business.waze}"   target="_blank" rel="noopener noreferrer" data-i18n-aria-label="footer.waze" aria-label="ניווט בוויז">${I.waze}</a>
    <a href="${S.business.phoneHref}" aria-label="${S.business.phone}">${I.phone}</a>
    <button type="button" class="social-collapse" id="socialCollapse"
            data-i18n-aria-label="social.toggle" aria-label="פתיחה וסגירה של סרגל הרשתות החברתיות">${I.chevron}</button>
  </aside>`;

  /* ======================================================================
     4. התראת קוקיז
     ====================================================================== */
  const cookieBanner = `
  <div class="cookie-banner" id="cookieBanner" role="dialog" aria-live="polite"
       aria-labelledby="cookieTitle" aria-describedby="cookieText" hidden>
    <h2 id="cookieTitle">${I.cookie}<span data-i18n="cookies.title">האתר עושה שימוש בעוגיות</span></h2>
    <p id="cookieText">
      <span data-i18n="cookies.text">אנו משתמשים בעוגיות כדי לשפר את חוויית הגלישה ולנתח את השימוש באתר. לחיצה על ״אישור״ מהווה הסכמה לשימוש בעוגיות כמפורט במדיניות הפרטיות.</span>
      <a href="privacy.html" data-i18n="cookies.policy">מדיניות הפרטיות</a>
    </p>
    <div class="cookie-actions">
      <button type="button" class="btn btn--gold" id="cookieAccept" data-i18n="cookies.accept">אישור</button>
      <button type="button" class="btn btn--ghost" id="cookieDecline" data-i18n="cookies.decline">עוגיות הכרחיות בלבד</button>
    </div>
  </div>`;

  /* ======================================================================
     5. תוסף נגישות
     ====================================================================== */
  const opt = (id, icon, key, label) => `
    <button type="button" class="a11y-opt" data-a11y="${id}" aria-pressed="false">
      ${icon}<span data-i18n="${key}">${label}</span><span class="a11y-switch" aria-hidden="true"></span>
    </button>`;

  const a11yWidget = `
  <button type="button" class="a11y-fab" id="a11yFab"
          aria-expanded="false" aria-controls="a11yPanel"
          data-i18n-aria-label="a11y.open" aria-label="פתיחת תפריט נגישות">${I.accessibility}</button>

  <div class="a11y-panel" id="a11yPanel" role="dialog" aria-labelledby="a11yTitle" hidden>
    <div class="a11y-head">
      <h2 id="a11yTitle" data-i18n="a11y.title">הגדרות נגישות</h2>
      <button type="button" class="a11y-close" id="a11yClose"
              data-i18n-aria-label="a11y.close" aria-label="סגירת תפריט נגישות">${I.close}</button>
    </div>

    <div class="a11y-group">
      <h3 data-i18n="a11y.textSize">גודל טקסט</h3>
      <div class="a11y-fontsize">
        <button type="button" id="a11yFontDown" data-i18n-aria-label="a11y.decrease" aria-label="הקטנת טקסט">${I.minus}</button>
        <output id="a11yFontValue" aria-live="polite">100%</output>
        <button type="button" id="a11yFontUp" data-i18n-aria-label="a11y.increase" aria-label="הגדלת טקסט">${I.plus}</button>
      </div>
    </div>

    <div class="a11y-group">
      <h3 data-i18n="a11y.title">הגדרות נגישות</h3>
      <div class="a11y-options">
        ${opt('contrast',  I.contrast, 'a11y.contrast',  'ניגודיות גבוהה')}
        ${opt('light',     I.sun,      'a11y.lightMode', 'רקע בהיר')}
        ${opt('grayscale', I.droplet,  'a11y.grayscale', 'גווני אפור')}
        ${opt('links',     I.link,     'a11y.links',     'הדגשת קישורים')}
        ${opt('readable',  I.type,     'a11y.readable',  'גופן קריא')}
        ${opt('spacing',   I.spacing,  'a11y.spacing',   'ריווח טקסט')}
        ${opt('motion',    I.motion,   'a11y.motion',    'עצירת אנימציות')}
        ${opt('cursor',    I.cursor,   'a11y.cursor',    'סמן גדול')}
        ${opt('guide',     I.guide,    'a11y.guide',     'מדריך קריאה')}
      </div>
    </div>

    <div class="a11y-foot">
      <button type="button" class="btn btn--ghost btn--sm btn--block" id="a11yReset">
        ${I.reset}<span data-i18n="a11y.reset">איפוס הגדרות</span>
      </button>
      <a href="accessibility.html" data-i18n="a11y.statement">הצהרת נגישות</a>
    </div>
  </div>
  <div class="a11y-guide-bar" id="a11yGuideBar" aria-hidden="true"></div>`;

  /* ======================================================================
     הזרקה לדף
     ====================================================================== */
  function mount(selector, html, position) {
    const host = document.querySelector(selector);
    if (host) host.insertAdjacentHTML(position, html);
  }

  mount('[data-partial="header"]', header, 'afterbegin');
  mount('[data-partial="footer"]', footer, 'afterbegin');
  mount('body', socialBar + cookieBanner + a11yWidget, 'beforeend');

  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
