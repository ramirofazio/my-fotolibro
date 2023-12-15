import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  maxBodyLength: 750000000, // hacerlo en post con el header form-data
  baseURL: "http://localhost:3001",
  headers: {
    // ? Configuracion las cabeceras CORS
    "Access-Control-Allow-Origin": "http://localhost:5173/",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
    //"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
  },
});
