// Contact page: tab switcher between the hotel form and the travel-partner form.
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".form-tab");
  const forms = document.querySelectorAll("form.contact-form");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      forms.forEach((f) => f.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.target).classList.add("active");
    });
  });

  // Forms post to Netlify Forms once deployed there (data-netlify="true").
  // ponytail: no backend in this repo — submit is left to Netlify's own handling;
  // we only show the on-page confirmation message instead of navigating away.
  document.querySelectorAll("form.contact-form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      const success = form.parentElement.querySelector(".form-success");
      if (window.location.protocol === "file:") {
        // Local file preview: Netlify isn't there to catch the POST, so fake it.
        e.preventDefault();
        form.reset();
      }
      if (success) success.style.display = "block";
    });
  });
});
