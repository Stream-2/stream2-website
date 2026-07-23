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
  // A plain POST navigates away before the on-page "thank you" message is ever
  // seen, so submit via fetch() instead and stay on the page either way.
  document.querySelectorAll("form.contact-form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const success = form.parentElement.querySelector(".form-success");
      if (window.location.protocol === "file:") {
        // Local file preview: no Netlify backend to POST to.
        form.reset();
        if (success) success.style.display = "block";
        return;
      }
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)).toString(),
      })
        .then((res) => {
          if (!res.ok) throw new Error("submit failed");
          form.reset();
          if (success) success.style.display = "block";
        })
        .catch(() => {
          alert("Something went wrong sending your message — please email us directly or try again.");
        });
    });
  });
});
