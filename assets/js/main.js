const header = document.querySelector('.header');
const nav = document.querySelector('.nav');
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav a[href^="#"]');
const revealEls = document.querySelectorAll('.reveal');
const heroVisual = document.querySelector('.hero-visual');
const heroFrame = document.querySelector('.hero-frame');
const heroSideCard = document.querySelector('.hero-side-card');
const heroLogoPill = document.querySelector('.hero-logo-pill');

const setHeaderState = () => {
  header?.classList.toggle('scrolled', window.scrollY > 10);
};

setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

toggle?.addEventListener('click', () => {
  const open = nav?.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(Boolean(open)));
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    nav?.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

revealEls.forEach((el) => revealObserver.observe(el));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { threshold: 0.35 });

document.querySelectorAll('section[id]').forEach((section) => sectionObserver.observe(section));

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isFinePointer = window.matchMedia('(pointer: fine)').matches;

if (heroVisual && isFinePointer && !prefersReducedMotion) {
  heroVisual.addEventListener('pointermove', (event) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    if (heroFrame) heroFrame.style.transform = `rotateY(${x * 6}deg) rotateX(${y * -6}deg)`;
    if (heroSideCard) heroSideCard.style.transform = `rotate(-8deg) translate3d(${x * 8}px, ${y * 8}px, 0)`;
    if (heroLogoPill) heroLogoPill.style.transform = `translate3d(${x * 10}px, ${y * -6}px, 0)`;
  });

  heroVisual.addEventListener('pointerleave', () => {
    if (heroFrame) heroFrame.style.transform = '';
    if (heroSideCard) heroSideCard.style.transform = 'rotate(-8deg)';
    if (heroLogoPill) heroLogoPill.style.transform = '';
  });
}

const updateHeroMotion = () => {
  if (prefersReducedMotion) {
    if (heroFrame) heroFrame.style.transform = '';
    if (heroSideCard) heroSideCard.style.transform = 'rotate(-8deg)';
    if (heroLogoPill) heroLogoPill.style.transform = '';
    return;
  }

  const offset = Math.max(-18, Math.min(18, window.scrollY * 0.03));
  if (heroFrame) {
    heroFrame.style.transform = `translate3d(0, ${offset}px, 0)`;
  }
  if (heroSideCard) {
    heroSideCard.style.transform = `rotate(-8deg) translate3d(0, ${offset / 2}px, 0)`;
  }
  if (heroLogoPill) {
    heroLogoPill.style.transform = `translate3d(0, ${-offset / 2}px, 0)`;
  }
};

window.addEventListener('scroll', updateHeroMotion, { passive: true });
updateHeroMotion();

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    nav?.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
  }
});
