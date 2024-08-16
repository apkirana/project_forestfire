// Initialize the map centered on Indonesia
var map = L.map('map').setView([-2.5, 120], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

var geojsonLayer;
var markers = [];

// Define a custom icon for the fire markers
var fireIcon = L.divIcon({
    html: '<div style="width: 20px; height: 20px; background-color: red; border-radius: 50%;"></div>',
    className: '', // No additional CSS class needed
    iconSize: [20, 20], // Size of the icon
    iconAnchor: [10, 10], // Point of the icon which corresponds to the marker's location
    popupAnchor: [0, -10] // Point from which the popup should open relative to the iconAnchor
});


// Load GeoJSON data
fetch('assets/data/indonesia_fires_2023.geojson')
    .then(response => response.json())
    .then(data => {
        console.log('Data loaded:', data); // Log the loaded data

        // Function to update map and table based on the selected date
        function updateMapAndTable(date) {
            console.log('Filtering data for date:', date); // Log the selected date

            if (geojsonLayer) {
                map.removeLayer(geojsonLayer);
            }
            markers.forEach(marker => map.removeLayer(marker));
            markers = [];

            // Filter the data based on the selected date
            const filteredFeatures = date 
                ? data.features.filter(feature => feature.properties.acq_date === date)
                : data.features;

            console.log('Filtered features:', filteredFeatures); // Log the filtered features

            const tableBody = document.getElementById('table-body');
            tableBody.innerHTML = '';

            // Populate the table with the filtered data
            if (filteredFeatures.length > 0) {
                filteredFeatures.forEach(feature => {
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
                    
                    // Add click event to focus on the map
                    row.addEventListener('click', () => {
                        const latlng = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
                        map.setView(latlng, 13);
                        const marker = L.marker(latlng, { icon: fireIcon }).addTo(map);
                        marker.bindPopup(
                            `<b>Location:</b> (${feature.geometry.coordinates[1]}, ${feature.geometry.coordinates[0]})<br>` +
                            `<b>Brightness:</b> ${feature.properties.brightness}<br>` +
                            `<b>Date:</b> ${feature.properties.acq_date}<br>` +
                            `<b>FRP:</b> ${feature.properties.frp}<br>` +
                            `<b>Satellite:</b> ${feature.properties.satellite}<br>` +
                            `<b>Instrument:</b> ${feature.properties.instrument}`
                        ).openPopup();
                    });

                    tableBody.appendChild(row);
                });
            } else {
                console.log('No data available for the selected date.');
                const row = document.createElement('tr');
                row.innerHTML = `<td colspan="7">No data available for this date.</td>`;
                tableBody.appendChild(row);
            }

            // Add the filtered data to the map
            geojsonLayer = L.geoJSON(filteredFeatures, {
                pointToLayer: function(feature, latlng) {
                    const marker = L.marker(latlng, { icon: fireIcon });
                    markers.push(marker);
                    return marker;
                }
            }).addTo(map);

            // Auto-zoom to the filtered data
            if (filteredFeatures.length > 0) {
                const bounds = geojsonLayer.getBounds();
                map.fitBounds(bounds);
            } else {
                map.setView([-2.5, 120], 5); // Reset to default view if no data matches
            }
        }

        // Initially display all data
        updateMapAndTable(null);

        // Add event listener to apply filter based on selected date
        document.getElementById('filter-button').addEventListener('click', function() {
            const selectedDate = document.getElementById('date-select').value;
            updateMapAndTable(selectedDate);
        });
    })
    .catch(error => console.error('Error loading or processing data:', error));