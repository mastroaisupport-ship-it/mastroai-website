const header = document.querySelector('.header');
const nav = document.querySelector('.nav');
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav a[href^="#"]');
const revealEls = document.querySelectorAll('.reveal');
const glow = document.querySelector('.cursor-glow');
const heroMedia = document.querySelector('.hero-media');
const heroCards = document.querySelectorAll('.hero-card');
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

const isFinePointer = window.matchMedia('(pointer: fine)').matches;
if (isFinePointer && glow) {
  window.addEventListener('mousemove', (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });
}

if (heroMedia && isFinePointer) {
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

const updateHeroCards = () => {
  const offset = Math.max(-24, Math.min(24, window.scrollY * 0.04));
  heroCards.forEach((card, index) => {
    card.style.transform = `translateY(${index === 0 ? -offset : offset}px)`;
  });
};

window.addEventListener('scroll', updateHeroCards, { passive: true });
updateHeroCards();

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    nav?.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
  }
});
