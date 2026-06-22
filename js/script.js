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

    const url = `https://wa.me/254705557706?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  });
}

