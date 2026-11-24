/* ==========================================================================
   supa.js - גשר דק ל-Supabase
   --------------------------------------------------------------------------
   ⚠️ בכוונה בלי ה-SDK הרשמי. הוא שוקל ~120KB, היה מחייב סקריפט מ-CDN חיצוני
      ולכן גם פרצה ב-CSP (script-src 'self'). כל מה שהאתר צריך הוא fetch
      מול PostgREST ומול נקודת הקצה של ההתחברות, וזה בדיוק מה שיש כאן.

   ⚠️ המפתח שלמטה הוא publishable key ונועד להיות גלוי בדפדפן. הוא לא סוד.
      כל ההגנה על הנתונים נמצאת ב-RLS בצד השרת:
        • products / settings - קריאה לכולם, כתיבה רק למי שרשום ב-admins
        • orders - אורח יכול ליצור הזמנה, אבל לא לקרוא הזמנות של אחרים
        • המחירים מחושבים בטריגר בשרת, לא מתקבלים מהדפדפן
   ========================================================================== */
window.Supa = (function () {
  const URL_BASE = 'https://pslbnrzddmgtwqdbjkmj.supabase.co';
  const KEY      = 'sb_publishable_vkaCCDoeVLPf1ACBh4Sa_g_iamod9YK';
  const SESSION  = 'cdb-admin-session';

  let session = null;
  try { session = JSON.parse(localStorage.getItem(SESSION) || 'null'); } catch (e) { session = null; }

  function saveSession(s) {
    session = s;
    try {
      if (s) localStorage.setItem(SESSION, JSON.stringify(s));
      else   localStorage.removeItem(SESSION);
    } catch (e) { /* מצב פרטי - הסשן יחיה רק עד רענון */ }
  }

  function headers(extra) {
    const h = Object.assign({
      'apikey': KEY,
      'Authorization': 'Bearer ' + ((session && session.access_token) || KEY)
    }, extra || {});
    return h;
  }

  /* ---------- שגיאות ----------
     PostgREST מחזיר את הודעת ה-raise מהטריגר בשדה message. הקודים
     (ORDERING_CLOSED, QTY_STEP...) מתורגמים למשתמש ב-order.js. */
  async function parseError(res) {
    let body = null;
    try { body = await res.json(); } catch (e) { /* גוף ריק */ }
    const msg = (body && (body.message || body.error_description || body.error || body.msg)) || ('HTTP ' + res.status);
    const err = new Error(msg);
    err.status = res.status;
    err.code = (String(msg).match(/[A-Z_]{4,}/) || [])[0] || null;
    return err;
  }

  /* ---------- REST ---------- */
  async function rest(path, opts) {
    const o = opts || {};
    const res = await fetch(URL_BASE + '/rest/v1/' + path, {
      method: o.method || 'GET',
      headers: headers(Object.assign(
        o.body ? { 'Content-Type': 'application/json' } : {},
        o.prefer ? { 'Prefer': o.prefer } : {}
      )),
      body: o.body ? JSON.stringify(o.body) : undefined
    });
    if (!res.ok) throw await parseError(res);
    if (res.status === 204) return null;
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }

  /* ---------- התחברות ---------- */
  async function signIn(email, password) {
    const res = await fetch(URL_BASE + '/auth/v1/token?grant_type=password', {
      method: 'POST',
      headers: { 'apikey': KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password })
    });
    if (!res.ok) throw await parseError(res);
    saveSession(await res.json());
    return session;
  }

  async function refresh() {
    if (!session || !session.refresh_token) return null;
    const res = await fetch(URL_BASE + '/auth/v1/token?grant_type=refresh_token', {
      method: 'POST',
      headers: { 'apikey': KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: session.refresh_token })
    });
    if (!res.ok) { saveSession(null); return null; }
    saveSession(await res.json());
    return session;
  }

  function signOut() {
    /* ניקוי מקומי בלבד. אין צורך לבטל את הטוקן בשרת - תוקפו קצר. */
    saveSession(null);
  }

  function isSignedIn() { return !!(session && session.access_token); }

  /* האם המשתמש המחובר נמצא ברשימת המנהלים. נבדק בשרת, לא בדפדפן. */
  async function isAdmin() {
    if (!isSignedIn()) return false;
    try {
      const r = await rest('rpc/is_admin', { method: 'POST', body: {} });
      return r === true;
    } catch (e) {
      if (e.status === 401) { await refresh(); }
      return false;
    }
  }

  return { rest, signIn, signOut, refresh, isSignedIn, isAdmin, URL_BASE: URL_BASE };
})();
