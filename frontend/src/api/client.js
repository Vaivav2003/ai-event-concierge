import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const planEvent = async (query) => {
  const response = await client.post("/api/plan", { query });
  return response.data;
};

export const getHistory = async () => {
  const response = await client.get("/api/history");
  return response.data;
};