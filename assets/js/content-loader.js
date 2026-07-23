function escapeHtml(str) {
  var div = document.createElement("div");
  div.textContent = str == null ? "" : str;
  return div.innerHTML;
}

var LINKEDIN_SVG =
  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>';

// Tap-to-flip is delegated on document so it keeps working after content-loader
// re-renders the team cards from JSON; on desktop the CSS ignores the
// .is-flipped class and the existing hover overlay takes over instead.
document.addEventListener("click", function (e) {
  var avatar = e.target.closest(".team-avatar");
  if (!avatar || e.target.closest("a")) return;
  avatar.classList.toggle("is-flipped");
});

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

  document.querySelectorAll("[data-cms-list]").forEach(function (el) {
    var key = el.getAttribute("data-cms-list");
    var type = el.getAttribute("data-cms-list-type") || "checklist";
    var items = data[key];
    if (Array.isArray(items)) renderList(el, items, type);
  });
}

// Rebuilds a repeating block of markup from a JSON array. Each "type" mirrors one
// repeating structure already in the page's CSS (check-list, step-grid, team cards,
// event rows) — kept as small dedicated templates rather than one generic template
// engine, since each structure's markup genuinely differs.
function renderList(container, items, type) {
  container.innerHTML = items
    .map(function (item) {
      switch (type) {
        case "checklist":
          return "<li>" + escapeHtml(item) + "</li>";

        case "steps":
          return (
            '<div class="step"><span class="step-no">' + escapeHtml(item.step_no) + "</span><h3>" +
            escapeHtml(item.title) + "</h3><p>" + escapeHtml(item.body) + "</p></div>"
          );

        case "teams":
          return (
            '<div class="card has-photo" style="--accent-card:' + escapeHtml(item.color) + ';">' +
            '<img class="card-photo" src="' + escapeHtml(item.photo) + '" alt="' + escapeHtml(item.name) + '" loading="lazy" />' +
            '<div class="card-body"><h3>' + escapeHtml(item.name) + ' — <span class="card-nickname">"' +
            escapeHtml(item.nickname) + '"</span></h3><p>' + escapeHtml(item.description) + "</p></div></div>"
          );

        case "events":
          var logoHtml =
            item.logo_type === "text"
              ? '<div class="event-logo-box text-fallback">' + escapeHtml(item.logo_text) + "</div>"
              : '<div class="event-logo-box' + (item.logo_dark ? " dark" : "") + '">' +
                '<img src="' + escapeHtml(item.logo) + '" alt="' + escapeHtml(item.name) + '" loading="lazy" /></div>';
          var attendeesHtml = "";
          if (Array.isArray(item.attendees) && item.attendees.length) {
            attendeesHtml =
              '<div class="event-attendees">' +
              item.attendees
                .map(function (person) {
                  return (
                    '<span class="event-attendee" title="' + escapeHtml(person.name) + '">' +
                    '<img class="event-attendee-photo" src="' + escapeHtml(person.photo) +
                    '" alt="' + escapeHtml(person.name) + '" loading="lazy" />' +
                    '<a class="event-attendee-email" href="mailto:' + escapeHtml(person.email) +
                    '" aria-label="Email ' + escapeHtml(person.name) +
                    '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg></a></span>'
                  );
                })
                .join("") +
              "</div>";
          }
          return (
            '<div class="event-row"><div class="event-date"><span class="event-day">' +
            escapeHtml(item.day) + '</span><span class="event-month">' + escapeHtml(item.month) + "</span></div>" +
            logoHtml + '<div class="event-info"><strong>' + escapeHtml(item.name) + "</strong><span>" +
            escapeHtml(item.city) + "</span></div>" + attendeesHtml + "</div>"
          );

        case "departments":
          var members = Array.isArray(item.members) ? item.members : [];
          return (
            '<div class="team-dept" style="--dept-color:' + escapeHtml(item.color) + ';">' +
            '<h3 class="team-dept-heading">' + escapeHtml(item.name) + "</h3>" +
            '<div class="team-grid">' +
            members
              .map(function (person) {
                var phoneHtml = person.phone
                  ? '<a href="tel:' + escapeHtml(String(person.phone).replace(/\s+/g, "")) + '">' + escapeHtml(person.phone) + "</a>"
                  : "";
                var linkedinHtml = person.linkedin
                  ? '<a class="team-linkedin" href="' + escapeHtml(person.linkedin) + '" target="_blank" rel="noopener" aria-label="' +
                    escapeHtml(person.name) + ' on LinkedIn">' + LINKEDIN_SVG + "</a>"
                  : "";
                return (
                  '<div class="team-card"><div class="team-avatar"><div class="team-avatar-inner">' +
                  '<div class="team-avatar-face team-avatar-front"><img src="' + escapeHtml(person.photo) +
                  '" alt="' + escapeHtml(person.name) + '" loading="lazy" /></div>' +
                  '<div class="team-avatar-face team-avatar-back"><a href="mailto:' + escapeHtml(person.email) + '">' +
                  escapeHtml(person.email) + "</a>" + phoneHtml + "</div>" +
                  "</div></div><strong>" + escapeHtml(person.name) + "</strong>" + linkedinHtml + "</div>"
                );
              })
              .join("") +
            "</div></div>"
          );

        default:
          return "";
      }
    })
    .join("");
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
