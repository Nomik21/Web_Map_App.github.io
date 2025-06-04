//$(function () {
// $("#accordion").accordion();
//});

function initMap() {
  // map options
  let centerLat = 37.84;
  let centerLng = 24.86;
  let initialZoom = 11;

  const map = L.map("map", {
    center: [centerLat, centerLng],
    zoom: initialZoom,
    maxZoom: 22,
  });

  //Basemaps
  // OpenStreetMap base layer
  const osm = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  ).addTo(map);

  // OpenStreetMap base layer
  const MiniMapLayer = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    {
      attribution: "Tiles &copy; Esri",
    }
  );

  const esriImagery = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution: "Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics",
      maxZoom: 19,
    }
  );

  const Carto = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      attribution: "&copy; CARTO",
    }
  );

  const ekxa = L.tileLayer.wms(
    "http://gis.ktimanet.gr/wms/wmsopen/wmsserver.aspx",
    {
      layers: "Basemap",
      format: "image/png",
      transparent: false,
      version: "1.1.1",
      attribution: "&copy; ΕΚΧΑ - Κτηματολόγιο",
      crs: L.CRS.EPSG3857,
    }
  );

  //Layers
  const soil_map = L.tileLayer.wms("http://mapsportal.ypen.gr/geoserver/ows?", {
    layers: "geonode:edafmap_1997",
    format: "image/png8",
    transparent: true,
    tiled: false,
    opacity: 1,
    version: "1.1.1",
    attribution: "Soil Map - Ministry of Environment and Energy (YPEN)",
  });

  const hypsometric_map = L.tileLayer.wms(
    "http://mapsportal.ypen.gr/geoserver/ows?",
    {
      layers: "geonode:hypsometriczonemap",
      format: "image/png8",
      transparent: true,
      tiled: false,
      opacity: 1,
      version: "1.1.1",
      attribution: "Height Zones - Ministry of Environment and Energy (YPEN)",
    }
  );

  const forests_map = L.tileLayer.wms(
    "http://mapsportal.ypen.gr/geoserver/ows?",
    {
      layers: "geonode:dlt_2015_020m_d04",
      format: "image/png8",
      transparent: true,
      tiled: false,
      opacity: 1,
      version: "1.1.1",
      attribution: "Forests - Ministry of Environment and Energy (YPEN)",
    }
  );

  const andros_L_Scale = L.tileLayer.wms(
    "http://atlas.geocenter.survey.ntua.gr:8080/geoserver/wms",
    {
      layers: "w_nomikos:Andros_L_Scale",
      format: "image/png",
      transparent: true,
      version: "1.1.1",
      attribution: "Developed by Nomikos Nikolaos",
    }
  );

  const andros_S_Scale = L.tileLayer.wms(
    "http://atlas.geocenter.survey.ntua.gr:8080/geoserver/wms",
    {
      layers: "w_nomikos:Andros_Small_Scale",
      format: "image/png",
      transparent: true,
      version: "1.1.1",
      attribution: "Developed by Nomikos Nikolaos",
    }
  );

  const andros_landuse = L.tileLayer.wms(
    "http://atlas.geocenter.survey.ntua.gr:8080/geoserver/wms",
    {
      layers: "w_nomikos:Andros_Land_Use_Hill",
      format: "image/png",
      transparent: true,
      version: "1.1.1",
      attribution: "Developed by Nomikos Nikolaos",
    }
  );

  const annotations_ = L.tileLayer.wms(
    "http://atlas.geocenter.survey.ntua.gr:8080/geoserver/wms",
    {
      layers: "w_nomikos:Annotations_Andros",
      format: "image/png",
      transparent: true,
      version: "1.1.1",
      attribution: "Developed by Nomikos Nikolaos",
    }
  );

  const annotations = L.esri.tiledMapLayer({
    url: "https://tiles.arcgis.com/tiles/zX8NTiUjIKUVyth8/arcgis/rest/services/Andros_Annot/MapServer",
    attribution: "Annotations developed by Nomikos Nikolaos",
  });

  function getColor(gridcode) {
    if (gridcode == 8) {
      return "#ccf24d";
    } else if (gridcode == 7) {
      return "#a6e648";
    } else if (gridcode == 6) {
      return "#e6a600";
    } else if (gridcode == 5) {
      return "#4dff00";
    } else if (gridcode == 4) {
      return "#ccffcc";
    } else {
      return "#ffffa8";
    }
  }

  function myStyle(feature) {
    return {
      fillColor: getColor(feature.properties.gridcode),
      weight: 1,
      fillOpacity: 1,
      color: "#000000", //Outline color
      opacity: 0.7,
    };
  }

  const landUseJSON = L.geoJson(landuse, {
    style: myStyle,
    onEachFeature: function (feature, layer) {
      const popupContent =
        "<p> Type of Land Use: <b>" + feature.properties.desc + "</b> </p>";
      if (feature.properties && feature.properties.popupContent) {
        popupContent += feature.properties.popupContent;
      }
      layer.bindPopup(popupContent);
    },
  });

  const beaconIcon = L.icon({
    iconUrl: "img/beacons.png",
    iconSize: [20, 20],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });

  const beaconsJSON = L.geoJSON(beacons, {
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, { icon: beaconIcon });
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup("<b>Beacon:</b> " + feature.properties.Name);
    },
  });

  //Base and overlay layers
  const baseLayers = {
    OpenStreetMap: osm,
    "Esri Imagery": esriImagery,
    Carto: Carto,
    "Hellenic Cadastre Orthophoto": ekxa,
  };

  const overlayLayers = {
    "Soil Map Service": soil_map,
    "Height Map Service": hypsometric_map,
    "Forests Main Type of Vegetation": forests_map,
    "Andros (1:5,000)": andros_L_Scale,
    "Andros (1:150,000)": andros_S_Scale,
    "Andros Land Use Map": andros_landuse,
    Annotations: annotations,
    "Andros Land Use GeoJSON": landUseJSON,
    Beacons: beaconsJSON,
  };

  // Add layer control
  const layerControl = L.control.layers(baseLayers, overlayLayers).addTo(map);

  setTimeout(() => {
    const layerControlEl = document.querySelector(
      ".leaflet-control-layers-base"
    );
    const overlaysEl = document.querySelector(
      ".leaflet-control-layers-overlays"
    );

    if (layerControlEl) {
      const baseTitle = document.createElement("div");
      baseTitle.innerHTML = "<strong>Basemaps</strong>";
      baseTitle.style.padding = "2px 10px";
      layerControlEl.parentNode.insertBefore(baseTitle, layerControlEl);
    }

    if (overlaysEl) {
      const overlayTitle = document.createElement("div");
      overlayTitle.innerHTML = "<strong>Layers</strong>";
      overlayTitle.style.padding = "2px 10px";
      overlaysEl.parentNode.insertBefore(overlayTitle, overlaysEl);
    }
  }, 10);

  L.control
    .graphicScale({
      position: "bottomleft",
      doubleLine: true,
      fill: "fill",
      showSubunits: false,
      units: "metric",
    })
    .addTo(map);

  // Cursor Coordinates
  L.control
    .coordinates({
      position: "bottomright",
      decimals: 4,
      decimalSeperator: ".",
      labelTemplateLat: "Lat: {y}",
      labelTemplateLng: "Lon: {x}",
      useDMS: false,
      useLatLngOrder: true,
    })
    .addTo(map);

  options = {
    position: "topleft",
    unit: "kilometres", // Default unit the distances are displayed in. Values: 'kilom
    useSubunits: true, // Use subunits (metres/feet) in tooltips if distances are les
    clearMeasurementsOnStop: true, // Clear all measurements when Measure Control is switched off
    showBearings: false, // Whether bearings are displayed within the tooltips
    bearingTextIn: "In", // language dependend label for inbound bearings
    bearingTextOut: "Out", // language dependend label for outbound bearings
    tooltipTextFinish: "Click to <b>finish line</b><br>",
    tooltipTextDelete: "Press SHIFT-key and click to <b>delete point</b>",
    tooltipTextMove: "Click and drag to <b>move point</b><br>",
    tooltipTextResume: "<br>Press CTRL-key and click to <b>resume line</b>",
    tooltipTextAdd: "Press CTRL-key and click to <b>add point</b>",
    // language dependend labels for point's tooltips
    measureControlTitleOn: "Turn on PolylineMeasure", // Title for the Measure Control going to
    measureControlTitleOff: "Turn off PolylineMeasure", // Title for the Measure Control going to
    measureControlLabel: "&#8614;", // Label of the Measure Control (Unicode symbols are possible)
    measureControlClasses: [], // Classes to apply to the Measure Control
    showClearControl: true, // Show a control to clear all the measurements
    clearControlTitle: "Clear Measurements", // Title text to show on the Clear Control
    clearControlLabel: "&times", // Label of the Clear Control (Unicode symbols are possible)
    clearControlClasses: [], // Classes to apply to Clear Control
    showUnitControl: true, // Show a control to change the units of measurements
    unitControlUnits: ["kilometres", "landmiles", "nauticalmiles"],
    // measurement units being cycled through by using the Unit Co
    unitControlTitle: {
      // Title texts to show on the Unit Control
      text: "Change Units",
      kilometres: "kilometres",
      landmiles: "land miles",
      nauticalmiles: "nautical miles",
    },
    unitControlLabel: {
      // Unit symbols to show in the Unit Control and measurement la
      metres: "m",
      kilometres: "km",
      feet: "ft",
      landmiles: "mi",
      nauticalmiles: "nm",
    },
    unitControlClasses: [], // Classes to apply to the Unit Control
    tempLine: {
      // Styling settings for the temporary dashed line
      color: "#1e90ff", // Dashed line color
      weight: 2, // Dashed line weight
    },
    fixedLine: {
      // Styling for the solid line
      color: "#007acc", // Solid line color
      weight: 2, // Solid line weight
    },
    startCircle: {
      // Style settings for circle marker indicating the starting po
      color: "#000", // Color of the border of the circle
      weight: 1, // Weight of the circle
      fillColor: "#32cd32", // Fill color of the circle
      fillOpacity: 1, // Fill opacity of the circle
      radius: 3, // Radius of the circle
    },
    intermedCircle: {
      // Style settings for all circle markers between startCircle a
      color: "#000", // Color of the border of the circle
      weight: 1, // Weight of the circle
      fillColor: "#ffd700", // Fill color of the circle
      fillOpacity: 1, // Fill opacity of the circle
      radius: 3, // Radius of the circle
    },
    currentCircle: {
      // Style settings for circle marker indicating the latest poin
      color: "#000", // Color of the border of the circle
      weight: 1, // Weight of the circle
      fillColor: "#ff69b4", // Fill color of the circle
      fillOpacity: 1, // Fill opacity of the circle
      radius: 3, // Radius of the circle
    },
    endCircle: {
      // Style settings for circle marker indicating the last point
      color: "#000", // Color of the border of the circle
      weight: 1, // Weight of the circle
      fillColor: "#dc143c", // Fill color of the circle
      fillOpacity: 1, // Fill opacity of the circle
      radius: 3, // Radius of the circle
    },
  };
  L.control.polylineMeasure(options).addTo(map);

  new L.Control.MiniMap(MiniMapLayer, {
    toggleDisplay: true,
    minimized: false,
  }).addTo(map);

  L.control
    .fullscreen({
      position: "topright",
      title: "Show me the fullscreen !",
    })
    .addTo(map);

  L.control
    .locate({
      position: "topleft",
      setView: "once",
      keepCurrentZoomLevel: false,
      initialZoom: 10,
      flyTo: true,
      strings: {
        title: "Show my location",
      },
    })
    .addTo(map);

  let searchMarker = null;

  L.Control.geocoder({
    defaultMarkGeocode: false,
    placeholder: "Find location..",
    errorMessage: "Not found..",
    geocoder: L.Control.Geocoder.nominatim(),
  })
    .on("markgeocode", function (e) {
      if (searchMarker) {
        map.removeLayer(searchMarker);
      }

      searchMarker = L.marker(e.geocode.center)
        .addTo(map)
        .bindPopup(e.geocode.name)
        .openPopup();

      map.setView(e.geocode.center, 12);
    })
    .addTo(map);

  map.on("click", function () {
    if (searchMarker) {
      map.removeLayer(searchMarker);
      searchMarker = null;
    }
  });

  // Legend handling
  map.on("overlayadd", function (e) {
    const legendDetails = document.querySelector("#legend-section");

    if (e.name === "Annotations") return;

    document.getElementById("no-legend-message").style.display = "none";

    const soilLegend = document.getElementById("soil-legend");
    const hypsometricLegend = document.getElementById("hypsometric-legend");
    const dltLegend = document.getElementById("dlt-legend");

    if (e.name === "Soil Map Service") {
      soilLegend.style.display = "block";
      legendDetails.setAttribute("open", "open");
    } else if (e.name === "Height Map Service") {
      hypsometricLegend.style.display = "block";
      legendDetails.setAttribute("open", "open");
    } else if (e.name === "Forests Main Type of Vegetation") {
      dltLegend.style.display = "block";
      legendDetails.setAttribute("open", "open");
    } else if (e.name === "Andros (1:5,000)") {
      const customLegend = document.createElement("div");
      customLegend.id = "andros-l-scale-legend";
      customLegend.className = "p-2";
      customLegend.innerHTML = `
       <h4 class="font-semibold mb-2">Legend of Andros Large Scale Map</h4>
    <div id="accordion1" name="accordion1" style="width:100%; height:auto;">
      <table class="legend">
        <tbody>
          <tr>
            <td class="legend_img"><img src="img/bank.png"></td>
            <td class="legend_title">Atm</td>
            <td class="legend_img"><img src="img/information.png"></td>
            <td class="legend_title">Information</td>
          </tr>
          <tr>
            <td class="legend_img"><img src="img/bus_stop.png"></td>
            <td class="legend_title">Bus Stop</td>
            <td class="legend_img"><img src="img/car_rental.png"></td>
            <td class="legend_title">Car Rental</td>
          </tr>
          <tr>
            <td class="legend_img"><img src="img/fuel.png"></td>
            <td class="legend_title">Fuel</td>
            <td class="legend_img"><img src="img/taxi.png"></td>
            <td class="legend_title">Taxi</td>
          </tr>
          <tr>
            <td class="legend_img"><img src="img/nightclub.png"></td>
            <td class="legend_title">Bar</td>
            <td class="legend_img"><img src="img/cafe.png"></td>
            <td class="legend_title">Cafe</td>
          </tr>
          <tr>
            <td class="legend_img"><img src="img/guest_house.png"></td>
            <td class="legend_title">Guest House</td>
            <td class="legend_img"><img src="img/hotel.png"></td>
            <td class="legend_title">Hotel</td>
          </tr>
          <tr>
            <td class="legend_img"><img src="img/ice_cream.png"></td>
            <td class="legend_title">Ice Cream</td>
            <td class="legend_img"><img src="img/restaurant.png"></td>
            <td class="legend_title">Restaurant</td>
          </tr>
          <tr>
            <td class="legend_img"><img src="img/doctor.png"></td>
            <td class="legend_title">Doctor's office</td>
            <td class="legend_img"><img src="img/pharmacy.png"></td>
            <td class="legend_title">Pharmacy</td>
          </tr>
          <tr>
            <td class="legend_img"><img src="img/monument.png"></td>
            <td class="legend_title">Monument</td>
            <td class="legend_img"></td>
            <td class="legend_title"></td>
          </tr>
          <tr>
            <td class="legend_img"><img src="img/major_road.png"></td>
            <td class="legend_title">Major Road</td>
            <td class="legend_img"><img src="img/minor_road.png"></td>
            <td class="legend_title">Minor road</td>
          </tr>
          <tr>
            <td class="legend_img"><img src="img/path.png"></td>
            <td class="legend_title">Path</td>
            <td class="legend_img"><img src="img/streams.png"></td>
            <td class="legend_title">Streams</td>
          </tr>
        </tbody>
      </table>
    </div>
      
    `;
      legendDetails.appendChild(customLegend);
      legendDetails.setAttribute("open", "open");

      const bounds = [
        [37.8517, 24.7908], // Southwest
        [37.863, 24.7746], // Northeast
      ];
      map.fitBounds(bounds);
    } else if (e.name === "Andros (1:150,000)") {
      const customLegend = document.createElement("div");
      customLegend.id = "andros-s-scale-legend";
      customLegend.className = "p-2";
      customLegend.innerHTML = `
           <h4 class="font-semibold mb-2">Legend of Andros Small Scale Map</h4>
  <div id="accordion1" name="accordion1" style="width:100%; height:auto;">
    <table class="legend">
      <tbody>
        <tr>
          <td class="legend_img"><img src="img/settlement.png"></td>
          <td class="legend_title">Settlement</td>
          <td class="legend_img"><img src="img/capital.png"></td>
          <td class="legend_title">Capital</td>
        </tr>
        <tr>
          <td class="legend_img"><img src="img/coastline.png"></td>
          <td class="legend_title">Coastline</td>
          <td class="legend_img"><img src="img/distinct_road.png"></td>
          <td class="legend_title">District Road</td>
        </tr>
        <tr>
          <td class="legend_img"><img src="img/village_road.png"></td>
          <td class="legend_title">Village Road</td>
          <td class="legend_img"><img src="img/agricultural_road.png"></td>
          <td class="legend_title">Agricultural Road</td>
        </tr>
      </tbody>
    </table>
  </div>
    
  `;
      legendDetails.appendChild(customLegend);
      legendDetails.setAttribute("open", "open");
      const bounds = [
        [37.7591, 25.008], // Southwest
        [37.9658, 24.6664], // Northeast
      ];
      map.fitBounds(bounds);
    } else if (e.name === "Andros Land Use Map") {
      const customLegend = document.createElement("div");
      customLegend.id = "andros-landuse-legend";
      customLegend.className = "p-2";
      customLegend.innerHTML = `
           <h4 class="font-semibold mb-2">Legend of Andros Land Use Map</h4>
  <div id="accordion1" name="accordion1" style="width:100%; height:auto;">
    <table class="legend">
      <tbody>
        <tr>
          <td class="legend_img"><img src="img/Arable_land.png"></td>
          <td class="legend_title">Arable Land</td>
          <td class="legend_img"><img src="img/Bare_land.png"></td>
          <td class="legend_title">Bare Land</td>
        </tr>
        <tr>
          <td class="legend_img"><img src="img/Mixed_forest.png"></td>
          <td class="legend_title">Mixed Forest</td>
          <td class="legend_img"><img src="img/Olives_groves.png"></td>
          <td class="legend_title">Olives Groves</td>
        </tr>
        <tr>
          <td class="legend_img"><img src="img/Sclero_vegetation.png"></td>
          <td class="legend_title">Sclerophyllous vegetation</td>
          <td class="legend_img"><img src="img/Natural_grasslands.png"></td>
          <td class="legend_title">Natural Grasslands</td>
        </tr>
      </tbody>
    </table>
  </div>
        
  `;
      legendDetails.appendChild(customLegend);
      legendDetails.setAttribute("open", "open");
      const bounds = [
        [37.7591, 25.008], // Southwest
        [37.9658, 24.6664], // Northeast
      ];
      map.fitBounds(bounds);
    } else if (e.name === "Andros Land Use GeoJSON") {
      const customLegend = document.createElement("div");
      customLegend.id = "andros-landuse-legend";
      customLegend.className = "p-2";
      customLegend.innerHTML = `
          <h4 class="font-semibold mb-2">Legend of Andros Land Use Map</h4>
 <div id="accordion1" name="accordion1" style="width:100%; height:auto;">
   <table class="legend">
     <tbody>
       <tr>
         <td class="legend_img"><img src="img/Arable_land.png"></td>
         <td class="legend_title">Arable Land</td>
         <td class="legend_img"><img src="img/Bare_land.png"></td>
         <td class="legend_title">Bare Land</td>
       </tr>
       <tr>
         <td class="legend_img"><img src="img/Mixed_forest.png"></td>
         <td class="legend_title">Mixed Forest</td>
         <td class="legend_img"><img src="img/Olives_groves.png"></td>
         <td class="legend_title">Olives Groves</td>
       </tr>
       <tr>
         <td class="legend_img"><img src="img/Sclero_vegetation.png"></td>
         <td class="legend_title">Sclerophyllous vegetation</td>
         <td class="legend_img"><img src="img/Natural_grasslands.png"></td>
         <td class="legend_title">Natural Grasslands</td>
       </tr>
     </tbody>
   </table>
 </div>
       
 `;
      legendDetails.appendChild(customLegend);
      legendDetails.setAttribute("open", "open");
      const bounds = [
        [37.7591, 25.008], // Southwest
        [37.9658, 24.6664], // Northeast
      ];
      map.fitBounds(bounds);
    } else if (e.name === "Beacons") {
      const customLegend = document.createElement("div");
      customLegend.id = "beacons-legend";
      customLegend.className = "p-2";
      customLegend.innerHTML = `
                <h4 class="font-semibold mb-2">Legend of Beacons</h4>
 <div id="accordion1" name="accordion1" style="width:100%; height:auto;">
   <table class="legend">
     <tbody>
       <tr>
         <td class="legend_img"><img src="img/beacons.png"></td>
         <td class="legend_title">Beacon</td>
       </tr>
     </tbody>
   </table>
 </div>
       
 `;
      legendDetails.appendChild(customLegend);
      legendDetails.setAttribute("open", "open");
      const bounds = [
        [37.7591, 25.008], // Southwest
        [37.9658, 24.6664], // Northeast
      ];
      map.fitBounds(bounds);
    }
  });

  map.on("overlayremove", function (e) {
    if (e.name === "Soil Map Service") {
      document.getElementById("soil-legend").style.display = "none";
    } else if (e.name === "Height Map Service") {
      document.getElementById("hypsometric-legend").style.display = "none";
    } else if (e.name === "Forests Main Type of Vegetation") {
      document.getElementById("dlt-legend").style.display = "none";
    } else if (e.name === "Andros (1:5,000)") {
      const customLegend = document.getElementById("andros-l-scale-legend");
      if (customLegend) customLegend.remove();
    } else if (e.name === "Andros (1:150,000)") {
      const customLegend = document.getElementById("andros-s-scale-legend");
      if (customLegend) customLegend.remove();
    } else if (e.name === "Andros Land Use Map") {
      const customLegend = document.getElementById("andros-landuse-legend");
      if (customLegend) customLegend.remove();
    } else if (e.name === "Andros Land Use GeoJSON") {
      const customLegend = document.getElementById("andros-landuse-legend");
      if (customLegend) customLegend.remove();
    } else if (e.name === "Beacons") {
      const customLegend = document.getElementById("beacons-legend");
      if (customLegend) customLegend.remove();
    }

    const anyLegendVisible = [
      "soil-legend",
      "hypsometric-legend",
      "dlt-legend",
      "andros-l-scale-legend",
      "andros-s-scale-legend",
      "andros-landuse-legend",
      "beacons-legend",
    ].some((id) => {
      const el = document.getElementById(id);
      return el && el.style.display !== "none";
    });

    if (!anyLegendVisible) {
      document.getElementById("no-legend-message").style.display = "block";
    }
  });

  // Return map object if needed externally
  return map;
}
