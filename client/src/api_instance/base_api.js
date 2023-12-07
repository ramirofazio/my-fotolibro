import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  maxBodyLength: 750000000,
  baseURL: API_URL,
  headers: {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
  },
});
