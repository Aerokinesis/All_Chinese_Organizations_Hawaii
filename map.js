// Create map
const map = L.map("map").setView([21.3099, -157.8581], 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

// store markers
const markers = {};
const markerLayer = L.layerGroup().addTo(map);


// Create markers
function addMarkers(data) {

  markerLayer.clearLayers();

  data.forEach(org => {

    if (!org.lat || !org.lng) return;

    const marker = L.marker([org.lat, org.lng])
      .bindPopup(`
        <b>${org["English Name"]}</b><br>
        ${org["Address"]}
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