// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// WhatsApp number, kept out of the HTML/JS source as plain text
const WA_NUMBER = [50, 53, 52, 55, 48, 53, 53, 53, 55, 55, 48, 54]
  .map((code) => String.fromCharCode(code))
  .join('');
document.querySelectorAll('.js-wa-link').forEach((link) => {
  link.href = `https://wa.me/${WA_NUMBER}`;
});

// Sticky header background
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  if (header) header.classList.toggle('scrolled', window.scrollY > 30);
});

// Mobile nav toggle
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
if (burger && navLinks) {
  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    burger.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.setAttribute('aria-expanded', false);
    })
  );
}

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('show');
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach(el => obs.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('show'));
}

// Hero blob parallax on pointer move
const hero = document.getElementById('heroSection');
if (hero && window.matchMedia('(prefers-reduced-motion: reduce)').matches === false) {
  const blobs = hero.querySelectorAll('.blob');
  hero.addEventListener('mousemove', (e) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 2;
    const y = (e.clientY / innerHeight - 0.5) * 2;
    blobs.forEach((blob, i) => {
      const strength = 14 + i * 8;
      blob.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });
  });
}

// Work section: per-card image sliders + shared lightbox
const sliders = document.querySelectorAll('[data-slider]');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
let activeGallery = [];
let activeIndex = 0;

function openLightbox(images, index) {
  activeGallery = images;
  activeIndex = index;
  lightboxImg.src = activeGallery[activeIndex].dataset.full;
  lightboxImg.alt = activeGallery[activeIndex].getAttribute('aria-label') || '';
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.hidden = true;
  lightboxImg.src = '';
  document.body.style.overflow = '';
}
function showLightboxImage(delta) {
  activeIndex = (activeIndex + delta + activeGallery.length) % activeGallery.length;
  lightboxImg.src = activeGallery[activeIndex].dataset.full;
  lightboxImg.alt = activeGallery[activeIndex].getAttribute('aria-label') || '';
}

sliders.forEach((card) => {
  const track = card.querySelector('.case-slides');
  const slides = Array.from(card.querySelectorAll('.case-slide-img'));
  const prevBtn = card.querySelector('.slide-prev');
  const nextBtn = card.querySelector('.slide-next');
  const dotsWrap = card.querySelector('.slide-dots');
  let current = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Go to image ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function goTo(i) {
    current = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    slides.forEach((s, idx) => s.classList.toggle('active', idx === current));
    dots.forEach((d, idx) => d.classList.toggle('active', idx === current));
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAutoplay(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAutoplay(); });
  dots.forEach((dot) => dot.addEventListener('click', resetAutoplay));

  slides.forEach((slide, i) => {
    slide.addEventListener('click', () => openLightbox(slides, i));
  });

  // Autoplay: gentle auto-advance, paused on hover/focus/out-of-view and reduced motion
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let autoplayId = null;
  let inView = false;

  function startAutoplay() {
    if (reduceMotion || slides.length < 2 || autoplayId) return;
    autoplayId = setInterval(() => goTo(current + 1), 4000);
  }
  function stopAutoplay() {
    clearInterval(autoplayId);
    autoplayId = null;
  }
  function resetAutoplay() {
    stopAutoplay();
    if (inView) startAutoplay();
  }

  card.addEventListener('mouseenter', stopAutoplay);
  card.addEventListener('mouseleave', () => inView && startAutoplay());
  card.addEventListener('focusin', stopAutoplay);
  card.addEventListener('focusout', () => inView && startAutoplay());

  if (!reduceMotion && slides.length > 1 && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          inView = entry.isIntersecting;
          if (inView) startAutoplay();
          else stopAutoplay();
        });
      },
      { threshold: 0.4 }
    );
    io.observe(card);
  }
});

if (lightbox) {
  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('lightboxPrev').addEventListener('click', () => showLightboxImage(-1));
  document.getElementById('lightboxNext').addEventListener('click', () => showLightboxImage(1));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightboxImage(-1);
    if (e.key === 'ArrowRight') showLightboxImage(1);
  });
}

// Contact form -> WhatsApp (only exists on contact.html)
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const service = document.getElementById('service').value;
    const budget = document.getElementById('budget').value;
    const details = document.getElementById('details').value.trim();

    let message = `Hi Cognitix Digital, I'm ${name}.\n`;
    message += `Service: ${service}\n`;
    if (budget) message += `Budget: ${budget}\n`;
    message += `Details: ${details}\n`;
    message += `Reach me at: ${phone}`;

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  });
}

