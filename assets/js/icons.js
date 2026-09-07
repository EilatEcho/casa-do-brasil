/* ==========================================================================
   icons.js - ספריית אייקונים (SVG inline, ללא תלות חיצונית)
   שימוש: ICON.phone, ICON.star וכו'. כולם aria-hidden - הטקסט הנגיש מגיע מהמעטפת.
   ========================================================================== */
window.ICON = (function () {
  const wrap = (path, extra = '') =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
      stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" ${extra}>${path}</svg>`;

  return {
    phone:   wrap('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>'),
    pin:     wrap('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>'),
    clock:   wrap('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    mail:    wrap('<rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="M3 7l9 6 9-6"/>'),
    globe:   wrap('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18z"/>'),
    calendar:wrap('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>'),
    arrow:   wrap('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    chevron: wrap('<path d="M9 6l6 6-6 6"/>'),
    close:   wrap('<path d="M6 6l12 12M18 6L6 18"/>'),
    plus:    wrap('<path d="M12 5v14M5 12h14"/>'),
    minus:   wrap('<path d="M5 12h14"/>'),
    check:   wrap('<path d="M4 12.5l5 5L20 6.5"/>'),
    flame:   wrap('<path d="M12 2s5 4.5 5 9a5 5 0 0 1-10 0c0-1.6.6-3 1.4-4.2.3 1.3 1.1 2.2 2 2.2 1.3 0 1.6-1.6 1.6-3.2C12 4.6 12 2 12 2z"/><path d="M7 13a5 5 0 0 0 10 0"/>'),
    crown:   wrap('<path d="M3 7l4 4 5-7 5 7 4-4-2 12H5L3 7z"/>'),
    glass:   wrap('<path d="M7 3h10l-1 6a4 4 0 0 1-8 0L7 3z"/><path d="M12 13v6M8.5 21h7"/>'),
    search:  wrap('<circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/>'),
    gift:    wrap('<rect x="3" y="8.5" width="18" height="12.5" rx="1"/><path d="M2 8.5h20M12 8.5V21"/><path d="M12 8.5S10.8 4 8.6 4a2.3 2.3 0 0 0 0 4.5zM12 8.5S13.2 4 15.4 4a2.3 2.3 0 0 1 0 4.5z"/>'),
    cookie:  wrap('<path d="M21 12a9 9 0 1 1-9-9 3.5 3.5 0 0 0 4 4 3.5 3.5 0 0 0 5 5z"/><circle cx="9" cy="10" r=".9" fill="currentColor"/><circle cx="13" cy="15" r=".9" fill="currentColor"/><circle cx="8" cy="15.5" r=".7" fill="currentColor"/>'),
    accessibility: wrap('<circle cx="12" cy="4.4" r="1.9" fill="currentColor" stroke="none"/><path d="M4.5 8.2c4.9 1.4 10.1 1.4 15 0"/><path d="M12 8.6v5.1m0 0l-2.6 6.8m2.6-6.8l2.6 6.8"/>'),
    contrast:wrap('<circle cx="12" cy="12" r="9"/><path d="M12 3v18a9 9 0 0 0 0-18z" fill="currentColor"/>'),
    sun:     wrap('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>'),
    droplet: wrap('<path d="M12 3s6 6.2 6 10a6 6 0 0 1-12 0c0-3.8 6-10 6-10z"/>'),
    link:    wrap('<path d="M10 13a4.5 4.5 0 0 0 6.6.4l2.4-2.4a4.6 4.6 0 0 0-6.5-6.5l-1.4 1.4"/><path d="M14 11a4.5 4.5 0 0 0-6.6-.4L5 13a4.6 4.6 0 0 0 6.5 6.5l1.4-1.4"/>'),
    type:    wrap('<path d="M4 6.5V5h16v1.5M12 5v14M8.5 19h7"/>'),
    spacing: wrap('<path d="M3 5h18M3 19h18M8 9.5h8M8 14.5h8"/>'),
    motion:  wrap('<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5h1.6v5H9.5zM12.9 9.5h1.6v5h-1.6z" fill="currentColor"/>'),
    cursor:  wrap('<path d="M5 3l14 8.5-6.2 1.3L16 20l-2.6 1.2-3.1-7.1L5 18z"/>'),
    guide:   wrap('<path d="M3 8h18M3 16h18"/><path d="M3 12h6M15 12h6" opacity=".45"/>'),
    reset:   wrap('<path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1"/><path d="M3 4v4.5h4.5"/>'),
    volume:  wrap('<path d="M11 5L6.5 9H3v6h3.5L11 19z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 6a9 9 0 0 1 0 12"/>'),
    muted:   wrap('<path d="M11 5L6.5 9H3v6h3.5L11 19z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>'),
    google:  `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z"/><path fill="#FBBC05" d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 0 0 0 9.2L6.4 14z"/><path fill="#EA4335" d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.4L6.4 10c.8-2.3 3-4.1 5.6-4.1z"/></svg>`,
    star:    `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.4l6.5-.9L12 2.6z"/></svg>`,
    quote:   `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M9.4 6C6.4 7.4 4.7 9.9 4.7 13v5h6.6v-6H8.1c0-2 .8-3.4 2.6-4.3L9.4 6zm9 0c-3 1.4-4.7 3.9-4.7 7v5h6.6v-6h-3.2c0-2 .8-3.4 2.6-4.3L18.4 6z"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg>`,
    facebook:  `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M14 9V7.2c0-.8.2-1.2 1.4-1.2H17V3h-2.6C11.2 3 10.2 4.6 10.2 7v2H8v3h2.2v9H14v-9h2.6l.4-3H14z"/></svg>`,
    tiktok:    `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M16.3 2h-3v13.2a2.6 2.6 0 1 1-2.2-2.6V9.5a5.8 5.8 0 1 0 5.2 5.8V8.9a6.6 6.6 0 0 0 3.9 1.3V7.1a3.9 3.9 0 0 1-3.9-3.9V2z"/></svg>`,
    waze:      `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 2C7 2 3 5.6 3 10c0 2.4 1.2 4.6 3.1 6-.2.9-.8 1.7-1.6 2.2-.4.3-.2 1 .3 1 2 0 3.7-.8 4.8-2 .8.2 1.6.2 2.4.2 5 0 9-3.6 9-8s-4-7.4-9-7.4zm-2.6 7.3a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4zm5.2 0a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4zM12 14.3c-1.9 0-3.5-1.1-4-2.6h8c-.5 1.5-2.1 2.6-4 2.6z"/></svg>`
  };
})();
