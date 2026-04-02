// Create map
const map = L.map("map").setView([21.3099, -157.8581], 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

// store markers
const markers = {};
const markerLayer = L.layerGroup().addTo(map);

function normalizeUrl(url) {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : "https://" + url;
}

// Create markers
function addMarkers(data) {

  markerLayer.clearLayers();

  data.forEach(org => {

    if (!org.lat || !org.lng) return;

    const phone = org["Phone"]
      ? `<br>📞 <a href="tel:${org["Phone"].replace(/\D/g, "")}" style="color:#b22222;">${org["Phone"]}</a>`
      : "";

    const email = org["Email"]
      ? `<br>✉️ <a href="mailto:${org["Email"]}" style="color:#b22222;">${org["Email"]}</a>`
      : "";

    const website = org["Website"]
      ? `<br>🌐 <a href="${normalizeUrl(org["Website"])}" target="_blank" style="color:#b22222;">${org["Website"]}</a>`
      : "";

    const marker = L.marker([org.lat, org.lng])
      .bindPopup(`
        <b>${org["English Name"]}</b><br>
        ${org["Address"]}
        ${phone}
        ${email}
        ${website}
      `);

    markerLayer.addLayer(marker);

    markers[org["English Name"]] = marker;

  });

}


// Zoom to organization
function zoomToOrganization(name) {

  const marker = markers[name];

  if (!marker) return;

  map.setView(marker.getLatLng(), 16);

  marker.openPopup();

}