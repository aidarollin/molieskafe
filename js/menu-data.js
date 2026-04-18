/* =========================================================
   MOLIES KAFE — MENU DATA
   Single source of truth. Used by both the public site
   (main.js) and the admin panel (admin.js).

   Changes made via the admin are saved to localStorage.
   The public site reads localStorage, falling back to
   DEFAULT_MENU if nothing has been saved yet.
   ========================================================= */

const MENU_STORAGE_KEY = 'molies_menu_v1';

const DEFAULT_MENU = [
  {
    id: 'coffee',
    category: 'Coffee',
    items: [
      { id: 'c1',  name: "Molies Klasik Ori",    price: 8,    desc: "Signature. Add whipping cream for the full experience." },
      { id: 'c2',  name: "Molies Klasik 'O'",    price: 10,   desc: "Black, clean, no sugar." },
      { id: 'c3',  name: "Espresso",             price: 8,    desc: "Single origin, rotating monthly." },
      { id: 'c4',  name: "Americano",            price: 10,   desc: "Double shot over hot water." },
      { id: 'c5',  name: "Cappuccino",           price: 10,   desc: "Espresso, steamed milk, light foam." },
      { id: 'c6',  name: "Mocha",                price: 10,   desc: "Espresso, chocolate, steamed milk." },
      { id: 'c7',  name: "Latte",                price: 12,   desc: "Velvet milk, no foam pyrotechnics." },
      { id: 'c8',  name: "Spanish Latte",        price: 12,   desc: "Equal parts coffee and trust." },
      { id: 'c9',  name: "Salted Caramel Latte", price: 14,   desc: "Sweet, salty, dangerous." },
      { id: 'c10', name: "Butterscotch Latte",   price: 14,   desc: "Warm and indulgent." },
      { id: 'c11', name: "Hazelnut Latte",       price: 14,   desc: "Roasted notes, gentle sweetness." }
    ]
  },
  {
    id: 'non-coffee',
    category: 'Non Coffee',
    items: [
      { id: 'nc1', name: "Water",                    price: 1,    desc: "Still, always available." },
      { id: 'nc2', name: "Iced Tea",                 price: 10,   desc: "Apple · Peach · Chamomile · Lemongrass" },
      { id: 'nc3', name: "Milk",                     price: 8,    desc: "Just pure milk." },
      { id: 'nc4', name: "Chocolate",                price: 12,   desc: "Real chocolate, hot or cold." },
      { id: 'nc5', name: "Chocolate Hazelnut",       price: 12,   desc: "Real chocolate, hot or cold." },
      { id: 'nc6', name: "Chocolate Strawberry",     price: 12,   desc: "Real chocolate, hot or cold." },
      { id: 'nc7', name: "Matcha Latte",             price: 14,   desc: "Ceremonial grade, lightly sweetened." },
      { id: 'nc8', name: "Matcha Hazelnut Latte",    price: 14,   desc: "Ceremonial grade, lightly sweetened." },
      { id: 'nc9', name: "Matcha Strawberry Latte",  price: 14,   desc: "Ceremonial grade, lightly sweetened." }
    ]
  },
  {
    id: 'refresher',
    category: 'Refresher',
    items: [
      { id: 'r1', name: "Sky Lemon Fizz",   price: 3.0, desc: "Crisp, citrusy, ice cold." },
      { id: 'r2', name: "Honey Lemon Fizz", price: 4.5, desc: "A little sweet, a little sharp." },
      { id: 'r3', name: "Golden Peach Fizz",price: 5.0, desc: "Soft peach with a fizzy finish." },
      { id: 'r4', name: "Berry Fizz Punch", price: 5.0, desc: "Mixed berry, bold colour." },
      { id: 'r5', name: "Berry Lemon Fizz", price: 5.0, desc: "Tangy, vibrant, refreshing." }
    ]
  },
  {
    id: 'kitchen',
    category: 'Kitchen',
    items: [
      { id: 'k1', name: "Mushroom Soup",    price: 5.0, desc: "Creamy, with warm bread to dip." },
      { id: 'k2', name: "Garlic Bread",     price: 3.5, desc: "Buttery, toasty, generous." },
      { id: 'k3', name: "Half-Boiled Eggs", price: 5.0, desc: "Soy, pepper, old-school." },
      { id: 'k4', name: "Toast",            price: 3.0, desc: "Kaya & butter, or chocolate." },
      { id: 'k5', name: "Croissant",        price: 3.0, desc: "Flaky, golden, warmed on request." },
      { id: 'k6', name: "Cinnamon Roll",    price: 3.0, desc: "Soft coils, sweet glaze." },
      { id: 'k7', name: "Waffle",           price: 5.0, desc: "Strawberry · chocolate · blueberry · peanut · butter" },
      { id: 'k8', name: "Ice Cream Waffle", price: 6.0, desc: "A scoop on top. That simple." },
      { id: 'k9', name: "Ice Cream Cone",   price: 1.0, desc: "For the in-between moments." }
    ]
  },
  {
    id: 'vendors',
    category: 'From Our Vendors',
    items: [
      { id: 'v1', name: "Nasi Lemak",             price: 3.0, desc: "The house plate. Sambal does the talking." },
      { id: 'v2', name: "Nasi Lemak Telur Mata",  price: 4.5, desc: "Same, with a sunny side egg." },
      { id: 'v3', name: "Roti Jala",              price: 5.0, desc: "Lacy, served with curry." }
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

function saveMenu(menu) {
  localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(menu));
}

function resetMenu() {
  localStorage.removeItem(MENU_STORAGE_KEY);
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
