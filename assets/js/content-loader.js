function escapeHtml(str) {
  var div = document.createElement("div");
  div.textContent = str == null ? "" : str;
  return div.innerHTML;
}

// Generic content binder driven by data attributes, so every page shares one script:
// data-cms="field"              → sets textContent from data[field]
// data-cms="field" data-cms-src → sets the src attribute instead (images/video)
// data-cms="field" data-cms-twoline="field2" → two-line value joined with <br />
// data-cms-href-field="field"   → additionally sets href from data[field] (buttons/links)
function applyContent(data) {
  document.querySelectorAll("[data-cms]").forEach(function (el) {
    var key = el.getAttribute("data-cms");
    var value = data[key];
    if (value !== undefined) {
      if (el.hasAttribute("data-cms-twoline")) {
        var second = data[el.getAttribute("data-cms-twoline")];
        el.innerHTML = escapeHtml(value) + "<br />" + escapeHtml(second);
      } else if (el.hasAttribute("data-cms-src")) {
        el.setAttribute("src", value);
      } else {
        el.textContent = value;
      }
    }
    var hrefField = el.getAttribute("data-cms-href-field");
    if (hrefField && data[hrefField] !== undefined) {
      el.setAttribute("href", data[hrefField]);
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var page = document.body.getAttribute("data-cms-page");
  if (!page) return;
  var lang = document.documentElement.lang === "es" ? "es" : "en";
  fetch("/content/" + page + "-" + lang + ".json")
    .then(function (res) { return res.json(); })
    .then(applyContent)
    .catch(function () {
      /* fetch failed — the static HTML already shipped with real content, so leave it as-is */
    });
});
