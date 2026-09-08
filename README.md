# קאזה דו ברזיל — אתר המסעדה

אתר סטטי, ללא שרת וללא שלב בנייה. פותחים כל קובץ `.html` בדפדפן והוא עובד.
עברית ואנגלית, RTL מלא, נגישות לפי ת"י 5568 / WCAG 2.1 AA.

---

## איפה משנים תוכן

**כמעט כל טקסט באתר יושב בקובץ אחד: `assets/js/config.js`.**
אין צורך לגעת ב-HTML כדי לשנות מחיר, להוסיף מנה או לתקן ניסוח.

| מה משנים | איפה ב-`config.js` |
| --- | --- |
| טלפון, כתובת, שעות, מייל | `SITE.business` |
| קישורי הזמנת שולחן ורשתות חברתיות | `SITE.links` |
| פריטי התפריט העליון | `SITE.nav` |
| מסלולי הצ׳ורסקריה ומחיריהם | `SITE.tracks` |
| מנות הפתיחה | `SITE.starters` |
| התפריט המלא | `SITE.menu` |
| מחירי הקצביה | `SITE.butcher` |
| שאלות נפוצות | `SITE.faq` |
| הטבות וכרטיסי מתנה | `SITE.benefits` |
| החדר הפרטי | `SITE.vip` |
| מועדון CASA FRIENDS | `SITE.friends` |
| תמונות הגלריה | `SITE.gallery` |
| המלצות גוגל | `SITE.reviews` |
| כל טקסט ממשק אחר | `I18N.he` / `I18N.en` |

מאמרי הבלוג יושבים בנפרד, ב-`assets/data/posts.js`.

**חשוב:** לכל טקסט יש גרסה בעברית וגרסה באנגלית. אם משנים אחת, לשנות גם את השנייה.

---

## מבנה

```
index.html          דף הבית
menu.html           התפריט
butcher.html        קצביה
vip.html            החדר הפרטי
gallery.html        גלריה
benefits.html       הטבות
friends.html        CASA FRIENDS
faq.html            שאלות נפוצות
blog.html           רשימת המאמרים
post.html           מאמר בודד  (post.html?p=<slug>)
contact.html · privacy.html · accessibility.html · terms.html

assets/css/         tokens (מערכת העיצוב) · base · layout · components ·
                    home · carnival · gallery · peek · inner · menu · pages
assets/js/          config (מקור האמת) · icons · partials (הדר/פוטר) · i18n ·
                    reviews · gallery · menu · pages · cookies · accessibility · app
assets/data/        posts.js — ארכיון הבלוג
assets/img/         לוגו, ראש הפרה, תמונות הגלריה
assets/video/       סרטון ההירו וקליפי המסלולים
assets/docs/        התפריט המודפס (PDF)
```

---

## שתי מלכודות שכדאי להכיר

1. **`.reveal` חייב להיווצר לפני `initReveal()`.**
   כל תוכן שנוצר ב-JavaScript ומקבל `class="reveal"` חייב להיווצר בתוך
   `renderDynamic()` ב-`app.js`. אלמנט שנוסף ל-DOM אחרי שה-IntersectionObserver
   כבר רץ לא ייצפה לעולם, יישאר ב-`opacity:0` ופשוט לא יופיע בדף.

2. **אוברליי עם `[hidden]` צריך כלל `display:none` מפורש.**
   `.lightbox`, `.nav-overlay` ו-`.a11y-panel` מוגדרים `display:grid/flex`,
   שגובר על ברירת המחדל של הדפדפן ל-`[hidden]`. בלי הכלל המפורש הם נשארים
   פרוסים על כל המסך ובולעים כל קליק בדף.

---

## עלייה לאוויר — מה נשאר לעשות

### שימור הדירוג בגוגל — לפי הסדר הזה

> ⚠️ **הדומיין הוא `casadobrasil.co.il` בלי `www`.** כל ה-canonical, המפה
> ו-`build_head.py` מכוונים לשם. שינוי לכתובת אחרת (למשל עם `www`) נחשב
> אצל גוגל למעבר אתר ומאפס חלק מהאותות — לא לגעת בלי סיבה.

1. [ ] **לתעד את המצב הנוכחי** לפני החלפה: ב-Search Console לייצא את
       Performance (16 חודשים) ואת Pages → Indexed. זו נקודת הייחוס היחידה
       שתאפשר לדעת אם משהו נפל אחרי המעבר.
2. [ ] **להשוות כתובות.** כל 47 המאמרים נשמרו ב-`/post/<slug>` הזהה לישן,
       וכל דפי הליבה (`/menu`, `/butcher`, `/vip`, `/faq`, `/benefits`,
       `/gallery`, `/blog`, `/privacy`, `/accessibility`) נשארו באותה כתובת.
       9 כתובות `/en/*` שאין להן מקבילה מכוסות בדפי הפניה בתיקיית `en/`
       (`_tools/build_redirects.py`) — canonical לעברית ו-`meta refresh`
       ל-`?lang=en`. GitHub Pages לא תומך ב-301 אמיתי, רק בזה.
3. [ ] **DNS.** קובץ `CNAME` בשורש עם `casadobrasil.co.il`, ואצל רושם הדומיין
       רשומות `A` ל-IP של GitHub Pages (דומיין שורש לא יכול להיות `CNAME`),
       ורשומת `CNAME` ל-`www` שתפנה למאגר — GitHub יפנה אותה לשורש.
4. [ ] **Enforce HTTPS** ב-GitHub Pages, אחרי שהתעודה הונפקה.
5. [ ] **`robots.txt`** — להחליף `Disallow: /` ב-`Allow: /`. רק אחרי שהדומיין
       כבר מצביע לכאן, אחרת נוצר תוכן כפול מול האתר הישן.
6. [ ] **Search Console** — להגיש את `sitemap.xml` מחדש ולבקש אינדוקס לדף הבית.
       הנכס קיים כבר (יש `google-site-verification` באתר הישן) — אין למחוק אותו.
7. [ ] **לעקוב שבועיים** אחרי Coverage ו-Performance. ירידה זמנית של 1-2 שבועות
       היא נורמלית; ירידה שנמשכת חודש מעידה על כתובת שנשברה.

### שאר המשימות

- [ ] **תוכן CASA FRIENDS** הוא טיוטה (`SITE.friends.draft = true`).
      לאשר את ההטבות והתנאים לפני פרסום.
- [ ] **טופס הרשמה** לדפי VIP ו-CASA FRIENDS. כרגע שניהם מפנים לטלפון.
- [ ] **וואטסאפ** — `SITE.business.whatsapp` מצביע על הקו הנייח ולא בשימוש.
      אם יש מספר נייד עסקי, לעדכן ולהוסיף כפתור לסרגל הצף.

---

## תחזוקה שוטפת

הקבצים `preview*.html` הם תצוגות מקדימות שנבנות מקומית ואינן חלק מהאתר —
הן מוחרגות ב-`.gitignore`.

עדכון: לערוך את `config.js`, לשמור, לרענן את הדפדפן. אין קומפילציה.
