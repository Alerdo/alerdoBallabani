var streets = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
});

var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var basemaps = {
  "Streets": streets,
  "Satellite": satellite
};

var map = L.map('map', {
    layers: [streets]
}).setView([54.5, -4], 6);

L.easyButton("fa-info fa-lg", function (btn, map) {
  
  $('#exampleModal').modal("show");
  
}).addTo(map);



var airports = L.markerClusterGroup({
      polygonOptions: {
        fillColor: '#fff',
        color: '#000',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.5
      }}).addTo(map);

var cities = L.markerClusterGroup({
      polygonOptions: {
        fillColor: '#fff',
        color: '#000',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.5
      }}).addTo(map);

var overlays = {
  "Airports": airports,
  "Cities": cities
};

var layerControl = L.control.layers(basemaps, overlays).addTo(map);

var airportIcon = L.ExtraMarkers.icon({
  prefix: 'fa',
  icon: 'fa-plane',
  iconColor: 'black',
  markerColor: 'white',
  shape: 'square'
});

var cityIcon = L.ExtraMarkers.icon({
  prefix: 'fa',
  icon: 'fa-city',
  markerColor: 'green',
  shape: 'square'
});

$(document).ready(function() {
  
  showToast("Getting airports and city markers", 1500, false);
                   
  $.ajax({
    url: "https://coding.itcareerswitch.co.uk/leaflet/getAirports.php",
    type: 'POST',
    dataType: 'json',
    data: {
      iso: "GB"
    },
    success: function (result) {
            
      if (result.status.code == 200) {
        
        result.data.forEach(function(item) {
          
          L.marker([item.lat, item.lng], {icon: airportIcon})
            .bindTooltip(item.name, {direction: 'top', sticky: true})
            .addTo(airports);
          
        })
       
      } else {

        showToast("Error retrieving airport data", 4000, false);

      } 

    },
    error: function (jqXHR, textStatus, errorThrown) {
      showToast("Airports - server error", 4000, false);
    }
  });      
                   
  $.ajax({
    url: "https://coding.itcareerswitch.co.uk/leaflet/getCities.php",
    type: 'POST',
    dataType: 'json',
    data: {
      iso: "GB"
    },
    success: function (result) {
            
      if (result.status.code == 200) {

        result.data.forEach(function(item) {
          
          L.marker([item.lat, item.lng], {icon: cityIcon})
            .bindTooltip("<div class='col text-center'><strong>" + item.name + "</strong><br><i>(" + numeral(item.population).format("0,0") + ")</i></div>", {direction: 'top', sticky: true})
            .addTo(cities);
          
        })
        
      } else {

        showToast("Error retrieving city data", 4000, false);

      } 

    },
    error: function (jqXHR, textStatus, errorThrown) {
      showToast("Cities - server error", 4000, false);
    }
  });   
                  
});

// functions

function showToast(message, duration, close) {
  
  Toastify({
    text: message,
    duration: duration,
    newWindow: true,
    close: close,
    gravity: "top", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "#004687"
    },
    onClick: function () {} // Callback after click
  }).showToast();
  
}


