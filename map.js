// Create the map
const map = L.map('map').setView([21.3099, -157.8581], 12);

// Map tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);


// Convert address to coordinates
async function geocodeAddress(address) {

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }

  } catch (err) {
    console.error("Geocode error:", err);
  }

  return null;
}


// Add markers using addresses
async function addMarkers(data) {

  for (const org of data) {

    const address = org["Address"];

    if (!address) continue;

    // Skip PO boxes
    if (address.toLowerCase().startsWith("p.o. box")) continue;

    const location = await geocodeAddress(address);

    if (!location) continue;

    L.marker([location.lat, location.lng])
      .addTo(map)
      .bindPopup(`
        <b>${org["English Name"]}</b><br>
        ${address}
      `);

  }

}