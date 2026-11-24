/* ==========================================================================
   i18n.js - מנוע דו-לשוני (עברית RTL / אנגלית LTR)
   --------------------------------------------------------------------------
   סימון ב-HTML:
     data-i18n="key"             → מחליף את תוכן הטקסט
     data-i18n-aria-label="key"  → מחליף aria-label
     data-i18n-nav="navKey"      → פריט ניווט (מתוך SITE.nav)
     data-i18n-text="address|hours" → שדות עסק דו-לשוניים
     data-i18n-html="key"        → מחליף HTML (לשימוש זהיר)
   ========================================================================== */
window.I18n = (function () {
  const STORAGE_KEY = 'cdb-lang';
  let lang = 'he';

  function safeGet() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function safeSet(v) {
    try { localStorage.setItem(STORAGE_KEY, v); } catch (e) { /* מצב פרטי */ }
  }

  function t(key) {
    const dict = window.I18N[lang] || window.I18N.he;
    return dict[key] !== undefined ? dict[key] : (window.I18N.he[key] || '');
  }

  function apply(root) {
    const scope = root || document;
    const S = window.SITE;

    scope.querySelectorAll('[data-i18n]').forEach(el => {
      const v = t(el.dataset.i18n);
      if (v) el.textContent = v;
    });

    scope.querySelectorAll('[data-i18n-html]').forEach(el => {
      const v = t(el.dataset.i18nHtml);
      if (v) el.innerHTML = v;
    });

    scope.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
      const v = t(el.dataset.i18nAriaLabel);
      if (v) el.setAttribute('aria-label', v);
    });

    /* פריטי ניווט */
    scope.querySelectorAll('[data-i18n-nav]').forEach(el => {
      const item = S.nav.find(n => n.key === el.dataset.i18nNav);
      if (item) el.textContent = item[lang] || item.he;
    });

    /* שדות עסק */
    scope.querySelectorAll('[data-i18n-text]').forEach(el => {
      const field = el.dataset.i18nText;
      if (field === 'address') el.textContent = lang === 'en' ? S.business.addressEn : S.business.address;
      if (field === 'hours')   el.textContent = lang === 'en' ? S.business.hoursEn   : S.business.hours;
    });

    /* מאפייני מסמך */
    document.documentElement.lang = lang;
    document.documentElement.dir  = lang === 'en' ? 'ltr' : 'rtl';

    const titleEl = document.querySelector('title[data-i18n-title]');
    if (titleEl) {
      const key = titleEl.dataset.i18nTitle;
      if (t(key)) document.title = t(key);
    }
    const descEl = document.querySelector('meta[name="description"][data-i18n-content]');
    if (descEl && t(descEl.dataset.i18nContent)) {
      descEl.setAttribute('content', t(descEl.dataset.i18nContent));
    }

    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }

  function set(next) {
    lang = (next === 'en') ? 'en' : 'he';
    safeSet(lang);
    apply();
  }

  function toggle() { set(lang === 'he' ? 'en' : 'he'); }
  function get() { return lang; }

  function init() {
    /* עדיפות: ?lang= בכתובת ← בחירה שמורה ← ברירת מחדל עברית */
    const urlLang = new URLSearchParams(location.search).get('lang');
    lang = (urlLang === 'en' || urlLang === 'he') ? urlLang : (safeGet() || 'he');
    apply();

    const btn = document.getElementById('langToggle');
    if (btn) btn.addEventListener('click', toggle);
  }

  return { init, set, get, toggle, t, apply };
})();
