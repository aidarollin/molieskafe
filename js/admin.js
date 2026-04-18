/* =========================================================
   MOLIES KAFE — ADMIN SCRIPT
   Depends on: js/menu-data.js (loaded first in admin/index.html)

   Default password: molieskafe2025
   Session expires when the browser tab/window is closed.
   ========================================================= */

const ADMIN_PW = 'molieskafe2025';

// ============================================================
// AUTH
// ============================================================

const loginOverlay = document.getElementById('loginOverlay');
const adminWrap    = document.getElementById('adminWrap');

function isAuthed() {
  return sessionStorage.getItem('molies_admin_auth') === '1';
}

function showDashboard() {
  loginOverlay.hidden = true;
  adminWrap.hidden    = false;
  renderAdmin();
}

function showLogin() {
  loginOverlay.hidden = false;
  adminWrap.hidden    = true;
}

document.getElementById('loginForm').addEventListener('submit', (e) => {
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
// STATE
// ============================================================

let activeCatId = null;

// ============================================================
// RENDER
// ============================================================

function renderAdmin() {
  const menu = getMenu();

  // Default to first category if none selected or selection gone
  if (!activeCatId || !menu.find(c => c.id === activeCatId)) {
    activeCatId = menu[0]?.id ?? null;
  }

  renderTabs(menu);
  renderItemsPanel(menu);
}

function renderTabs(menu) {
  const tabs = document.getElementById('catTabs');

  tabs.innerHTML = menu.map(cat => `
    <button
      class="cat-tab ${cat.id === activeCatId ? 'active' : ''}"
      data-cat="${escHtml(cat.id)}"
      role="tab"
      aria-selected="${cat.id === activeCatId}"
    >${escHtml(cat.category)}</button>
  `).join('');

  tabs.querySelectorAll('.cat-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCatId = btn.dataset.cat;
      renderAdmin();
    });
  });
}

function renderItemsPanel(menu) {
  const panel = document.getElementById('itemsPanel');
  const cat   = menu.find(c => c.id === activeCatId);

  if (!cat) {
    panel.innerHTML = `
      <div class="empty-state">
        <p>No categories yet. Click <strong>+ New Category</strong> to get started.</p>
      </div>`;
    return;
  }

  const rows = cat.items.length
    ? cat.items.map(item => `
        <tr data-item-id="${escHtml(item.id)}">
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
    : `<tr><td colspan="3">
        <div class="empty-state">
          <p>No items yet in this category.</p>
          <button class="btn btn--primary" id="emptyAddBtn">+ Add First Item</button>
        </div>
       </td></tr>`;

  panel.innerHTML = `
    <div class="panel-header">
      <span class="panel-title">${escHtml(cat.category)}</span>
      <div class="panel-header-actions">
        <button class="btn btn--primary" id="panelAddItemBtn">+ Add Item</button>
      </div>
    </div>
    <table class="items-table" aria-label="${escHtml(cat.category)} items">
      <thead>
        <tr>
          <th>Item</th>
          <th style="width:130px">Price</th>
          <th style="width:150px;text-align:right">Actions</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="panel-footer">
      <button class="btn btn--danger-outline" id="deleteCatBtn">
        Delete Category
      </button>
    </div>
  `;

  // Bind panel buttons
  document.getElementById('panelAddItemBtn').addEventListener('click', () => openItemModal());
  document.getElementById('deleteCatBtn').addEventListener('click', () => deleteCategory(cat));
  document.getElementById('emptyAddBtn')?.addEventListener('click', () => openItemModal());

  // Bind per-row edit / delete
  panel.querySelectorAll('tr[data-item-id]').forEach(row => {
    const item = cat.items.find(i => i.id === row.dataset.itemId);
    if (!item) return;
    row.querySelector('[data-action="edit"]').addEventListener('click',   () => openItemModal(item, cat.id));
    row.querySelector('[data-action="delete"]').addEventListener('click', () => deleteItem(cat, item));
  });
}

// ============================================================
// CRUD — Items
// ============================================================

function deleteItem(cat, item) {
  if (!confirm(`Delete "${item.name}"?`)) return;

  const menu = getMenu();
  const c    = menu.find(c => c.id === cat.id);
  if (!c) return;
  c.items = c.items.filter(i => i.id !== item.id);
  saveMenu(menu);
  renderAdmin();
}

function deleteCategory(cat) {
  const itemCount = cat.items.length;
  const msg = itemCount > 0
    ? `Delete category "${cat.category}" and its ${itemCount} item(s)? This cannot be undone.`
    : `Delete category "${cat.category}"?`;

  if (!confirm(msg)) return;

  const menu    = getMenu();
  const newMenu = menu.filter(c => c.id !== cat.id);
  activeCatId   = newMenu[0]?.id ?? null;
  saveMenu(newMenu);
  renderAdmin();
}

// ============================================================
// ITEM MODAL
// ============================================================

const itemModalOverlay = document.getElementById('itemModalOverlay');
const itemForm         = document.getElementById('itemForm');

function openItemModal(item = null, ownerCatId = null) {
  const menu = getMenu();

  document.getElementById('itemModalTitle').textContent = item ? 'Edit Item' : 'Add Item';

  // Populate category dropdown
  const catSelect = document.getElementById('fItemCategory');
  catSelect.innerHTML = menu.map(c =>
    `<option value="${escHtml(c.id)}">${escHtml(c.category)}</option>`
  ).join('');
  catSelect.value = ownerCatId ?? activeCatId ?? menu[0]?.id ?? '';

  // Populate fields
  document.getElementById('fItemId').value    = item?.id    ?? '';
  document.getElementById('fItemName').value  = item?.name  ?? '';
  document.getElementById('fItemPrice').value = item?.price ?? '';
  document.getElementById('fItemDesc').value  = item?.desc  ?? '';

  itemModalOverlay.hidden = false;
  document.getElementById('fItemName').focus();
}

function closeItemModal() {
  itemModalOverlay.hidden = true;
  itemForm.reset();
}

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
    // Edit: find item across all categories (may have been moved to a new category)
    const oldCat = menu.find(c => c.items.some(i => i.id === id));
    if (!oldCat) return;

    if (oldCat.id === newCatId) {
      const item  = oldCat.items.find(i => i.id === id);
      item.name  = name;
      item.price = price;
      item.desc  = desc;
    } else {
      oldCat.items = oldCat.items.filter(i => i.id !== id);
      newCat.items.push({ id, name, price, desc });
    }
  } else {
    newCat.items.push({ id: generateId(), name, price, desc });
  }

  activeCatId = newCatId;
  saveMenu(menu);
  closeItemModal();
  renderAdmin();
});

// ============================================================
// CRUD — Categories
// ============================================================

const catModalOverlay = document.getElementById('catModalOverlay');
const catForm         = document.getElementById('catForm');

document.getElementById('addCategoryBtn').addEventListener('click', () => {
  catModalOverlay.hidden = false;
  document.getElementById('fCatName').focus();
});

function closeCatModal() {
  catModalOverlay.hidden = true;
  catForm.reset();
}

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
  renderAdmin();
});

// ============================================================
// RESET TO DEFAULT
// ============================================================

document.getElementById('resetMenuBtn').addEventListener('click', () => {
  if (!confirm('Reset the entire menu to default? All admin changes will be lost.')) return;
  resetMenu();
  activeCatId = null;
  renderAdmin();
});

// ============================================================
// TOOLBAR "Add Item" button
// ============================================================

document.getElementById('addItemBtn').addEventListener('click', () => openItemModal());

// ============================================================
// GLOBAL KEYBOARD
// ============================================================

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (!itemModalOverlay.hidden) closeItemModal();
  if (!catModalOverlay.hidden)  closeCatModal();
});
