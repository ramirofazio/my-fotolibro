import { readFileSync } from 'fs';

// Lee el archivo JSON
const jsonContent = readFileSync('./salida.json', 'utf-8');

// Analiza el contenido JSON en un objeto JavaScript
const data = JSON.parse(jsonContent);

// Ahora puedes trabajar con el objeto 'data'
console.log(data['Río Negro']);

