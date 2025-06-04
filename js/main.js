// Εκκίνηση του Leaflet map
const map = initMap();

window.addEventListener("load", () => {
  setTimeout(() => {
    map.invalidateSize();
  }, 500);
});
