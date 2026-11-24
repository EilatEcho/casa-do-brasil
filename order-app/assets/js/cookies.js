/* ==========================================================================
   cookies.js - התראת עוגיות
   --------------------------------------------------------------------------
   שומרת את הבחירה ('all' / 'essential') למשך שנה.
   כשהמשתמש מאשר, נורה האירוע 'cookies:accepted' - נקודת החיבור להטמעת
   סקריפטים של אנליטיקס/פיקסלים (ראו הערה בתחתית הקובץ).
   ========================================================================== */
(function () {
  const KEY = 'cdb-cookie-consent';
  const MAX_AGE_DAYS = 365;

  const read = () => {
    try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; }
  };
  const write = value => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ value, at: Date.now() }));
    } catch (e) { /* אחסון חסום - הבאנר יופיע שוב בביקור הבא */ }
  };

  function isValid(record) {
    if (!record || !record.value) return false;
    const ageDays = (Date.now() - record.at) / 86400000;
    return ageDays < MAX_AGE_DAYS;
  }

  function decide(value) {
    write(value);
    hide();
    if (value === 'all') {
      document.dispatchEvent(new CustomEvent('cookies:accepted'));
    }
  }

  function show() {
    const el = document.getElementById('cookieBanner');
    if (!el) return;
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add('is-visible'));
  }

  function hide() {
    const el = document.getElementById('cookieBanner');
    if (!el) return;
    el.classList.remove('is-visible');
    setTimeout(() => { el.hidden = true; }, 560);
  }

  function init() {
    const el = document.getElementById('cookieBanner');
    if (!el) return;

    document.getElementById('cookieAccept')?.addEventListener('click', () => decide('all'));
    document.getElementById('cookieDecline')?.addEventListener('click', () => decide('essential'));

    const record = read();
    if (isValid(record)) {
      if (record.value === 'all') document.dispatchEvent(new CustomEvent('cookies:accepted'));
      return;
    }
    /* השהיה קצרה כדי לא לחסום את הרושם הראשוני מההירו */
    setTimeout(show, 1400);
  }

  /* API לפתיחה חוזרת מתוך דף מדיניות הפרטיות */
  window.CookieConsent = {
    init,
    reopen() {
      try { localStorage.removeItem(KEY); } catch (e) {}
      show();
    },
    status: () => (read() || {}).value || null
  };

  /* --------------------------------------------------------------------
     נקודת חיבור לאנליטיקס - הסירו את ההערה והחליפו במזהה בפועל:

     document.addEventListener('cookies:accepted', () => {
       const s = document.createElement('script');
       s.async = true;
       s.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX';
       document.head.appendChild(s);
       window.dataLayer = window.dataLayer || [];
       function gtag(){ dataLayer.push(arguments); }
       gtag('js', new Date());
       gtag('config', 'G-XXXXXXX');
     });
     -------------------------------------------------------------------- */
})();
