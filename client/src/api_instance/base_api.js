import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

//"Access-Control-Allow-Origin": import.meta.env.VITE_ACCESS_URL,

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
