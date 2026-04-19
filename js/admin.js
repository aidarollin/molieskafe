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
  if (name === 'content')  renderContentAdmin();
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
// SETTINGS — SOCIAL + STUDIOS LOGO
// ============================================================
let capturedStudiosLogo = null;

function buildSocialCard(containerId, groupKey, heading, extra = '') {
  const social  = getSocial();
  const group   = social[groupKey] || {};

  const rows = SOCIAL_PLATFORMS.map(p => {
    const val     = group[p.key] || {};
    const enabled = val.enabled ?? false;
    const url     = val.url     ?? '';
    return `
      <div class="social-platform-row" data-spkey="${escHtml(p.key)}" data-spgroup="${groupKey}">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="sp-icon">${p.svg}</svg>
        <div class="sp-info">
          <span class="sp-label">${escHtml(p.label)}</span>
          <input type="url" class="sp-url" placeholder="https://..." value="${escHtml(url)}" />
        </div>
        <label class="toggle-switch" title="${enabled ? 'Enabled' : 'Disabled'}">
          <input type="checkbox" class="toggle-input" ${enabled ? 'checked' : ''} />
          <span class="toggle-track"></span>
        </label>
      </div>`;
  }).join('');

  document.getElementById(containerId).innerHTML = `
    <div class="settings-card">
      <div class="settings-card-header">
        <h3>${heading}</h3>
      </div>
      <div class="settings-card-body">
        ${extra}
        <div class="social-platforms-list">${rows}</div>
        <div class="settings-save-row">
          <button class="btn btn--primary btn--sm" data-save-social="${groupKey}">Save ${heading}</button>
          <span class="settings-saved-msg" data-saved-msg="${groupKey}" hidden>Saved!</span>
        </div>
      </div>
    </div>`;

  document.querySelector(`[data-save-social="${groupKey}"]`).addEventListener('click', () => saveSocialGroup(groupKey, containerId));
}

function saveSocialGroup(groupKey, containerId) {
  const social = getSocial();
  const group  = social[groupKey] || {};

  document.querySelectorAll(`#${containerId} [data-spgroup="${groupKey}"]`).forEach(row => {
    const key     = row.dataset.spkey;
    const url     = row.querySelector('.sp-url').value.trim();
    const enabled = row.querySelector('.toggle-input').checked;
    group[key]    = { url, enabled };
  });

  if (groupKey === 'studios') {
    const pageUrlInput = document.getElementById('studiosPageUrl');
    if (pageUrlInput) group.pageUrl = pageUrlInput.value.trim();
  }

  social[groupKey] = group;
  saveSocial(social);

  const msg = document.querySelector(`[data-saved-msg="${groupKey}"]`);
  if (msg) { msg.hidden = false; setTimeout(() => { msg.hidden = true; }, 2500); }
}

function buildStudiosExtra() {
  const customLogo  = getStudiosLogo();
  const previewSrc  = customLogo || '../assets/studios-logo.svg';
  const pageUrl     = getSocial().studios?.pageUrl ?? '';

  return `
    <div class="settings-sub-section">
      <div class="settings-sub-label">Studio Logo</div>
      <div class="studios-logo-preview" id="studiosLogoPreview">
        <img src="${escHtml(previewSrc)}" alt="Studios logo" id="studiosLogoImg" />
      </div>
      <div class="img-upload-controls" style="margin-top:10px">
        <label for="studiosLogoFile" class="btn btn--outline btn--sm">Upload Logo</label>
        <input type="file" id="studiosLogoFile" accept="image/*" />
        ${customLogo ? '<button type="button" class="btn btn--ghost btn--sm" id="clearStudiosLogoBtn">Remove Custom</button>' : ''}
      </div>
      <p class="img-upload-note" id="studiosLogoError" hidden></p>
    </div>
    <div class="settings-sub-section">
      <div class="settings-sub-label">Studio Page URL</div>
      <input type="url" id="studiosPageUrl" class="sp-url" style="width:100%" placeholder="https://…" value="${escHtml(pageUrl)}" />
      <p class="field-hint">Leave blank to hide the "Visit Studio Page" button.</p>
    </div>
    <div class="settings-sub-section">
      <div class="settings-sub-label">Studio Social Links</div>
    </div>`;
}

function renderSettings() {
  buildSocialCard('cafeSocialCard',    'cafe',    'Café Social Links');
  buildSocialCard('studiosSettingsCard', 'studios', 'Molies Studios', buildStudiosExtra());
  bindStudiosLogoUpload();
}

function bindStudiosLogoUpload() {
  const fileInput = document.getElementById('studiosLogoFile');
  const errEl     = document.getElementById('studiosLogoError');
  const imgEl     = document.getElementById('studiosLogoImg');
  const clearBtn  = document.getElementById('clearStudiosLogoBtn');

  fileInput?.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;
    if (file.size > 800 * 1024) {
      errEl.textContent = 'Logo must be under 800 KB.';
      errEl.hidden = false;
      fileInput.value = '';
      return;
    }
    errEl.hidden = true;
    const reader = new FileReader();
    reader.onload = ev => {
      saveStudiosLogo(ev.target.result);
      imgEl.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  clearBtn?.addEventListener('click', () => {
    clearStudiosLogo();
    imgEl.src = '../assets/studios-logo.svg';
    clearBtn.remove();
  });
}

// ============================================================
// CONTENT EDITOR
// ============================================================
const CONTENT_SECTIONS = [
  { label: 'Hero',    keys: ['hero.meta', 'hero.sub'] },
  { label: 'About',   keys: ['about.p1', 'about.p2', 'about.value1', 'about.value2', 'about.value3'] },
  { label: 'Contact', keys: ['contact.phone', 'contact.ig'] },
  { label: 'Footer',  keys: ['footer.copy'] },
];

const CONTENT_LABELS = {
  'hero.meta':     'Hero tagline (small text)',
  'hero.sub':      'Hero subtitle',
  'about.p1':      'About paragraph 1',
  'about.p2':      'About paragraph 2',
  'about.value1':  'Value i',
  'about.value2':  'Value ii',
  'about.value3':  'Value iii',
  'contact.phone': 'Phone number',
  'contact.ig':    'Instagram handle',
  'footer.copy':   'Footer copyright text',
};

function renderContentAdmin() {
  const wrap = document.getElementById('contentEditorWrap');
  if (!wrap) return;
  const c = getContent();

  wrap.innerHTML = CONTENT_SECTIONS.map(section => `
    <div class="content-section">
      <div class="content-section-label">${section.label}</div>
      ${section.keys.map(key => `
        <div class="content-field">
          <label class="content-field-label" for="cf-${key.replace('.', '-')}">${CONTENT_LABELS[key] || key}</label>
          <textarea class="content-field-input" id="cf-${key.replace('.', '-')}" data-ckey="${key}" rows="2">${escHtml(c[key] ?? '')}</textarea>
        </div>
      `).join('')}
    </div>
  `).join('') + `
    <div class="settings-save-row">
      <button class="btn btn--primary" id="saveContentBtn">Save All Content</button>
      <span class="settings-saved-msg" id="contentSaved" hidden>Saved!</span>
    </div>`;

  document.getElementById('saveContentBtn').addEventListener('click', () => {
    const c = getContent();
    wrap.querySelectorAll('[data-ckey]').forEach(el => {
      c[el.dataset.ckey] = el.value.trim();
    });
    saveContent(c);
    const msg = document.getElementById('contentSaved');
    msg.hidden = false;
    setTimeout(() => { msg.hidden = true; }, 2500);
  });
}

document.getElementById('resetContentBtn')?.addEventListener('click', () => {
  if (!confirm('Reset all content to default? Your edits will be lost.')) return;
  resetContent();
  if (activeSection === 'content') renderContentAdmin();
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
