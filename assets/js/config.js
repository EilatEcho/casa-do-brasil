/* ==========================================================================
   config.js - מקור האמת היחיד לתוכן האתר
   --------------------------------------------------------------------------
   כאן משנים: פרטי קשר, קישורים, מסלולי הצ'ורסקריה, המלצות, ותרגומים.
   אין צורך לגעת ב-HTML כדי לעדכן טקסט.
   ========================================================================== */

/* ==========================================================================
   ROOT - קידומת לנתיבים פנימיים.
   דף בשורש: '' . דף בתת-תיקייה (post/<slug>.html): '../'
   נקבע מ-<body data-root="../">. כל קישור פנימי שנבנה ב-JS חייב לעבור דרכו,
   אחרת הוא יישבר בדפי הבלוג הסטטיים.
   ========================================================================== */
window.ROOT = (document.body && document.body.dataset.root) || '';

window.SITE = {

  /* ---------- פרטי העסק ---------- */
  business: {
    name:     'קאזה דו ברזיל',
    nameEn:   'Casa do Brasil',
    phone:    '08-6323032',
    /* בפורמט בינלאומי בכוונה - כך החיוג עובד גם ממכשיר של תייר בחו"ל.
       התצוגה למשתמש נשארת 08-6323032. */
    phoneHref:'tel:+97286323032',
    /* ⚠️ קו נייח - לא בהכרח פעיל בוואטסאפ. כרגע לא בשימוש בשום מקום באתר.
       להפעלה: לעדכן למספר נייד עסקי ולהוסיף קישור בסרגל הסושיאל שב-partials.js */
    whatsapp: 'https://wa.me/97286323032',
    address:  'דרך הערבה 23, אילת (מתחם מלון איסלה בראון)',
    addressEn:'23 Derech HaArava, Eilat (Isla Brown Hotel complex)',
    waze:     'https://waze.com/ul?ll=29.5588148,34.95681&navigate=yes',
    maps:     'https://www.google.com/maps/search/Casa+do+Brasil+Eilat',
    hours:    'ראשון - שבת | 12:00 - 23:00',
    hoursEn:  'Sunday - Saturday | 12:00 - 23:00',
    email:    'info@casadobrasil.co.il'
  },

  /* ---------- קישורים חיצוניים ---------- */
  links: {
    reserve:  'https://tabitisrael.co.il/online-reservations/create-reservation?step=search&orgId=619bae58c6a7c716a41bdc73',
    instagram:'https://www.instagram.com/casadobrasill/',
    facebook: 'https://www.facebook.com/casadobrasil',
    tiktok:   'https://www.tiktok.com/@casadobrasileilat',
    reviews:  'https://www.google.com/maps/search/Casa+do+Brasil+Eilat'
  },

  /* ---------- מדיה ---------- */
  media: {
    /* סרטון ההירו - מקודד מהמקור ל-1920×1080, ללא אודיו.
       להחלפה: הכניסו קובץ חדש ל-assets/video ועדכנו גם את ה-<source> ב-index.html */
    heroVideoWebm: 'assets/video/hero.webm',
    heroVideoMp4:  'assets/video/hero.mp4',
    heroPoster:    'assets/video/hero-poster.webp',
    /* תמונות המסלולים ומנות הפתיחה - צילומים אמיתיים מהמסעדה.
       אין יותר שום תלות ב-CDN של האתר הישן. */
    premium:      'assets/img/gallery/02-picanha.webp',
    churrascaria: 'assets/img/gallery/03-passadores.webp',
    starters:     'assets/img/gallery/04-table.webp',
  },

  /* ---------- ניווט ראשי ---------- */
  nav: [
    { key: 'home',     he: 'בית',           en: 'Home',     href: 'index.html' },
    { key: 'menu',     he: 'תפריט',         en: 'Menu',     href: 'menu.html' },
    { key: 'butcher',  he: 'קצביה',         en: 'Butcher',  href: 'butcher.html' },
    { key: 'vip',      he: 'VIP',           en: 'VIP',      href: 'vip.html' },
    { key: 'gallery',  he: 'גלריה',         en: 'Gallery',  href: 'gallery.html' },
    { key: 'benefits', he: 'הטבות',         en: 'Benefits', href: 'benefits.html' },
    { key: 'friends',  he: 'CASA FRIENDS',  en: 'CASA FRIENDS', href: 'friends.html' },
    { key: 'faq',      he: 'שאלות נפוצות',  en: 'FAQ',      href: 'faq.html' },
    { key: 'blog',     he: 'בלוג',          en: 'Blog',     href: 'blog.html' },
    { key: 'contact',  he: 'צור קשר',       en: 'Contact',  href: 'contact.html' }
  ],

  /* ---------- מסלולי הצ'ורסקריה - הלב של האתר ----------
     סדר המערך = סדר התצוגה. הפרימיום ראשון, ולכן בעברית הוא יופיע מימין. */
  tracks: [
    {
      id: 'premium',
      featured: true,
      /* קליפ מושתק בלולאה במקום תמונה. הפוסטר מוצג עד שהוא נטען,
         וגם במקומו כשמבקשים פחות תנועה. להסרה - למחוק את video. */
      video: {
        webm:   'assets/video/track-premium.webm',
        mp4:    'assets/video/track-premium.mp4',
        poster: 'assets/video/track-premium-poster.webp'
      },
      he: {
        kicker: 'החוויה המלאה',
        title: 'צ׳ורסקריה פרימיום',
        count: '12 סוגי בשר',
        tagline: 'עם אנטריקוט מובחר ומיושן בקצביית הבית',
        price: '289',
        priceNote: 'לסועד · ללא הגבלה',
        cuts: ['אנטריקוט מובחר ומיושן', 'פיקאניה עגל', 'דנוור קאט', 'קאפה דה פילה', 'מאמיה מלכת הבשר',
               'פרגיות במרינדת דבש, סויה ויין לבן', 'אונטריב בקר', 'כנפי עוף בצ׳ילי',
               'בוליניו - קציצות בשר ברזילאיות', 'לבבות עוף', 'נקניקיות צ׳וריסו דרום אמריקאיות'],
        highlight: 0
      },
      en: {
        kicker: 'The Full Experience',
        title: 'Premium Churrascaria',
        count: '12 cuts of meat',
        tagline: 'Featuring house-aged prime entrecôte',
        price: '289',
        priceNote: 'per diner · unlimited',
        cuts: ['House-aged prime entrecôte', 'Veal Picanha', 'Denver Cut', 'Capa de Filé', 'Mamiya - Queen of Beef',
               'Chicken thighs in honey, soy & white wine', 'Beef short rib', 'Chili chicken wings',
               'Bolinho - Brazilian beef meatballs', 'Chicken hearts', 'South American chorizo sausages'],
        highlight: 0
      }
    },
    {
      id: 'classic',
      featured: false,
      video: {
        webm:   'assets/video/track-classic.webm',
        mp4:    'assets/video/track-classic.mp4',
        poster: 'assets/video/track-classic-poster.webp'
      },
      he: {
        kicker: 'המסלול הקלאסי',
        title: 'צ׳ורסקריה קאזה דו ברזיל',
        count: '11 סוגי בשר',
        tagline: 'השיפוד הרץ - כמה שרק תרצו',
        price: '259',
        priceNote: 'לסועד · ללא הגבלה',
        cuts: ['פיקאניה', 'אסאדו עגל', 'דנוור קאט', 'קאפה דה פילה', 'מאמיה מלכת הבשר',
               'פרגיות במרינדת דבש, סויה ויין לבן', 'אונטריב בקר', 'כנפי עוף בצ׳ילי',
               'בוליניו - קציצות בשר ברזילאיות', 'לבבות עוף', 'נקניקיות צ׳וריסו דרום אמריקאיות']
      },
      en: {
        kicker: 'The Classic',
        title: 'Casa do Brasil Churrascaria',
        count: '11 cuts of meat',
        tagline: 'The running skewer - as much as you like',
        price: '259',
        priceNote: 'per diner · unlimited',
        cuts: ['Picanha', 'Veal Asado', 'Denver Cut', 'Capa de Filé', 'Mamiya - Queen of Beef',
               'Chicken thighs in honey, soy & white wine', 'Beef short rib', 'Chili chicken wings',
               'Bolinho - Brazilian beef meatballs', 'Chicken hearts', 'South American chorizo sausages']
      }
    }
  ],

  /* ---------- מנות פתיחה למרכז השולחן ---------- */
  starters: {
    he: ['אורז ברזילאי לבן', 'תבשיל מסורתי צ׳ילי קונקרנה', 'תפוחי אדמה אפויים',
         'סלט הבית ברוטב וויניגרט', 'רוטב צ׳ימיצ׳ורי'],
    en: ['White Brazilian rice', 'Traditional chili con carne', 'Roasted potatoes',
         'House salad, vinaigrette dressing', 'Chimichurri sauce']
  },

  /* ---------- גלריה ----------
     כל פריט: base (שם הקובץ ללא סיומת) + כיתוב בשתי השפות.
     w/h הם המידות הטבעיות של תמונת התצוגה - הן מונעות קפיצת פריסה בטעינה
     ומאפשרות לפריסה לכבד גם תמונות לאורך וגם לרוחב.
     לכל base קיימים ארבעה קבצים ב-assets/img/gallery:
     <base>.webp/.jpg (מקור, ללייטבוקס) ו-<base>-thumb.webp/.jpg (לרשת). */
  gallery: [
    { base: '01-team',       w: 560, h: 995, he: 'הצוות של קאזה דו ברזיל לפני פתיחת המשמרת',  en: 'The Casa do Brasil team before service' },
    { base: '02-picanha',    w: 560, h: 995, he: 'שיפוד פיקאניה יוצא מהגריל',                 en: 'A picanha skewer straight off the grill' },
    { base: '06-dining',     w: 720, h: 540, he: 'אולם המסעדה בערב עמוס',                     en: 'The dining room on a busy evening' },
    { base: '03-passadores', w: 560, h: 995, he: 'הפסאדורים פורסים בשורה לאורך העמדה',        en: 'Passadores carving along the counter' },
    { base: '04-table',      w: 560, h: 995, he: 'שיפוד על מעמד העץ, נפרס אל השולחן',          en: 'A skewer on the wooden stand, carved at the table' },
    { base: '07-bar',        w: 720, h: 405, he: 'מבט אל הבר ואזור הישיבה',                    en: 'A view toward the bar and the seating area' },
    { base: '05-carving',    w: 560, h: 995, he: 'פסאדור פורס פיקאניה היישר אל הצלחת',         en: 'A passador carving picanha straight onto the plate' }
  ],

  /* ---------- המלצות 5 כוכבים מגוגל ---------- */
  reviews: [
    { name: 'רון ק.',   nameEn: 'Ron K.',    stars: 5, he: 'הבשר היה מצוין, שירות מעולה, אווירה מדהימה. בקיצור - מומלץ בחום.', en: 'The meat was excellent, great service, amazing atmosphere. Highly recommended.' },
    { name: 'סמי מ.',   nameEn: 'Sami M.',   stars: 5, he: 'הלכתי על השיפוד הרץ. כעבור 20 דקות שבענו - בשרים איכותיים, הכל בשפע, שירות מהיר.', en: 'I went for the running skewer. Twenty minutes in we were full - quality meats, endless portions, fast service.' },
    { name: 'אביב נ.',  nameEn: 'Aviv N.',   stars: 5, he: 'מסעדה מספר 1 בארץ. בשר משובח, שירות אדיב ומקצועי ואווירה נעימה. ממליץ בחום לבקר אם אתם באילת!', en: 'The number one restaurant in the country. Fine meat, courteous professional service and a warm atmosphere. A must if you are in Eilat!' },
    { name: 'פאריס ס.', nameEn: 'Faris S.',  stars: 5, he: 'מסעדה מושלמת עם קונספט של בשר חופשי לפי מסלולים. חובה ביקור - מומלצת בחום.', en: 'A perfect restaurant with an all-you-can-eat meat concept by track. A must visit - highly recommended.' },
    { name: 'אמיר מ.',  nameEn: 'Amir M.',   stars: 5, he: 'תודעת שירות יוצאת מן הכלל מהרגע הראשון ועד האחרון. לקחנו מגוון בשרים וכל מנה הייתה מעולה.', en: 'Outstanding service from the first moment to the last. We took a variety of meats and every dish was excellent.' },
    { name: 'דניאל ב.', nameEn: 'Daniel B.', stars: 5, he: 'מקום מצוין, ארוחה מאוד טעימה, נהנינו כל רגע שהיינו שם! מומלץ בחום.', en: 'Excellent place, a delicious meal, we enjoyed every moment! Highly recommended.' },
    { name: 'ארז ב.',   nameEn: 'Erez B.',   stars: 5, he: 'טעים מאוד, שירות מקצועי ומזמין!', en: 'Very tasty, professional and welcoming service!' }
  ],

  /* ---------- מונים ---------- */
  stats: [
    { value: '2M+',    he: 'לקוחות מרוצים',  en: 'Happy guests' },
    { value: '25+',    he: 'שנות מסורת',     en: 'Years of tradition' },
    { value: '5,000+', he: 'ביקורות חיוביות', en: 'Positive reviews' }
  ],

  /* ==========================================================================
     התפריט - מפורק מתוך "תפריט קאזה 2026 A3"
     --------------------------------------------------------------------------
     מבנה פריט:  { price, he: [שם, תיאור], en: [name, desc], add: [תוספות] }
     • price      מחרוזת. שני מחירים מופרדים ב-" / " (למשל גודל/נפח).
     • he/en      מערך של שניים: [שם, תיאור]. אפשר להשמיט את התיאור.
     • add        תוספות למנה: { price, he, en }
     מבנה קטגוריה: { id, cols, he:[כותרת, אינטרו], en:[...], items:[], note }
     • cols       2 = רשימה בשתי עמודות (ברירת מחדל), 1 = עמודה אחת.
     להוספת מנה: להוסיף אובייקט ל-items. אין צורך לגעת ב-HTML או ב-CSS.
     ========================================================================== */
  menu: {

    /* ---- הבאנר האדום בראש הדף. המסלולים עצמם נלקחים מ-SITE.tracks ---- */
    feature: {
      he: ['הקרנבל מתחיל!',
           'עם מנות פתיחה למרכז השולחן - אורז לבן, תבשיל מסורתי צ׳ילי קונקרנה, תפוחי אדמה אפויים וסלט הבית ברוטב ויניגרט ורוטב צ׳ימיצ׳ורי. כמה שבא לך!'],
      en: ['The Carnival Begins!',
           'With family-style starters for the centre of the table - white rice, traditional chili con carne, roasted potatoes and house salad with vinaigrette and chimichurri. As much as you like!'],
      bread: { price: '29', he: ['לחם הבית', 'בליווי מטבלים'], en: ['House bread', 'Served with dips'] },
      note: { he: 'מחויב במסלול זהה לכל יושבי השולחן.', en: 'All diners at the table must order the same track.' }
    },

    /* ---- הקטגוריות, לפי סדר התצוגה בדף ---- */
    categories: [

      /* ===================== עיקריות ===================== */
      {
        id: 'mains', tone: 'dark', cols: 2,
        he: ['עיקריות', 'נתחי הבשר מובחרים ומיושנים בקצביית הבית, בליווי מנות פתיחה למרכז השולחן - כמה שבא לכם!'],
        en: ['Main Courses', 'Our cuts are prime and dry-aged in the house butchery, served with family-style starters - as much as you like!'],
        items: [
          { price: '220', he: ['כבד אווז צרוב', 'מוגש על בריוש ביתי עם ריבת עגבניות שרי'],
                           en: ['Seared foie gras', 'On house brioche with cherry tomato jam'] },
          { price: '179', he: ['פיקאניה', '300 גרם, נתח ברזילאי מובחר'],
                           en: ['Picanha', '300 g, prime Brazilian cut'],
                           add: [{ price: '70', he: 'מדליון כבד אווז, 100 גרם', en: 'Foie gras medallion, 100 g' }] },
          { price: '179', he: ['סינטה', '300 גרם, נתח בקר מובחר'],
                           en: ['Sirloin', '300 g, prime beef cut'],
                           add: [{ price: '70', he: 'מדליון כבד אווז, 100 גרם', en: 'Foie gras medallion, 100 g' }] },
          { price: '269', he: ['פילה רוסיני', 'מדליוני פילה בקר וכבד אווז על הפלנצ׳ה, מוגש עם ריבת שרי'],
                           en: ['Filet Rossini', 'Beef fillet and foie gras medallions on the plancha, with cherry jam'] },
          { price: '296', he: ['טורנדו', 'חגיגת בשרים המורכבת מאנטריקוט, פילה בקר ומדליון כבד אווז'],
                           en: ['Tournedos', 'A meat celebration: entrecôte, beef fillet and a foie gras medallion'] },
          { price: '189', he: ['פילה בקר', '300 גרם, מדליוני פילה בקר צרובים, מוגש עם רוטב יין עשיר'],
                           en: ['Beef fillet', '300 g, seared fillet medallions in a rich wine sauce'] },
          { price: '189 / 249', he: ['אנטריקוט', 'לבחירה 320 או 500 גרם, נתח משויש ועסיסי'],
                           en: ['Entrecôte', '320 g or 500 g, marbled and juicy'],
                           add: [{ price: '70', he: 'מדליון כבד אווז, 100 גרם', en: 'Foie gras medallion, 100 g' }] },
          { price: '219', he: ['צלעות טלה מיושנות', '450 גרם'],
                           en: ['Dry-aged lamb chops', '450 g'] },
          { price: '169', he: ['חזה מולארד', '350 גרם'],
                           en: ['Moulard duck breast', '350 g'] },
          { price: '139', he: ['בוליניו', 'קציצות בקר ברזילאיות, 300 גרם'],
                           en: ['Bolinho', 'Brazilian beef meatballs, 300 g'] },
          { price: '139', he: ['צ׳וריסוס', 'נקניקיות בקר ברזילאיות, 300 גרם'],
                           en: ['Chorizos', 'Brazilian beef sausages, 300 g'] },
          { price: '129', he: ['פרגיות במרינדה', '300 גרם'],
                           en: ['Marinated chicken thighs', '300 g'] },
          { price: '108', he: ['המבורגר קאזה דו ברזיל', '300 גרם של בשר משובח בליווי צ׳יפס וירקות טריים'],
                           en: ['Casa do Brasil burger', '300 g of prime beef with fries and fresh vegetables'],
                           add: [
                             { price: '10', he: 'פטריות מוקפצות / בצל מטוגן / ביצת עין / ריבת בצל / ריבת שרי', en: 'Sautéed mushrooms / fried onion / fried egg / onion jam / cherry jam' },
                             { price: '17', he: 'אסאדו ברוטב ברביקיו מעושן', en: 'Asado in smoked barbecue sauce' },
                             { price: '70', he: 'מדליון כבד אווז, 100 גרם', en: 'Foie gras medallion, 100 g' },
                             { price: '14', he: 'גבינה טבעונית', en: 'Vegan cheese' }
                           ] }
        ],
        callout: { he: ['בשר טרי במשקל', 'שאל את המלצר!'], en: ['Fresh meat by weight', 'Ask your waiter!'] }
      },

      /* ===================== לא רק בשר ===================== */
      {
        id: 'notmeat', tone: 'cream', cols: 2,
        he: ['לא רק בשר', 'דגים, פסטות וסלטים - לצד השיפודים או במקומם.'],
        en: ['Not Only Meat', 'Fish, pasta and salads - alongside the skewers, or instead of them.'],
        items: [
          { price: '139', he: ['ריזוטו פילה דניס', 'ריזוטו קרמי עם פטריות צלויות בחמאה, יין וטימין'],
                           en: ['Sea bream fillet risotto', 'Creamy risotto with mushrooms roasted in butter, wine and thyme'] },
          { price: '139', he: ['דניס שלם טרי', 'על הגריל'],
                           en: ['Whole fresh sea bream', 'From the grill'] },
          { price: '139', he: ['פילה סלמון', 'אפוי בתנור, ירקות מוקפצים וקרם שמנת'],
                           en: ['Salmon fillet', 'Oven baked, with sautéed vegetables and cream'] },
          { price: '119', he: ['פטוצ׳יני סלמון', 'פסטה ברוטב שמנת עשיר עם קוביות סלמון צרובות'],
                           en: ['Salmon fettuccine', 'Pasta in a rich cream sauce with seared salmon cubes'] },
          { price: '85',  he: ['פסטה פטוצ׳יני', 'בעבודת יד, עם מגוון רטבים לבחירה: נפוליטנה / שמנת / רוזה / שמנת פטריות'],
                           en: ['Fettuccine', 'Handmade, with a choice of sauces: napolitana / cream / rosé / mushroom cream'] },
          { price: '89',  he: ['רביולי בטטה', 'שמנת / שמנת פטריות / רוזה'],
                           en: ['Sweet potato ravioli', 'Cream / mushroom cream / rosé'] },
          { price: '85',  he: ['סלט יווני', 'חסה פריכה, מלפפון ירוק, גמבה אדומה, עגבניות שרי, בצל סגול, קרוטונים, זיתי קלמטה, זעתר וגבינה בולגרית'],
                           en: ['Greek salad', 'Crisp lettuce, cucumber, red pepper, cherry tomatoes, red onion, croutons, Kalamata olives, za’atar and Bulgarian cheese'] },
          { price: '89',  he: ['טבע בורגר', 'בליווי צ׳יפס וירקות טריים'],
                           en: ['Veggie burger', 'With fries and fresh vegetables'],
                           add: [
                             { price: '10', he: 'פטריות מוקפצות / בצל מטוגן / ביצת עין', en: 'Sautéed mushrooms / fried onion / fried egg' },
                             { price: '14', he: 'גבינה טבעונית', en: 'Vegan cheese' }
                           ] }
        ]
      },

      /* ===================== לילדים ===================== */
      {
        id: 'kids', tone: 'dark', cols: 2,
        he: ['לילדים', 'עד גיל 12. כל המנות המסומנות מוגשות עם צ׳יפס.'],
        en: ['For Kids', 'Up to age 12. All marked dishes are served with fries.'],
        items: [
          { price: '65', he: ['פרגית', '150 גרם · מוגש עם צ׳יפס'], en: ['Chicken thigh', '150 g · served with fries'] },
          { price: '65', he: ['שניצלונים', 'מוגש עם צ׳יפס'],        en: ['Mini schnitzels', 'Served with fries'] },
          { price: '65', he: ['המבורגר ג׳וניור ברזיל', '180 גרם · מוגש עם צ׳יפס'], en: ['Junior Brasil burger', '180 g · served with fries'] },
          { price: '49', he: ['פסטה פנה', 'במבחר רטבים'],           en: ['Penne pasta', 'Choice of sauces'] }
        ],
        /* מסלול הצ׳ורסקריה לילדים - מוצג ככרטיס נפרד בסוף הקטגוריה */
        kidsTrack: {
          price: '179',
          he: ['צ׳ורסקריה ילד', '11 סוגי בשר · עד גיל 12',
               'פיקאניה, אסאדו עגל, דנוור קאט, מאמיה מלכת הבשר, פרגיות במרינדת סויה ודבש, אונטריב בקר, כנפי עוף בצ׳ילי, קציצות בקר ברזילאיות, קאפא דה פילה, לבבות עוף ונקניקיות צ׳וריסו דרום אמריקאיות.'],
          en: ['Kids’ Churrascaria', '11 cuts of meat · up to age 12',
               'Picanha, veal asado, Denver cut, Mamiya queen of beef, chicken thighs in soy and honey marinade, beef short rib, chili chicken wings, Brazilian beef meatballs, capa de filé, chicken hearts and South American chorizo sausages.']
        }
      },

      /* ===================== קינוחים ===================== */
      {
        id: 'desserts', tone: 'cream', cols: 2,
        he: ['משהו מתוק?', 'סוף מתוק לארוחה - ברזילאי, כמובן.'],
        en: ['Something Sweet?', 'A sweet finish - Brazilian, of course.'],
        items: [
          { price: '52', he: ['קינוח בהפתעה', 'שאל את המלצר'], en: ['Surprise dessert', 'Ask your waiter'] },
          { price: '53', he: ['קרם ברולה', 'קרם שמנת עם שבבי מקלות וניל בציפוי סוכר מקורמל'], en: ['Crème brûlée', 'Vanilla bean custard under caramelised sugar'] },
          { price: '49', he: ['פאווה', 'קינוח ברזילאי אותנטי עם קרם וניל עשיר על מצע ביסקוויטים, קצפת ושבבי קוקוס'], en: ['Pavê', 'An authentic Brazilian dessert: rich vanilla cream over biscuits, whipped cream and coconut'] },
          { price: '49', he: ['בוטפגו', 'פונדנט שוקולד נמס ועשיר בליווי כדור גלידה'], en: ['Botafogo', 'A rich molten chocolate fondant with a scoop of ice cream'] },
          { price: '49', he: ['נמסיס (פרווה)', 'עוגת שוקולד חמה בליווי כדור גלידה'], en: ['Nemesis (parve)', 'Warm chocolate cake with a scoop of ice cream'] },
          { price: '37', he: ['סורבה', 'במבחר טעמים'], en: ['Sorbet', 'A selection of flavours'] }
        ]
      },

      /* ===================== שתייה קרה ===================== */
      {
        id: 'drinks', tone: 'dark', cols: 2,
        he: ['מה תשתו?', 'שתייה קרה, מיצים טבעיים וסודה.'],
        en: ['What Will You Drink?', 'Cold drinks, fresh juices and soda.'],
        items: [
          { price: '15 / 25', he: ['קולה / קולה זירו', 'בקבוק או קנקן'], en: ['Cola / Cola Zero', 'Bottle or pitcher'] },
          { price: '14', he: ['ספרייט / ספרייט זירו'], en: ['Sprite / Sprite Zero'] },
          { price: '14', he: ['פנטה'], en: ['Fanta'] },
          { price: '14', he: ['גווארנה', 'משקה ברזילאי מוגז'], en: ['Guaraná', 'Brazilian sparkling soft drink'] },
          { price: '22', he: ['פררלה'], en: ['Ferrarelle'] },
          { price: '13 / 21', he: ['סודה', 'בקבוק או קנקן'], en: ['Soda', 'Bottle or pitcher'] },
          { price: '13 / 22', he: ['מים מינרלים', 'קטן או גדול'], en: ['Mineral water', 'Small or large'] },
          { price: '13', he: ['מים בטעמים', 'אפרסק / תפוח / ענבים'], en: ['Flavoured water', 'Peach / apple / grape'] },
          { price: '14 / 28', he: ['לימונדה', 'כוס או קנקן'], en: ['Lemonade', 'Glass or pitcher'] },
          { price: '21', he: ['לימונענע גרוס', 'כוס'], en: ['Crushed mint lemonade', 'Glass'] },
          { price: '14', he: ['מיץ אשכוליות'], en: ['Grapefruit juice'] },
          { price: '14', he: ['מיץ תפוזים'], en: ['Orange juice'] },
          { price: '14', he: ['מיץ ענבים'], en: ['Grape juice'] },
          { price: '14', he: ['סיידר תפוחים צלול'], en: ['Clear apple cider'] },
          { price: '14', he: ['פיוזטי אפרסק'], en: ['Fuze Tea peach'] },
          { price: '16', he: ['בירה שחורה מאלט'], en: ['Malt dark beer (non-alcoholic)'] }
        ]
      },

      /* ===================== בירות ===================== */
      {
        id: 'beers', tone: 'dark', cols: 2, boxed: true,
        he: ['בירות', 'מהחבית ומהבקבוק.'],
        en: ['Beers', 'On tap and by the bottle.'],
        items: [
          { price: '35 / 40', he: ['קרלסברג מהחבית', 'שליש / חצי'], en: ['Carlsberg draught', 'Third / half litre'] },
          { price: '36 / 41', he: ['בלאנק 1664 מהחבית', 'שליש / חצי'], en: ['Blanc 1664 draught', 'Third / half litre'] },
          { price: '37 / 42', he: ['ווינשטפן מהחבית', 'שליש / חצי'], en: ['Weihenstephan draught', 'Third / half litre'] },
          { price: '29', he: ['טובורג רד', 'בקבוק'], en: ['Tuborg Red', 'Bottle'] }
        ]
      },

      /* ===================== חם ===================== */
      {
        id: 'hot', tone: 'dark', cols: 2, boxed: true,
        he: ['משהו חם?', 'לסגירת הארוחה.'],
        en: ['Something Hot?', 'To finish the meal.'],
        items: [
          { price: '12', he: ['קפה שחור'], en: ['Black coffee'] },
          { price: '12', he: ['אספרסו', 'קצר / ארוך / כפול'], en: ['Espresso', 'Short / long / double'] },
          { price: '12', he: ['תה'], en: ['Tea'] },
          { price: '15', he: ['קפה הפוך'], en: ['Café au lait'] }
        ]
      }
    ],

    /* ---- הערות בתחתית התפריט ---- */
    notes: {
      he: ['סועד שלא יזמין מנה עיקרית יחויב ב-78 ₪ בגין מנות הפתיחה.',
           'מחויב במסלול זהה לכל יושבי השולחן.',
           'המחירים אינם כוללים שירות ונתונים לשינוי.'],
      en: ['A diner who does not order a main course will be charged ₪78 for the starters.',
           'All diners at the table must order the same churrascaria track.',
           'Prices do not include service and are subject to change.']
    }
  },

  /* ==========================================================================
     קצביה - בשר טרי לפי משקל
     --------------------------------------------------------------------------
     כל המחירים לקילוגרם, אלא אם צוין אחרת ב-unit.
     noDiscount: true - הפריט מסומן בכוכבית ולא נכלל בהנחות.
     ========================================================================== */
  butcher: {
    he: ['קצביה ביתית', 'בשר טרי מובחר, מיושן בקפידה בקצביית הבית של קאזה דו ברזיל. כל המחירים לקילוגרם.'],
    en: ['House Butchery', 'Prime fresh meat, carefully aged in the Casa do Brasil house butchery. All prices per kilogram.'],
    offer: {
      he: ['מבצע מיוחד', 'קונים בשר טרי בסכום של 600 ₪ ומקבלים סט מנות ראשונות בחינם.'],
      en: ['Special offer', 'Spend ₪600 on fresh meat and receive a set of starters on the house.']
    },
    cuts: [
      { price: '269', he: 'פיקאניה',                    en: 'Picanha' },
      { price: '349', he: 'אנטריקוט',                   en: 'Entrecôte' },
      { price: '269', he: 'סינטה מיושנת',               en: 'Aged sirloin' },
      { price: '349', he: 'פילה בקר',                   en: 'Beef fillet', noDiscount: true },
      { price: '269', he: 'צלעות טלה',                  en: 'Lamb chops' },
      { price: '289', he: 'חזה מולארד',                 en: 'Moulard duck breast' },
      { price: '520', he: 'כבד אווז',                   en: 'Foie gras', noDiscount: true },
      { price: '139', he: 'פרגית',                      en: 'Chicken thigh' },
      { price: '169', he: 'צ׳וריסו',                    en: 'Chorizo',
                      heNote: 'נקניקיות פיקנטיות',       enNote: 'Spicy sausages' },
      { price: '149', he: 'בוליניו',                    en: 'Bolinho',
                      heNote: 'קציצות ברזילאיות',        enNote: 'Brazilian meatballs' },
      { price: '149', he: 'המבורגר',                    en: 'Burger',
                      heNote: 'לחמנייה 5 ₪ · ירקות 12 ₪', enNote: 'Bun ₪5 · vegetables ₪12' },
      { price: '79',  he: 'לבבות עוף',                  en: 'Chicken hearts' },
      { price: '79',  he: 'כנפי עוף',                   en: 'Chicken wings' },
      { price: '33',  he: 'המבורגר BEYOND MEAT',        en: 'BEYOND MEAT burger',
                      unitHe: 'ליחידה', unitEn: 'each', noDiscount: true }
    ],
    /* תוספות שנמכרות לצד הבשר */
    extras: [
      { price: '79', he: ['סט מנות פתיחה', 'צ׳ילי קונקרנה, אורז לבן, תפוחי אדמה אפויים בעשבי תיבול, סלט הבית וצ׳ימיצ׳ורי'],
                     en: ['Set of starters', 'Chili con carne, white rice, herb-roasted potatoes, house salad and chimichurri'] },
      { price: '29', he: ['מנת פתיחה בודדת', 'צ׳ילי קונקרנה / אורז לבן / תפוחי אדמה אפויים / סלט הבית'],
                     en: ['A single starter', 'Chili con carne / white rice / roasted potatoes / house salad'] },
      { price: '10', he: ['רטבים', 'צ׳ימיצ׳ורי / שום קונפי / ריבת עגבניות שרי / רוטב הסלט שלנו'],
                     en: ['Sauces', 'Chimichurri / garlic confit / cherry tomato jam / our salad dressing'] }
    ],
    notes: {
      he: ['כל הנתחים מוכנים לפי הזמנה.',
           'המחיר הוא לקילוגרם. המשקל הסופי עשוי להשתנות מעט.',
           'פריטים המסומנים בכוכבית אינם כלולים בהנחות ובמבצעים.'],
      en: ['All cuts are prepared to order.',
           'Prices are per kilogram. The final weight may vary slightly.',
           'Items marked with an asterisk are excluded from discounts and offers.']
    }
  },

  /* ==========================================================================
     שאלות נפוצות - נטענות גם כ-JSON-LD מסוג FAQPage בדף עצמו
     ========================================================================== */
  faq: {
    he: ['שאלות נפוצות', 'תשובות לשאלות הנפוצות ביותר על קאזה דו ברזיל - שעות, הזמנות, תפריט ועוד. לכל שאלה נוספת אתם מוזמנים תמיד לחייג אלינו.'],
    en: ['Frequently Asked Questions', 'Answers to the most common questions about Casa do Brasil - hours, reservations, the menu and more. For anything else, you are always welcome to call us.'],
    items: [
      { he: ['מה זה מסלול השיפוד הרץ (צ׳ורסקריה)?',
             'השיפוד הרץ הוא סגנון האכילה הברזילאי המסורתי: הפסאדורים עוברים בין השולחנות עם השיפודים, פורסים ומגישים את הבשר היישר לצלחת שלכם. אתם נהנים מהחוויה בקצב שלכם ואוכלים כמה שתרצו, תוך התענגות על הטעמים העשירים של המטבח הברזילאי.'],
        en: ['What is the running skewer (churrascaria)?',
             'The running skewer is the traditional Brazilian way of eating: our passadores move between the tables with the skewers, carving and serving the meat straight onto your plate. You enjoy the experience at your own pace and eat as much as you like, savouring the rich flavours of Brazilian cuisine.'] },
      { he: ['האם כל יושבי השולחן מחויבים בבחירת מסלול?',
             'מסלול השיפוד הרץ אינו מחייב את כל יושבי השולחן. ניתן להזמין גם מנה עיקרית רגילה, כאשר המסלול משרת את הסועד שהזמין אותו בלבד.'],
        en: ['Does everyone at the table have to order a track?',
             'The running skewer does not obligate everyone at the table. Any diner can order a regular main course instead; the track serves only the diner who ordered it.'] },
      { he: ['מה שעות הפעילות שלכם?',
             'אנחנו פתוחים בימים ראשון עד שבת, בין 12:00 ל-23:00. מומלץ להזמין מקום מראש, במיוחד בשעות השיא.'],
        en: ['What are your opening hours?',
             'We are open Sunday to Saturday, 12:00 to 23:00. We recommend booking ahead, especially at peak hours.'] },
      { he: ['האם צריך להזמין מקום מראש?',
             'מומלץ מאוד. בשעות השיא ובעונות התיירות המסעדה מתמלאת, והזמנה מראש מבטיחה לכם שולחן.'],
        en: ['Do I need to book in advance?',
             'It is strongly recommended. At peak hours and in tourist season the restaurant fills up, and booking ahead guarantees you a table.'] },
      { he: ['האם יש תפריט ילדים?',
             'כן. יש לנו תפריט ייעודי לילדים עד גיל 12, הכולל מנות קטנות יותר ואפשרויות ידידותיות לילדים במחיר מיוחד, וגם מסלול צ׳ורסקריה בגרסת ילדים.'],
        en: ['Is there a children’s menu?',
             'Yes. We have a dedicated menu for children up to age 12 with smaller, kid-friendly dishes at a special price, plus a children’s version of the churrascaria track.'] },
      { he: ['האם יש מענה לצמחונים ולטבעונים?',
             'התפריט שלנו מתמקד בעיקר בבשר, אבל אנחנו מציעים גם מנות צמחוניות וטבעוניות כמנה עיקרית, לצד מגוון סלטים ומנות פתיחה צמחוניות.'],
        en: ['Do you cater to vegetarians and vegans?',
             'Our menu focuses mainly on meat, but we also serve vegetarian and vegan main courses alongside a range of salads and vegetarian starters.'] },
      { he: ['האם יש חניה בקרבת מקום?',
             'כן, יש מקומות חניה בסמוך למסעדה, כולל חניית נכים. מומלץ להגיע קצת מוקדם כדי להבטיח מקום, במיוחד בשעות עמוסות.'],
        en: ['Is there parking nearby?',
             'Yes, there is parking next to the restaurant, including accessible parking. We recommend arriving a little early to secure a spot at busy times.'] },
      { he: ['אפשר לארח אצלכם אירוע פרטי או ארוחה קבוצתית?',
             'בהחלט. אנחנו מארחים אירועים פרטיים, ארוחות ערב ארגוניות וחגיגות. צרו איתנו קשר בטלפון 08-6323032 כדי לבדוק זמינות ולבנות תפריט שמתאים לאירוע שלכם.'],
        en: ['Can I host a private event or a group dinner?',
             'Absolutely. We host private events, corporate dinners and celebrations. Call us at 08-6323032 to check availability and build a menu that suits your event.'] },
      { he: ['האם יש מוזיקה חיה במקום?',
             'כן. קאזה דו ברזיל מציעה מוזיקה ברזילאית חיה בערבים נבחרים. עקבו אחרינו ברשתות החברתיות או התקשרו מראש כדי לברר על הופעות ואירועים מיוחדים.'],
        en: ['Is there live music?',
             'Yes. Casa do Brasil hosts live Brazilian music on selected evenings. Follow us on social media or call ahead to ask about upcoming performances and special events.'] },
      { he: ['איפה אתם נמצאים?',
             'דרך הערבה 23, אילת, במתחם מלון איסלה בראון. מחכים לכם.'],
        en: ['Where are you located?',
             '23 Derech HaArava, Eilat, in the Isla Brown Hotel complex. We look forward to seeing you.'] }
    ],
    foot: {
      he: ['לא מצאתם את התשובה?', 'התקשרו אלינו ישירות ונשמח לעזור.'],
      en: ['Didn’t find your answer?', 'Call us directly and we will be glad to help.']
    }
  },

  /* ==========================================================================
     הטבות
     ========================================================================== */
  benefits: {
    he: ['הטבות', 'הטבות בלעדיות לאורחי קאזה דו ברזיל, כרטיסי מתנה, כרטיסי אשראי מיוחדים ועוד.'],
    en: ['Benefits', 'Exclusive benefits for Casa do Brasil guests, gift cards, partner credit cards and more.'],
    house: [
      { icon: 'wine', he: ['כוס יין עם צ׳ורסקריה פרימיום', 'הזמינו את הצ׳ורסקריה פרימיום שלנו וקבלו כוס יין הבית על חשבוננו.', 'לא ניתן לשלב עם הצעות אחרות. לא תקף בעסקאות ארוחת צהריים.'],
        en: ['A glass of wine with Premium Churrascaria', 'Order our Premium Churrascaria and receive a glass of house wine on us.', 'Cannot be combined with other offers. Not valid on lunch deals.'] },
      { icon: 'wine2', he: ['שתי כוסות יין בספיישל הזוגי', 'הזמינו את הספיישל הזוגי - קילוגרם בשר - וקבלו שתי כוסות יין הבית על חשבוננו.', 'לא ניתן לשלב עם הצעות אחרות. לא תקף בעסקאות ארוחת צהריים.'],
        en: ['Two glasses of wine with the couples special', 'Order the couples special - one kilo of meat - and receive two glasses of house wine on us.', 'Cannot be combined with other offers. Not valid on lunch deals.'] }
    ],
    gift: {
      he: ['כרטיסי מתנה', 'קאזה דו ברזיל מקבלת שני סוגים של כרטיסי מתנה דיגיטליים - המתנה המושלמת לכל אירוע.'],
      en: ['Gift cards', 'Casa do Brasil accepts two kinds of digital gift card - the perfect gift for any occasion.'],
      cards: [{ name: 'BuyMe', he: 'כרטיס מתנה דיגיטלי', en: 'Digital gift card' },
              { name: 'Xtra Giftcard', he: 'כרטיס מתנה דיגיטלי', en: 'Digital gift card' }]
    },
    cards: {
      he: ['כרטיסים מיוחדים', 'אנחנו עובדים עם מספר כרטיסי אשראי ומועדונים שמציעים הנחות והטבות.',
           ['חבר טעמים', 'כרטיס קרן שוטרים', 'שוברים וקופונים']],
      en: ['Partner cards', 'We work with several credit cards and clubs that offer discounts and benefits.',
           ['Haver Te’amim', 'Police Fund card', 'Vouchers and coupons']]
    },
    note: {
      he: 'יש לבדוק מולנו מראש בכל הנוגע למימוש הטבה מכל סוג, ואין התחייבות לקבלת כרטיס כלשהו. אין כפל מבצעים או הטבות. כל הפרטים כפופים לשינויים.',
      en: 'Please check with us in advance regarding any benefit; acceptance of any particular card is not guaranteed. Offers and benefits cannot be combined. All details are subject to change.'
    }
  },

  /* ==========================================================================
     VIP - החדר הפרטי. הסטטוס עדיין "בקרוב" באתר הקיים.
     כשהחדר נפתח: להחליף soon ל-false והטקסט של ה"בקרוב" ייעלם מהדף.
     ========================================================================== */
  vip: {
    soon: true,
    he: ['VIP', 'החדר הפרטי של קאזה דו ברזיל - חגיגת בשרים איכותיים בסטייל ברזילאי, רק לכם.'],
    en: ['VIP', 'The private room at Casa do Brasil - a celebration of fine meat, Brazilian style, just for you.'],
    features: [
      { he: ['נתחי גאוצ׳ו פרימיום', 'הבשרים המובחרים ביותר מקצביית הבית'], en: ['Premium gaucho cuts', 'The finest meat from our house butchery'] },
      { he: ['אווירת קרנבל ברזילאית', 'מוזיקה ואנרגיה של ריו, בחדר משלכם'],  en: ['Brazilian carnival atmosphere', 'The music and energy of Rio, in your own room'] },
      { he: ['חלל פרטי לחלוטין', 'עד 30 אורחים'],                            en: ['A fully private space', 'Up to 30 guests'] },
      { he: ['גאוצ׳ו אישי', 'פסאדור צמוד שפורס לשולחן שלכם בלבד'],           en: ['Your own gaucho', 'A dedicated passador carving for your table alone'] },
      { he: ['תפריט ובר מותאמים', 'חוויה שנבנית סביב האירוע שלכם'],          en: ['A curated menu and bar', 'An experience built around your event'] },
      { he: ['מספר מקומות מוגבל', 'מומלץ לתאם מראש כדי לשריין תאריך'],       en: ['Limited availability', 'We recommend calling ahead to secure your date'] }
    ],
    soonText: {
      he: ['בקרוב', 'אנחנו עוד מלטשים את הפרטים האחרונים. בינתיים אפשר להתקשר אלינו ולתאם אירוע פרטי - נשמח לבנות לכם חוויה.'],
      en: ['Coming soon', 'We are still polishing the final details. In the meantime you are welcome to call us to arrange a private event - we will be glad to build the experience with you.']
    }
  },

  /* ==========================================================================
     CASA FRIENDS - מועדון הלקוחות
     --------------------------------------------------------------------------
     ⚠️ טיוטה. התכנים כאן הם הצעה ראשונית ולא אושרו על ידי המסעדה.
     לפני עלייה לאוויר יש לאשר את ההטבות, התנאים והניסוח.
     טופס ההרשמה טרם נבנה - כרגע הדף מפנה לטלפון.
     ========================================================================== */
  friends: {
    draft: true,
    he: ['CASA FRIENDS', 'מועדון הלקוחות של קאזה דו ברזיל. חברים במועדון מקבלים הטבות לאורך כל השנה, מתנה ביום ההולדת ועדכון ראשון על כל מבצע.'],
    en: ['CASA FRIENDS', 'The Casa do Brasil members club. Members enjoy benefits all year round, a birthday gift, and first word on every offer.'],
    perks: [
      { he: ['הצטרפות ללא עלות', 'רישום קצר, בלי דמי חבר ובלי התחייבות.'],
        en: ['Free to join', 'A short sign-up, no membership fee and no commitment.'] },
      { he: ['מתנה ביום ההולדת', 'הטבה אישית שמחכה לכם בחודש יום ההולדת.'],
        en: ['A birthday gift', 'A personal benefit waiting for you in your birthday month.'] },
      { he: ['ראשונים לדעת', 'מבצעים, ערבי מוזיקה ואירועים מיוחדים - אליכם לפני כולם.'],
        en: ['First to know', 'Offers, music nights and special events - to you before anyone else.'] },
      { he: ['הטבות לאורך השנה', 'הפתעות מתחלפות לחברי המועדון, במסעדה ובקצביה.'],
        en: ['Benefits all year', 'Rotating surprises for members, in the restaurant and at the butchery.'] }
    ],
    steps: [
      { he: ['נרשמים', 'משאירים שם, טלפון ותאריך לידה.'],           en: ['Sign up', 'Leave your name, phone number and date of birth.'] },
      { he: ['מזדהים בהגעה', 'אומרים למלצר שאתם חברי CASA FRIENDS.'], en: ['Identify on arrival', 'Tell your waiter you are a CASA FRIENDS member.'] },
      { he: ['נהנים', 'ההטבה מתווספת לחשבון באותו הביקור.'],         en: ['Enjoy', 'The benefit is added to your bill on the same visit.'] }
    ],
    note: {
      he: 'תנאי המועדון וההטבות עשויים להשתנות. אין כפל מבצעים או הטבות. ההטבות אישיות ואינן ניתנות להעברה.',
      en: 'Club terms and benefits may change. Offers and benefits cannot be combined. Benefits are personal and non-transferable.'
    }
  },


  /* כותרות הדפים המשפטיים ודף צור קשר */
  contactPage: {
    he: ['צור קשר', 'פרטי התקשרות, מיקום ושעות פעילות של קאזה דו ברזיל אילת.'],
    en: ['Contact', 'Contact details, location and opening hours for Casa do Brasil Eilat.']
  },
  privacyPage: {
    he: ['מדיניות פרטיות', 'מדיניות הפרטיות של אתר קאזה דו ברזיל.'],
    en: ['Privacy Policy', 'The privacy policy of the Casa do Brasil website.']
  },
  accessibilityPage: {
    he: ['הצהרת נגישות', 'הצהרת הנגישות של אתר קאזה דו ברזיל.'],
    en: ['Accessibility Statement', 'The accessibility statement of the Casa do Brasil website.']
  },
  termsPage: {
    he: ['תנאי שימוש', 'תנאי השימוש באתר קאזה דו ברזיל.'],
    en: ['Terms of Use', 'The terms of use of the Casa do Brasil website.']
  },

  /* כותרת דף הגלריה. התמונות עצמן ב-SITE.gallery למעלה. */
  galleryPage: {
    he: ['גלריה', 'צלילים, ניחוחות וצבעים - הצצה אל הנשמה של קאזה דו ברזיל.'],
    en: ['Gallery', 'Sounds, aromas and colour - a look into the soul of Casa do Brasil.']
  },

  /* ==========================================================================
     בלוג - התוכן עצמו יושב ב-assets/data/posts.js
     ========================================================================== */
  blog: {
    he: ['בלוג', 'סיפורים מהמטבח של הקאזה - מאמרים על בשר, על ברזיל ועל החוויה הקולינרית באילת.'],
    en: ['Blog', 'Stories from the Casa kitchen - articles about meat, about Brazil, and about eating well in Eilat.'],
    perPage: 9
  }
};

/* ==========================================================================
   מילון תרגום - כל טקסט בממשק. מפתח = ערך של data-i18n ב-HTML.
   ========================================================================== */
window.I18N = {
  he: {
    'meta.title':        'קאזה דו ברזיל | צ׳ורסקריה ושיפוד רץ באילת',
    'meta.description':  'קאזה דו ברזיל אילת - צ׳ורסקריה ברזילאית אותנטית בשיטת השיפוד הרץ. 12 סוגי בשר ללא הגבלה, מוסיקה ואווירת קרנבל.',

    'skip':              'דילוג לתוכן הראשי',
    'header.reserve':    'הזמנת שולחן',
    'header.menuOpen':   'פתיחת תפריט הניווט',
    'header.menuClose':  'סגירת תפריט הניווט',
    'header.lang':       'EN',
    'header.langLabel':  'Switch to English',
    'header.home':       'לדף הבית',

    'hero.eyebrow':      'אילת · מאז 1999',
    'hero.title':        'השיפוד לא מפסיק לרוץ',
    'hero.subtitle':     'צ׳ורסקריה ברזילאית אותנטית - הפסאדורים פורסים לכם היישר מהשיפוד אל הצלחת, כמה שרק תרצו.',
    'hero.cta1':         'הזמינו שולחן',
    'hero.cta2':         'לתפריט המלא',
    'hero.scroll':       'גללו למטה',
    'hero.videoLabel':   'סרטון רקע: אווירת המסעדה והשיפוד הרץ',

    /* כותרות סקשן תלת-חלקיות: [משפט מלווה | כותרת | משפט מלווה] */
    'tracks.sideL':      'השיפוד לא עוצר',
    'tracks.sideR':      'עד שתגידו די',
    'about.sideL':       'באילת מאז 1999',
    'about.sideR':       'גריל · מוסיקה · אווירה',
    'reviews.sideL':     'אלפי ביקורות בגוגל',
    'reviews.sideR':     'ממוצע חמישה כוכבים',
    'about.section':     'הסיפור שלנו',
    'reviews.section':   'הלקוחות שלנו',

    'tracks.eyebrow':    'הקרנבל מתחיל',
    'tracks.title':      'המסלולים',
    'tracks.intro':      'שני מסלולי צ׳ורסקריה, אותה שיטה: “אשפטו קוהידו” - השיפוד הרץ. הפסאדורים עוברים בין השולחנות ופורסים נתח אחרי נתח, עד שתגידו די.',
    'tracks.badge':      'הכי מבוקש',
    'tracks.per':        '₪',
    'tracks.cta':        'להזמנת שולחן',
    'tracks.menuLink':   'לתפריט המלא',
    'tracks.note':       'מחויב במסלול זהה לכל מזמיני הצ׳ורסקריה. ניתן להזמין כל מנה עיקרית - אין חובה לבחור במסלול.',
    'tracks.cutsLabel':  'הנתחים במסלול',

    'starters.eyebrow':  'על השולחן מהרגע הראשון',
    'starters.title':    'מנות הפתיחה',
    'starters.text':     'עוד לפני שהשיפוד הראשון מגיע, השולחן כבר מלא. מנות הפתיחה מוגשות למרכז השולחן ומתחדשות לאורך כל הארוחה - כמה שרק תרצו.',
    'starters.note':     'סועד שלא יזמין מנה עיקרית יחויב עבור מנות הפתיחה - 78 ₪.',

    'about.eyebrow':     'הסיפור שלנו',
    'about.title':       'בשר. מוסיקה. ברזיל.',
    'about.p1':          'אח, ברזיל… הצבעוניות, החופים, הכדורגל, ריו דה ז׳ניירו, הקופה־קבנה, הקפה, הקפרינייה - והאוכל. אח, האוכל!',
    'about.p2':          'בברזיל יש כלל ברזל: מאוכל נהנים כמו ב״קאזה דו ברזיל״. כשהשיפוד מתחיל לרוץ, כשאוכלים כמה שרוצים, כשריחות הבשר פולשים וכשקצב הסמבה באוויר - מובטחת חוויה ענקית, לנפש ולגוף.',
    'about.p3':          'למעלה מ־25 שנה שקאזה דו ברזיל היא חוויית הבשרים המובילה באילת. הנתחים מיושנים בקצביית הבית, הגרילמנים על האש והפסאדורים בדרך אליכם.',
    'about.ctaReserve':  'להזמנת מקום',
    'about.ctaMenu':     'לתפריט המלא',

    'gallery.sideL':     'מאחורי הקלעים',
    'gallery.sideR':     'ועל השולחן',
    'gallery.section':   'סיבוב בקאזה',
    'gallery.intro':     'רגע לפני שהשיפוד מגיע אליכם.',
    'gallery.dialog':    'תמונה מוגדלת',
    'gallery.open':      'הגדלת התמונה',
    'gallery.close':     'סגירת התמונה',
    'gallery.prev':      'התמונה הקודמת',
    'gallery.next':      'התמונה הבאה',
    'gallery.counter':   'תמונה',
    'gallery.cta':       'לגלריה המלאה',

    'reviews.eyebrow':   'הלקוחות שלנו',
    'reviews.title':     'חמישה כוכבים, שוב ושוב',
    'reviews.intro':     'מתוך אלפי ביקורות בגוגל.',
    'reviews.cta':       'לכל הביקורות בגוגל',
    'reviews.prev':      'ההמלצה הקודמת',
    'reviews.next':      'ההמלצה הבאה',
    'reviews.pause':     'עצירת החלפה אוטומטית',
    'reviews.play':      'הפעלת החלפה אוטומטית',
    'reviews.starsLabel':'דירוג 5 מתוך 5 כוכבים',
    'reviews.region':    'קרוסלת המלצות לקוחות',

    'footer.about':      'צ׳ורסקריה ברזילאית באילת - גריל, מוסיקה ואווירה, מאז 1999.',
    'footer.navTitle':   'ניווט באתר',
    'footer.contactTitle':'צרו קשר',
    'footer.hoursTitle': 'שעות פעילות',
    'footer.social':     'עקבו אחרינו',
    'footer.rights':     'כל הזכויות שמורות',
    'footer.privacy':    'מדיניות פרטיות',
    'footer.accessibility':'הצהרת נגישות',
    'footer.terms':      'תנאי שימוש',
    'footer.waze':       'ניווט בוויז',

    'social.title':      'עקבו אחרינו',
    'social.toggle':     'פתיחה וסגירה של סרגל הרשתות החברתיות',

    'cookies.title':     'האתר עושה שימוש בעוגיות',
    'cookies.text':      'אנו משתמשים בעוגיות כדי לשפר את חוויית הגלישה ולנתח את השימוש באתר. לחיצה על ״אישור״ מהווה הסכמה לשימוש בעוגיות כמפורט במדיניות הפרטיות.',
    'cookies.accept':    'אישור',
    'cookies.decline':   'עוגיות הכרחיות בלבד',
    'cookies.policy':    'מדיניות הפרטיות',

    'a11y.open':         'פתיחת תפריט נגישות',
    'a11y.title':        'הגדרות נגישות',
    'a11y.close':        'סגירת תפריט נגישות',
    'a11y.textSize':     'גודל טקסט',
    'a11y.decrease':     'הקטנת טקסט',
    'a11y.increase':     'הגדלת טקסט',
    'a11y.contrast':     'ניגודיות גבוהה',
    'a11y.lightMode':    'רקע בהיר',
    'a11y.grayscale':    'גווני אפור',
    'a11y.links':        'הדגשת קישורים',
    'a11y.readable':     'גופן קריא',
    'a11y.spacing':      'ריווח טקסט',
    'a11y.motion':       'עצירת אנימציות',
    'a11y.cursor':       'סמן גדול',
    'a11y.guide':        'מדריך קריאה',
    'a11y.reset':        'איפוס הגדרות',
    'a11y.statement':    'הצהרת נגישות',
    'a11y.on':           'פעיל',
    'a11y.off':          'כבוי',

    'page.soon':         'הדף בהכנה',
    'page.soonText':     'התוכן של הדף הזה נמצא בבנייה ויעלה בקרוב. בינתיים אתם מוזמנים לחזור לדף הבית או להזמין שולחן.',
    'page.backHome':     'חזרה לדף הבית',

    'menu.title':        'תפריט',
    'menu.metaTitle':    'תפריט | קאזה דו ברזיל',
    'menu.lead':         'התפריט המלא של קאזה דו ברזיל - מסלולי הצ׳ורסקריה, עיקריות מקצביית הבית, מנות ללא בשר, תפריט ילדים, קינוחים ומשקאות.',
    'menu.jump':         'קפיצה לקטגוריה',
    'menu.currency':     '₪',
    'menu.addTitle':     'תוספות',
    'menu.notesTitle':   'לתשומת לבכם',
    'menu.download':     'התפריט המודפס (PDF)',
    'menu.trackCta':     'להזמנת שולחן',
    'menu.perDiner':     'לסועד',
    'menu.cutsLabel':    'הנתחים במסלול',
    'menu.kidsTrack':    'מסלול הילדים',
    'menu.printedNote':  'התפריט מתעדכן מעת לעת. ייתכנו שינויים בין התפריט באתר לתפריט במסעדה.',

    /* ---- דפים פנימיים ---- */
    'pg.perKg':          'לק״ג',
    'pg.perUnit':        'ליחידה',
    'pg.noDiscount':     'ללא הנחה',
    'pg.extrasTitle':    'לצד הבשר',
    'pg.notesTitle':     'לתשומת לבכם',
    'pg.callUs':         'חייגו אלינו',
    'pg.whatsapp':       'וואטסאפ',
    'pg.reserve':        'להזמנת מקום',
    'pg.toMenu':         'לתפריט המלא',
    'pg.readMore':       'קראו עוד',
    'pg.backToBlog':     'חזרה לכל המאמרים',
    'pg.more':           'עוד מאמרים',
    'pg.loadMore':       'טעינת מאמרים נוספים',
    'pg.postsCount':     'מאמרים',
    'pg.search':         'חיפוש מאמר',
    'pg.searchNone':     'לא נמצאו מאמרים שמתאימים לחיפוש.',
    'pg.howTitle':       'איך זה עובד',
    'pg.joinTitle':      'הצטרפות למועדון',
    'pg.joinSoon':       'טופס ההרשמה המקוון ייפתח בקרוב. עד אז אפשר להצטרף בטלפון או בביקור הבא במסעדה.',
    'pg.giftTitle':      'כרטיסי מתנה',
    'pg.faqSchema':      'שאלות נפוצות'
  },

  en: {
    'meta.title':        'Casa do Brasil | Brazilian Churrascaria in Eilat',
    'meta.description':  'Casa do Brasil Eilat - an authentic Brazilian churrascaria serving the running skewer. Twelve cuts of meat, unlimited, with music and carnival spirit.',

    'skip':              'Skip to main content',
    'header.reserve':    'Book a table',
    'header.menuOpen':   'Open navigation menu',
    'header.menuClose':  'Close navigation menu',
    'header.lang':       'עב',
    'header.langLabel':  'מעבר לעברית',
    'header.home':       'Go to homepage',

    'hero.eyebrow':      'Eilat · Since 1999',
    'hero.title':        'The Skewer Never Stops',
    'hero.subtitle':     'An authentic Brazilian churrascaria - our passadores carve straight from the skewer to your plate, as much as you like.',
    'hero.cta1':         'Book a table',
    'hero.cta2':         'View the menu',
    'hero.scroll':       'Scroll down',
    'hero.videoLabel':   'Background video: the restaurant atmosphere and the running skewer',

    'tracks.sideL':      'The skewer never stops',
    'tracks.sideR':      'Until you say when',
    'about.sideL':       'In Eilat since 1999',
    'about.sideR':       'Grill · Music · Spirit',
    'reviews.sideL':     'Thousands of Google reviews',
    'reviews.sideR':     'Five stars on average',
    'about.section':     'Our story',
    'reviews.section':   'Our guests',

    'tracks.eyebrow':    'The carnival begins',
    'tracks.title':      'The Tracks',
    'tracks.intro':      'Two churrascaria tracks, one method: “espeto corrido” - the running skewer. Our passadores move between the tables, carving cut after cut, until you say stop.',
    'tracks.badge':      'Most popular',
    'tracks.per':        '₪',
    'tracks.cta':        'Book a table',
    'tracks.menuLink':   'View the full menu',
    'tracks.note':       'All churrascaria diners at the table must order the same track. Any main course can be ordered à la carte - a track is not mandatory.',
    'tracks.cutsLabel':  'Cuts included',

    'starters.eyebrow':  'On the table from minute one',
    'starters.title':    'The Starters',
    'starters.text':     'Before the first skewer arrives, the table is already full. Starters are served family-style to the centre of the table and refilled throughout the meal - as much as you like.',
    'starters.note':     'Diners not ordering a main course will be charged ₪78 for the starters.',

    'about.eyebrow':     'Our story',
    'about.title':       'Meat. Music. Brazil.',
    'about.p1':          'Ah, Brazil… the colour, the beaches, the football, Rio de Janeiro, Copacabana, the coffee, the caipirinha - and the food. Ah, the food!',
    'about.p2':          'In Brazil there is an iron rule: you enjoy food the way you enjoy it at Casa do Brasil. When the skewer starts running, when you eat as much as you want, when the scent of grilled meat fills the room and the samba is in the air - a great experience is guaranteed.',
    'about.p3':          'For more than 25 years Casa do Brasil has been the leading meat experience in Eilat. Our cuts are aged in the house butchery, the grillmen work the fire, and the passadores are on their way to you.',
    'about.ctaReserve':  'Book a table',
    'about.ctaMenu':     'View the full menu',

    'gallery.sideL':     'Behind the scenes',
    'gallery.sideR':     'And at the table',
    'gallery.section':   'Around the Casa',
    'gallery.intro':     'A moment before the skewer reaches you.',
    'gallery.dialog':    'Enlarged image',
    'gallery.open':      'Enlarge image',
    'gallery.close':     'Close image',
    'gallery.prev':      'Previous image',
    'gallery.next':      'Next image',
    'gallery.counter':   'Image',
    'gallery.cta':       'See the full gallery',

    'reviews.eyebrow':   'Our guests',
    'reviews.title':     'Five stars, again and again',
    'reviews.intro':     'From thousands of Google reviews.',
    'reviews.cta':       'Read all Google reviews',
    'reviews.prev':      'Previous review',
    'reviews.next':      'Next review',
    'reviews.pause':     'Pause auto-rotation',
    'reviews.play':      'Resume auto-rotation',
    'reviews.starsLabel':'Rated 5 out of 5 stars',
    'reviews.region':    'Guest reviews carousel',

    'footer.about':      'A Brazilian churrascaria in Eilat - grill, music and atmosphere since 1999.',
    'footer.navTitle':   'Site navigation',
    'footer.contactTitle':'Get in touch',
    'footer.hoursTitle': 'Opening hours',
    'footer.social':     'Follow us',
    'footer.rights':     'All rights reserved',
    'footer.privacy':    'Privacy policy',
    'footer.accessibility':'Accessibility statement',
    'footer.terms':      'Terms of use',
    'footer.waze':       'Navigate with Waze',

    'social.title':      'Follow us',
    'social.toggle':     'Toggle the social media bar',

    'cookies.title':     'This site uses cookies',
    'cookies.text':      'We use cookies to improve your browsing experience and analyse site usage. Clicking “Accept” constitutes consent to the use of cookies as described in our privacy policy.',
    'cookies.accept':    'Accept',
    'cookies.decline':   'Essential cookies only',
    'cookies.policy':    'privacy policy',

    'a11y.open':         'Open accessibility menu',
    'a11y.title':        'Accessibility settings',
    'a11y.close':        'Close accessibility menu',
    'a11y.textSize':     'Text size',
    'a11y.decrease':     'Decrease text size',
    'a11y.increase':     'Increase text size',
    'a11y.contrast':     'High contrast',
    'a11y.lightMode':    'Light background',
    'a11y.grayscale':    'Grayscale',
    'a11y.links':        'Highlight links',
    'a11y.readable':     'Readable font',
    'a11y.spacing':      'Text spacing',
    'a11y.motion':       'Stop animations',
    'a11y.cursor':       'Large cursor',
    'a11y.guide':        'Reading guide',
    'a11y.reset':        'Reset settings',
    'a11y.statement':    'Accessibility statement',
    'a11y.on':           'on',
    'a11y.off':          'off',

    'page.soon':         'Page in progress',
    'page.soonText':     'This page is being built and will be published soon. In the meantime you are welcome to return home or book a table.',
    'page.backHome':     'Back to homepage',

    'menu.title':        'Menu',
    'menu.metaTitle':    'Menu | Casa do Brasil',
    'menu.lead':         'The full Casa do Brasil menu - churrascaria tracks, mains from the house butchery, dishes without meat, a kids’ menu, desserts and drinks.',
    'menu.jump':         'Jump to a section',
    'menu.currency':     '₪',
    'menu.addTitle':     'Add-ons',
    'menu.notesTitle':   'Please note',
    'menu.download':     'The printed menu (PDF)',
    'menu.trackCta':     'Book a table',
    'menu.perDiner':     'per diner',
    'menu.cutsLabel':    'Cuts included',
    'menu.kidsTrack':    'Kids’ track',
    'menu.printedNote':  'The menu is updated from time to time. There may be differences between the online menu and the menu in the restaurant.',

    'pg.perKg':          'per kg',
    'pg.perUnit':        'each',
    'pg.noDiscount':     'no discount',
    'pg.extrasTitle':    'Alongside the meat',
    'pg.notesTitle':     'Please note',
    'pg.callUs':         'Call us',
    'pg.whatsapp':       'WhatsApp',
    'pg.reserve':        'Book a table',
    'pg.toMenu':         'View the full menu',
    'pg.readMore':       'Read more',
    'pg.backToBlog':     'Back to all articles',
    'pg.more':           'More articles',
    'pg.loadMore':       'Load more articles',
    'pg.postsCount':     'articles',
    'pg.search':         'Search articles',
    'pg.searchNone':     'No articles match your search.',
    'pg.howTitle':       'How it works',
    'pg.joinTitle':      'Join the club',
    'pg.joinSoon':       'The online sign-up form is opening soon. Until then you can join by phone or on your next visit to the restaurant.',
    'pg.giftTitle':      'Gift cards',
    'pg.faqSchema':      'Frequently asked questions'
  }
};
