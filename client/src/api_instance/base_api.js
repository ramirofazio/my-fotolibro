
import axios from "axios";

const API_URL = "http://localhost:3001" /* import.meta.env.VITE_API_URL */;

export const api = axios.create({
  maxBodyLength: 750000000, // hacerlo en post con el header form-data
  baseURL: API_URL,
  headers: {
    // ? Configuracion las cabeceras CORS
    "Access-Control-Allow-Origin": "http://localhost:5173"/* import.meta.env.VITE_ACCESS_URL */,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
    //"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
  },
});


