/* ==========================================================================
   admin.js - מערכת הניהול של הזמנות הבשר
   --------------------------------------------------------------------------
   המסך הזה הוא נוחות בלבד. ההרשאה האמיתית נאכפת ב-RLS בצד השרת:
   גם אם מישהו יטען את הדף, יסתיר את מסך ההתחברות וילחץ על "שמירה" -
   Supabase יסרב לכתוב כל עוד המשתמש שלו לא רשום בטבלת admins.
   ========================================================================== */
(function () {
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const money = n => '₪' + Number(n).toLocaleString('he-IL',
    { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });

  const CAT_NAMES = { meat: 'בשר במשקל', starters: 'מנות פתיחה', extras: 'ליד הבשר' };
  const STATUS = {
    new: 'חדשה', confirmed: 'אושרה', ready: 'מוכנה', done: 'הושלמה', cancelled: 'בוטלה'
  };

  let products = [], settings = null, orders = [];

  function say(el, text, kind) {
    el.textContent = text;
    el.className = 'adm-msg' + (kind ? ' is-' + kind : '');
    if (kind === 'ok') setTimeout(() => { if (el.textContent === text) el.textContent = ''; }, 4000);
  }

  /* ====================== התחברות ====================== */
  function loginScreen(err) {
    $('admRoot').innerHTML =
      '<form class="adm-login" id="admLogin">' +
        '<h1>כניסה לניהול</h1>' +
        '<div class="adm-field"><label for="admEmail">אימייל</label>' +
          '<input id="admEmail" type="email" autocomplete="username" required dir="ltr"></div>' +
        '<div class="adm-field"><label for="admPass">סיסמה</label>' +
          '<input id="admPass" type="password" autocomplete="current-password" required></div>' +
        '<p class="adm-msg' + (err ? ' is-error' : '') + '" id="admLoginMsg">' + esc(err || '') + '</p>' +
        '<button class="btn btn--gold" type="submit">כניסה</button>' +
      '</form>';

    $('admLogin').addEventListener('submit', async ev => {
      ev.preventDefault();
      const msg = $('admLoginMsg');
      say(msg, 'מתחבר…');
      try {
        await window.Supa.signIn($('admEmail').value.trim(), $('admPass').value);
        start();
      } catch (e) {
        say(msg, 'האימייל או הסיסמה לא נכונים.', 'error');
      }
    });
  }

  /* ====================== שלד ====================== */
  function shell(email) {
    $('admRoot').innerHTML =
      '<div class="adm-head">' +
        '<h1>ניהול הזמנות בשר</h1>' +
        '<p class="adm-who">' + esc(email || '') +
          '<button type="button" id="admOut">יציאה</button></p>' +
      '</div>' +
      '<div class="adm-tabs" role="tablist">' +
        '<button class="adm-tab" role="tab" id="tabSettings" aria-selected="true"  aria-controls="panSettings">מצב המערכת</button>' +
        '<button class="adm-tab" role="tab" id="tabPrices"   aria-selected="false" aria-controls="panPrices">מחירון וזמינות</button>' +
        '<button class="adm-tab" role="tab" id="tabOrders"   aria-selected="false" aria-controls="panOrders">הזמנות</button>' +
      '</div>' +
      '<div class="adm-panel" id="panSettings" role="tabpanel" aria-labelledby="tabSettings"></div>' +
      '<div class="adm-panel" id="panPrices"   role="tabpanel" aria-labelledby="tabPrices" hidden></div>' +
      '<div class="adm-panel" id="panOrders"   role="tabpanel" aria-labelledby="tabOrders" hidden></div>';

    $('admOut').addEventListener('click', () => { window.Supa.signOut(); loginScreen(); });

    [['tabSettings', 'panSettings'], ['tabPrices', 'panPrices'], ['tabOrders', 'panOrders']]
      .forEach(([t, p]) => $(t).addEventListener('click', () => {
        ['tabSettings', 'tabPrices', 'tabOrders'].forEach(x =>
          $(x).setAttribute('aria-selected', String(x === t)));
        ['panSettings', 'panPrices', 'panOrders'].forEach(x => { $(x).hidden = (x !== p); });
        if (p === 'panOrders') loadOrders();
      }));
  }

  /* ====================== מצב המערכת ====================== */
  function modeCard(val, label, note, cls) {
    return '<label class="adm-mode adm-mode--' + cls + '">' +
      '<input type="radio" name="admMode" value="' + val + '"' +
        (settings.ordering_mode === val ? ' checked' : '') + '>' +
      '<strong>' + esc(label) + '</strong><small>' + esc(note) + '</small></label>';
  }

  function renderSettings() {
    const s = settings;
    $('panSettings').innerHTML =
      '<div class="adm-modes">' +
        modeCard('online', 'הזמנות פתוחות', 'הלקוחות מזמינים מהאתר כרגיל.', 'online') +
        modeCard('phone',  'הזמנה טלפונית', 'המחירון מוצג, אבל במקום סל הזמנה מופיע כפתור חיוג.', 'phone') +
        modeCard('off',    'המערכת כבויה',  'הדף מציג הודעת סגירה בלבד.', 'off') +
      '</div>' +

      '<div class="adm-field"><label for="setClosed">הודעה כשהמערכת כבויה</label>' +
        '<textarea id="setClosed" rows="2">' + esc(s.closed_he) + '</textarea></div>' +

      '<div class="adm-field"><label for="setNotice">הודעה בראש דף ההזמנה (ריק = בלי הודעה)</label>' +
        '<textarea id="setNotice" rows="2" placeholder="למשל: בשישי ההזמנות נסגרות ב-14:00">' + esc(s.notice_he) + '</textarea></div>' +

      '<h2>מסירה</h2>' +
      '<div class="adm-check"><input type="checkbox" id="setPickup"' + (s.pickup_enabled ? ' checked' : '') + '>' +
        '<label for="setPickup">איסוף עצמי מהמסעדה</label></div>' +
      '<div class="adm-check"><input type="checkbox" id="setDelivery"' + (s.delivery_enabled ? ' checked' : '') + '>' +
        '<label for="setDelivery">משלוחים</label></div>' +

      '<div class="adm-row2">' +
        '<div class="adm-field"><label for="setFee">דמי משלוח (₪)</label>' +
          '<input id="setFee" type="number" min="0" step="1" value="' + esc(s.delivery_fee) + '"></div>' +
        '<div class="adm-field"><label for="setArea">אזור החלוקה</label>' +
          '<input id="setArea" type="text" value="' + esc(s.delivery_area_he) + '"></div>' +
      '</div>' +

      '<div class="adm-field"><label for="setMin">מינימום להזמנה (₪, 0 = בלי מינימום)</label>' +
        '<input id="setMin" type="number" min="0" step="1" value="' + esc(s.min_order) + '">' +
        '<small>נבדק בשרת. הזמנה מתחת לסכום תידחה.</small></div>' +

      '<div class="adm-field"><label for="setLead">מה כתוב ללקוח אחרי שליחת ההזמנה</label>' +
        '<textarea id="setLead" rows="2">' + esc(s.lead_time_he) + '</textarea></div>' +

      '<h2>מבצע</h2>' +
      '<div class="adm-check"><input type="checkbox" id="setPromo"' + (s.promo_enabled ? ' checked' : '') + '>' +
        '<label for="setPromo">מבצע סט מנות פתיחה במתנה</label></div>' +
      '<div class="adm-row2">' +
        '<div class="adm-field"><label for="setThresh">מעל סכום בשר של (₪)</label>' +
          '<input id="setThresh" type="number" min="0" step="10" value="' + esc(s.promo_threshold) + '">' +
          '<small>פריטים מסומנים "ללא הנחה" לא נספרים לסכום הזה.</small></div>' +
        '<div class="adm-field"><label for="setPromoTxt">נוסח המבצע</label>' +
          '<input id="setPromoTxt" type="text" value="' + esc(s.promo_he) + '"></div>' +
      '</div>' +

      '<div class="adm-bar">' +
        '<button class="btn btn--gold" type="button" id="setSave">שמירת ההגדרות</button>' +
        '<p class="adm-msg" id="setMsg"></p>' +
      '</div>';

    $('setSave').addEventListener('click', saveSettings);
  }

  async function saveSettings() {
    const msg = $('setMsg');
    const patch = {
      ordering_mode:    (document.querySelector('input[name="admMode"]:checked') || {}).value || 'online',
      pickup_enabled:   $('setPickup').checked,
      delivery_enabled: $('setDelivery').checked,
      delivery_fee:     Number($('setFee').value) || 0,
      delivery_area_he: $('setArea').value.trim(),
      min_order:        Number($('setMin').value) || 0,
      promo_enabled:    $('setPromo').checked,
      promo_threshold:  Number($('setThresh').value) || 0,
      promo_he:         $('setPromoTxt').value.trim(),
      notice_he:        $('setNotice').value.trim(),
      closed_he:        $('setClosed').value.trim(),
      lead_time_he:     $('setLead').value.trim()
    };
    say(msg, 'שומר…');
    try {
      await window.Supa.rest('settings?id=eq.true', { method: 'PATCH', body: patch });
      Object.assign(settings, patch);
      say(msg, 'נשמר. השינוי כבר באוויר.', 'ok');
    } catch (e) {
      say(msg, 'השמירה נכשלה: ' + e.message, 'error');
    }
  }

  /* ====================== מחירון ====================== */
  function renderPrices() {
    let rows = '';
    ['meat', 'starters', 'extras'].forEach(cat => {
      const items = products.filter(p => p.category === cat);
      if (!items.length) return;
      rows += '<tr class="adm-cat-row"><td colspan="4">' + esc(CAT_NAMES[cat]) + '</td></tr>';
      rows += items.map(p =>
        '<tr data-slug="' + esc(p.slug) + '"' + (p.available ? '' : ' class="is-off"') + '>' +
          '<td>' + esc(p.name_he) +
            (p.no_discount ? ' <span class="adm-unit">(ללא הנחה)</span>' : '') + '</td>' +
          '<td><input type="number" min="0" step="1" value="' + esc(p.price) + '" data-price></td>' +
          '<td class="adm-unit">' + (p.unit === 'kg' ? 'לק״ג' : 'ליחידה') + '</td>' +
          '<td><label class="adm-check"><input type="checkbox" data-avail' +
            (p.available ? ' checked' : '') + '> במלאי</label></td>' +
        '</tr>').join('');
    });

    $('panPrices').innerHTML =
      '<p class="adm-empty">שינוי מחיר או הורדת פריט מהמלאי משפיעים על דף ההזמנה מיד אחרי השמירה.</p>' +
      '<div class="adm-table-wrap"><table class="adm-table">' +
        '<thead><tr><th>פריט</th><th>מחיר</th><th>יחידה</th><th>זמינות</th></tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
      '</table></div>' +
      '<div class="adm-bar">' +
        '<button class="btn btn--gold" type="button" id="priceSave">שמירת המחירון</button>' +
        '<p class="adm-msg" id="priceMsg"></p>' +
      '</div>';

    $('panPrices').addEventListener('change', ev => {
      const tr = ev.target.closest('tr[data-slug]');
      if (tr && ev.target.matches('[data-avail]')) tr.classList.toggle('is-off', !ev.target.checked);
    });
    $('priceSave').addEventListener('click', savePrices);
  }

  async function savePrices() {
    const msg = $('priceMsg');
    const changed = [];
    $('panPrices').querySelectorAll('tr[data-slug]').forEach(tr => {
      const slug  = tr.dataset.slug;
      const p     = products.find(x => x.slug === slug);
      const price = Number(tr.querySelector('[data-price]').value);
      const avail = tr.querySelector('[data-avail]').checked;
      if (!p) return;
      if (Number(p.price) !== price || p.available !== avail) {
        changed.push({ slug: slug, price: price, available: avail });
      }
    });

    if (!changed.length) { say(msg, 'אין שינויים לשמור.'); return; }
    say(msg, 'שומר ' + changed.length + ' פריטים…');
    try {
      /* עדכון פר שורה. בכמות פריטים כזאת זה מיידי, ומונע את הסיכון
         של upsert שמוחק בטעות עמודות שלא נשלחו. */
      for (const c of changed) {
        await window.Supa.rest('products?slug=eq.' + encodeURIComponent(c.slug),
          { method: 'PATCH', body: { price: c.price, available: c.available } });
        const p = products.find(x => x.slug === c.slug);
        p.price = c.price; p.available = c.available;
      }
      say(msg, changed.length + ' פריטים עודכנו.', 'ok');
    } catch (e) {
      say(msg, 'השמירה נכשלה: ' + e.message, 'error');
    }
  }

  /* ====================== הזמנות ====================== */
  async function loadOrders() {
    const pan = $('panOrders');
    pan.innerHTML = '<p class="adm-empty">טוען הזמנות…</p>';
    try {
      orders = await window.Supa.rest('orders?select=*&order=created_at.desc&limit=100') || [];
    } catch (e) {
      pan.innerHTML = '<p class="adm-msg is-error">טעינת ההזמנות נכשלה: ' + esc(e.message) + '</p>';
      return;
    }
    if (!orders.length) { pan.innerHTML = '<p class="adm-empty">עוד לא התקבלו הזמנות.</p>'; return; }

    pan.innerHTML = orders.map(orderHtml).join('');
    pan.querySelectorAll('select[data-status]').forEach(sel =>
      sel.addEventListener('change', () => setStatus(sel.dataset.status, sel.value, sel)));
  }

  function orderHtml(o) {
    const when = new Date(o.created_at).toLocaleString('he-IL',
      { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    const items = (o.items || []).map(i =>
      '<li><span>' + esc(i.name) + ' · ' +
        (i.unit === 'kg'
          ? (i.qty < 1 ? Math.round(i.qty * 1000) + ' גרם' : i.qty + ' ק״ג')
          : i.qty + ' יח׳') +
      '</span><span>' + money(i.line) + '</span></li>').join('');

    return '<article class="adm-order" data-status="' + esc(o.status) + '">' +
      '<div class="adm-order-top">' +
        '<span class="adm-order-ref">' + esc(o.ref) + '</span>' +
        '<span class="adm-order-when">' + esc(when) + '</span>' +
      '</div>' +
      '<dl>' +
        '<dt>לקוח</dt><dd>' + esc(o.customer_name) + '</dd>' +
        '<dt>טלפון</dt><dd><a href="tel:' + esc(o.phone) + '" dir="ltr">' + esc(o.phone) + '</a></dd>' +
        '<dt>מסירה</dt><dd>' + (o.method === 'delivery' ? 'משלוח' : 'איסוף עצמי') + '</dd>' +
        (o.address ? '<dt>כתובת</dt><dd>' + esc(o.address) + '</dd>' : '') +
        (o.notes ? '<dt>הערות</dt><dd>' + esc(o.notes) + '</dd>' : '') +
      '</dl>' +
      '<ul>' + items + '</ul>' +
      '<p class="adm-order-total">סה״כ ' + money(o.total) +
        (Number(o.delivery_fee) ? ' <span class="adm-unit">(כולל משלוח ' + money(o.delivery_fee) + ')</span>' : '') +
        (o.promo_applied ? ' <span class="adm-promo-flag">סט מנות פתיחה במתנה</span>' : '') +
      '</p>' +
      '<div class="adm-order-foot">' +
        '<label for="st-' + esc(o.id) + '">סטטוס</label>' +
        '<select id="st-' + esc(o.id) + '" data-status="' + esc(o.id) + '">' +
          Object.keys(STATUS).map(k =>
            '<option value="' + k + '"' + (o.status === k ? ' selected' : '') + '>' + STATUS[k] + '</option>').join('') +
        '</select>' +
        '<span class="adm-msg" data-msg="' + esc(o.id) + '"></span>' +
      '</div>' +
    '</article>';
  }

  async function setStatus(id, status, sel) {
    const msg = document.querySelector('[data-msg="' + CSS.escape(id) + '"]');
    try {
      await window.Supa.rest('orders?id=eq.' + encodeURIComponent(id),
        { method: 'PATCH', body: { status: status } });
      sel.closest('.adm-order').dataset.status = status;
      say(msg, 'עודכן', 'ok');
    } catch (e) {
      say(msg, 'נכשל', 'error');
    }
  }

  /* ====================== הפעלה ====================== */
  async function start() {
    $('admRoot').innerHTML = '<p class="adm-empty">טוען…</p>';

    if (!(await window.Supa.isAdmin())) {
      /* ייתכן שהטוקן פג. ניסיון רענון אחד לפני שמחזירים למסך הכניסה. */
      await window.Supa.refresh();
      if (!(await window.Supa.isAdmin())) {
        window.Supa.signOut();
        loginScreen('המשתמש הזה לא מורשה לנהל את המערכת.');
        return;
      }
    }

    try {
      const [prod, set] = await Promise.all([
        window.Supa.rest('products?select=*&order=category.asc,sort.asc'),
        window.Supa.rest('settings?select=*&limit=1')
      ]);
      products = prod || [];
      settings = (set && set[0]) || null;
    } catch (e) {
      $('admRoot').innerHTML = '<p class="adm-msg is-error">טעינת הנתונים נכשלה: ' + esc(e.message) + '</p>';
      return;
    }

    let email = '';
    try {
      const s = JSON.parse(localStorage.getItem('cdb-admin-session') || '{}');
      email = (s.user && s.user.email) || '';
    } catch (e) { /* לא קריטי */ }

    shell(email);
    renderSettings();
    renderPrices();
  }

  function boot() {
    if (window.Supa.isSignedIn()) start();
    else loginScreen();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
