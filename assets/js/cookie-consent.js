(function () {
  var KEY = "s2_cookie_consent";
  var LANG = document.documentElement.lang === "es" ? "es" : "en";

  var COPY = {
    en: {
      text: 'We use our own and third-party cookies for analytics purposes by analysing your browsing habits, to personalise content based on your preferences, and for advertising purposes. For more information, see our <a href="/cookie-policy.html">Cookie Policy</a>. You can accept or reject all cookies in bulk, or accept them selectively, change your selection, or reject their use via "Cookie Settings".',
      acceptAll: "Accept all",
      rejectAll: "Reject all",
      settings: "Cookie Settings",
      save: "Save preferences",
      necessary: "Necessary cookies",
      necessaryNote: "Always active — required for the site to function.",
      personalization: "Preference / personalisation cookies",
      analytics: "Analytics cookies",
      advertising: "Advertising cookies",
    },
    es: {
      text: 'Utilizamos cookies propias y de terceros con finalidades analíticas mediante el análisis del tráfico web, para personalizar el contenido según sus preferencias y con finalidades publicitarias. Para más información, consulte nuestra <a href="/es/politica-cookies.html">Política de Cookies</a>. Puede aceptar o rechazar todas las cookies en bloque, o aceptarlas de forma concreta, modificar su selección o rechazar su uso desde "Configuración de Cookies".',
      acceptAll: "Aceptar todas",
      rejectAll: "Rechazar todas",
      settings: "Configuración de Cookies",
      save: "Guardar preferencias",
      necessary: "Cookies necesarias",
      necessaryNote: "Siempre activas — necesarias para el funcionamiento de la web.",
      personalization: "Cookies de preferencias o personalización",
      analytics: "Cookies analíticas",
      advertising: "Cookies publicitarias",
    },
  };
  var c = COPY[LANG];

  function getConsent() {
    try {
      return JSON.parse(localStorage.getItem(KEY));
    } catch (e) {
      return null;
    }
  }

  function setConsent(categories) {
    var record = {
      necessary: true,
      personalization: !!categories.personalization,
      analytics: !!categories.analytics,
      advertising: !!categories.advertising,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(KEY, JSON.stringify(record));
    window.s2CookieConsent = record;
    document.dispatchEvent(new CustomEvent("s2:cookie-consent", { detail: record }));
    return record;
  }

  function buildBanner() {
    var wrap = document.createElement("div");
    wrap.id = "cookie-consent";
    wrap.innerHTML =
      '<div class="cookie-consent-scrim"></div>' +
      '<div class="cookie-consent-bar" role="dialog" aria-label="' + c.settings + '">' +
      '<p class="cookie-consent-text">' + c.text + "</p>" +
      '<div class="cookie-consent-actions">' +
      '<button type="button" class="btn btn-ghost" id="cookie-reject-all">' + c.rejectAll + "</button>" +
      '<button type="button" class="btn btn-ghost" id="cookie-open-settings">' + c.settings + "</button>" +
      '<button type="button" class="btn btn-primary" id="cookie-accept-all">' + c.acceptAll + "</button>" +
      "</div>" +
      '<div class="cookie-consent-settings" id="cookie-settings-panel" hidden>' +
      '<label class="cookie-toggle-row"><input type="checkbox" checked disabled /><span>' + c.necessary + "<small>" + c.necessaryNote + "</small></span></label>" +
      '<label class="cookie-toggle-row"><input type="checkbox" id="cookie-toggle-personalization" /><span>' + c.personalization + "</span></label>" +
      '<label class="cookie-toggle-row"><input type="checkbox" id="cookie-toggle-analytics" /><span>' + c.analytics + "</span></label>" +
      '<label class="cookie-toggle-row"><input type="checkbox" id="cookie-toggle-advertising" /><span>' + c.advertising + "</span></label>" +
      '<button type="button" class="btn btn-primary" id="cookie-save-settings">' + c.save + "</button>" +
      "</div>" +
      "</div>";
    document.body.appendChild(wrap);

    function close() {
      wrap.remove();
    }

    document.getElementById("cookie-accept-all").addEventListener("click", function () {
      setConsent({ personalization: true, analytics: true, advertising: true });
      close();
    });
    document.getElementById("cookie-reject-all").addEventListener("click", function () {
      setConsent({ personalization: false, analytics: false, advertising: false });
      close();
    });
    document.getElementById("cookie-open-settings").addEventListener("click", function () {
      document.getElementById("cookie-settings-panel").hidden = false;
    });
    document.getElementById("cookie-save-settings").addEventListener("click", function () {
      setConsent({
        personalization: document.getElementById("cookie-toggle-personalization").checked,
        analytics: document.getElementById("cookie-toggle-analytics").checked,
        advertising: document.getElementById("cookie-toggle-advertising").checked,
      });
      close();
    });
  }

  function openSettingsOnly() {
    var existing = document.getElementById("cookie-consent");
    if (existing) {
      existing.querySelector(".cookie-consent-settings").hidden = false;
      return;
    }
    buildBanner();
    document.getElementById("cookie-settings-panel").hidden = false;
    var stored = getConsent();
    if (stored) {
      document.getElementById("cookie-toggle-personalization").checked = !!stored.personalization;
      document.getElementById("cookie-toggle-analytics").checked = !!stored.analytics;
      document.getElementById("cookie-toggle-advertising").checked = !!stored.advertising;
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    window.s2CookieConsent = getConsent();
    if (!getConsent()) buildBanner();

    var settingsLink = document.getElementById("cookie-settings-link");
    if (settingsLink) {
      settingsLink.addEventListener("click", function (e) {
        e.preventDefault();
        openSettingsOnly();
      });
    }
  });
})();
