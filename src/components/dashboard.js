// import { db } from '../Authentication/firebase';
// import { onValue, ref, get } from "firebase/database";
// import React, { useState, useEffect, useRef } from "react";
// import Button from '@mui/material/Button';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import customIcon from '../images/marker.png'

// export default function ShowMap() {
//   const [projects, setProjects] = useState([]);
//   const [crimeType, setCrimeType] = useState(""); // State to store selected crime type
//   const mapRef = useRef(null);

//   useEffect(() => {
//     if (!mapRef.current) {
//       const mapInstance = L.map('map').setView([41.8781, -87.6298], 10); // Set initial view to Chicago
//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance);
//       mapRef.current = mapInstance;
//     }
//   }, []);

//   const fetchData = async () => {
//     const queryRef = ref(db, "watchTower");
//     try {
//       onValue(queryRef, (snapshot) => {
//         if (snapshot.exists()) {
//           const data = snapshot.val();
//           const projectsArray = Object.values(data);
//           setProjects(projectsArray);
//           console.log("Fetched data:", projectsArray); // Log fetched data
//           addMarkersToMap(projectsArray);
//         } else {
//           console.log("No data available");
//         }
//       });
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const addMarkersToMap = (data) => {
//     console.log("Adding markers to map...");
//     const map = mapRef.current;
//     if (!map) return;
    
//     map.eachLayer(layer => {
//       if (layer instanceof L.Marker) {
//         map.removeLayer(layer);
//       }
//     });
//     // Filter data based on selected crime type
//     const filteredData = crimeType ? data.filter(project => project["Primary Type"] === crimeType) : data;
//     // Add markers for filtered data
//     filteredData.forEach((project) => {
//       const { Latitude, Longitude, Description } = project;
//       if (Latitude && Longitude) {
//         L.marker([parseFloat(Latitude), parseFloat(Longitude)],{ icon: customIcon }).addTo(map).bindPopup(Description);
//       }
//     });
//   };

//   // Function to handle dropdown change
//   const handleCrimeTypeChange = (event) => {
//     setCrimeType(event.target.value);
//   };

//   // Extract unique crime types from fetched data
//   const uniqueCrimeTypes = [...new Set(projects.map(project => project["Primary Type"]))];

//   return (
//     <div>
//       <div>
//         <select value={crimeType} onChange={handleCrimeTypeChange}>
//           <option value="">Select Crime Type</option>
//           {uniqueCrimeTypes.map((type, index) => (
//             <option key={index} value={type}>{type}</option>
//           ))}
//         </select>
//         <Button variant="contained" onClick={fetchData}>
//           Show Map
//         </Button>
//       </div>
//       <div id="map" style={{ height: "600px", width: "100%" }}></div>
//     </div>
//   );
// }
import { db } from '../Authentication/firebase';
import { onValue, ref, get } from "firebase/database";
import React, { useState, useEffect, useRef } from "react";
import Button from '@mui/material/Button';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import customIcon from '../images/marker.png';

export default function ShowMap() {
  const [projects, setProjects] = useState([]);
  const [crimeType, setCrimeType] = useState("");
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      const mapInstance = L.map('map').setView([41.8781, -87.6298], 10);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance);
      mapRef.current = mapInstance;
    }
  }, []);

  const fetchData = async () => {
    const queryRef = ref(db, "watchTower");
    try {
      onValue(queryRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const projectsArray = Object.values(data);
          setProjects(projectsArray);
          addMarkersToMap(projectsArray);
        } else {
          console.log("No data available");
        }
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const addMarkersToMap = (data) => {
    const map = mapRef.current;
    if (!map) return;
    
    map.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    const filteredData = crimeType ? data.filter(project => project["Primary Type"] === crimeType) : data;
    
    filteredData.forEach((project) => {
      const { Latitude, Longitude, Description } = project;
      if (Latitude && Longitude) {
        L.marker([parseFloat(Latitude), parseFloat(Longitude)],{ icon: createCustomIcon() }).addTo(map).bindPopup(Description);
      }
    });
  };

  const handleCrimeTypeChange = (event) => {
    setCrimeType(event.target.value);
  };

  const uniqueCrimeTypes = [...new Set(projects.map(project => project["Primary Type"]))];

  const createCustomIcon = () => {
    return L.icon({
      iconUrl: customIcon,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
  };

  return (
    <div>
      <div>
        <select value={crimeType} onChange={handleCrimeTypeChange}>
          <option value="">Select Crime Type</option>
          {uniqueCrimeTypes.map((type, index) => (
            <option key={index} value={type}>{type}</option>
          ))}
        </select>
        <Button variant="contained" onClick={fetchData}>
          Show Map
        </Button>
      </div>
      <div id="map" style={{ height: "600px", width: "100%" }}></div>
    </div>
  );
}
