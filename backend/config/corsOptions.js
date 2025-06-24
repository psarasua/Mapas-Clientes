// config/corsOptions.js
// Configuración de CORS para restringir orígenes permitidos y mejorar la seguridad.
const allowedOrigins = [
  'http://localhost:5173', // Cambia esto por el dominio de tu frontend en producción
];

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
};
