// Initialize the map centered on Indonesia
var map = L.map('map').setView([-2.5, 120], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// Load GeoJSON data
fetch('assets/data/indonesia_fires_2023.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            onEachFeature: function (feature, layer) {
                layer.bindPopup("Brightness: " + feature.properties.brightness + 
                                "<br>Date: " + feature.properties.acq_date + 
                                "<br>FRP: " + feature.properties.frp);
            }
        }).addTo(map);
    });