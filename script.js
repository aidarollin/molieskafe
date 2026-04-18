/* =========================================================
   MOLIES KAFE — SCRIPT
   - Sticky header style on scroll
   - Mobile nav toggle (with body lock + close on link click)
   ========================================================= */

(() => {
  const header    = document.getElementById('siteHeader');
  const nav       = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');

  // Header style on scroll
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close mobile nav when a link is clicked
  document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close mobile nav with Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      navToggle.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
})();