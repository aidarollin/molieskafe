/* =========================================================
   MOLIES KAFE — MAIN SCRIPT
   Depends on: js/menu-data.js (loaded first in index.html)
   ========================================================= */

(() => {

  // ============================================================
  // HEADER — scroll style + mobile nav
  // ============================================================
  const header    = document.getElementById('siteHeader');
  const nav       = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
    updateParallax();
  }, { passive: true });
  header.classList.toggle('scrolled', window.scrollY > 40);

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

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      navToggle.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // ============================================================
  // PARALLAX — hero coffee beans shift at 40% scroll speed
  // ============================================================
  const heroBeans = document.querySelectorAll('.hero-bean');

  function updateParallax() {
    const y = window.scrollY;
    heroBeans.forEach((bean, i) => {
      const speed  = 0.25 + (i % 3) * 0.12;
      const offset = y * speed;
      bean.style.transform = bean.style.transform.replace(/translateY\([^)]+\)/, '')
        + ` translateY(${offset}px)`;
    });
  }
  updateParallax();

  // ============================================================
  // SCROLL ENTRANCE — IntersectionObserver
  // ============================================================
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      // stagger siblings inside a grid/flex parent
      const siblings = entry.target.parentElement.querySelectorAll('[data-animate]');
      let delay = 0;
      siblings.forEach((sib, j) => { if (sib === entry.target) delay = j * 80; });
      setTimeout(() => entry.target.classList.add('in-view'), delay);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-animate]').forEach(el => io.observe(el));

  // ============================================================
  // MENU — tabs + horizontal-scroll cards
  // ============================================================

  const CAT_GRADIENTS = {
    'coffee':     ['#1A3D2B', '#2D6A47'],
    'non-coffee': ['#243B30', '#3A6655'],
    'refresher':  ['#0F3555', '#1A5D8A'],
    'kitchen':    ['#5C2E0A', '#9E5216'],
    'vendors':    ['#3D1F0A', '#7A4215'],
  };

  function catGradient(catId) {
    const g = CAT_GRADIENTS[catId] || ['#1A3D2B', '#2D4035'];
    return `linear-gradient(140deg, ${g[0]} 0%, ${g[1]} 100%)`;
  }

  function renderMenu() {
    const tabsEl   = document.getElementById('menuTabs');
    const panelsEl = document.getElementById('menuPanels');
    if (!tabsEl || !panelsEl) return;

    const menu = getMenu();
    if (!menu.length) { panelsEl.innerHTML = '<p style="color:var(--muted)">Menu coming soon.</p>'; return; }

    tabsEl.innerHTML   = '';
    panelsEl.innerHTML = '';

    menu.forEach((cat, idx) => {
      // Tab button
      const tab = document.createElement('button');
      tab.className = 'menu-tab' + (idx === 0 ? ' active' : '');
      tab.textContent = cat.category;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', idx === 0);
      tab.dataset.panel = cat.id;
      tabsEl.appendChild(tab);

      // Panel
      const panel = document.createElement('div');
      panel.className   = 'menu-panel' + (idx === 0 ? ' active' : '');
      panel.id          = 'panel-' + cat.id;
      panel.setAttribute('role', 'tabpanel');

      const scrollWrap = document.createElement('div');
      scrollWrap.className = 'menu-scroll-wrap';

      const btnLeft  = document.createElement('button');
      btnLeft.className = 'scroll-btn scroll-btn--left';
      btnLeft.textContent = '‹';
      btnLeft.setAttribute('aria-label', 'Scroll left');

      const btnRight = document.createElement('button');
      btnRight.className = 'scroll-btn scroll-btn--right';
      btnRight.textContent = '›';
      btnRight.setAttribute('aria-label', 'Scroll right');

      const scroller = document.createElement('div');
      scroller.className = 'menu-scroll';

      cat.items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-card';

        const imgWrap = document.createElement('div');
        if (item.image) {
          imgWrap.className = 'menu-card-img-wrap';
          const img = document.createElement('img');
          img.className = 'menu-card-img';
          img.src = item.image;
          img.alt = item.name;
          img.loading = 'lazy';
          imgWrap.appendChild(img);
        } else {
          imgWrap.className = 'menu-card-placeholder';
          imgWrap.style.background = catGradient(cat.id);
          imgWrap.textContent = item.name.charAt(0);
        }

        const body = document.createElement('div');
        body.className = 'menu-card-body';
        body.innerHTML = `
          <div class="menu-card-name">${escHtml(item.name)}</div>
          <div class="menu-card-price">RM ${escHtml(String(item.price))}</div>
          <div class="menu-card-desc">${escHtml(item.desc)}</div>
        `;

        card.appendChild(imgWrap);
        card.appendChild(body);
        scroller.appendChild(card);
      });

      scrollWrap.appendChild(btnLeft);
      scrollWrap.appendChild(scroller);
      scrollWrap.appendChild(btnRight);
      panel.appendChild(scrollWrap);
      panelsEl.appendChild(panel);

      // Arrow button logic
      function syncBtns() {
        btnLeft.hidden  = scroller.scrollLeft <= 4;
        btnRight.hidden = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 4;
      }
      scroller.addEventListener('scroll', syncBtns, { passive: true });
      btnLeft.addEventListener('click',  () => scroller.scrollBy({ left: -260, behavior: 'smooth' }));
      btnRight.addEventListener('click', () => scroller.scrollBy({ left:  260, behavior: 'smooth' }));
      setTimeout(syncBtns, 50);
    });

    // Tab switching
    tabsEl.addEventListener('click', e => {
      const tab = e.target.closest('.menu-tab');
      if (!tab) return;

      tabsEl.querySelectorAll('.menu-tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panelsEl.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const panel = document.getElementById('panel-' + tab.dataset.panel);
      if (panel) {
        panel.classList.add('active');
        // Re-sync scroll buttons for newly visible panel
        panel.querySelector('.menu-scroll')?.dispatchEvent(new Event('scroll'));
      }
    });
  }

  // ============================================================
  // SERVICES — render café cards + studios block
  // ============================================================
  function renderServices() {
    const grid   = document.getElementById('servicesGrid');
    const studios = document.getElementById('studiosBlock');
    if (!grid) return;

    const services = getServices();
    const cafeServices = services.filter(s => s.type !== 'studios');
    const studiosData  = services.find(s => s.type === 'studios');

    // Café service cards
    grid.innerHTML = cafeServices.map(s => `
      <div class="service-card" data-animate>
        <div class="service-num">${escHtml(s.num)}</div>
        <h3 class="service-title">${escHtml(s.title)}</h3>
        <p class="service-desc">${escHtml(s.desc)}</p>
      </div>
    `).join('');

    // Molies Studios block
    if (studios && studiosData) {
      const offerings = (studiosData.offerings || []).map(o => `
        <div class="offering">
          <div class="offering-name">${escHtml(o.name)}</div>
          <div class="offering-desc">${escHtml(o.desc)}</div>
        </div>
      `).join('');

      studios.innerHTML = `
        <div class="studios-block" data-animate>
          <div class="studios-info">
            <div class="studios-logo-wrap">
              <img src="assets/studios-logo.svg" alt="Molies Studios mark" class="studios-logo-icon" />
              <div class="studios-logo-text">
                <span class="studios-logo-main">Molies</span>
                <span class="studios-logo-sub">Studios</span>
              </div>
            </div>
            <p class="studios-desc">${escHtml(studiosData.desc)}</p>
          </div>
          <div class="studios-offerings">${offerings}</div>
        </div>
      `;

      // Observe newly inserted animate elements
      studios.querySelectorAll('[data-animate]').forEach(el => io.observe(el));
    }

    // Observe newly inserted animate elements in services grid
    grid.querySelectorAll('[data-animate]').forEach(el => io.observe(el));
  }

  // ============================================================
  // REVIEWS — render approved + handle submission
  // ============================================================
  function renderReviews() {
    const container = document.getElementById('reviewsGrid');
    if (!container) return;

    const approved = getReviews().filter(r => r.status === 'approved');

    if (!approved.length) {
      container.innerHTML = '<p class="reviews-empty">No reviews yet — be the first to share your experience.</p>';
      return;
    }

    container.innerHTML = approved.map(r => `
      <div class="review-card">
        <div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
        ${r.image ? `<img src="${r.image}" alt="Review photo" class="review-img" loading="lazy" />` : ''}
        <p class="review-text">${escHtml(r.text)}</p>
        <div class="review-meta"><span class="review-name">${escHtml(r.name)}</span> · ${escHtml(r.date)}</div>
      </div>
    `).join('');
  }

  // Review form submission
  const reviewForm = document.getElementById('reviewForm');
  if (reviewForm) {
    let capturedImage = null;

    const rvImage    = document.getElementById('rvImage');
    const rvImageName= document.getElementById('rvImageName');
    const rvPreview  = document.getElementById('rvImgPreview');
    const rvThumb    = document.getElementById('rvImgThumb');
    const rvRemove   = document.getElementById('rvRemoveImg');

    rvImage?.addEventListener('change', () => {
      const file = rvImage.files[0];
      if (!file) return;

      // Warn if image is too large for localStorage
      if (file.size > 800 * 1024) {
        document.getElementById('reviewError').textContent = 'Image must be under 800 KB.';
        document.getElementById('reviewError').hidden = false;
        rvImage.value = '';
        return;
      }
      document.getElementById('reviewError').hidden = true;

      rvImageName.textContent = file.name;
      const reader = new FileReader();
      reader.onload = ev => {
        capturedImage = ev.target.result;
        rvThumb.src = capturedImage;
        rvPreview.hidden = false;
      };
      reader.readAsDataURL(file);
    });

    rvRemove?.addEventListener('click', () => {
      capturedImage = null;
      rvImage.value = '';
      rvImageName.textContent = 'No file chosen';
      rvPreview.hidden = true;
    });

    reviewForm.addEventListener('submit', e => {
      e.preventDefault();

      const name   = document.getElementById('rvName').value.trim();
      const text   = document.getElementById('rvText').value.trim();
      const rating = document.querySelector('input[name="rvRating"]:checked')?.value;
      const errEl  = document.getElementById('reviewError');
      const okEl   = document.getElementById('reviewSuccess');

      errEl.hidden = true;
      okEl.hidden  = true;

      if (!name)   { errEl.textContent = 'Please enter your name.';   errEl.hidden = false; return; }
      if (!rating) { errEl.textContent = 'Please select a star rating.'; errEl.hidden = false; return; }
      if (!text)   { errEl.textContent = 'Please write a review.';    errEl.hidden = false; return; }

      const reviews = getReviews();
      reviews.push({
        id:     generateId(),
        name,
        rating: parseInt(rating),
        text,
        image:  capturedImage,
        date:   new Date().toLocaleDateString('en-MY', { year: 'numeric', month: 'short', day: 'numeric' }),
        status: 'pending'
      });
      saveReviews(reviews);

      reviewForm.reset();
      capturedImage = null;
      rvImageName.textContent = 'No file chosen';
      rvPreview.hidden = true;
      okEl.hidden = false;
    });
  }

  // ============================================================
  // FOOTER — social links
  // ============================================================
  function renderFooterSocial() {
    const el = document.getElementById('footerSocial');
    if (!el) return;

    const social = getSocial();

    el.innerHTML = `
      <a href="${escHtml(social.instagram)}" class="social-link" target="_blank" rel="noopener" aria-label="Instagram">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      </a>
      <a href="${escHtml(social.tiktok)}" class="social-link" target="_blank" rel="noopener" aria-label="TikTok">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
        </svg>
      </a>
    `;
  }

  // ============================================================
  // INIT
  // ============================================================
  renderMenu();
  renderServices();
  renderReviews();
  renderFooterSocial();

})();
