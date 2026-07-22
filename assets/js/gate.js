// ponytail: client-side-only preview gate (no server, no Netlify plan needed).
// Deters casual visitors while the site is pre-launch; not real security — remove before go-live.
(function () {
  var KEY = "s2_preview_unlocked";
  var PASSWORD = "stream2preview";
  if (sessionStorage.getItem(KEY) === "1") return;
  document.documentElement.style.visibility = "hidden";

  document.addEventListener("DOMContentLoaded", function () {
    var overlay = document.createElement("div");
    overlay.id = "preview-gate";
    overlay.innerHTML =
      '<div class="preview-gate-box">' +
      '<img src="/assets/img/stream2-logo-color.png" alt="Stream2" class="preview-gate-logo" />' +
      "<p>This is a private preview of the new Stream2 website, not yet live.</p>" +
      '<input type="password" id="preview-gate-input" placeholder="Password" autofocus />' +
      '<button id="preview-gate-btn" type="button">Enter</button>' +
      '<p id="preview-gate-error">Incorrect password.</p>' +
      "</div>";
    document.body.appendChild(overlay);
    document.documentElement.style.visibility = "visible";

    var input = document.getElementById("preview-gate-input");
    var error = document.getElementById("preview-gate-error");
    function tryUnlock() {
      if (input.value === PASSWORD) {
        sessionStorage.setItem(KEY, "1");
        overlay.remove();
      } else {
        error.style.display = "block";
      }
    }
    document.getElementById("preview-gate-btn").addEventListener("click", tryUnlock);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") tryUnlock();
    });
  });
})();
