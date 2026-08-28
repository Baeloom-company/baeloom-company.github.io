// ── Baeloom Cookie Consent + Google Analytics ────────────────────────────────
// Replace GA_MEASUREMENT_ID with your actual GA4 measurement ID (e.g. G-XXXXXXXXXX)
const GA_ID = 'G-9ZHWJT4GV0';
const STORAGE_KEY = 'baeloom_cookie_consent';

// Load GA only if consent was given
function loadGA() {
  if (!GA_ID) return;
  const s = document.createElement('script');
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  s.async = true;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });
}

// Meta Pixel, loaded on the same consent as GA. Nothing fires before the
// visitor accepts: the script tag itself is only injected from here, so a
// declined visitor never contacts Meta at all.
const META_PIXEL_ID = '1512250620726066';

function loadMetaPixel() {
  if (!META_PIXEL_ID || window.fbq) return;
  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
    t = b.createElement(e); t.async = !0; t.src = v;
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', META_PIXEL_ID);
  fbq('track', 'PageView');
}

// Fired when someone leaves the site for the app. This is the closest thing to
// a signup that can be measured without putting a pixel (and a second consent
// banner) on chat.baeloom.com. Per-ad it answers: which creative sent people
// who actually wanted in.
function trackAppClick() {
  if (window.fbq) fbq('trackCustom', 'ClickToApp');
}

function wireAppLinks() {
  document.querySelectorAll('a[href*="chat.baeloom.com"]').forEach((a) => {
    a.addEventListener('click', trackAppClick);
  });
}

function setCookieChoice(accepted) {
  localStorage.setItem(STORAGE_KEY, accepted ? 'accepted' : 'declined');
  document.getElementById('baeloom-cookie-banner').remove();
  if (accepted) { loadGA(); loadMetaPixel(); wireAppLinks(); }
}

// The banner sat in English on the Dutch site too. Language comes from the
// path: everything under /nl/ is the Dutch site.
const COOKIE_NL = location.pathname.indexOf('/nl/') === 0 || location.pathname.indexOf('/nl') === 0;
const COOKIE_TXT = COOKIE_NL
  ? {
      body: 'We gebruiken cookies om te begrijpen hoe Baeloom gebruikt wordt. Lees ons ',
      link: 'cookiebeleid',
      decline: 'Weigeren',
      accept: 'Akkoord'
    }
  : {
      body: 'We use cookies to understand how people use Baeloom. Read our ',
      link: 'Cookies Policy',
      decline: 'Decline',
      accept: 'Accept'
    };

function initCookieBanner() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'accepted') { loadGA(); loadMetaPixel(); wireAppLinks(); return; }
  if (stored === 'declined') return;

  // Build banner
  const banner = document.createElement('div');
  banner.id = 'baeloom-cookie-banner';
  banner.innerHTML = `
    <div style="
      position:fixed;bottom:0;left:0;right:0;z-index:9999;
      background:#FCF7F0;
      border-top:1px solid rgba(0,0,0,0.08);
      padding:16px 24px;
      display:flex;align-items:center;justify-content:space-between;gap:16px;
      flex-wrap:wrap;
      font-family:'Albert Sans',sans-serif;
      box-shadow:0 -4px 24px rgba(0,0,0,0.06);
    ">
      <p style="margin:0;font-size:0.85rem;color:#505050;line-height:1.5;flex:1;min-width:220px;">
        ${COOKIE_TXT.body}<a href="${COOKIE_NL ? '../cookies.html' : './cookies.html'}" style="color:#FF6D1F;text-decoration:none;">${COOKIE_TXT.link}</a>.
      </p>
      <div style="display:flex;gap:10px;flex-shrink:0;">
        <button onclick="setCookieChoice(false)" style="
          padding:9px 22px;border-radius:100px;border:1px solid rgba(0,0,0,0.2);
          background:transparent;font-family:'Albert Sans',sans-serif;font-size:0.85rem;
          font-weight:500;color:#505050;cursor:pointer;transition:border-color 0.2s;
        " onmouseover="this.style.borderColor='#1a1a1a'" onmouseout="this.style.borderColor='rgba(0,0,0,0.2)'">
          ${COOKIE_TXT.decline}
        </button>
        <button onclick="setCookieChoice(true)" style="
          padding:9px 22px;border-radius:100px;border:none;
          background:#FF6D1F;font-family:'Albert Sans',sans-serif;font-size:0.85rem;
          font-weight:600;color:white;cursor:pointer;transition:background 0.2s;
        " onmouseover="this.style.background='#6A2500'" onmouseout="this.style.background='#FF6D1F'">
          ${COOKIE_TXT.accept}
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(banner);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCookieBanner);
} else {
  initCookieBanner();
}
