/* ==========================================================================
   order.js - הזמנת בשר במשקל
   --------------------------------------------------------------------------
   המחירון, הזמינות ומצב המערכת נמשכים מ-Supabase בכל טעינה, כדי שעדכון
   במסך הניהול ישפיע מיד בלי פריסה מחדש של האתר.

   ⚠️ הסכומים שמוצגים כאן הם תצוגה בלבד. הסכום המחייב מחושב בשרת בטריגר
      build_order, ולכן אי אפשר להזמין אנטריקוט בשקל גם אם משנים את ה-DOM.
   ========================================================================== */
(function () {
  const MAX_KG = 20;
  const MAX_UN = 50;

  let products = [];
  let settings = null;
  const cart  = Object.create(null);   /* slug → qty */
  const notes = Object.create(null);   /* slug → בקשה מיוחדת */
  const openNotes = new Set();         /* אילו שדות הערה פתוחים */

  /* קפיצת המשקל היא תכונה של הפריט: נתח בקר מובחר ב-100 גרם,
     כנפיים ופרגיות ב-50. ברירת מחדל שמרנית אם השדה חסר. */
  const stepOf = p => (p.unit === 'kg' ? (Number(p.step_g) || 100) / 1000 : 1);

  const lang = () => (window.I18n ? window.I18n.get() : 'he');
  const t    = k => (window.I18n ? window.I18n.t(k) : k);
  const $    = id => document.getElementById(id);

  /* ---------- עזרי תצוגה ---------- */
  const esc = s => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const money = n => '₪' + Number(n).toLocaleString('he-IL',
    { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });

  /* 0.75 → "750 גרם" | 1.5 → "1.5 ק\"ג" - קריא יותר מ-0.75 ק"ג.
     אפס מוצג כ-"0 ק״ג" ולא כקו מפריד: במובייל קו דק נקרא כשדה ריק
     ולא היה ברור שאפשר ללחוץ. */
  function qtyLabel(q, unit) {
    if (unit !== 'kg') return q + ' ' + t('ord.units');
    if (q === 0)       return '0 ' + t('ord.kg');
    if (q < 1)         return Math.round(q * 1000) + ' ' + t('ord.grams');
    return q + ' ' + t('ord.kg');
  }

  const pname = p => (lang() === 'en' ? p.name_en : p.name_he);
  const pnote = p => (lang() === 'en' ? p.note_en : p.note_he);

  /* ---------- טעינת נתונים ---------- */
  async function load() {
    const [prod, set] = await Promise.all([
      window.Supa.rest('products?select=*&order=category.asc,sort.asc'),
      window.Supa.rest('settings?select=*&limit=1')
    ]);
    products = prod || [];
    settings = (set && set[0]) || null;
  }

  /* ---------- מצבי המערכת ---------- */
  function notice(kind, html) {
    return '<div class="ord-notice ord-notice--' + kind + '">' + html + '</div>';
  }

  /* ---------- אופן המסירה ----------
     ⚠️ כששיטה אחת בלבד פעילה, מוצגת שורה ולא בורר: רדיו עם אפשרות
        יחידה נראה כמו בחירה שנשללה. הערך עדיין נשלח כ-input מוסתר,
        כדי ששאר הקוד ימשיך לקרוא אותו מאותו מקום. */
  function methodBlock() {
    const pick = !!settings.pickup_enabled;
    const deli = !!settings.delivery_enabled;
    const area = lang() === 'en' ? settings.delivery_area_en : settings.delivery_area_he;

    const radio = (val, title, sub, checked) =>
      '<label class="ord-radio"><input type="radio" name="ordMethod" value="' + val + '"' +
      (checked ? ' checked' : '') + '><span><strong>' + esc(title) + '</strong>' +
      '<small>' + esc(sub) + '</small></span></label>';

    if (pick && deli) {
      return '<fieldset class="ord-fs"><legend>' + esc(t('ord.method')) + '</legend>' +
        '<div class="ord-methods">' +
          radio('pickup', t('ord.pickup'), window.SITE.business.address, true) +
          radio('delivery', t('ord.delivery'), area + ' · ' + money(settings.delivery_fee), false) +
        '</div></fieldset>';
    }

    const only = pick ? 'pickup' : 'delivery';
    const title = pick ? t('ord.pickupOnly') : t('ord.delivery');
    const sub = pick ? window.SITE.business.address : area;
    return '<div class="ord-single-method">' +
        '<input type="radio" name="ordMethod" value="' + only + '" checked hidden>' +
        '<strong>' + esc(title) + '</strong><small>' + esc(sub) + '</small>' +
      '</div>';
  }

  /* ---------- מועד האיסוף ----------
     ⚠️ המשבצות נבנות מחלון הפתיחה שבהגדרות, ולא מרשימה קבועה בקוד.
        לשעה של היום מסוננות משבצות שכבר עברו או שקרובות מדי - זמן
        ההכנה המינימלי. אותה בדיקה בדיוק רצה שוב בשרת, כי שעון הדפדפן
        של הלקוח אינו מקור אמין. */
  const pad = n => String(n).padStart(2, '0');
  const toMin = hhmm => { const [h, m] = String(hhmm).split(':'); return (+h) * 60 + (+m); };

  function todayIL() {
    /* התאריך בישראל, לא במכשיר של הגולש */
    const p = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Jerusalem', year: 'numeric', month: '2-digit', day: '2-digit'
    }).format(new Date());
    return p;   /* YYYY-MM-DD */
  }

  function nowMinIL() {
    const p = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Jerusalem', hour: '2-digit', minute: '2-digit', hour12: false
    }).format(new Date());
    return toMin(p);
  }

  function slotsFor(dateStr) {
    const from = toMin(settings.pickup_from || '12:00');
    const to   = toMin(settings.pickup_to   || '22:30');
    const step = Number(settings.slot_minutes) || 30;
    const lead = Number(settings.lead_minutes) || 0;
    const earliest = (dateStr === todayIL()) ? nowMinIL() + lead : -1;

    const out = [];
    for (let m = from; m <= to; m += step) {
      if (m < earliest) continue;
      out.push(pad(Math.floor(m / 60)) + ':' + pad(m % 60));
    }
    return out;
  }

  function dateOptions() {
    const max = Number(settings.max_days_ahead) || 14;
    const base = new Date(todayIL() + 'T12:00:00');
    const out = [];
    for (let i = 0; i <= max; i++) {
      const d = new Date(base.getTime() + i * 86400000);
      const iso = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
      if (!slotsFor(iso).length) continue;        /* יום שכבר אין בו משבצת פנויה */
      const label = i === 0 ? t('ord.today') : i === 1 ? t('ord.tomorrow')
        : new Intl.DateTimeFormat(lang() === 'en' ? 'en-GB' : 'he-IL',
            { weekday: 'long', day: 'numeric', month: 'numeric', timeZone: 'Asia/Jerusalem' }).format(d);
      out.push({ iso: iso, label: label });
    }
    return out;
  }

  function pickupWhenBlock() {
    if (!settings.pickup_enabled) return '';
    const days = dateOptions();
    if (!days.length) {
      return '<p class="ord-msg is-error">' + esc(t('ord.noSlots')) + '</p>';
    }
    const slots = slotsFor(days[0].iso);
    return '<div id="ordWhenWrap" class="ord-grid2">' +
      '<div class="ord-field">' +
        '<label for="ordDate">' + esc(t('ord.pickupDate')) + '</label>' +
        '<select id="ordDate" required>' +
          days.map(d => '<option value="' + esc(d.iso) + '">' + esc(d.label) + '</option>').join('') +
        '</select>' +
      '</div>' +
      '<div class="ord-field">' +
        '<label for="ordTime">' + esc(t('ord.pickupTime')) + '</label>' +
        '<select id="ordTime" required>' +
          slots.map(s => '<option value="' + s + '">' + s + '</option>').join('') +
        '</select>' +
      '</div>' +
    '</div>';
  }

  /* בהחלפת תאריך - בונים מחדש את השעות, כי היום הנוכחי מוגבל בזמן ההכנה */
  function syncSlots() {
    const dEl = $('ordDate'), tEl = $('ordTime');
    if (!dEl || !tEl) return;
    const keep = tEl.value;
    const slots = slotsFor(dEl.value);
    tEl.innerHTML = slots.map(s => '<option value="' + s + '">' + s + '</option>').join('');
    if (slots.includes(keep)) tEl.value = keep;
  }

  function phoneBlock() {
    const B = window.SITE.business;
    return '<p class="ord-callrow">' +
      '<a class="btn btn--gold btn--lg" href="' + esc(B.phoneHref) + '">' +
      esc(t('ord.callNow')) + ' ' + esc(B.phone) + '</a></p>';
  }

  /* ---------- רשימת הפריטים ---------- */
  const CATS = [
    { id: 'meat',     titleKey: 'ord.catMeat',     subKey: 'ord.catMeatSub' },
    { id: 'starters', titleKey: 'ord.catStarters', subKey: 'ord.catStartersSub' },
    { id: 'extras',   titleKey: 'ord.catExtras',   subKey: 'ord.catExtrasSub' }
  ];

  function rowHtml(p) {
    const q    = cart[p.slug] || 0;
    const unit = p.unit === 'kg' ? t('ord.perKg') : t('ord.perUnit');
    const desc = pnote(p);
    const off  = !p.available;
    const open = openNotes.has(p.slug);
    const val  = notes[p.slug] || '';

    /* קפיצת המשקל מוצגת ליד המחיר - אחרת הלקוח לא יודע אם לחיצה
       מוסיפה 50 גרם או 250, והקפיצה שונה בין נתח לנתח. */
    const stepTxt = p.unit === 'kg'
      ? ' <small class="ord-item-step">' + esc(t('ord.stepOf').replace('{n}', p.step_g || 100)) + '</small>'
      : '';

    /* שדה "בקשה מיוחדת" - נפתח בלחיצה כדי לא להציג עשרים תיבות טקסט */
    const noteBox = (!off && p.allow_note)
      ? '<div class="ord-note">' +
          (open || val
            ? '<label class="ord-note-lab" for="note-' + esc(p.slug) + '">' + esc(t('ord.noteLabel')) + '</label>' +
              '<textarea id="note-' + esc(p.slug) + '" class="ord-note-in" data-note="' + esc(p.slug) + '" ' +
                'rows="2" maxlength="200" placeholder="' + esc(t('ord.notePlaceholder')) + '">' + esc(val) + '</textarea>'
            : '<button type="button" class="ord-note-open" data-note-open="' + esc(p.slug) + '">+ ' +
                esc(t('ord.noteAdd')) + '</button>') +
        '</div>'
      : '';

    return '' +
      '<li class="ord-item' + (off ? ' is-off' : '') + (q ? ' is-picked' : '') + '" data-slug="' + esc(p.slug) + '">' +
        '<div class="ord-item-main">' +
          '<p class="ord-item-name">' + esc(pname(p)) + '</p>' +
          (desc ? '<p class="ord-item-note">' + esc(desc) + '</p>' : '') +
        '</div>' +
        '<p class="ord-item-price"><span>' + money(p.price) + '</span> <small>' + esc(unit) + '</small>' + stepTxt + '</p>' +
        (off
          ? '<p class="ord-item-off">' + esc(t('ord.soldOut')) + '</p>'
          : '<div class="ord-step" role="group" aria-label="' + esc(pname(p)) + '">' +
              '<button type="button" class="ord-step-btn ord-step-btn--dec" data-act="dec" aria-label="' + esc(t('ord.less')) + '"' + (q ? '' : ' disabled') + '>&minus;</button>' +
              '<span class="ord-step-val" aria-live="polite">' + esc(qtyLabel(q, p.unit)) + '</span>' +
              '<button type="button" class="ord-step-btn ord-step-btn--inc" data-act="inc" aria-label="' + esc(t('ord.more')) + '">+</button>' +
            '</div>') +
        noteBox +
      '</li>';
  }

  function renderList() {
    const host = $('ordList');
    host.innerHTML = CATS.map(c => {
      const items = products.filter(p => p.category === c.id);
      if (!items.length) return '';
      return '<section class="ord-cat">' +
        '<h2>' + esc(t(c.titleKey)) + '</h2>' +
        '<p class="ord-cat-sub">' + esc(t(c.subKey)) + '</p>' +
        '<ul class="ord-items">' + items.map(rowHtml).join('') + '</ul>' +
      '</section>';
    }).join('');
  }

  /* ---------- העגלה ---------- */
  function totals() {
    let sub = 0, meat = 0;
    const lines = [];
    products.forEach(p => {
      const q = cart[p.slug];
      if (!q) return;
      const line = p.price * q;
      sub += line;
      if (p.category === 'meat' && !p.no_discount) meat += line;
      lines.push({ p: p, q: q, line: line });
    });
    const method = (document.querySelector('input[name="ordMethod"]:checked') || {}).value || 'pickup';
    const fee = (method === 'delivery' && settings) ? Number(settings.delivery_fee) : 0;
    return { lines: lines, sub: sub, meat: meat, fee: fee, total: sub + fee, method: method };
  }

  function renderCart() {
    const T = totals();
    const host = $('ordCart');

    if (!T.lines.length) {
      host.innerHTML = '<p class="ord-empty">' + esc(t('ord.empty')) + '</p>';
      $('ordSubmit').disabled = true;
      return;
    }

    const rows = T.lines.map(l => {
      const n = (notes[l.p.slug] || '').trim();
      return '<li><span class="ord-sum-name">' + esc(pname(l.p)) +
        (n ? '<em class="ord-sum-note">' + esc(n) + '</em>' : '') + '</span>' +
        '<span class="ord-sum-qty">' + esc(qtyLabel(l.q, l.p.unit)) + '</span>' +
        '<span class="ord-sum-line">' + money(l.line) + '</span></li>';
    }).join('');

    const promoOn = settings && settings.promo_enabled && T.meat >= Number(settings.promo_threshold);
    const gap = settings ? Number(settings.promo_threshold) - T.meat : 0;

    host.innerHTML =
      '<ul class="ord-sum">' + rows + '</ul>' +
      '<dl class="ord-tot">' +
        '<div><dt>' + esc(t('ord.subtotal')) + '</dt><dd>' + money(T.sub) + '</dd></div>' +
        (T.fee ? '<div><dt>' + esc(t('ord.deliveryFee')) + '</dt><dd>' + money(T.fee) + '</dd></div>' : '') +
        '<div class="ord-tot-grand"><dt>' + esc(t('ord.total')) + '</dt><dd>' + money(T.total) + '</dd></div>' +
      '</dl>' +
      (settings && settings.promo_enabled
        ? (promoOn
            ? '<p class="ord-promo is-on">' + esc(lang() === 'en' ? settings.promo_en : settings.promo_he) + '</p>'
            : '<p class="ord-promo">' + esc(t('ord.promoGap').replace('{sum}', money(gap))) + '</p>')
        : '');

    $('ordSubmit').disabled = false;
  }

  function refreshRow(slug) {
    const p = products.find(x => x.slug === slug);
    const li = document.querySelector('.ord-item[data-slug="' + CSS.escape(slug) + '"]');
    if (p && li) li.outerHTML = rowHtml(p);
  }

  function bump(slug, dir) {
    const p = products.find(x => x.slug === slug);
    if (!p || !p.available) return;
    const step = stepOf(p);
    const max  = p.unit === 'kg' ? MAX_KG : MAX_UN;
    /* שלוש ספרות אחרי הנקודה: קפיצה של 50 גרם היא 0.05, ובלי
       העיגול הזה חיבור חוזר של שברים בינאריים יוצר 0.15000000000000002. */
    let q = Math.round(((cart[p.slug] || 0) + dir * step) * 1000) / 1000;
    if (q <= 0) delete cart[p.slug];
    else cart[p.slug] = Math.min(q, max);
    refreshRow(slug);
    renderCart();
  }

  /* ---------- שליחה ---------- */
  const ERRORS = {
    ORDERING_CLOSED:  'ord.errClosed',
    ITEM_UNAVAILABLE: 'ord.errItem',
    QTY_STEP:         'ord.errQty',
    QTY_UNITS:        'ord.errQty',
    QTY_INVALID:      'ord.errQty',
    ADDRESS_REQUIRED: 'ord.errAddress',
    DELIVERY_DISABLED:'ord.errDelivery',
    PICKUP_DISABLED:  'ord.errPickup',
    BELOW_MINIMUM:    'ord.errMinimum',
    PICKUP_TIME_REQUIRED: 'ord.errWhen',
    PICKUP_DATE_PAST: 'ord.errWhenPast',
    PICKUP_DATE_FAR:  'ord.errWhenFar',
    PICKUP_TIME_CLOSED: 'ord.errWhenClosed',
    PICKUP_TOO_SOON:  'ord.errWhenSoon'
  };

  async function submit(e) {
    e.preventDefault();
    const T = totals();
    if (!T.lines.length) return;

    const btn = $('ordSubmit');
    const msg = $('ordMsg');
    btn.disabled = true;
    btn.classList.add('is-busy');
    msg.textContent = '';
    msg.className = 'ord-msg';

    /* ⚠️ דרך RPC ולא INSERT ישיר. לאורח אין הרשאת קריאה על טבלת ההזמנות
       (היא מכילה שם, טלפון וכתובת), ולכן INSERT...RETURNING היה נדחה.
       place_order רצה בשרת, מכניסה את השורה ומחזירה רק את מספר ההזמנה
       והסכומים. נשלחים רק slug וכמות - המחירים נקבעים בשרת. */
    const payload = {
      p_name:    $('ordName').value.trim(),
      p_phone:   $('ordPhone').value.trim(),
      p_method:  T.method,
      p_address: T.method === 'delivery' ? $('ordAddress').value.trim() : null,
      p_notes:   $('ordNotes').value.trim() || null,
      p_pickup_date: T.method === 'pickup' && $('ordDate') ? $('ordDate').value : null,
      p_pickup_time: T.method === 'pickup' && $('ordTime') ? $('ordTime').value : null,
      p_items:   T.lines.map(l => {
        const o = { slug: l.p.slug, qty: l.q };
        const n = (notes[l.p.slug] || '').trim();
        if (n && l.p.allow_note) o.note = n.slice(0, 200);
        return o;
      })
    };

    try {
      const o = await window.Supa.rest('rpc/place_order', { method: 'POST', body: payload });
      done(o);
    } catch (err) {
      const key = ERRORS[err.code];
      msg.textContent = key ? t(key) : t('ord.errGeneric');
      msg.className = 'ord-msg is-error';
      btn.disabled = false;
      btn.classList.remove('is-busy');
      /* אם המערכת נסגרה בזמן שהדף היה פתוח - לרענן את המצב */
      if (err.code === 'ORDERING_CLOSED') setTimeout(() => location.reload(), 2500);
    }
  }

  function done(o) {
    const B = window.SITE.business;
    const lead = settings ? (lang() === 'en' ? settings.lead_time_en : settings.lead_time_he) : '';
    $('ordMain').innerHTML =
      '<div class="ord-done">' +
        '<p class="ord-done-mark" aria-hidden="true">✓</p>' +
        '<h2>' + esc(t('ord.doneTitle')) + '</h2>' +
        (o && o.ref ? '<p class="ord-done-ref">' + esc(t('ord.doneRef')) + ' <strong>' + esc(o.ref) + '</strong></p>' : '') +
        (o && o.pickup_date
          ? '<p class="ord-done-when">' + esc(t('ord.doneWhen')) + ' <strong>' +
            esc(new Intl.DateTimeFormat(lang() === 'en' ? 'en-GB' : 'he-IL',
                { weekday: 'long', day: 'numeric', month: 'numeric' })
                .format(new Date(o.pickup_date + 'T12:00:00'))) +
            ', ' + esc(o.pickup_time || '') + '</strong></p>' : '') +
        '<p>' + esc(t('ord.doneText')) + '</p>' +
        (lead ? '<p class="ord-done-lead">' + esc(lead) + '</p>' : '') +
        '<p class="ord-callrow">' +
          '<a class="btn btn--gold" href="' + esc(B.phoneHref) + '">' + esc(B.phone) + '</a>' +
          '<a class="btn btn--ghost" href="index.html" data-i18n="ord.backHome">' + esc(t('ord.backHome')) + '</a>' +
        '</p>' +
      '</div>';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---------- אופן המסירה ---------- */
  function syncMethod() {
    const m = (document.querySelector('input[name="ordMethod"]:checked') || {}).value;
    const wrap = $('ordAddressWrap');
    const on = m === 'delivery';
    wrap.hidden = !on;
    $('ordAddress').required = on;
    const when = $('ordWhenWrap');
    if (when) {
      when.hidden = on;
      if ($('ordDate')) $('ordDate').required = !on;
      if ($('ordTime')) $('ordTime').required = !on;
    }
    renderCart();
  }

  /* ---------- הרכבה ---------- */
  function wire() {
    const list = $('ordList');
    list.addEventListener('click', ev => {
      const open = ev.target.closest('[data-note-open]');
      if (open) {
        const slug = open.dataset.noteOpen;
        openNotes.add(slug);
        refreshRow(slug);
        const box = list.querySelector('[data-note="' + CSS.escape(slug) + '"]');
        if (box) box.focus();
        return;
      }
      const btn = ev.target.closest('.ord-step-btn');
      if (!btn) return;
      bump(btn.closest('.ord-item').dataset.slug, btn.dataset.act === 'inc' ? 1 : -1);
    });

    /* ⚠️ בלי רינדור מחדש בזמן הקלדה - הוא היה גוזל את המיקוד מהשדה */
    list.addEventListener('input', ev => {
      const box = ev.target.closest('[data-note]');
      if (box) notes[box.dataset.note] = box.value;
    });
    document.querySelectorAll('input[name="ordMethod"]').forEach(r =>
      r.addEventListener('change', syncMethod));
    if ($('ordDate')) $('ordDate').addEventListener('change', syncSlots);
    $('ordForm').addEventListener('submit', submit);
  }

  function renderShell() {
    const root = $('ordMain');
    const B = window.SITE.business;

    if (!settings || settings.ordering_mode === 'off') {
      const txt = settings ? (lang() === 'en' ? settings.closed_en : settings.closed_he) : t('ord.errGeneric');
      root.innerHTML = notice('closed', '<h2>' + esc(t('ord.closedTitle')) + '</h2><p>' + esc(txt) + '</p>') + phoneBlock();
      return 'off';
    }

    /* מצב טלפוני: המחירון מוצג, הסל לא */
    const phoneOnly = settings.ordering_mode === 'phone';

    root.innerHTML =
      (settings.notice_he || settings.notice_en
        ? notice('info', esc(lang() === 'en' ? settings.notice_en : settings.notice_he)) : '') +
      (phoneOnly
        ? notice('phone', '<h2>' + esc(t('ord.phoneTitle')) + '</h2><p>' + esc(t('ord.phoneText')) + '</p>') + phoneBlock()
        : '') +
      '<div id="ordList" class="ord-list"></div>' +
      (phoneOnly ? phoneBlock() : '' +
        '<form id="ordForm" class="ord-form" novalidate>' +
          '<h2>' + esc(t('ord.yourOrder')) + '</h2>' +
          '<div id="ordCart" class="ord-cart"></div>' +

          methodBlock() +

          pickupWhenBlock() +

          '<div id="ordAddressWrap" class="ord-field" hidden>' +
            '<label for="ordAddress">' + esc(t('ord.address')) + '</label>' +
            '<input id="ordAddress" name="address" type="text" autocomplete="street-address" maxlength="300">' +
          '</div>' +

          '<div class="ord-grid2">' +
            '<div class="ord-field">' +
              '<label for="ordName">' + esc(t('ord.name')) + '</label>' +
              '<input id="ordName" name="name" type="text" required autocomplete="name" maxlength="80">' +
            '</div>' +
            '<div class="ord-field">' +
              '<label for="ordPhone">' + esc(t('ord.phone')) + '</label>' +
              '<input id="ordPhone" name="phone" type="tel" required autocomplete="tel" maxlength="25" dir="ltr">' +
            '</div>' +
          '</div>' +

          '<div class="ord-field">' +
            '<label for="ordNotes">' + esc(t('ord.notes')) + '</label>' +
            '<textarea id="ordNotes" name="notes" rows="3" maxlength="600"></textarea>' +
          '</div>' +

          '<p class="ord-pay">' + esc(t('ord.payNote')) + '</p>' +
          '<p id="ordMsg" class="ord-msg" role="status" aria-live="polite"></p>' +
          '<button id="ordSubmit" class="btn btn--gold btn--lg" type="submit" disabled>' +
            esc(t('ord.send')) + '</button>' +
          '<p class="ord-legal">' + esc(t('ord.legal')) +
            ' <a href="privacy.html">' + esc(t('ord.privacy')) + '</a>.</p>' +
        '</form>');

    /* ⚠️ מחזיר את המצב, לא בוליאני. במצב 'phone' המחירון עדיין נבנה -
       רק הסל והטופס לא. הגרסה הקודמת החזירה false ודילגה גם על המחירון,
       כך שהדף הציג "המחירון כאן מעודכן" מעל רשימה ריקה. */
    return phoneOnly ? 'phone' : 'online';
  }

  function paint() {
    const mode = renderShell();
    if (mode === 'off') return;
    renderList();
    if (mode === 'online') {
      renderCart();
      wire();
      syncMethod();
    }
  }

  async function boot() {
    try {
      await load();
    } catch (e) {
      $('ordMain').innerHTML = notice('closed',
        '<h2>' + esc(t('ord.offlineTitle')) + '</h2><p>' + esc(t('ord.offlineText')) + '</p>') + phoneBlock();
      return;
    }
    paint();
  }

  document.addEventListener('langchange', () => { if (settings) paint(); });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
