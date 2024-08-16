// Initialize the map centered on Indonesia
var map = L.map('map').setView([-2.5, 120], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

var geojsonLayer;
var markers = [];

// Define a custom icon for the fire markers
var fireIcon = L.icon({
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Fire_icon.svg/1024px-Fire_icon.svg.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

// Load GeoJSON data
fetch('assets/data/indonesia_fires_2023.geojson')
    .then(response => response.json())
    .then(data => {
        // Function to update map and table based on the selected date
        function updateMapAndTable(date) {
            if (geojsonLayer) {
                map.removeLayer(geojsonLayer);
            }
            markers.forEach(marker => map.removeLayer(marker));
            markers = [];

            const filteredData = {
                type: 'FeatureCollection',
                features: data.features.filter(feature => {
                    return feature.properties.acq_date === date;
                })
            };

            const tableBody = document.getElementById('table-body');
            tableBody.innerHTML = '';

            geojsonLayer = L.geoJSON(filteredData, {
                pointToLayer: function(feature, latlng) {
                    const marker = L.marker(latlng, { icon: fireIcon });
                    markers.push(marker);
                    return marker;
                },
                onEachFeature: function (feature, layer) {
                    layer.bindPopup(
                        `<b>Location:</b> (${feature.geometry.coordinates[1]}, ${feature.geometry.coordinates[0]})<br>` +
                        `<b>Brightness:</b> ${feature.properties.brightness}<br>` +
                        `<b>Date:</b> ${feature.properties.acq_date}<br>` +
                        `<b>FRP:</b> ${feature.properties.frp}<br>` +
                        `<b>Satellite:</b> ${feature.properties.satellite}<br>` +
                        `<b>Instrument:</b> ${feature.properties.instrument}`
                    );

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${feature.geometry.coordinates[1]}</td>
                        <td>${feature.geometry.coordinates[0]}</td>
                        <td>${feature.properties.brightness}</td>
                        <td>${feature.properties.acq_date}</td>
                        <td>${feature.properties.frp}</td>
                        <td>${feature.properties.satellite}</td>
                        <td>${feature.properties.instrument}</td>
                    `;

                    row.addEventListener('click', () => {
                        map.setView(layer.getLatLng(), 13);
                        layer.openPopup();
                    });

                    tableBody.appendChild(row);
                }
            }).addTo(map);

            // Auto-zoom to the filtered data
            if (filteredData.features.length > 0) {
                var bounds = geojsonLayer.getBounds();
                map.fitBounds(bounds);

                // Automatically open the popup for the first marker
                if (markers.length > 0) {
                    map.setView(markers[0].getLatLng(), 13);
                    markers[0].openPopup();
                }
            } else {
                map.setView([-2.5, 120], 5); // Reset to default view if no data matches
            }
        }

        // Set the default date to January 1, 2023
        const defaultDate = '2023-01-01';
        updateMapAndTable(defaultDate);

        // Add event listener to apply filter based on selected date
        document.getElementById('filter-button').addEventListener('click', function() {
            const selectedDate = document.getElementById('date-select').value;
            updateMapAndTable(selectedDate);
        });
    });