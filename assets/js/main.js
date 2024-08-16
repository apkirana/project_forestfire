// Initialize the map centered on Indonesia
var map = L.map('map').setView([-2.5, 120], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

var geojsonLayer;

// Load GeoJSON data
fetch('assets/data/indonesia_fires_2023.geojson')
    .then(response => response.json())
    .then(data => {
        // Get the unique provinces from the data
        const provinces = [...new Set(data.features.map(feature => feature.properties.province))];
        
        // Populate the province dropdown
        var selectProvince = document.getElementById('province-select');
        provinces.forEach(province => {
            var option = document.createElement('option');
            option.value = province;
            option.text = province;
            selectProvince.add(option);
        });

        // Function to update map based on filters
        function updateMap(province, date) {
            if (geojsonLayer) {
                map.removeLayer(geojsonLayer);
            }

            const filteredData = {
                type: 'FeatureCollection',
                features: data.features.filter(feature => {
                    const matchesProvince = province === 'all' || feature.properties.province === province;
                    const matchesDate = !date || feature.properties.acq_date === date;
                    return matchesProvince && matchesDate;
                })
            };

            geojsonLayer = L.geoJSON(filteredData, {
                onEachFeature: function (feature, layer) {
                    layer.bindPopup("Brightness: " + feature.properties.brightness + 
                                    "<br>Date: " + feature.properties.acq_date + 
                                    "<br>FRP: " + feature.properties.frp);
                }
            }).addTo(map);
        }

        // Initially display all data
        updateMap('all', null);

        // Add event listener to apply filters
        document.getElementById('filter-button').addEventListener('click', function() {
            const selectedProvince = selectProvince.value;
            const selectedDate = document.getElementById('date-select').value;
            updateMap(selectedProvince, selectedDate);
        });
    });