/* =========================================================
   MOLIES KAFE — DATA LAYER
   Single source of truth for all dynamic site content.
   Used by public site (main.js) and admin panel (admin.js).
   ========================================================= */

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
      { id: 'r1', name: "Sky Lemon Fizz",   price: 3.0, desc: "Crisp, citrusy, ice cold.", image: null },
      { id: 'r2', name: "Honey Lemon Fizz", price: 4.5, desc: "A little sweet, a little sharp.", image: null },
      { id: 'r3', name: "Golden Peach Fizz",price: 5.0, desc: "Soft peach with a fizzy finish.", image: null },
      { id: 'r4', name: "Berry Fizz Punch", price: 5.0, desc: "Mixed berry, bold colour.", image: null },
      { id: 'r5', name: "Berry Lemon Fizz", price: 5.0, desc: "Tangy, vibrant, refreshing.", image: null }
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
function saveMenu(menu)  { localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(menu)); }
function resetMenu()     { localStorage.removeItem(MENU_STORAGE_KEY); }

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
function saveServices(s) { localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(s)); }
function resetServices()  { localStorage.removeItem(SERVICES_STORAGE_KEY); }

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
function saveReviews(r) { localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(r)); }

// ============================================================
// SOCIAL LINKS
// ============================================================
const SOCIAL_STORAGE_KEY = 'molies_social_v1';

const DEFAULT_SOCIAL = {
  instagram: 'https://instagram.com/molies.kafe',
  tiktok:    'https://www.tiktok.com/@molies.kafe'
};

function getSocial() {
  try {
    const stored = localStorage.getItem(SOCIAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : { ...DEFAULT_SOCIAL };
  } catch { return { ...DEFAULT_SOCIAL }; }
}
function saveSocial(s) { localStorage.setItem(SOCIAL_STORAGE_KEY, JSON.stringify(s)); }

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
