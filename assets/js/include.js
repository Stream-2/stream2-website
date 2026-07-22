// Loads header/footer partials at runtime (no build step). Requires the site to be
// served over http(s) — fetch() of local files fails under file://. Run e.g. `npx serve`.
// normalize() exists because static hosts disagree on URLs: `serve` strips ".html" and
// serves "/contact", Netlify's pretty-URLs can do the same, a raw file server won't.
// Comparing everything in this stripped form keeps nav/lang-switch correct on any of them.

const PAGE_MAP = {
  "/": "/es/index.html",
  "/for-hotels": "/es/para-hoteles.html",
  "/for-travel-partners": "/es/para-turoperadores.html",
  "/how-we-work": "/es/como-trabajamos.html",
  "/hotel-network": "/es/red-hotelera.html",
  "/about": "/es/sobre-stream2.html",
  "/events": "/es/eventos.html",
  "/contact": "/es/contacto.html",
  "/privacy-policy": "/es/politica-privacidad.html",
  "/legal-notice": "/es/aviso-legal.html",
  "/cookie-policy": "/es/politica-cookies.html",
};
const PAGE_MAP_REVERSE = {
  "/es": "/index.html",
  "/es/para-hoteles": "/for-hotels.html",
  "/es/para-turoperadores": "/for-travel-partners.html",
  "/es/como-trabajamos": "/how-we-work.html",
  "/es/red-hotelera": "/hotel-network.html",
  "/es/sobre-stream2": "/about.html",
  "/es/eventos": "/events.html",
  "/es/contacto": "/contact.html",
  "/es/politica-privacidad": "/privacy-policy.html",
  "/es/aviso-legal": "/legal-notice.html",
  "/es/politica-cookies": "/cookie-policy.html",
};

function normalize(path) {
  let p = path.split(/[?#]/)[0];
  p = p.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
  if (p.length > 1) p = p.replace(/\/$/, "");
  return p === "" ? "/" : p;
}

async function includePartials() {
  const nodes = document.querySelectorAll("[data-include]");
  await Promise.all(
    Array.from(nodes).map(async (node) => {
      const res = await fetch(node.getAttribute("data-include"));
      node.innerHTML = await res.text();
    })
  );
  wireHeader();
}

function wireHeader() {
  const current = normalize(window.location.pathname);

  document.querySelectorAll(".main-nav a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href && normalize(href) === current) a.setAttribute("aria-current", "page");
  });

  const esLink = document.querySelector('[data-lang="es"]');
  const enLink = document.querySelector('[data-lang="en"]');
  if (esLink && PAGE_MAP[current]) esLink.setAttribute("href", PAGE_MAP[current]);
  if (enLink && PAGE_MAP_REVERSE[current]) enLink.setAttribute("href", PAGE_MAP_REVERSE[current]);

  const toggle = document.querySelector(".menu-toggle");
  const header = document.querySelector(".site-header");
  if (toggle && header) {
    toggle.addEventListener("click", () => {
      const open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
}

document.addEventListener("DOMContentLoaded", includePartials);
