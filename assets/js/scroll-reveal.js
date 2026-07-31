// Subtle fade-up per section as it enters the viewport. If JS never runs (or
// prefers-reduced-motion is set) sections simply stay visible -- the hidden
// state only exists on the .reveal class this script itself adds, so there
// is no no-JS/no-animation fallback to maintain separately.
(function () {
  var sections = document.querySelectorAll("section:not(.hero)");
  if (!sections.length) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) return;

  sections.forEach(function (s) { s.classList.add("reveal"); });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );
  sections.forEach(function (s) { observer.observe(s); });
})();
