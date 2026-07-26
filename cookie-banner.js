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

function setCookieChoice(accepted) {
  localStorage.setItem(STORAGE_KEY, accepted ? 'accepted' : 'declined');
  document.getElementById('baeloom-cookie-banner').remove();
  if (accepted) loadGA();
}

function initCookieBanner() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'accepted') { loadGA(); return; }
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
        We use cookies to understand how people use Baeloom. Read our
        <a href="./cookies.html" style="color:#FF6D1F;text-decoration:none;">Cookies Policy</a>.
      </p>
      <div style="display:flex;gap:10px;flex-shrink:0;">
        <button onclick="setCookieChoice(false)" style="
          padding:9px 22px;border-radius:100px;border:1px solid rgba(0,0,0,0.2);
          background:transparent;font-family:'Albert Sans',sans-serif;font-size:0.85rem;
          font-weight:500;color:#505050;cursor:pointer;transition:border-color 0.2s;
        " onmouseover="this.style.borderColor='#1a1a1a'" onmouseout="this.style.borderColor='rgba(0,0,0,0.2)'">
          Decline
        </button>
        <button onclick="setCookieChoice(true)" style="
          padding:9px 22px;border-radius:100px;border:none;
          background:#FF6D1F;font-family:'Albert Sans',sans-serif;font-size:0.85rem;
          font-weight:600;color:white;cursor:pointer;transition:background 0.2s;
        " onmouseover="this.style.background='#6A2500'" onmouseout="this.style.background='#FF6D1F'">
          Accept
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
