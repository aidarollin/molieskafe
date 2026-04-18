/* =========================================================
   MOLIES KAFE — ADMIN SCRIPT
   Depends on: js/menu-data.js

   Default password: molieskafe2025
   Session expires on tab/window close (sessionStorage).
   ========================================================= */

const ADMIN_PW = 'molieskafe2025';

// ============================================================
// AUTH
// ============================================================
const loginOverlay = document.getElementById('loginOverlay');
const adminWrap    = document.getElementById('adminWrap');

function isAuthed() { return sessionStorage.getItem('molies_admin_auth') === '1'; }

function showDashboard() {
  loginOverlay.hidden = true;
  adminWrap.hidden    = false;
  initAdmin();
}
function showLogin() {
  loginOverlay.hidden = false;
  adminWrap.hidden    = true;
}

document.getElementById('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const input = document.getElementById('loginPassword');
  const error = document.getElementById('loginError');
  if (input.value === ADMIN_PW) {
    sessionStorage.setItem('molies_admin_auth', '1');
    error.classList.remove('show');
    showDashboard();
  } else {
    error.classList.add('show');
    input.value = '';
    input.focus();
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem('molies_admin_auth');
  showLogin();
});

isAuthed() ? showDashboard() : showLogin();

// ============================================================
// SECTION NAVIGATION
// ============================================================
let activeSection = 'menu';

document.getElementById('adminSectionNav').addEventListener('click', e => {
  const btn = e.target.closest('.asn-btn');
  if (!btn) return;
  switchSection(btn.dataset.section);
});

function switchSection(name) {
  activeSection = name;

  document.querySelectorAll('.asn-btn').forEach(b => b.classList.toggle('active', b.dataset.section === name));
  document.querySelectorAll('.admin-section').forEach(s => { s.hidden = s.id !== `section${cap(name)}`; });

  if (name === 'menu')     renderMenuAdmin();
  if (name === 'services') renderServicesAdmin();
  if (name === 'reviews')  renderReviewsAdmin();
  if (name === 'settings') renderSettings();
}

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function initAdmin() {
  updatePendingBadge();
  switchSection('menu');
}

function updatePendingBadge() {
  const count = getReviews().filter(r => r.status === 'pending').length;
  const badge = document.getElementById('pendingBadge');
  badge.textContent = count;
  badge.hidden = count === 0;
}

// ============================================================
// MENU — CRUD
// ============================================================
let activeCatId = null;

function renderMenuAdmin() {
  const menu = getMenu();
  if (!activeCatId || !menu.find(c => c.id === activeCatId)) {
    activeCatId = menu[0]?.id ?? null;
  }
  renderCatTabs(menu);
  renderItemsPanel(menu);
}

function renderCatTabs(menu) {
  const tabs = document.getElementById('catTabs');
  tabs.innerHTML = menu.map(cat => `
    <button class="cat-tab ${cat.id === activeCatId ? 'active' : ''}"
      data-cat="${escHtml(cat.id)}" role="tab" aria-selected="${cat.id === activeCatId}">
      ${escHtml(cat.category)}
    </button>
  `).join('');

  tabs.querySelectorAll('.cat-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCatId = btn.dataset.cat;
      renderMenuAdmin();
    });
  });
}

function renderItemsPanel(menu) {
  const panel = document.getElementById('itemsPanel');
  const cat   = menu.find(c => c.id === activeCatId);

  if (!cat) {
    panel.innerHTML = `<div class="empty-state"><p>No categories yet. Click <strong>+ New Category</strong>.</p></div>`;
    return;
  }

  const rows = cat.items.length
    ? cat.items.map(item => `
        <tr data-item-id="${escHtml(item.id)}">
          <td>
            ${item.image ? `<img src="${item.image}" class="td-thumb" alt="${escHtml(item.name)}" />` : ''}
          </td>
          <td>
            <div class="td-name">${escHtml(item.name)}</div>
            <div class="td-desc">${escHtml(item.desc)}</div>
          </td>
          <td class="td-price">RM&nbsp;${escHtml(String(item.price))}</td>
          <td>
            <div class="td-actions">
              <button class="btn--icon-edit"   data-action="edit">Edit</button>
              <button class="btn--icon-delete" data-action="delete">Delete</button>
            </div>
          </td>
        </tr>
      `).join('')
    : `<tr><td colspan="4"><div class="empty-state"><p>No items yet.</p><button class="btn btn--primary" id="emptyAddBtn">+ Add First Item</button></div></td></tr>`;

  panel.innerHTML = `
    <div class="panel-header">
      <span class="panel-title">${escHtml(cat.category)}</span>
      <div class="panel-header-actions">
        <button class="btn btn--primary" id="panelAddItemBtn">+ Add Item</button>
      </div>
    </div>
    <table class="items-table" aria-label="${escHtml(cat.category)} items">
      <thead><tr>
        <th style="width:54px">Photo</th>
        <th>Item</th>
        <th style="width:110px">Price</th>
        <th style="width:130px;text-align:right">Actions</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="panel-footer">
      <button class="btn btn--danger-outline" id="deleteCatBtn">Delete Category</button>
    </div>
  `;

  document.getElementById('panelAddItemBtn')?.addEventListener('click', () => openItemModal());
  document.getElementById('emptyAddBtn')?.addEventListener('click',    () => openItemModal());
  document.getElementById('deleteCatBtn')?.addEventListener('click',   () => deleteCategory(cat));

  panel.querySelectorAll('tr[data-item-id]').forEach(row => {
    const item = cat.items.find(i => i.id === row.dataset.itemId);
    if (!item) return;
    row.querySelector('[data-action="edit"]')?.addEventListener('click',   () => openItemModal(item, cat.id));
    row.querySelector('[data-action="delete"]')?.addEventListener('click', () => deleteItem(cat, item));
  });
}

// Delete helpers
function deleteItem(cat, item) {
  if (!confirm(`Delete "${item.name}"?`)) return;
  const menu = getMenu();
  const c    = menu.find(c => c.id === cat.id);
  if (!c) return;
  c.items = c.items.filter(i => i.id !== item.id);
  saveMenu(menu);
  renderMenuAdmin();
}

function deleteCategory(cat) {
  const msg = cat.items.length
    ? `Delete "${cat.category}" and its ${cat.items.length} item(s)? This cannot be undone.`
    : `Delete category "${cat.category}"?`;
  if (!confirm(msg)) return;
  const newMenu = getMenu().filter(c => c.id !== cat.id);
  activeCatId   = newMenu[0]?.id ?? null;
  saveMenu(newMenu);
  renderMenuAdmin();
}

// Reset menu
document.getElementById('resetMenuBtn')?.addEventListener('click', () => {
  if (!confirm('Reset entire menu to default? All changes will be lost.')) return;
  resetMenu();
  activeCatId = null;
  renderMenuAdmin();
});

// Toolbar add item / category
document.getElementById('addItemBtn')?.addEventListener('click', () => openItemModal());
document.getElementById('addCategoryBtn')?.addEventListener('click', () => {
  catModalOverlay.hidden = false;
  document.getElementById('fCatName').focus();
});

// ============================================================
// ITEM MODAL
// ============================================================
const itemModalOverlay = document.getElementById('itemModalOverlay');
const itemForm         = document.getElementById('itemForm');
let   capturedItemImg  = null;   // base64 or null

function openItemModal(item = null, ownerCatId = null) {
  const menu = getMenu();
  document.getElementById('itemModalTitle').textContent = item ? 'Edit Item' : 'Add Item';

  const catSelect = document.getElementById('fItemCategory');
  catSelect.innerHTML = menu.map(c =>
    `<option value="${escHtml(c.id)}">${escHtml(c.category)}</option>`
  ).join('');
  catSelect.value = ownerCatId ?? activeCatId ?? menu[0]?.id ?? '';

  document.getElementById('fItemId').value    = item?.id    ?? '';
  document.getElementById('fItemName').value  = item?.name  ?? '';
  document.getElementById('fItemPrice').value = item?.price ?? '';
  document.getElementById('fItemDesc').value  = item?.desc  ?? '';

  // Image preview
  capturedItemImg = item?.image ?? null;
  refreshItemImgPreview();

  itemModalOverlay.hidden = false;
  document.getElementById('fItemName').focus();
}

function refreshItemImgPreview() {
  const box    = document.getElementById('itemImgPreview');
  const remove = document.getElementById('removeItemImg');
  if (capturedItemImg) {
    box.innerHTML = `<img src="${capturedItemImg}" alt="Preview" />`;
    remove.hidden = false;
  } else {
    box.innerHTML = `<span class="img-preview-placeholder">No image</span>`;
    remove.hidden = true;
  }
}

document.getElementById('fItemImage')?.addEventListener('change', e => {
  const file = e.target.files[0];
  const errEl = document.getElementById('imgUploadError');
  if (!file) return;
  if (file.size > 800 * 1024) {
    errEl.textContent = 'Image must be under 800 KB.';
    errEl.hidden = false;
    e.target.value = '';
    return;
  }
  errEl.hidden = true;
  const reader = new FileReader();
  reader.onload = ev => {
    capturedItemImg = ev.target.result;
    refreshItemImgPreview();
  };
  reader.readAsDataURL(file);
});

document.getElementById('removeItemImg')?.addEventListener('click', () => {
  capturedItemImg = null;
  document.getElementById('fItemImage').value = '';
  refreshItemImgPreview();
});

function closeItemModal() { itemModalOverlay.hidden = true; itemForm.reset(); capturedItemImg = null; }
document.getElementById('itemModalClose').addEventListener('click',  closeItemModal);
document.getElementById('itemModalCancel').addEventListener('click', closeItemModal);
itemModalOverlay.addEventListener('click', e => { if (e.target === itemModalOverlay) closeItemModal(); });

itemForm.addEventListener('submit', e => {
  e.preventDefault();
  const id       = document.getElementById('fItemId').value;
  const name     = document.getElementById('fItemName').value.trim();
  const price    = parseFloat(document.getElementById('fItemPrice').value);
  const desc     = document.getElementById('fItemDesc').value.trim();
  const newCatId = document.getElementById('fItemCategory').value;
  if (!name || isNaN(price) || price < 0) return;

  const menu   = getMenu();
  const newCat = menu.find(c => c.id === newCatId);
  if (!newCat) return;

  if (id) {
    const oldCat = menu.find(c => c.items.some(i => i.id === id));
    if (!oldCat) return;
    if (oldCat.id === newCatId) {
      const item = oldCat.items.find(i => i.id === id);
      item.name = name; item.price = price; item.desc = desc; item.image = capturedItemImg;
    } else {
      oldCat.items = oldCat.items.filter(i => i.id !== id);
      newCat.items.push({ id, name, price, desc, image: capturedItemImg });
    }
  } else {
    newCat.items.push({ id: generateId(), name, price, desc, image: capturedItemImg });
  }

  activeCatId = newCatId;
  saveMenu(menu);
  closeItemModal();
  renderMenuAdmin();
});

// ============================================================
// CATEGORY MODAL
// ============================================================
const catModalOverlay = document.getElementById('catModalOverlay');
const catForm         = document.getElementById('catForm');

function closeCatModal() { catModalOverlay.hidden = true; catForm.reset(); }
document.getElementById('catModalClose').addEventListener('click',  closeCatModal);
document.getElementById('catModalCancel').addEventListener('click', closeCatModal);
catModalOverlay.addEventListener('click', e => { if (e.target === catModalOverlay) closeCatModal(); });

catForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('fCatName').value.trim();
  if (!name) return;
  const menu  = getMenu();
  const newId = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '') + '-' + generateId();
  menu.push({ id: newId, category: name, items: [] });
  activeCatId = newId;
  saveMenu(menu);
  closeCatModal();
  renderMenuAdmin();
});

// ============================================================
// SERVICES ADMIN
// ============================================================
function renderServicesAdmin() {
  const list = document.getElementById('servicesList');
  if (!list) return;
  const services = getServices();

  list.innerHTML = `<div class="services-admin-list">${services.map(s => `
    <div class="service-admin-card ${s.type === 'studios' ? 'service-admin-card--studios' : ''}" data-svc-id="${escHtml(s.id)}">
      <div class="service-admin-info">
        <div class="service-admin-badge">${s.type === 'studios' ? 'Studios' : 'Café Service'} · ${escHtml(s.num)}</div>
        <div class="service-admin-title">${escHtml(s.title)}</div>
        <div class="service-admin-desc">${escHtml(s.desc)}</div>
      </div>
      <div class="service-admin-actions">
        <button class="btn--icon-edit" data-saction="edit">Edit</button>
      </div>
    </div>
  `).join('')}</div>`;

  list.querySelectorAll('[data-svc-id]').forEach(card => {
    const s = services.find(sv => sv.id === card.dataset.svcId);
    card.querySelector('[data-saction="edit"]')?.addEventListener('click', () => openServiceModal(s));
  });
}

document.getElementById('resetServicesBtn')?.addEventListener('click', () => {
  if (!confirm('Reset services to default?')) return;
  resetServices();
  renderServicesAdmin();
});

// Service modal
const serviceModalOverlay = document.getElementById('serviceModalOverlay');
const serviceForm         = document.getElementById('serviceForm');
let   currentOfferings    = [];

function openServiceModal(s) {
  document.getElementById('fServiceId').value    = s.id;
  document.getElementById('fServiceTitle').value = s.title;
  document.getElementById('fServiceDesc').value  = s.desc;

  const offeringsSection = document.getElementById('offeringsSection');
  if (s.type === 'studios') {
    offeringsSection.hidden = false;
    currentOfferings = structuredClone(s.offerings || []);
    renderOfferingsEditor();
  } else {
    offeringsSection.hidden = true;
    currentOfferings = [];
  }

  serviceModalOverlay.hidden = false;
  document.getElementById('fServiceTitle').focus();
}

function renderOfferingsEditor() {
  const list = document.getElementById('offeringsList');
  list.innerHTML = currentOfferings.map((o, i) => `
    <div class="offering-row" data-oi="${i}">
      <div class="offering-row-label">Name</div>
      <input type="text" class="o-name" value="${escHtml(o.name)}" placeholder="Offering name" />
      <div class="offering-row-label" style="margin-top:8px">Description</div>
      <input type="text" class="o-desc" value="${escHtml(o.desc)}" placeholder="Short description" />
      <button type="button" class="offering-remove" data-oi="${i}" aria-label="Remove">✕</button>
    </div>
  `).join('');

  list.querySelectorAll('.offering-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      currentOfferings.splice(parseInt(btn.dataset.oi), 1);
      renderOfferingsEditor();
    });
  });
}

document.getElementById('addOfferingBtn')?.addEventListener('click', () => {
  currentOfferings.push({ name: '', desc: '' });
  renderOfferingsEditor();
});

function closeServiceModal() { serviceModalOverlay.hidden = true; serviceForm.reset(); currentOfferings = []; }
document.getElementById('serviceModalClose').addEventListener('click',  closeServiceModal);
document.getElementById('serviceModalCancel').addEventListener('click', closeServiceModal);
serviceModalOverlay.addEventListener('click', e => { if (e.target === serviceModalOverlay) closeServiceModal(); });

serviceForm.addEventListener('submit', e => {
  e.preventDefault();
  const id    = document.getElementById('fServiceId').value;
  const title = document.getElementById('fServiceTitle').value.trim();
  const desc  = document.getElementById('fServiceDesc').value.trim();
  if (!title) return;

  // Collect current offerings from inputs
  document.querySelectorAll('#offeringsList .offering-row').forEach((row, i) => {
    const name = row.querySelector('.o-name')?.value.trim() ?? '';
    const odesc = row.querySelector('.o-desc')?.value.trim() ?? '';
    if (currentOfferings[i]) { currentOfferings[i].name = name; currentOfferings[i].desc = odesc; }
  });

  const services = getServices();
  const svc = services.find(s => s.id === id);
  if (!svc) return;
  svc.title = title;
  svc.desc  = desc;
  if (svc.type === 'studios') svc.offerings = currentOfferings.filter(o => o.name);
  saveServices(services);
  closeServiceModal();
  renderServicesAdmin();
});

// ============================================================
// REVIEWS ADMIN
// ============================================================
let activeRevTab = 'pending';

function renderReviewsAdmin() {
  const reviews  = getReviews();
  const pending  = reviews.filter(r => r.status === 'pending');
  const approved = reviews.filter(r => r.status === 'approved');

  document.getElementById('pendingCount').textContent  = pending.length;
  document.getElementById('approvedCount').textContent = approved.length;
  updatePendingBadge();

  renderRevList('pendingList',  pending,  'pending');
  renderRevList('approvedList', approved, 'approved');
}

function renderRevList(containerId, list, type) {
  const el = document.getElementById(containerId);
  if (!list.length) {
    el.innerHTML = `<div class="review-empty">No ${type} reviews.</div>`;
    return;
  }
  el.innerHTML = list.map(r => `
    <div class="review-admin-card" data-rev-id="${escHtml(r.id)}">
      <div>
        <div class="review-admin-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
        <div class="review-admin-name">${escHtml(r.name)}</div>
        <div class="review-admin-date">${escHtml(r.date)}</div>
        <div class="review-admin-text">${escHtml(r.text)}</div>
        ${r.image ? `<img src="${r.image}" class="review-admin-img" alt="Review image" loading="lazy" />` : ''}
      </div>
      <div class="review-admin-actions">
        ${type === 'pending'
          ? `<button class="btn btn--primary btn--sm"         data-raction="approve">Approve</button>
             <button class="btn btn--danger-outline btn--sm"  data-raction="reject">Reject</button>`
          : `<button class="btn btn--danger-outline btn--sm"  data-raction="remove">Remove</button>`}
      </div>
    </div>
  `).join('');

  el.querySelectorAll('[data-rev-id]').forEach(card => {
    const id = card.dataset.revId;
    card.querySelector('[data-raction="approve"]')?.addEventListener('click', () => setReviewStatus(id, 'approved'));
    card.querySelector('[data-raction="reject"]')?.addEventListener('click',  () => setReviewStatus(id, 'rejected'));
    card.querySelector('[data-raction="remove"]')?.addEventListener('click',  () => setReviewStatus(id, 'rejected'));
  });
}

function setReviewStatus(id, status) {
  let reviews = getReviews();
  if (status === 'rejected') {
    reviews = reviews.filter(r => r.id !== id);
  } else {
    const r = reviews.find(r => r.id === id);
    if (r) r.status = status;
  }
  saveReviews(reviews);
  renderReviewsAdmin();
}

// Review tab switching
document.getElementById('sectionReviews')?.addEventListener('click', e => {
  const tab = e.target.closest('.rev-tab');
  if (!tab) return;
  activeRevTab = tab.dataset.rtab;
  document.querySelectorAll('.rev-tab').forEach(t => t.classList.toggle('active', t.dataset.rtab === activeRevTab));
  document.getElementById('revPanelPending').hidden  = activeRevTab !== 'pending';
  document.getElementById('revPanelApproved').hidden = activeRevTab !== 'approved';
});

// ============================================================
// SETTINGS — SOCIAL LINKS
// ============================================================
function renderSettings() {
  const social = getSocial();
  document.getElementById('fInstagram').value = social.instagram ?? '';
  document.getElementById('fTiktok').value    = social.tiktok    ?? '';
  document.getElementById('socialSaved').hidden = true;
}

document.getElementById('socialForm')?.addEventListener('submit', e => {
  e.preventDefault();
  saveSocial({
    instagram: document.getElementById('fInstagram').value.trim(),
    tiktok:    document.getElementById('fTiktok').value.trim()
  });
  const saved = document.getElementById('socialSaved');
  saved.hidden = false;
  setTimeout(() => { saved.hidden = true; }, 2500);
});

// ============================================================
// GLOBAL KEYBOARD
// ============================================================
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (!itemModalOverlay.hidden)    closeItemModal();
  if (!catModalOverlay.hidden)     closeCatModal();
  if (!serviceModalOverlay.hidden) closeServiceModal();
});
