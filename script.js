const motoParkingUrl = 'https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/motorcycle-parking/exports/geojson?lang=en&timezone=America%2FLos_Angeles'

// blue, gold, red, green, orange, yellow, violet, grey, black
function iconColor(color) {
    var icon = new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      return icon
}

function addDataToMap(data) {
    var markers = L.markerClusterGroup({
        disableClusteringAtZoom: 17
    });
    markers.addLayer(
        L.geoJSON(data, {
        filter: filter,
        onEachFeature: onEachFeature
    }))
    map.addLayer(markers)
}
fetch(motoParkingUrl).then(response => {
    return response.json()
}).then(data => addDataToMap(data)) 

var map = L.map('map').setView([49.28290750560059, -123.12051391364608], 13);

// Add a tile layer (you can choose a different provider)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function onEachFeature(feature, layer) {
    // modify this to parse each geojon file
    [meterType, timeineffe, coords] = [feature.properties.type, feature.properties.timeineffe, feature.properties.geo_point_2d]
    popupText = `<b>${meterType}</b> <br> ${timeineffe != 'n/a' ? timeineffe + '<br>': ''}`
    popupText += `<a href="https://www.google.com/maps/search/?api=1&query=${coords.lat}%2C${coords.lon}" target="_blank">Maps Directions</a><br>`
    layer.bindPopup(popupText, {
        maxHeight: 560
    })
    if (meterType == 'Metered Motorcycle Parking'){
        layer.setIcon(iconColor('green'))
    }
    layer.bindTooltip(feature.properties.type)
}

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend')
    div.innerHTML += "<i class='blue'></i>Non-Metered<br><i class='green'></i>Metered"
    return div;
};

legend.addTo(map);

// in case need to filter data
function filter(geoJsonFeature) {
    result = geoJsonFeature
    // result = (geoJsonFeature.properties.type == 'Non-Metered Motorcycle Parking') ? true : false;
    return result
}
// Locate user (Need HTTPS host)
L.control.locate().addTo(map)