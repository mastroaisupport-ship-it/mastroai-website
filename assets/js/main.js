const header = document.querySelector('.header');
const nav = document.querySelector('.nav');
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav a[href^="#"]');
const revealEls = document.querySelectorAll('.reveal');
const glow = document.querySelector('.cursor-glow');
const heroMedia = document.querySelector('.hero-media');
const heroVisual = document.querySelector('.hero-visual');
const heroFloaters = document.querySelectorAll('.hero-floating');
const faqItems = document.querySelectorAll('.faq-item');

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

faqItems.forEach((item) => {
  item.addEventListener('toggle', () => {
    if (item.open) {
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    }
  });
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isFinePointer = window.matchMedia('(pointer: fine)').matches;

if (isFinePointer && glow && !prefersReducedMotion) {
  window.addEventListener('mousemove', (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });
}

if (heroMedia && isFinePointer && !prefersReducedMotion) {
  heroMedia.addEventListener('pointermove', (event) => {
    const rect = heroMedia.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    heroMedia.style.transform = `rotateY(${x * 6}deg) rotateX(${y * -6}deg)`;
  });

  heroMedia.addEventListener('pointerleave', () => {
    heroMedia.style.transform = '';
  });
}

const updateHeroMotion = () => {
  if (prefersReducedMotion) {
    if (heroVisual) heroVisual.style.transform = '';
    heroFloaters.forEach((card) => { card.style.transform = ''; });
    return;
  }
  const offset = Math.max(-18, Math.min(18, window.scrollY * 0.03));
  if (heroVisual) {
    heroVisual.style.transform = `translate3d(0, ${offset}px, 0)`;
  }
  heroFloaters.forEach((card, index) => {
    card.style.transform = `translate3d(0, ${index === 0 ? -offset / 2 : offset / 2}px, 0)`;
  });
};

window.addEventListener('scroll', updateHeroMotion, { passive: true });
updateHeroMotion();

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    nav?.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
  }
});
