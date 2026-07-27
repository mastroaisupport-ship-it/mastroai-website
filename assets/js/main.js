document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const glow = document.querySelector('.cursor-glow');
  const revealEls = document.querySelectorAll('.reveal');
  const counters = document.querySelectorAll('[data-count]');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dotsWrap = document.querySelector('.carousel-dots');
  const prev = document.querySelector('.carousel-btn.prev');
  const next = document.querySelector('.carousel-btn.next');
  const faqItems = document.querySelectorAll('.faq-item');
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');
  let index = 0;
  let timer;

  const setHeader = () => header.classList.toggle('scrolled', window.scrollY > 12);
  setHeader();
  window.addEventListener('scroll', setHeader, { passive: true });

  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
  }));

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        if (entry.target.hasAttribute('data-count')) animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.22 });
  revealEls.forEach(el => obs.observe(el));
  counters.forEach(el => obs.observe(el));

  function animateCounter(el) {
    const target = Number(el.dataset.count || 0);
    const duration = 1200;
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      const value = Math.floor(target * (0.12 + 0.88 * p));
      el.textContent = value.toString();
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toString();
    };
    requestAnimationFrame(tick);
  }

  if (dotsWrap && slides.length) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Vai alla slide ${i + 1}`);
      dot.addEventListener('click', () => showSlide(i, true));
      dotsWrap.appendChild(dot);
    });
  }
  const dots = Array.from(document.querySelectorAll('.carousel-dots button'));

  function showSlide(nextIndex, manual = false) {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    if (manual) restart();
  }
  function restart() {
    clearInterval(timer);
    timer = setInterval(() => showSlide(index + 1), 5000);
  }
  prev?.addEventListener('click', () => showSlide(index - 1, true));
  next?.addEventListener('click', () => showSlide(index + 1, true));
  if (slides.length) {
    showSlide(0);
    restart();
  }

  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach(other => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  const sections = [...document.querySelectorAll('section[id]')];
  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
      }
    });
  }, { threshold: 0.3 });
  sections.forEach(section => sectionObs.observe(section));

  const isFinePointer = matchMedia('(pointer:fine)').matches;
  if (isFinePointer && glow) {
    window.addEventListener('mousemove', e => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    }, { passive: true });
  }

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      nav.classList.remove('is-open');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  });
});
