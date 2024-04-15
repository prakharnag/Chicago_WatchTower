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
      <div style={{ marginBottom: "10px" }}>
        <select
          value={crimeType}
          onChange={handleCrimeTypeChange}
          style={{
            padding: "8px",
            borderRadius: "5px",
            marginRight: "10px",
            border: "1px solid #ccc"
          }}
        >
          <option value="">Select Crime Type</option>
          {uniqueCrimeTypes.map((type, index) => (
            <option key={index} value={type}>{type}</option>
          ))}
        </select>
        <Button
          variant="contained"
          onClick={fetchData}
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            backgroundColor: "#3f51b5",
            color: "#fff",
            border: "none",
            cursor: "pointer"
          }}
        >
          Show Map
        </Button>
      </div>
      <div id="map" style={{ height: "600px", width: "100%" }}></div>
    </div>
  );
}
