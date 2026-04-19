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

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 40);
    updateParallax();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
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
  // PARALLAX — hero coffee beans
  // ============================================================
  const heroBeans = document.querySelectorAll('.hero-bean');

  function updateParallax() {
    const y = window.scrollY;
    heroBeans.forEach((bean, i) => {
      const speed  = 0.22 + (i % 3) * 0.1;
      const offset = y * speed;
      const base   = bean.style.transform.replace(/translateY\([^)]+\)/, '').trim();
      bean.style.transform = (base ? base + ' ' : '') + `translateY(${offset}px)`;
    });
  }
  updateParallax();

  // ============================================================
  // SCROLL ENTRANCE — IntersectionObserver
  // ============================================================
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = entry.target.parentElement.querySelectorAll('[data-animate]');
      let delay = 0;
      siblings.forEach((sib, j) => { if (sib === entry.target) delay = j * 80; });
      setTimeout(() => entry.target.classList.add('in-view'), delay);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-animate]').forEach(el => io.observe(el));

  // ============================================================
  // CONTENT — apply stored text to data-content-key elements
  // ============================================================
  function applyContent() {
    const c = getContent();
    document.querySelectorAll('[data-content-key]').forEach(el => {
      const key = el.dataset.contentKey;
      if (c[key] !== undefined) el.textContent = c[key];
    });
  }

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
      // Tab
      const tab = document.createElement('button');
      tab.className = 'menu-tab' + (idx === 0 ? ' active' : '');
      tab.textContent = cat.category;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', idx === 0);
      tab.dataset.panel = cat.id;
      tabsEl.appendChild(tab);

      // Panel
      const panel = document.createElement('div');
      panel.className = 'menu-panel' + (idx === 0 ? ' active' : '');
      panel.id        = 'panel-' + cat.id;
      panel.setAttribute('role', 'tabpanel');

      const scrollWrap = document.createElement('div');
      scrollWrap.className = 'menu-scroll-wrap';

      const btnLeft  = document.createElement('button');
      btnLeft.className = 'scroll-btn scroll-btn--left';
      btnLeft.innerHTML = '&#8249;';
      btnLeft.setAttribute('aria-label', 'Scroll left');

      const btnRight = document.createElement('button');
      btnRight.className = 'scroll-btn scroll-btn--right';
      btnRight.innerHTML = '&#8250;';
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

      function syncBtns() {
        btnLeft.hidden  = scroller.scrollLeft <= 4;
        btnRight.hidden = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 4;
      }
      scroller.addEventListener('scroll', syncBtns, { passive: true });
      btnLeft.addEventListener('click',  () => scroller.scrollBy({ left: -250, behavior: 'smooth' }));
      btnRight.addEventListener('click', () => scroller.scrollBy({ left:  250, behavior: 'smooth' }));
      setTimeout(syncBtns, 80);
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
        setTimeout(() => {
          panel.querySelector('.menu-scroll')?.dispatchEvent(new Event('scroll'));
        }, 50);
      }
    });
  }

  // ============================================================
  // SERVICES — render café cards + studios block
  // ============================================================
  function renderServices() {
    const grid         = document.getElementById('servicesGrid');
    const studiosBlock = document.getElementById('studiosBlock');
    if (!grid) return;

    const services      = getServices();
    const cafeServices  = services.filter(s => s.type !== 'studios');
    const studiosData   = services.find(s => s.type === 'studios');
    const social        = getSocial();
    const studiosSocial = social.studios || {};

    // Café service cards
    grid.innerHTML = cafeServices.map(s => `
      <div class="service-card" data-animate>
        <div class="service-num">${escHtml(s.num)}</div>
        <h3 class="service-title">${escHtml(s.title)}</h3>
        <p class="service-desc">${escHtml(s.desc)}</p>
      </div>
    `).join('');

    // Molies Studios block
    if (studiosBlock && studiosData) {
      const customLogo = getStudiosLogo();
      const logoSrc    = customLogo || 'assets/studios-logo.svg';

      const offerings = (studiosData.offerings || []).map(o => `
        <div class="offering">
          <div class="offering-name">${escHtml(o.name)}</div>
          <div class="offering-desc">${escHtml(o.desc)}</div>
        </div>
      `).join('');

      // Studios social links (enabled platforms only)
      const studiosSocialHtml = SOCIAL_PLATFORMS
        .filter(p => studiosSocial[p.key]?.enabled && studiosSocial[p.key]?.url)
        .map(p => `
          <a href="${escHtml(studiosSocial[p.key].url)}" class="studios-social-link"
             target="_blank" rel="noopener" aria-label="${escHtml(p.label)}">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${p.svg}</svg>
          </a>
        `).join('');

      const pageUrl = studiosSocial.pageUrl || '';
      const ctaHtml = pageUrl
        ? `<a href="${escHtml(pageUrl)}" class="studios-cta" target="_blank" rel="noopener">Visit Studio Page →</a>`
        : '';

      studiosBlock.innerHTML = `
        <div class="studios-block" data-animate>
          <div class="studios-info">
            <img src="${escHtml(logoSrc)}" alt="Molies Studios" class="studios-logo-wordmark" />
            <p class="studios-desc">${escHtml(studiosData.desc)}</p>
            ${studiosSocialHtml ? `<div class="studios-social">${studiosSocialHtml}</div>` : ''}
            ${ctaHtml}
          </div>
          <div class="studios-offerings">${offerings}</div>
        </div>
      `;

      studiosBlock.querySelectorAll('[data-animate]').forEach(el => io.observe(el));
    }

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

  // Review form collapse toggle
  const reviewToggle   = document.getElementById('reviewToggle');
  const reviewCollapse = document.getElementById('reviewCollapse');
  if (reviewToggle && reviewCollapse) {
    reviewToggle.addEventListener('click', () => {
      const expanded = reviewToggle.getAttribute('aria-expanded') === 'true';
      reviewToggle.setAttribute('aria-expanded', String(!expanded));
      reviewCollapse.classList.toggle('open', !expanded);
    });
  }

  // Review form submission
  const reviewForm = document.getElementById('reviewForm');
  if (reviewForm) {
    let capturedImage = null;

    const rvImage     = document.getElementById('rvImage');
    const rvImageName = document.getElementById('rvImageName');
    const rvPreview   = document.getElementById('rvImgPreview');
    const rvThumb     = document.getElementById('rvImgThumb');
    const rvRemove    = document.getElementById('rvRemoveImg');

    rvImage?.addEventListener('change', () => {
      const file = rvImage.files[0];
      if (!file) return;

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
        rvThumb.src   = capturedImage;
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

      if (!name)   { errEl.textContent = 'Please enter your name.';      errEl.hidden = false; return; }
      if (!rating) { errEl.textContent = 'Please select a star rating.'; errEl.hidden = false; return; }
      if (!text)   { errEl.textContent = 'Please write a review.';       errEl.hidden = false; return; }

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
  // FOOTER — social links (café, enabled platforms)
  // ============================================================
  function renderFooterSocial() {
    const el = document.getElementById('footerSocial');
    if (!el) return;

    const cafeSocial = getSocial().cafe || {};

    const links = SOCIAL_PLATFORMS
      .filter(p => cafeSocial[p.key]?.enabled && cafeSocial[p.key]?.url)
      .map(p => `
        <a href="${escHtml(cafeSocial[p.key].url)}" class="social-link"
           target="_blank" rel="noopener" aria-label="${escHtml(p.label)}">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${p.svg}</svg>
        </a>
      `).join('');

    el.innerHTML = links;
  }

  // ============================================================
  // INIT
  // ============================================================
  applyContent();
  renderMenu();
  renderServices();
  renderReviews();
  renderFooterSocial();

})();
