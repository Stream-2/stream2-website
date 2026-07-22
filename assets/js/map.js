// Anonymized coverage map: city-level presence dots only, colored by country.
// Aggregate/presence-only — no hotel names, no per-property counts, no search box.
// See proposal Fase 3.4 / 1.4 for why this stays above hotel-level detail.
const COUNTRY_COLORS = {
  "Netherlands": "#e6194b",
  "Belgium": "#3cb44b",
  "Spain": "#f0c400",
  "Germany": "#4363d8",
  "France": "#f58231",
  "Hungary": "#911eb4",
  "Poland": "#2ec4c4",
  "Italy": "#f032e6",
  "Portugal": "#8fce00",
  "United Kingdom": "#e88fa2",
  "Luxembourg": "#008080",
  "Switzerland": "#a35ce6",
  "Czechia": "#9a6324",
  "Austria": "#800000",
  "Slovakia": "#6b8e23",
  "Ireland": "#588157",
  "Denmark": "#c1121f",
  "Croatia": "#ee6c4d",
  "Greece": "#023e8a",
  "Sweden": "#ffb703",
  "Romania": "#4a4e69",
};
const DEFAULT_DOT_COLOR = "#0b3d5c";

document.addEventListener("DOMContentLoaded", async () => {
  const el = document.getElementById("coverage-map");
  if (!el || typeof L === "undefined") return;

  const cityRes = await fetch("/data/city-coverage.json");
  const { cities } = await cityRes.json();

  const map = L.map(el, { scrollWheelZoom: false, minZoom: 3, maxZoom: 17 }).setView([50, 10], 4);
  L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
    attribution: "© OpenStreetMap, © CARTO",
  }).addTo(map);

  cities.forEach((city) => {
    const color = COUNTRY_COLORS[city.country] || DEFAULT_DOT_COLOR;
    L.circleMarker([city.lat, city.lon], {
      radius: 6,
      color: "#fff",
      weight: 1.5,
      fillColor: color,
      fillOpacity: 0.95,
    })
      .bindTooltip(city.name, { direction: "top", className: "city-tooltip" })
      .addTo(map);
  });
});
