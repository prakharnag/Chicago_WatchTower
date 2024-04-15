import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";
import querystring from "querystring";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Unified search endpoint to handle various types of searches
app.post("/search", async (req, res) => {
  const { engine, q , ll} = req.body; // Expecting 'engine' and 'q' in the request body
  console.log('Arpit: ',ll);

  const queryParams = querystring.stringify({
    engine: engine,
    q: q,
    ll: ll,
    api_key: process.env.SERPAPI_KEY,
  });

  const fullUrl = `https://serpapi.com/search.json?${queryParams}`;
  console.log("Making GET request to URL:", fullUrl);

  try {
    const response = await axios.get("https://serpapi.com/search.json", {
      params: {
        engine: engine, // Use the engine specified in the request
        q: q,
        ll: ll,
        api_key: process.env.SERPAPI_KEY,
      }
    });
    res.json(response.data); // Forward the SERP API response to the client
  } catch (error) {
    console.error('Error making request to SERP API:', error);
    res.status(500).json({ message: "Failed to fetch data from SERP API" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
