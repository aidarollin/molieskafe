/* =========================================================
   MOLIES KAFE — MAIN SCRIPT
   Depends on: js/menu-data.js (loaded first in index.html)
   ========================================================= */

(() => {

  // ---- Header: scroll style ----
  const header    = document.getElementById('siteHeader');
  const nav       = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
  header.classList.toggle('scrolled', window.scrollY > 40);

  // ---- Mobile nav toggle ----
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      navToggle.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // ---- Menu: render from data ----
  function renderMenu() {
    const grid = document.getElementById('menuGrid');
    if (!grid) return;

    const menu = getMenu();

    grid.innerHTML = menu.map(cat => `
      <div class="menu-col">
        <h3 class="menu-cat">${escHtml(cat.category)}</h3>
        ${cat.items.map(item => `
          <div class="menu-item">
            <div class="menu-item-name">
              <span>${escHtml(item.name)}</span>
              <span class="dots"></span>
              <span class="menu-price">${escHtml(String(item.price))}</span>
            </div>
            <div class="menu-item-desc">${escHtml(item.desc)}</div>
          </div>
        `).join('')}
      </div>
    `).join('');
  }

  renderMenu();

})();
