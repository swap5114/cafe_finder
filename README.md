// // Get DOM elements
// const locationInput = document.getElementById("location-input");
// const searchBtn = document.getElementById("search-btn");
// const geolocBtn = document.getElementById("loc-btn");
// const cafesContainer = document.getElementById("results");

// // Initialize Leaflet Map
// let map = L.map("map").setView([20, 0], 2); // Default view
// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//   attribution: "© OpenStreetMap contributors"
// }).addTo(map);

// let markersGroup = L.layerGroup().addTo(map); 
// let routingControl = null; // store route

// let userLocation = null; // store user’s lat/lon

// // Function: Fetch cafés
// function fetchCafes(lat, lon) {
//   const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node["amenity"="cafe"](around:1500,${lat},${lon});out;`;

//   fetch(overpassUrl)
//     .then(response => response.json())
//     .then(data => {
//       cafesContainer.innerHTML = "";
//       markersGroup.clearLayers();
//       map.setView([lat, lon], 14);

//       if (!data.elements || data.elements.length === 0) {
//         cafesContainer.innerHTML = "<p>No cafés found nearby.</p>";
//         return;
//       }

//       data.elements.forEach(cafe => {
//         const name = cafe.tags.name || "Unnamed Café";
//         const address = cafe.tags["addr:street"] || "Address not available";

//         // Café card
//         const card = document.createElement("div");
//         card.classList.add("cafe-card");
//         card.innerHTML = `
//           <h3>${name}</h3>
//           <p>${address}</p>
//           <button class="route-btn">Get Directions</button>
//         `;
//         cafesContainer.appendChild(card);

//         // Add marker
//         const marker = L.marker([cafe.lat, cafe.lon]).bindPopup(
//           `<strong>${name}</strong><br>${address}<br><button class="route-btn">Get Directions</button>`
//         );
//         markersGroup.addLayer(marker);

//         // Directions when clicking card
//         card.querySelector(".route-btn").addEventListener("click", () => {
//           showRoute([cafe.lat, cafe.lon]);
//         });

//         // Directions when clicking popup button
//         marker.on("popupopen", () => {
//           const popupBtn = document.querySelector(".leaflet-popup .route-btn");
//           if (popupBtn) {
//             popupBtn.addEventListener("click", () => {
//               showRoute([cafe.lat, cafe.lon]);
//             });
//           }
//         });
//       });
//     })
//     .catch(err => {
//       cafesContainer.innerHTML = "<p>Failed to fetch cafés. Try again later.</p>";
//       console.error(err);
//     });
// }

// // Function: Show route from user → café
// function showRoute(destination) {
//   if (!userLocation) {
//     alert("Please allow geolocation (Use My Location button) to get directions.");
//     return;
//   }

//   if (routingControl) {
//     map.removeControl(routingControl); // remove old route
//   }

//   routingControl = L.Routing.control({
//     waypoints: [
//       L.latLng(userLocation.lat, userLocation.lon),
//       L.latLng(destination[0], destination[1])
//     ],
//     routeWhileDragging: true,
//     showAlternatives: true,
//     lineOptions: {
//       styles: [{ color: "blue", opacity: 0.7, weight: 5 }]
//     }
//   }).addTo(map);
// }

// // Function: Geocode text → coords
// function geocodeLocation(query) {
//   const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//     query
//   )}`;

//   fetch(url)
//     .then(res => res.json())
//     .then(data => {
//       if (data.length === 0) {
//         cafesContainer.innerHTML = "<p>Location not found.</p>";
//         return;
//       }
//       const lat = parseFloat(data[0].lat);
//       const lon = parseFloat(data[0].lon);
//       fetchCafes(lat, lon);
//     })
//     .catch(err => console.error(err));
// }

// // Events
// searchBtn.addEventListener("click", () => {
//   const query = locationInput.value.trim();
//   if (query) {
//     geocodeLocation(query);
//   } else {
//     alert("Please enter a location.");
//   }
// });

// geolocBtn.addEventListener("click", () => {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(
//       pos => {  
//         userLocation = {
//           lat: pos.coords.latitude,
//           lon: pos.coords.longitude
//         };
//         fetchCafes(userLocation.lat, userLocation.lon);
//       },
//       err => {
//         alert("Unable to fetch your location.");
//         console.error(err);
//       }
//     );
//   } else {
//     alert("Geolocation not supported by your browser.");
//   }
// });
