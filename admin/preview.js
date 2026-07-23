function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isVideoPath(p) {
  return typeof p === "string" && /\.(mp4|webm|mov)$/i.test(p);
}

function renderListField(items) {
  if (!Array.isArray(items) || !items.length) return "";
  if (typeof items[0] !== "object") {
    return (
      '<ul class="check-list cms-preview-checklist">' +
      items.map(function (item) { return "<li>" + escapeHtml(item) + "</li>"; }).join("") +
      "</ul>"
    );
  }
  return (
    '<div class="cms-preview-list">' +
    items
      .map(function (item) {
        var rows = Object.keys(item)
          .filter(function (k) { return item[k] !== "" && item[k] != null && typeof item[k] !== "object"; })
          .map(function (k) {
            return '<div class="cms-preview-list-row"><span class="cms-preview-list-key">' + escapeHtml(k) + "</span> " + escapeHtml(item[k]) + "</div>";
          })
          .join("");
        return '<div class="cms-preview-list-item">' + rows + "</div>";
      })
      .join("") +
    "</div>"
  );
}

var PreviewComponent = createClass({
  render: function () {
    var data = this.props.entry.get("data").toJS();
    var getAsset = this.props.getAsset;
    var html = ['<div class="cms-preview-page">'];

    var bgKey = data.background_video ? "background_video" : data.s2_background_video ? "s2_background_video" : null;
    if (bgKey) {
      var bgSrc = getAsset(data[bgKey]).toString();
      if (isVideoPath(data[bgKey])) {
        html.push('<video class="cms-preview-hero-media" src="' + escapeHtml(bgSrc) + '" autoplay muted loop playsinline></video>');
      } else {
        html.push('<img class="cms-preview-hero-media" src="' + escapeHtml(bgSrc) + '" alt="" />');
      }
    }

    html.push('<div class="cms-preview-content">');
    if (data.eyebrow) html.push('<span class="eyebrow">' + escapeHtml(data.eyebrow) + "</span>");
    if (data.headline_line1) {
      html.push("<h1>" + escapeHtml(data.headline_line1) + (data.headline_line2 ? "<br/>" + escapeHtml(data.headline_line2) : "") + "</h1>");
    } else if (data.headline) {
      html.push("<h1>" + escapeHtml(data.headline) + "</h1>");
    }
    if (data.lede) html.push('<p class="lede">' + escapeHtml(data.lede) + "</p>");
    html.push("</div>");

    var skip = { eyebrow: 1, headline: 1, headline_line1: 1, headline_line2: 1, lede: 1, background_video: 1, s2_background_video: 1 };
    Object.keys(data).forEach(function (key) {
      if (skip[key]) return;
      var value = data[key];
      if (Array.isArray(value)) {
        html.push('<div class="cms-preview-section"><span class="cms-preview-label">' + escapeHtml(key) + "</span>" + renderListField(value) + "</div>");
      } else if (typeof value === "string" && value && /_photo$/.test(key)) {
        html.push('<img class="cms-preview-photo" src="' + escapeHtml(getAsset(value).toString()) + '" alt="" />');
      } else if (typeof value === "string" && value && /heading|eyebrow/.test(key)) {
        html.push('<div class="cms-preview-section"><span class="' + (/eyebrow/.test(key) ? "eyebrow" : "") + '">' + escapeHtml(value) + "</span></div>");
      } else if (typeof value === "string" && value && /body|quote|cite/.test(key)) {
        html.push('<p class="cms-preview-section">' + escapeHtml(value) + "</p>");
      }
    });

    html.push("</div>");
    return h("div", { dangerouslySetInnerHTML: { __html: html.join("") } });
  },
});

CMS.registerPreviewStyle(
  "https://fonts.googleapis.com/css2?family=Fraunces:SOFT,WONK,opsz,wght@0,0,9..144,300..700&family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap"
);
CMS.registerPreviewStyle("/assets/css/style.css");
CMS.registerPreviewStyle(
  "body { padding: 32px; } .cms-preview-hero-media { width: 100%; max-height: 280px; object-fit: cover; border-radius: 8px; display: block; } .cms-preview-content { padding: 24px 4px; } .cms-preview-section { margin: 18px 4px; } .cms-preview-label { display: block; font-family: var(--font-mono, monospace); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.06em; color: #888; margin-bottom: 8px; } .cms-preview-photo { max-width: 260px; border-radius: 8px; margin: 12px 4px; display: block; } .cms-preview-list { display: grid; gap: 10px; } .cms-preview-list-item { border: 1px solid #e4e4e4; border-radius: 8px; padding: 10px 14px; font-size: 0.86rem; } .cms-preview-list-row { padding: 2px 0; } .cms-preview-list-key { font-weight: 700; text-transform: capitalize; margin-right: 6px; }",
  { raw: true }
);

[
  "home_en", "home_es",
  "for_hotels_en", "for_hotels_es",
  "for_travel_partners_en", "for_travel_partners_es",
  "how_we_work_en", "how_we_work_es",
  "hotel_network_en", "hotel_network_es",
  "events_en", "events_es",
  "about_en", "about_es",
  "contact_en", "contact_es",
].forEach(function (name) {
  CMS.registerPreviewTemplate(name, PreviewComponent);
});
