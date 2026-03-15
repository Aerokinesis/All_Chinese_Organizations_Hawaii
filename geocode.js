const fs = require("fs");

const inputFile = "chinese_organizations.json";
const outputFile = "chinese_organizations_geocoded.json";

const data = JSON.parse(fs.readFileSync(inputFile, "utf8"));

function cleanAddress(address) {
    return address
        .replace(/suite\s*\d+/i, "")
        .replace(/ste\s*\d+/i, "")
        .replace(/#\d+/i, "")
        .trim();
}

async function geocode(address) {

    const cleaned = cleanAddress(address);

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleaned + ", Honolulu, HI")}`;

    const res = await fetch(url, {
        headers: {
            "User-Agent": "organization-directory"
        }
    });

    const json = await res.json();

    if (json.length === 0) return null;

    return {
        lat: parseFloat(json[0].lat),
        lng: parseFloat(json[0].lon)
    };
}

async function run() {

    for (let org of data) {

        const address = org["Address"];

        if (!address) continue;

        if (address.toLowerCase().startsWith("p.o. box") || address.toLowerCase().startsWith("c/o")) {
            console.log("Skipping PO Box / c/o address:", address);
            continue;
        }
        
        console.log("Geocoding:", address);

        const coords = await geocode(address);

        if (coords) {
            org.lat = coords.lat;
            org.lng = coords.lng;
        }

        await new Promise(r => setTimeout(r, 1100)); // respect API rate limit
    }

    fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));

    console.log("Done! Saved to:", outputFile);
}

run();