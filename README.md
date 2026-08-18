# Cognitix Digital

A static single-page site. `index.html` is the canonical page — hero, services,
work, pricing, process, about and contact all live there as anchored sections.

`services.html`, `work.html`, `process.html`, `about.html` and `contact.html`
are thin redirects to the matching `index.html#anchor`, kept only so old links
don't break.

## Structure
- `index.html` — the site
- `css/style.css` — design system (tokens, components, responsive rules)
- `js/script.js` — sticky header, mobile nav, scroll reveal, WhatsApp link wiring, contact form
- `assets/images/brand_logo.png` — logo

## Deployment
Static files — deployable as-is (e.g. GitHub Pages) with no build step.
