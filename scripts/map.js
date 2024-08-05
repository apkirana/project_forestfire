// Initialize the map
var map = L.map('map').setView([44.9722, -120.5542], 6);

// Set up the OSM layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Function to convert CSV to JSON
function csvToJSON(csv) {
    const lines = csv.split("\n");
    const result = [];
    const headers = lines[0].split(",");

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i]) continue;
        const obj = {};
        const currentline = lines[i].split(",");
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    return result;
}

// Fetch and process the CSV data
fetch('path/to/your/ooregon_fire.csv')
    .then(response => response.text())
    .then(csvText => {
        const data = csvToJSON(csvText);
        data.forEach(fire => {
            L.marker([parseFloat(fire.latitude), parseFloat(fire.longitude)])
                .addTo(map)
                .bindPopup(`<b>${fire.incident_name}</b><br>${fire.incident_date}`);
        });
    });