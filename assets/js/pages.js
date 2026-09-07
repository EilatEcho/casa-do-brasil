/* ==========================================================================
   pages.js - רינדור הדפים הפנימיים מתוך config.js
   --------------------------------------------------------------------------
   דף אחד = מארח אחד ב-HTML. הסקריפט מזהה מי מהמארחים קיים בדף הנוכחי
   ומרנדר רק אותו:

     #butcherRoot   קצביה          #vipRoot      VIP
     #faqRoot       שאלות נפוצות   #friendsRoot  CASA FRIENDS
     #benefitsRoot  הטבות          #blogRoot     רשימת המאמרים
                                    #postRoot     מאמר בודד

   ⚠️ render() רצה מתוך renderDynamic() ב-app.js, לפני initReveal().
   אלמנט .reveal שנוצר אחרי שה-observer רץ יישאר שקוף לנצח.
   ========================================================================== */
window.Pages = (function () {

  const esc = s => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const lang = () => (window.I18n ? window.I18n.get() : 'he');
  const t    = k => (window.I18n ? window.I18n.t(k) : k);
  const L    = o => (o ? (o[lang()] || o.he) : null);
  const S    = () => window.SITE;
  const R    = () => (window.ROOT || '');
  const I    = () => window.ICON;

  /* כותרת סקשן אחידה לכל הדפים הפנימיים */
  function head(title, sub, id) {
    return `
    <header class="pg-head reveal">
      <h2${id ? ` id="${id}"` : ''}>${esc(title)}</h2>
      ${sub ? `<p>${esc(sub)}</p>` : ''}
    </header>`;
  }

  /* שורת פעולה חוזרת: טלפון + הזמנת שולחן */
  function actions(extra) {
    const s = S();
    return `
    <div class="pg-actions reveal">
      <a class="btn btn--gold" href="${s.links.reserve}" target="_blank" rel="noopener noreferrer">
        ${I().calendar}<span>${esc(t('pg.reserve'))}</span>
      </a>
      <a class="btn btn--ghost" href="${s.business.phoneHref}">
        ${I().phone}<span>${esc(s.business.phone)}</span>
      </a>
      ${extra || ''}
    </div>`;
  }

  /* ======================================================================
     1. קצביה
     ====================================================================== */
  function butcher(host) {
    const b = S().butcher, d = L(b), off = L(b.offer);
    const star = ' <span class="pg-star" aria-hidden="true">*</span>';

    const cuts = b.cuts.map((c, i) => {
      const note = c[lang() === 'en' ? 'enNote' : 'heNote'];
      const unit = c.unitHe ? (lang() === 'en' ? c.unitEn : c.unitHe) : t('pg.perKg');
      return `
      <li class="pg-price-row reveal" style="--reveal-delay:${Math.min(i, 7) * 40}ms">
        <span class="pg-price-name">${esc(c[lang()] || c.he)}${c.noDiscount ? star : ''}</span>
        <span class="menu-dots" aria-hidden="true"></span>
        <span class="pg-price-val"><b><i>₪</i>${esc(c.price)}</b><em>${esc(unit)}</em></span>
        ${note ? `<span class="pg-price-note">${esc(note)}</span>` : ''}
      </li>`;
    }).join('');

    const extras = b.extras.map(e => {
      const x = L(e);
      return `
      <li class="pg-extra reveal">
        <p class="pg-extra-head">
          <span class="pg-price-name">${esc(x[0])}</span>
          <span class="menu-dots" aria-hidden="true"></span>
          <span class="pg-price-val"><b><i>₪</i>${esc(e.price)}</b></span>
        </p>
        <p class="pg-extra-desc">${esc(x[1])}</p>
      </li>`;
    }).join('');

    host.innerHTML = `
    <section class="section">
      <div class="container container--narrow">
        ${head(d[0], d[1], 'butcherTitle')}

        <p class="pg-offer reveal">
          ${I().flame}
          <strong>${esc(off[0])}</strong>
          <span>${esc(off[1])}</span>
        </p>

        <ul class="pg-price-list">${cuts}</ul>

        <h3 class="pg-sub reveal">${esc(t('pg.extrasTitle'))}</h3>
        <ul class="pg-extras">${extras}</ul>

        ${notes(L(b.notes))}
        ${actions()}
      </div>
    </section>`;
  }

  function notes(list) {
    if (!list || !list.length) return '';
    return `
    <div class="pg-notes reveal">
      <h3>${esc(t('pg.notesTitle'))}</h3>
      <ul>${list.map(n => `<li>${esc(n)}</li>`).join('')}</ul>
    </div>`;
  }

  /* ======================================================================
     2. שאלות נפוצות - אקורדיון נגיש (button + aria-expanded + hidden)
     ====================================================================== */
  function faq(host) {
    const f = S().faq, d = L(f), foot = L(f.foot);

    const items = f.items.map((item, i) => {
      const q = L(item);
      return `
      <li class="pg-acc-item reveal" style="--reveal-delay:${Math.min(i, 6) * 45}ms">
        <h3>
          <button type="button" class="pg-acc-btn" aria-expanded="false" aria-controls="acc-${i}">
            <span>${esc(q[0])}</span>
            <span class="pg-acc-icon" aria-hidden="true"></span>
          </button>
        </h3>
        <div class="pg-acc-panel" id="acc-${i}" hidden><p>${esc(q[1])}</p></div>
      </li>`;
    }).join('');

    host.innerHTML = `
    <section class="section">
      <div class="container container--narrow">
        ${head(d[0], d[1], 'faqTitle')}
        <ul class="pg-acc">${items}</ul>

        <div class="pg-cta reveal">
          <h3>${esc(foot[0])}</h3>
          <p>${esc(foot[1])}</p>
          <a class="btn btn--gold" href="${S().business.phoneHref}">
            ${I().phone}<span>${esc(S().business.phone)}</span>
          </a>
        </div>
      </div>
    </section>`;

    wireAccordion(host);
    faqSchema(f);
  }

  function wireAccordion(host) {
    host.querySelectorAll('.pg-acc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const panel = document.getElementById(btn.getAttribute('aria-controls'));
        const open  = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        panel.hidden = open;
        btn.closest('.pg-acc-item').classList.toggle('is-open', !open);
      });
    });
  }

  /* JSON-LD מסוג FAQPage - מה שמזכה בתצוגת שאלות נפוצות בתוצאות החיפוש */
  function faqSchema(f) {
    const old = document.getElementById('faqSchema');
    if (old) old.remove();
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.id = 'faqSchema';
    s.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: f.items.map(item => {
        const q = L(item);
        return { '@type': 'Question', name: q[0],
                 acceptedAnswer: { '@type': 'Answer', text: q[1] } };
      })
    });
    document.head.appendChild(s);
  }

  /* ======================================================================
     3. הטבות
     ====================================================================== */
  function benefits(host) {
    const b = S().benefits, d = L(b), g = L(b.gift), c = L(b.cards);

    const house = b.house.map((h, i) => {
      const x = L(h);
      return `
      <article class="pg-card reveal" style="--reveal-delay:${i * 90}ms">
        <span class="pg-card-icon" aria-hidden="true">${I().glass}</span>
        <h3>${esc(x[0])}</h3>
        <p>${esc(x[1])}</p>
        <p class="pg-fine">${esc(x[2])}</p>
      </article>`;
    }).join('');

    const gifts = b.gift.cards.map(card => `
      <li class="pg-gift reveal">
        <b>${esc(card.name)}</b>
        <span>${esc(card[lang()] || card.he)}</span>
      </li>`).join('');

    const list = c[2].map(x => `<li>${I().check}<span>${esc(x)}</span></li>`).join('');

    host.innerHTML = `
    <section class="section">
      <div class="container container--narrow">
        ${head(d[0], d[1], 'benefitsTitle')}
        <div class="pg-cards pg-cards--2">${house}</div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container container--narrow">
        ${head(g[0], g[1])}
        <ul class="pg-gifts">${gifts}</ul>

        <h3 class="pg-sub reveal">${esc(c[0])}</h3>
        <p class="pg-lead reveal">${esc(c[1])}</p>
        <ul class="pg-ticks reveal">${list}</ul>

        <p class="pg-fine pg-fine--block reveal">${esc(L(b.note))}</p>
        ${actions()}
      </div>
    </section>`;
  }

  /* ======================================================================
     4. VIP
     ====================================================================== */
  function vip(host) {
    const v = S().vip, d = L(v), soon = L(v.soonText);

    const feats = v.features.map((f, i) => {
      const x = L(f);
      return `
      <article class="pg-card reveal" style="--reveal-delay:${Math.min(i, 5) * 70}ms">
        <span class="pg-card-icon" aria-hidden="true">${I().crown}</span>
        <h3>${esc(x[0])}</h3>
        <p>${esc(x[1])}</p>
      </article>`;
    }).join('');

    host.innerHTML = `
    <section class="section">
      <div class="container">
        ${head(d[0], d[1], 'vipTitle')}
        <div class="pg-cards pg-cards--3">${feats}</div>
      </div>
    </section>

    ${v.soon ? `
    <section class="section section--alt">
      <div class="container container--narrow">
        <div class="pg-cta pg-cta--soon reveal">
          <p class="pg-badge">${esc(soon[0])}</p>
          <p>${esc(soon[1])}</p>
          <a class="btn btn--gold" href="${S().business.phoneHref}">
            ${I().phone}<span>${esc(S().business.phone)}</span>
          </a>
        </div>
      </div>
    </section>` : `
    <section class="section section--alt">
      <div class="container container--narrow">${actions()}</div>
    </section>`}`;
  }

  /* ======================================================================
     5. CASA FRIENDS
     ====================================================================== */
  function friends(host) {
    const f = S().friends, d = L(f);

    const perks = f.perks.map((p, i) => {
      const x = L(p);
      return `
      <article class="pg-card reveal" style="--reveal-delay:${i * 80}ms">
        <span class="pg-card-icon" aria-hidden="true">${I().star}</span>
        <h3>${esc(x[0])}</h3>
        <p>${esc(x[1])}</p>
      </article>`;
    }).join('');

    const steps = f.steps.map((s, i) => {
      const x = L(s);
      return `
      <li class="pg-step reveal" style="--reveal-delay:${i * 90}ms">
        <span class="pg-step-num" aria-hidden="true">${i + 1}</span>
        <h3>${esc(x[0])}</h3>
        <p>${esc(x[1])}</p>
      </li>`;
    }).join('');

    host.innerHTML = `
    <section class="section">
      <div class="container">
        ${head(d[0], d[1], 'friendsTitle')}
        <div class="pg-cards pg-cards--4">${perks}</div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container container--narrow">
        ${head(t('pg.howTitle'))}
        <ol class="pg-steps">${steps}</ol>

        <!-- ==============================================================
             טופס ההרשמה למועדון ייכנס כאן.
             עד שיהיה שרת שיקבל אותו, ההצטרפות מתבצעת בטלפון.
             ============================================================== -->
        <div class="pg-cta reveal">
          <h3>${esc(t('pg.joinTitle'))}</h3>
          <p>${esc(t('pg.joinSoon'))}</p>
          <a class="btn btn--gold" href="${S().business.phoneHref}">
            ${I().phone}<span>${esc(S().business.phone)}</span>
          </a>
        </div>

        <p class="pg-fine pg-fine--block reveal">${esc(L(f.note))}</p>
      </div>
    </section>`;
  }

  /* ======================================================================
     6. בלוג - רשימה עם חיפוש וטעינה מדורגת
     ====================================================================== */
  let shown = 0, filtered = [];

  function blog(host) {
    const b = S().blog, d = L(b);
    const posts = window.POSTS || [];

    host.innerHTML = `
    <section class="section">
      <div class="container">
        ${head(d[0], d[1], 'blogTitle')}

        <div class="pg-blog-bar reveal">
          <label class="pg-search">
            <span class="sr-only">${esc(t('pg.search'))}</span>
            ${I().search}
            <input type="search" id="blogSearch" placeholder="${esc(t('pg.search'))}" autocomplete="off">
          </label>
          <p class="pg-count"><b id="blogCount">${posts.length}</b> ${esc(t('pg.postsCount'))}</p>
        </div>

        <ul class="pg-posts" id="blogList"></ul>
        <p class="pg-empty" id="blogEmpty" hidden>${esc(t('pg.searchNone'))}</p>

        <div class="pg-more">
          <button type="button" class="btn btn--ghost" id="blogMore" hidden>
            <span>${esc(t('pg.loadMore'))}</span>
          </button>
        </div>
      </div>
    </section>`;

    filtered = posts;
    shown = 0;
    paint(true);

    const search = document.getElementById('blogSearch');
    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      filtered = !q ? posts : posts.filter(p =>
        (p.title + ' ' + p.desc).toLowerCase().includes(q));
      shown = 0;
      paint(true);
    });

    document.getElementById('blogMore').addEventListener('click', () => paint(false));
  }

  function paint(reset) {
    const b = S().blog;
    const list  = document.getElementById('blogList');
    const more  = document.getElementById('blogMore');
    const empty = document.getElementById('blogEmpty');
    const count = document.getElementById('blogCount');
    if (!list) return;

    if (reset) list.innerHTML = '';
    const next = filtered.slice(shown, shown + b.perPage);
    shown += next.length;

    list.insertAdjacentHTML('beforeend', next.map((p, i) => `
      <li class="pg-post reveal" style="--reveal-delay:${(i % 3) * 70}ms">
        <a href="${R()}post/${encodeURIComponent(p.slug)}.html">
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.desc)}</p>
          <span class="link-underline">${esc(t('pg.readMore'))}${I().arrow}</span>
        </a>
      </li>`).join(''));

    count.textContent = filtered.length;
    empty.hidden = filtered.length > 0;
    more.hidden  = shown >= filtered.length;

    /* הכרטיסים שנוספו עכשיו לא נצפו על ידי ה-observer המקורי - מציגים מיד */
    if (!reset) list.querySelectorAll('.reveal:not(.is-visible)')
      .forEach(el => el.classList.add('is-visible'));
  }

  /* ======================================================================
     7. מאמר בודד
     ====================================================================== */
  function post(host) {
    const slug = new URLSearchParams(location.search).get('p');
    const posts = window.POSTS || [];
    const idx = posts.findIndex(p => p.slug === slug);
    const p = idx > -1 ? posts[idx] : null;

    if (!p) {
      host.innerHTML = `
      <section class="section">
        <div class="container container--narrow">
          <div class="pg-cta reveal">
            <h3>${esc(t('page.soon'))}</h3>
            <p>${esc(t('pg.searchNone'))}</p>
            <a class="btn btn--gold" href="${R()}blog.html"><span>${esc(t('pg.backToBlog'))}</span></a>
          </div>
        </div>
      </section>`;
      return;
    }

    const body = p.blocks.map(bl => {
      if (bl.t === 'h2') return `<h2>${esc(bl.x)}</h2>`;
      if (bl.t === 'ul')  return `<ul>${bl.x.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
      return `<p>${esc(bl.x)}</p>`;
    }).join('');

    /* שלושה מאמרים נוספים, מיד אחרי הנוכחי ובמעגל */
    const more = [1, 2, 3].map(k => posts[(idx + k) % posts.length])
      .filter(x => x && x.slug !== p.slug);

    host.innerHTML = `
    <article class="section">
      <div class="container container--narrow">
        <nav class="breadcrumbs reveal" aria-label="${esc(t('pg.backToBlog'))}">
          <ol>
            <li><a href="${R()}index.html" data-i18n-nav="home">${esc(S().nav[0][lang()])}</a></li>
            <li><a href="${R()}blog.html" data-i18n-nav="blog">${esc(S().nav.find(n => n.key === 'blog')[lang()])}</a></li>
          </ol>
        </nav>

        <h1 class="pg-post-title reveal">${esc(p.title)}</h1>
        <div class="prose pg-prose reveal">${body}</div>

        <div class="pg-actions reveal">
          <a class="btn btn--ghost" href="${R()}blog.html"><span>${esc(t('pg.backToBlog'))}</span></a>
          <a class="btn btn--gold" href="${S().links.reserve}" target="_blank" rel="noopener noreferrer">
            ${I().calendar}<span>${esc(t('pg.reserve'))}</span>
          </a>
        </div>
      </div>
    </article>

    <section class="section section--alt">
      <div class="container">
        ${head(t('pg.more'))}
        <ul class="pg-posts">
          ${more.map((m, i) => `
          <li class="pg-post reveal" style="--reveal-delay:${i * 70}ms">
            <a href="${R()}post/${encodeURIComponent(m.slug)}.html">
              <h3>${esc(m.title)}</h3>
              <p>${esc(m.desc)}</p>
              <span class="link-underline">${esc(t('pg.readMore'))}${I().arrow}</span>
            </a>
          </li>`).join('')}
        </ul>
      </div>
    </section>`;

    document.title = p.title + ' | ' + (lang() === 'en' ? S().business.nameEn : S().business.name);
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', p.desc);
  }

  /* ======================================================================
     ניתוב: מרנדרים רק את המארח שקיים בדף
     ====================================================================== */
  const ROUTES = {
    butcherRoot:  butcher,
    faqRoot:      faq,
    benefitsRoot: benefits,
    vipRoot:      vip,
    friendsRoot:  friends,
    blogRoot:     blog,
    postRoot:     post
  };

  /* כותרת הדף וההסבר מתחתיה נלקחים מאותו מקום שממנו נבנה הגוף,
     לפי data-page על ה-body. כך אין כפילות טקסט בין ה-HTML ל-config. */
  function paintHero() {
    const key = document.body.dataset.page;
    if (!key || !S()[key]) return;
    const d = L(S()[key]);
    if (!d) return;

    document.querySelectorAll('[data-page-title]').forEach(e => { e.textContent = d[0]; });
    document.querySelectorAll('[data-page-desc]').forEach(e => { e.textContent = d[1]; });
    document.title = d[0] + ' | ' + (lang() === 'en' ? S().business.nameEn : S().business.name);
    const meta = document.querySelector('meta[name="description"]');
    if (meta && d[1]) meta.setAttribute('content', d[1]);
  }

  function render() {
    if (!window.SITE) return;
    paintHero();
    Object.keys(ROUTES).forEach(id => {
      const host = document.getElementById(id);
      if (host) ROUTES[id](host);
    });
  }

  return { render };
})();
