// src/index.ts

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Crear una instancia de la aplicación Express
const app = express();
const port = process.env.PORT || 3000; // Usar el puerto definido en .env o el 3000 por defecto

// Middleware para analizar el cuerpo de las solicitudes como JSON
app.use(express.json());

// Conectar a la base de datos MongoDB
mongoose.connect(process.env.MONGO_URL!) 
  .then(() => {
    console.log('Conectado a MongoDB');
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB:', err);
  });

// Ruta de ejemplo
app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});