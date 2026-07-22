function escapeHtml(str) {
  var div = document.createElement("div");
  div.textContent = str == null ? "" : str;
  return div.innerHTML;
}

function applyHomeContent(data) {
  var eyebrow = document.getElementById("cms-eyebrow");
  var headline = document.getElementById("cms-headline");
  var lede = document.getElementById("cms-lede");
  var cta1 = document.getElementById("cms-cta1");
  var cta2 = document.getElementById("cms-cta2");
  var video = document.querySelector(".hero-video-bg");

  if (eyebrow) eyebrow.textContent = data.eyebrow;
  if (headline) headline.innerHTML = escapeHtml(data.headline_line1) + "<br />" + escapeHtml(data.headline_line2);
  if (lede) lede.textContent = data.lede;
  if (cta1) {
    cta1.textContent = data.cta1_label;
    cta1.setAttribute("href", data.cta1_href);
  }
  if (cta2) {
    cta2.textContent = data.cta2_label;
    cta2.setAttribute("href", data.cta2_href);
  }
  if (video && data.background_video) video.setAttribute("src", data.background_video);
}

document.addEventListener("DOMContentLoaded", function () {
  var lang = document.documentElement.lang === "es" ? "es" : "en";
  fetch("/content/home-" + lang + ".json")
    .then(function (res) { return res.json(); })
    .then(applyHomeContent)
    .catch(function () {
      /* fetch failed — the static HTML already shipped with real content, so leave it as-is */
    });
});
