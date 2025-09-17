const locationInput = document.getElementById("location-input");
const searchBtn = document.getElementById("search-btn");
const geolocBtn = document.getElementById("loc-btn");
const cafesContainer = document.getElementById("results");

let map, markersGroup, routingControl, userMarker;

let userLocation = null; // { lat, lon }

//create the map

function initMap(){
    map = L.map("map").setView([20, 0], 2);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    markersGroup = L.layerGroup().addTo(map);
}

initMap();

async function geocode(query){
    const url =  `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
    const res = await fetch(url);
    const data = await res.json();
    
    if (!data || data.length === 0) {
        throw new Error("Location not found");
    }

    return {lat: parseFloat(data[0].lat), lon : parseFloat(data[0].lon)};
}

//----------------------- Get USER Location ------------------- 


async function fetchCafes(lat,lon,radius = 1500){
    markersGroup.clearLayers();
    console.log("inside fetchCafes")
    const query = `
    [out:json];
    node["amenity"="cafe"](around:${radius},${lat},${lon});
    out;
  `;
    
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    const res = await fetch(url)
    const data = await res.json();
    // console.log(res);

    cafesContainer.innerHTML = "";

    if(!data.elements || data.elements.length === 0){
        cafesContainer.innerHTML = "<p>No cafes found nearby ☕</p>";
        return;
    }

      data.elements.forEach(cafe => {
        
        const cafeDiv = document.createElement("div");
        cafeDiv.classList.add("cafe-item");

        cafeDiv.innerHTML = `
        <h3>${cafe.tags.name || "Unnamed Café"}</h3>
        <p>Latitude: ${cafe.lat}, Longitude: ${cafe.lon}</p>
        <button onclick="getDirections(${cafe.lat}, ${cafe.lon})">Get Directions</button>
        `;


        cafesContainer.appendChild(cafeDiv);
        const marker = L.marker([cafe.lat, cafe.lon]).addTo(markersGroup);
        marker.bindPopup(`<strong>${cafe.tags.name || "Unnamed Café"}</strong>`);
    });
    map.setView([lat, lon], 14);
}

function getDirections(destLat, destLon) {
    if(!userLocation){
        alert("User location not set. Please use 'Detect My Location' first.");
        return;
    }
    if (routingControl) {
        map.removeControl(routingControl);
    }
    routingControl = L.Routing.control({
        waypoints: [
            L.latLng(userLocation.lat, userLocation.lon),
            L.latLng(destLat, destLon)
        ],
        routeWhileDragging: false,
        showAlternatives: false,
        lineOptions: {
            styles: [{ color: 'blue', opacity: 0.7, weight: 5 }]
        }
    }).addTo(map);

}
searchBtn.addEventListener("click",async function(){
    const query= locationInput.value.trim();

    if(!query){
        alert("Please enter a location")
        return;
    }
    try{
        const {lat,lon} = await geocode(query);
        console.log("Coordinates:", lat, lon);
        const cafes = await fetchCafes(lat, lon);
        console.log("Nearby Cafes:", cafes);
        
    }
    catch(err){
        console.log(err);
        alert(err.message);
    }
})

geolocBtn.addEventListener('click', function () {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by browser");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async(success) => {
            let lat = (success.coords.latitude);
            let lon = (success.coords.longitude);
            console.log(lat,lon)
            
            userLocation = { lat, lon };

            const cafes = await fetchCafes(lat, lon);
            console.log("Nearby Cafes:", cafes);

            if (userMarker) map.removeLayer(userMarker);
            userMarker = L.marker([lat, lon]).addTo(map).bindPopup("You are here").openPopup();

            // console.log("Nearby Cafes:", cafes);
            
        },
        (error) => {
            console.error("Error getting location:", error);
            alert("Unable to retrieve location");
        }
    );
});
