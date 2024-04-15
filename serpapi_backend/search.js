import { getJson } from "serpapi";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.SERPAPI_KEY;

export async function postResults(req, res, next) {
  req.params = { ...req.body, api_key: API_KEY };
  next();
}

export async function getResults(req, res, next) {
  req.params = { ...req.query, api_key: API_KEY };
  next();
}

export async function search(req, res, next) {
  try {
    const data = await getJson("google", req.params); // Ensure req.params includes the API key and query
    res.locals.result = data;
    res.status(200).json(data); // Send the data back to the client
  } catch (error) {
    console.error('Error fetching from SERP API:', error);
    res.status(400).json({ message: "Failed to fetch data from SERP API", error: error.message });
  }
}
