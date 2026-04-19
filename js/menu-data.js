/* =========================================================
   MOLIES KAFE — DATA LAYER
   Single source of truth for all dynamic site content.
   Used by public site (main.js) and admin panel (admin.js).
   ========================================================= */

// ============================================================
// SOCIAL PLATFORMS — ordered list with SVG icon paths
// ============================================================
const SOCIAL_PLATFORMS = [
  {
    key: 'instagram', label: 'Instagram',
    svg: '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>'
  },
  {
    key: 'tiktok', label: 'TikTok',
    svg: '<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>'
  },
  {
    key: 'facebook', label: 'Facebook',
    svg: '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>'
  },
  {
    key: 'twitter', label: 'Twitter / X',
    svg: '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>'
  },
  {
    key: 'whatsapp', label: 'WhatsApp',
    svg: '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>'
  },
  {
    key: 'telegram', label: 'Telegram',
    svg: '<path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>'
  },
  {
    key: 'threads', label: 'Threads',
    svg: '<path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 1.868-.015 3.454-.438 4.688-1.244.998-.642 1.601-1.502 1.76-2.56l.006-.049c.067-.622.067-.622-.006-1.049-.1-.634-.401-1.11-.888-1.406-.538-.328-1.271-.458-2.132-.367l-.135.015-.09.011c-.562.053-1.036.23-1.404.523l-.06.046-.06.059c-.354.342-.535.754-.535 1.226 0 .15.014.302.043.459l-2.01-.376a4.55 4.55 0 01-.073-.726c0-1.016.364-1.92 1.05-2.604.555-.549 1.292-.92 2.168-1.086.83-.159 1.74-.14 2.617.055 1.054.236 1.944.72 2.538 1.359.684.738 1.022 1.712 1.002 2.858-.018.954-.32 1.874-.878 2.658-1.018 1.429-2.71 2.235-4.94 2.386-.17.012-.342.018-.514.018z"/>'
  }
];

// ============================================================
// MENU
// ============================================================
const MENU_STORAGE_KEY = 'molies_menu_v1';

const DEFAULT_MENU = [
  {
    id: 'coffee',
    category: 'Coffee',
    items: [
      { id: 'c1',  name: "Molies Klasik Ori",    price: 8,  desc: "Signature. Add whipping cream for the full experience.", image: null },
      { id: 'c2',  name: "Molies Klasik 'O'",    price: 10, desc: "Black, clean, no sugar.", image: null },
      { id: 'c3',  name: "Espresso",             price: 8,  desc: "Single origin, rotating monthly.", image: null },
      { id: 'c4',  name: "Americano",            price: 10, desc: "Double shot over hot water.", image: null },
      { id: 'c5',  name: "Cappuccino",           price: 10, desc: "Espresso, steamed milk, light foam.", image: null },
      { id: 'c6',  name: "Mocha",                price: 10, desc: "Espresso, chocolate, steamed milk.", image: null },
      { id: 'c7',  name: "Latte",                price: 12, desc: "Velvet milk, no foam pyrotechnics.", image: null },
      { id: 'c8',  name: "Spanish Latte",        price: 12, desc: "Equal parts coffee and trust.", image: null },
      { id: 'c9',  name: "Salted Caramel Latte", price: 14, desc: "Sweet, salty, dangerous.", image: null },
      { id: 'c10', name: "Butterscotch Latte",   price: 14, desc: "Warm and indulgent.", image: null },
      { id: 'c11', name: "Hazelnut Latte",       price: 14, desc: "Roasted notes, gentle sweetness.", image: null }
    ]
  },
  {
    id: 'non-coffee',
    category: 'Non Coffee',
    items: [
      { id: 'nc1', name: "Water",                   price: 1,  desc: "Still, always available.", image: null },
      { id: 'nc2', name: "Iced Tea",                price: 10, desc: "Apple · Peach · Chamomile · Lemongrass", image: null },
      { id: 'nc3', name: "Milk",                    price: 8,  desc: "Just pure milk.", image: null },
      { id: 'nc4', name: "Chocolate",               price: 12, desc: "Real chocolate, hot or cold.", image: null },
      { id: 'nc5', name: "Chocolate Hazelnut",      price: 12, desc: "Real chocolate, hot or cold.", image: null },
      { id: 'nc6', name: "Chocolate Strawberry",    price: 12, desc: "Real chocolate, hot or cold.", image: null },
      { id: 'nc7', name: "Matcha Latte",            price: 14, desc: "Ceremonial grade, lightly sweetened.", image: null },
      { id: 'nc8', name: "Matcha Hazelnut Latte",   price: 14, desc: "Ceremonial grade, lightly sweetened.", image: null },
      { id: 'nc9', name: "Matcha Strawberry Latte", price: 14, desc: "Ceremonial grade, lightly sweetened.", image: null }
    ]
  },
  {
    id: 'refresher',
    category: 'Refresher',
    items: [
      { id: 'r1', name: "Sky Lemon Fizz",    price: 3.0, desc: "Crisp, citrusy, ice cold.", image: null },
      { id: 'r2', name: "Honey Lemon Fizz",  price: 4.5, desc: "A little sweet, a little sharp.", image: null },
      { id: 'r3', name: "Golden Peach Fizz", price: 5.0, desc: "Soft peach with a fizzy finish.", image: null },
      { id: 'r4', name: "Berry Fizz Punch",  price: 5.0, desc: "Mixed berry, bold colour.", image: null },
      { id: 'r5', name: "Berry Lemon Fizz",  price: 5.0, desc: "Tangy, vibrant, refreshing.", image: null }
    ]
  },
  {
    id: 'kitchen',
    category: 'Kitchen',
    items: [
      { id: 'k1', name: "Mushroom Soup",    price: 5.0, desc: "Creamy, with warm bread to dip.", image: null },
      { id: 'k2', name: "Garlic Bread",     price: 3.5, desc: "Buttery, toasty, generous.", image: null },
      { id: 'k3', name: "Half-Boiled Eggs", price: 5.0, desc: "Soy, pepper, old-school.", image: null },
      { id: 'k4', name: "Toast",            price: 3.0, desc: "Kaya & butter, or chocolate.", image: null },
      { id: 'k5', name: "Croissant",        price: 3.0, desc: "Flaky, golden, warmed on request.", image: null },
      { id: 'k6', name: "Cinnamon Roll",    price: 3.0, desc: "Soft coils, sweet glaze.", image: null },
      { id: 'k7', name: "Waffle",           price: 5.0, desc: "Strawberry · chocolate · blueberry · peanut · butter", image: null },
      { id: 'k8', name: "Ice Cream Waffle", price: 6.0, desc: "A scoop on top. That simple.", image: null },
      { id: 'k9', name: "Ice Cream Cone",   price: 1.0, desc: "For the in-between moments.", image: null }
    ]
  },
  {
    id: 'vendors',
    category: 'From Our Vendors',
    items: [
      { id: 'v1', name: "Nasi Lemak",            price: 3.0, desc: "The house plate. Sambal does the talking.", image: null },
      { id: 'v2', name: "Nasi Lemak Telur Mata", price: 4.5, desc: "Same, with a sunny side egg.", image: null },
      { id: 'v3', name: "Roti Jala",             price: 5.0, desc: "Lacy, served with curry.", image: null }
    ]
  }
];

function getMenu() {
  try {
    const stored = localStorage.getItem(MENU_STORAGE_KEY);
    return stored ? JSON.parse(stored) : structuredClone(DEFAULT_MENU);
  } catch {
    return structuredClone(DEFAULT_MENU);
  }
}
function saveMenu(menu) { localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(menu)); _dbWrite('menu', { data: menu }); }
function resetMenu()    { localStorage.removeItem(MENU_STORAGE_KEY); _dbWrite('menu', { data: DEFAULT_MENU }); }

// ============================================================
// SERVICES
// ============================================================
const SERVICES_STORAGE_KEY = 'molies_services_v1';

const DEFAULT_SERVICES = [
  {
    id: 'dine-in',
    num: '01',
    title: 'Dine In',
    desc: 'A seat, a cup, and no rush. Come sit with us on weekends — we keep the music quiet and the coffee careful.',
    type: 'cafe'
  },
  {
    id: 'takeaway',
    num: '02',
    title: 'Takeaway',
    desc: 'Order at the counter and carry it out. Everything travels well — croissants, nasi lemak, and your flat white.',
    type: 'cafe'
  },
  {
    id: 'catering',
    num: '03',
    title: 'Catering & Events',
    desc: 'Planning a function? We set up dessert tables and full catering sections for events of all sizes — birthdays, corporate gatherings, weddings. Contact us to discuss your occasion.',
    type: 'cafe'
  },
  {
    id: 'studios',
    num: '04',
    title: 'Molies Studios',
    desc: 'Our creative arm. We handcraft floral arrangements from straw cleaners and offer henna art for events, weddings, and private bookings. Each piece is made to order.',
    type: 'studios',
    offerings: [
      { name: 'Floral Arrangements', desc: 'Handcrafted flowers made from straw cleaners — bouquets, centrepieces, and custom displays.' },
      { name: 'Henna Art', desc: 'Traditional and modern henna designs for events, weddings, and walk-ins.' }
    ]
  }
];

function getServices() {
  try {
    const stored = localStorage.getItem(SERVICES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : structuredClone(DEFAULT_SERVICES);
  } catch {
    return structuredClone(DEFAULT_SERVICES);
  }
}
function saveServices(s) { localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(s)); _dbWrite('services', { data: s }); }
function resetServices()  { localStorage.removeItem(SERVICES_STORAGE_KEY); _dbWrite('services', { data: DEFAULT_SERVICES }); }

// ============================================================
// REVIEWS
// ============================================================
const REVIEWS_STORAGE_KEY = 'molies_reviews_v1';

function getReviews() {
  try {
    const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}
function saveReviews(r) { localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(r)); _dbWrite('reviews', { data: r }); }

// ============================================================
// SOCIAL LINKS — v2 structure (cafe + studios, per platform)
// ============================================================
const SOCIAL_STORAGE_KEY = 'molies_social_v2';

const DEFAULT_SOCIAL = {
  cafe: {
    instagram: { url: 'https://instagram.com/molies.kafe',        enabled: true  },
    tiktok:    { url: 'https://www.tiktok.com/@molies.kafe',      enabled: true  },
    facebook:  { url: '',                                          enabled: false },
    twitter:   { url: '',                                          enabled: false },
    whatsapp:  { url: '',                                          enabled: false },
    telegram:  { url: '',                                          enabled: false },
    threads:   { url: '',                                          enabled: false }
  },
  studios: {
    instagram: { url: 'https://www.instagram.com/by.molies/',     enabled: true  },
    tiktok:    { url: 'https://www.tiktok.com/@molies.studio',    enabled: true  },
    facebook:  { url: '',                                          enabled: false },
    twitter:   { url: '',                                          enabled: false },
    whatsapp:  { url: '',                                          enabled: false },
    telegram:  { url: '',                                          enabled: false },
    threads:   { url: '',                                          enabled: false },
    pageUrl:   ''
  }
};

function getSocial() {
  try {
    const stored = localStorage.getItem(SOCIAL_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure pageUrl exists in older v2 saves
      if (parsed.studios && parsed.studios.pageUrl === undefined) parsed.studios.pageUrl = '';
      return parsed;
    }
    // Migrate from v1 flat structure
    const v1raw = localStorage.getItem('molies_social_v1');
    if (v1raw) {
      const v1 = JSON.parse(v1raw);
      const migrated = structuredClone(DEFAULT_SOCIAL);
      if (v1.instagram) migrated.cafe.instagram = { url: v1.instagram, enabled: true };
      if (v1.tiktok)    migrated.cafe.tiktok    = { url: v1.tiktok,    enabled: true };
      return migrated;
    }
    return structuredClone(DEFAULT_SOCIAL);
  } catch { return structuredClone(DEFAULT_SOCIAL); }
}
function saveSocial(s) { localStorage.setItem(SOCIAL_STORAGE_KEY, JSON.stringify(s)); _dbWrite('social', s); }

// ============================================================
// STUDIOS LOGO — custom upload (base64 or null = default SVG)
// ============================================================
const STUDIOS_LOGO_KEY = 'molies_studios_logo_v1';
function getStudiosLogo()         { return localStorage.getItem(STUDIOS_LOGO_KEY) || null; }
function saveStudiosLogo(dataUrl) { localStorage.setItem(STUDIOS_LOGO_KEY, dataUrl); _dbWrite('studiosLogo', { data: dataUrl }); }
function clearStudiosLogo()       { localStorage.removeItem(STUDIOS_LOGO_KEY); _dbWrite('studiosLogo', { data: '' }); }

// ============================================================
// SITE CONTENT — editable text fields
// ============================================================
const CONTENT_STORAGE_KEY = 'molies_content_v1';

const DEFAULT_CONTENT = {
  'hero.meta':      'Est. 2025 — Pantai Dalam',
  'hero.sub':       'A neighbourhood café for the unhurried, the curious, and the second cup.',
  'about.p1':       "Molie's Kafe is a small, laid-back café where the tables sit under an open tent and the counter is always within arm's reach. A handful of seats, a neighbourhood rhythm, and the kind of welcome that makes you want to stay for a second slice.",
  'about.p2':       'Every cake on our counter comes from a local warm kitchen. The brews are classic, the flavours are honest, and the door is always open for the unhurried.',
  'about.value1':   'Dine-in under the tent. Laid-back. Never rushed.',
  'about.value2':   'Classic brews and local favourites, done properly.',
  'about.value3':   'Wi-Fi exists. You\'ll have to ask for it.',
  'contact.phone':  '018-358 2814',
  'contact.ig':     '@molies.kafe',
  'contact.hours':  'Saturday & Sunday · 8:00am — 6:00pm',
  'footer.copy':    '© Molies Kafe — Kafe tingkap anda.'
};

function getContent() {
  try {
    const stored = localStorage.getItem(CONTENT_STORAGE_KEY);
    return stored ? { ...DEFAULT_CONTENT, ...JSON.parse(stored) } : { ...DEFAULT_CONTENT };
  } catch { return { ...DEFAULT_CONTENT }; }
}
function saveContent(c) { localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(c)); _dbWrite('content', c); }
function resetContent()  { localStorage.removeItem(CONTENT_STORAGE_KEY); _dbWrite('content', DEFAULT_CONTENT); }

// ============================================================
// GOOGLE REVIEWS INTEGRATION
// ============================================================
const GOOGLE_CONFIG_KEY = 'molies_google_config_v1';
const GOOGLE_SYNCED_KEY = 'molies_google_synced_v1';

function getGoogleConfig() {
  try { return JSON.parse(localStorage.getItem(GOOGLE_CONFIG_KEY)) || { apiKey: '', placeId: '', enabled: false }; }
  catch { return { apiKey: '', placeId: '', enabled: false }; }
}
function saveGoogleConfig(c) { localStorage.setItem(GOOGLE_CONFIG_KEY, JSON.stringify(c)); _dbWrite('googleConfig', c); }
function getGoogleSynced() {
  try { return new Set(JSON.parse(localStorage.getItem(GOOGLE_SYNCED_KEY)) || []); }
  catch { return new Set(); }
}
function saveGoogleSynced(s) {
  const arr = [...s];
  localStorage.setItem(GOOGLE_SYNCED_KEY, JSON.stringify(arr));
  _dbWrite('googleSynced', { data: arr });
}

// ============================================================
// CLOUD DATABASE — Firebase Firestore
// ============================================================
/*
  SETUP (one-time):
  1. Go to console.firebase.google.com → create a project.
  2. Add a Web app → copy the config object → paste into FB_CONFIG below.
  3. Enable Firestore Database (Start in test mode for now).
  4. Deploy. Data now syncs across all devices automatically.

  FREE TIER: 1 GB storage · 50 K reads/day · 20 K writes/day
  — more than enough for a café website.

  NOTE: Menu-item and review images are stored as base64.
  Keep photos ≤ 800 KB (already enforced by the upload forms).
  If your menu document approaches 900 KB, contact Google to
  confirm limits or switch to Firebase Storage for images.
*/
const FB_CONFIG = {
  apiKey:            'AIzaSyC3ncgtB7GyVnM66TxRQsoN5NN1J4kRk94',
  authDomain:        'molieskafe.firebaseapp.com',
  projectId:         'molieskafe',
  storageBucket:     'molieskafe.firebasestorage.app',
  messagingSenderId: '359569775022',
  appId:             '1:359569775022:web:259094f469bc69c772503f',
};

const FB_COLLECTION = 'molies_kafe';
let _fbDb = null;

function _dbReady() {
  if (_fbDb) return _fbDb;
  if (typeof firebase === 'undefined') return null;
  if (FB_CONFIG.apiKey === 'PASTE_YOUR_API_KEY') return null; // not yet configured
  try {
    if (!firebase.apps.length) firebase.initializeApp(FB_CONFIG);
    _fbDb = firebase.firestore();
    return _fbDb;
  } catch { return null; }
}

function _dbWrite(docId, payload) {
  const db = _dbReady();
  if (!db) return;
  // Strip undefined values (Firestore rejects them)
  const clean = JSON.parse(JSON.stringify(payload));
  db.collection(FB_COLLECTION).doc(docId).set(clean)
    .catch(e => console.warn('[DB] write failed:', docId, e));
}

// Mapping: Firestore doc → localStorage key + conversion helpers
const _DB_MAP = [
  { id: 'menu',        key: MENU_STORAGE_KEY,        fromDoc: d => JSON.stringify(d.data),     },
  { id: 'reviews',     key: REVIEWS_STORAGE_KEY,     fromDoc: d => JSON.stringify(d.data),     },
  { id: 'services',    key: SERVICES_STORAGE_KEY,    fromDoc: d => JSON.stringify(d.data),     },
  { id: 'social',      key: SOCIAL_STORAGE_KEY,      fromDoc: d => JSON.stringify(d),          },
  { id: 'content',     key: CONTENT_STORAGE_KEY,     fromDoc: d => JSON.stringify(d),          },
  { id: 'studiosLogo', key: STUDIOS_LOGO_KEY,        fromDoc: d => d.data || null,             },
  { id: 'googleConfig',key: GOOGLE_CONFIG_KEY,       fromDoc: d => JSON.stringify(d),          },
  { id: 'googleSynced',key: GOOGLE_SYNCED_KEY,       fromDoc: d => JSON.stringify(d.data || [])},
];

async function syncFromCloud() {
  const db = _dbReady();
  if (!db) return;

  // Avoid infinite reload loop: if we just reloaded because of a sync, skip once.
  if (sessionStorage.getItem('_db_just_synced')) {
    sessionStorage.removeItem('_db_just_synced');
    return;
  }

  try {
    const snap = await db.collection(FB_COLLECTION).get();
    let changed = false;

    snap.forEach(doc => {
      const map = _DB_MAP.find(m => m.id === doc.id);
      if (!map) return;

      const incoming = map.fromDoc(doc.data());
      if (incoming === null || incoming === 'null' || incoming === undefined) return;

      const current = localStorage.getItem(map.key);
      if (incoming !== current) {
        localStorage.setItem(map.key, incoming);
        changed = true;
      }
    });

    if (changed) {
      sessionStorage.setItem('_db_just_synced', '1');
      window.location.reload();
    }
  } catch (e) {
    console.warn('[DB] sync failed:', e);
  }
}

// Kick off sync as soon as the script loads (non-blocking).
syncFromCloud();

// ============================================================
// UTILITIES
// ============================================================
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
