/* ==========================================================================
   accessibility.js - תוסף נגישות בהתאמה לת"י 5568 / WCAG 2.1 AA
   --------------------------------------------------------------------------
   יכולות: הגדלת/הקטנת טקסט, ניגודיות גבוהה, רקע בהיר, גווני אפור,
   הדגשת קישורים, גופן קריא, ריווח טקסט, עצירת אנימציות, סמן גדול,
   מדריך קריאה, איפוס. ההעדפות נשמרות בין ביקורים.
   כל הפקדים נגישים ממקלדת ומסומנים ב-aria-pressed.
   ========================================================================== */
(function () {
  const KEY = 'cdb-a11y';
  const FONT_MIN = 90, FONT_MAX = 160, FONT_STEP = 10;

  /* מצבי טוגל - id → מחלקה על <html> */
  const TOGGLES = {
    contrast:  'a11y-contrast',
    light:     'a11y-light',
    grayscale: 'a11y-grayscale',
    links:     'a11y-links',
    readable:  'a11y-readable',
    spacing:   'a11y-spacing',
    motion:    'a11y-no-motion',
    cursor:    'a11y-cursor',
    guide:     'a11y-guide'
  };
  /* מצבים שאינם יכולים לפעול יחד */
  const EXCLUSIVE = [['contrast', 'light']];

  let state = { font: 100 };

  /* ---------- אחסון בטוח ---------- */
  const load = () => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) state = Object.assign({ font: 100 }, JSON.parse(raw));
      /* ⚠️ הערך הזה נכתב ישירות ל-style.fontSize. אם התוכן באחסון נפגם
         או נערך ידנית, כאן הוא נעצר: רק מספר בטווח מותר עובר הלאה. */
      const n = Number(state.font);
      state.font = (Number.isFinite(n) && n >= 80 && n <= 160) ? Math.round(n) : 100;
    } catch (e) { /* גלישה פרטית או אחסון חסום - ממשיכים עם ברירת מחדל */ }
  };
  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  };

  /* ---------- החלת המצב על המסמך ---------- */
  function render() {
    const html = document.documentElement;

    Object.entries(TOGGLES).forEach(([id, cls]) => html.classList.toggle(cls, !!state[id]));

    /* גודל טקסט - משנה את בסיס ה-rem, כל הסקאלה מתכווננת יחד */
    html.style.fontSize = state.font === 100 ? '' : state.font + '%';

    /* סנכרון הממשק */
    const out = document.getElementById('a11yFontValue');
    if (out) out.textContent = state.font + '%';

    document.querySelectorAll('[data-a11y]').forEach(btn => {
      btn.setAttribute('aria-pressed', String(!!state[btn.dataset.a11y]));
    });

    const down = document.getElementById('a11yFontDown');
    const up   = document.getElementById('a11yFontUp');
    if (down) down.disabled = state.font <= FONT_MIN;
    if (up)   up.disabled   = state.font >= FONT_MAX;

    save();
  }

  function toggle(id) {
    state[id] = !state[id];
    if (state[id]) {
      EXCLUSIVE.forEach(group => {
        if (group.includes(id)) group.forEach(other => { if (other !== id) state[other] = false; });
      });
    }
    render();
    announce(id);
  }

  /* הודעה לקוראי מסך על שינוי מצב */
  function announce(id) {
    const live = document.getElementById('a11yLive');
    if (!live) return;
    const btn = document.querySelector(`[data-a11y="${id}"] span[data-i18n]`);
    const name = btn ? btn.textContent : id;
    const status = window.I18n ? window.I18n.t(state[id] ? 'a11y.on' : 'a11y.off') : (state[id] ? 'on' : 'off');
    live.textContent = `${name}: ${status}`;
  }

  function setFont(delta) {
    state.font = Math.min(FONT_MAX, Math.max(FONT_MIN, state.font + delta));
    render();
  }

  function reset() {
    state = { font: 100 };
    document.documentElement.removeAttribute('style');
    render();
  }

  /* ---------- פאנל ---------- */
  let lastFocus = null;

  function openPanel() {
    const panel = document.getElementById('a11yPanel');
    const fab   = document.getElementById('a11yFab');
    lastFocus = document.activeElement;
    panel.hidden = false;
    requestAnimationFrame(() => panel.classList.add('is-open'));
    fab.setAttribute('aria-expanded', 'true');
    const first = panel.querySelector('button, a, [tabindex]');
    if (first) first.focus();
    document.addEventListener('keydown', onKeydown);
    document.addEventListener('click', onOutside, true);
  }

  function closePanel() {
    const panel = document.getElementById('a11yPanel');
    const fab   = document.getElementById('a11yFab');
    panel.classList.remove('is-open');
    fab.setAttribute('aria-expanded', 'false');
    setTimeout(() => { panel.hidden = true; }, 320);
    document.removeEventListener('keydown', onKeydown);
    document.removeEventListener('click', onOutside, true);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') { closePanel(); return; }
    if (e.key !== 'Tab') return;
    /* לכידת מיקוד בתוך הפאנל */
    const panel = document.getElementById('a11yPanel');
    const items = [...panel.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')];
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function onOutside(e) {
    const panel = document.getElementById('a11yPanel');
    const fab   = document.getElementById('a11yFab');
    if (!panel.contains(e.target) && !fab.contains(e.target)) closePanel();
  }

  /* ---------- מדריך קריאה - פס אופקי שעוקב אחרי הסמן ---------- */
  function initGuide() {
    const bar = document.getElementById('a11yGuideBar');
    if (!bar) return;
    const move = e => {
      if (!state.guide) return;
      const y = (e.touches ? e.touches[0].clientY : e.clientY) - 22;
      bar.style.top = y + 'px';
    };
    document.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('touchmove', move, { passive: true });
  }

  /* ---------- אתחול ---------- */
  function init() {
    /* אזור הכרזה לקוראי מסך */
    const live = document.createElement('div');
    live.id = 'a11yLive';
    live.className = 'sr-only';
    live.setAttribute('aria-live', 'polite');
    live.setAttribute('role', 'status');
    document.body.appendChild(live);

    load();
    render();

    document.getElementById('a11yFab')?.addEventListener('click', () => {
      const panel = document.getElementById('a11yPanel');
      panel.hidden ? openPanel() : closePanel();
    });
    document.getElementById('a11yClose')?.addEventListener('click', closePanel);
    document.getElementById('a11yReset')?.addEventListener('click', reset);
    document.getElementById('a11yFontUp')?.addEventListener('click', () => setFont(FONT_STEP));
    document.getElementById('a11yFontDown')?.addEventListener('click', () => setFont(-FONT_STEP));

    document.querySelectorAll('[data-a11y]').forEach(btn => {
      btn.addEventListener('click', () => toggle(btn.dataset.a11y));
    });

    initGuide();

    /* קיצור מקלדת: Alt + A לפתיחת התפריט */
    document.addEventListener('keydown', e => {
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        const panel = document.getElementById('a11yPanel');
        panel.hidden ? openPanel() : closePanel();
      }
    });
  }

  window.A11y = { init, reset, toggle };
})();
