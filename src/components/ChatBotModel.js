import React, { useState, useEffect } from 'react';
import { Button, Modal, Box, Typography, TextField } from '@mui/material';
import axios from 'axios'; // Import axios for making HTTP requests
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: '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',
    dangerouslyAllowBrowser: true,
});

async function getLocation() {
    const response = await fetch("https://ipapi.co/json/");
    const locationData = await response.json();
    console.log(locationData);
    return locationData;
}

async function getCurrentWeather(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=apparent_temperature`;
    const response = await fetch(url);
    const weatherData = await response.json();
    return weatherData;
}

async function geocodeAddress(address) {
    const apiKey = 'AIzaSyC8Cr1WNOvix-yGs66Y6e2Aa9M23TKfMoY'; // Replace with your actual API key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK' && response.data.results[0]) {
            const location = response.data.results[0].geometry.location;
            return { lat: location.lat, lng: location.lng };
        } else {
            console.error('Geocode was not successful for the following reason: ' + response.data.status);
            return null;
        }
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}

const tools = [
    {
        type: "function",
        function: {
            name: "getCurrentWeather",
            description: "Get the current weather in a given location",
            parameters: {
                type: "object",
                properties: {
                    latitude: {
                        type: "string",
                    },
                    longitude: {
                        type: "string",
                    },
                },
                required: ["longitude", "latitude"],
            },
        }
    },
    {
        type: "function",
        function: {
            name: "getLocation",
            description: "Get the user's location based on their IP address",
            parameters: {
                type: "object",
                properties: {},
            },
        }
    },
];

const availableTools = {
    getCurrentWeather,
    getLocation,
};

const ChatBotModel = () => {
    const [open, setOpen] = useState(true);
    const [userSearchResponse, setUserSearchResponse] = useState("");
    const [map, setMap] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const locationData = await getLocation();
            setCurrentLocation(locationData);
            initializeMap(locationData);
        };
        fetchData();
    }, []);

    const getLocation = async () => {
        const response = await fetch("https://ipapi.co/json/");
        const locationData = await response.json();
        return locationData;
    };

    const initializeMap = (locationData) => {
        const mapCenter = { lat: locationData.latitude, lng: locationData.longitude };
        const mapOptions = {
            center: mapCenter,
            zoom: 10,
        };
        const newMap = new window.google.maps.Map(document.getElementById('google-map'), mapOptions);

        // Custom Marker for User's Location
        const userLocationMarker = new window.google.maps.Marker({
            position: mapCenter,
            map: newMap,
            icon: {
                url: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
                scaledSize: new window.google.maps.Size(40, 40),
            },
            title: 'Your Location',
        });

        // Optionally, you could add an info window for this marker
        const userInfoWindow = new window.google.maps.InfoWindow({
            content: `<div><strong>Your Location</strong><br>Latitude: ${mapCenter.lat.toFixed(4)}, Longitude: ${mapCenter.lng.toFixed(4)}</div>`,
        });

        userLocationMarker.addListener('click', () => {
            userInfoWindow.open({
                anchor: userLocationMarker,
                map: newMap,
                shouldFocus: false,
            });
        });

        setMap(newMap);
    };

    const handleModalSubmit = async () => {
        const location = await getLocation();
        const recommendationsData = await fetchRecommendations(location, userSearchResponse);
        setRecommendations(recommendationsData);
        addMarkersToMap(map, recommendationsData); // Pass 'map' along with 'recommendationsData'
    };

    const fetchRecommendations = async (location, userSearchResponse) => {
        try {
            const userSearchQuery = userSearchResponse;
            console.log(userSearchQuery);
            const userSearchResult = await axios.post("http://localhost:7561/search", {
                engine: "google_maps",
                q: userSearchQuery,
                ll: `@${location.latitude},${location.longitude},15.1z`
            }).then(res => res.data);

            console.log(userSearchResult);

            const processResultsWithGPS = async (results) => {
                let relevantResults = [];

                if (results.local_results && Array.isArray(results.local_results)) {
                    relevantResults = results.local_results;
                } else if (results.events_results && Array.isArray(results.events_results)) {
                    relevantResults = results.events_results;
                } else {
                    console.error("No expected results found or the results are not in an array format", results);
                    return [];
                }

                // Process each result to ensure it has GPS coordinates
                const processedResults = await Promise.all(relevantResults.map(async (result) => {
                    // If GPS coordinates are already provided, use them; otherwise, fetch based on address
                    let gpsCoordinates = result.gps_coordinates;
                    let address = Array.isArray(result.address) ? result.address.join(", ") : result.address || 'Address not available';
                    if (!gpsCoordinates && address) {
                        gpsCoordinates = await geocodeAddress(address); // Assuming you have a geocodeAddress function
                    }

                    return {
                        title: result.title,
                        gpsCoordinates: gpsCoordinates, // This may need adjustment based on your data structure
                        openState: result.open_state,
                        operatingHours: result.operating_hours,
                        website: result.website,
                        address: result.address,
                    };
                }));

                return processedResults;
            };

            // Process each category of results to include GPS coordinates
            const processedRestaurants = await processResultsWithGPS(userSearchResult);

            console.log('Processed Restaurant Results: ', processedRestaurants);

            return {
                placesrecommended: processedRestaurants,
            };
        } catch (error) {
            console.error("Error fetching recommendations:", error);
            return null;
        }
    };

    const addMarkersToMap = (newMap, recommendations) => {
        const icons = {
            placesrecommended: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        };

        // Keep track of existing marker positions to adjust for overlaps
        const existingPositions = new Map();

        const adjustForOverlap = (position) => {
            const key = `${position.lat.toFixed(4)}_${position.lng.toFixed(4)}`;
            const offsetDegree = 0.0001; // Adjust this value as needed
            let adjustedPosition = { ...position };
            let count = existingPositions.get(key) || 0;

            while (count > 0) {
                // Adjust position slightly
                adjustedPosition.lat += offsetDegree * count;
                adjustedPosition.lng += offsetDegree * count;
                const newKey = `${adjustedPosition.lat.toFixed(4)}_${adjustedPosition.lng.toFixed(4)}`;
                if (!existingPositions.has(newKey)) break;
                count++;
            }

            existingPositions.set(key, count + 1);
            return adjustedPosition;
        };

        const addMarker = (item, category) => {
            let position = item.gpsCoordinates.lat ?
                { lat: item.gpsCoordinates.lat, lng: item.gpsCoordinates.lng } :
                { lat: item.gpsCoordinates.latitude, lng: item.gpsCoordinates.longitude };

            position = adjustForOverlap(position);

            console.log(`Adding ${category} marker at: `, position);

            if (!position.lat || !position.lng) {
                console.error(`Invalid GPS coordinates for ${category}:`, item);
                return;
            }

            const marker = new window.google.maps.Marker({
                position,
                map: newMap,
                icon: icons[category],
                title: item.title,
            });

            const infowindow = new window.google.maps.InfoWindow({
                content: `<div><strong>${item.title}</strong><br>${item.eventAddress || item.address || ''}</div>`,
            });

            marker.addListener('click', () => {
                infowindow.open({
                    anchor: marker,
                    map: newMap,
                    shouldFocus: false,
                });
            });
        };

        // Add markers for all categories
        if (recommendations.placesrecommended) {
            recommendations.placesrecommended.forEach(item => addMarker(item, 'placesrecommended'));
        }
    };

    return (
        <Modal open={open}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 1000, height: 600, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                <Typography variant="h5">Get Recommendations</Typography>
                <br />
                <br />
                <br />
                <br />
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TextField
                        fullWidth
                        label="Search Places"
                        variant="outlined"
                        value={userSearchResponse}
                        onChange={(e) => setUserSearchResponse(e.target.value)}
                    />
                    <Button variant="contained" color="primary" onClick={handleModalSubmit}>Submit</Button>
                </Box>
                <div id="google-map" style={{ width: '100%', height: 400, marginBottom: 10 }}></div>
            </Box>
        </Modal>
    );
};

export default ChatBotModel;