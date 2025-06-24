import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Importar routers
import clientesRoutes from './routes/clientes.js';
import camionesRoutes from './routes/camiones.js';
import diasEntregaRoutes from './routes/diasEntrega.js';
import camionesDiasRoutes from './routes/camionesDias.js';

// Usar las rutas
app.use('/api/clientes', clientesRoutes);
app.use('/api/camiones', camionesRoutes);
app.use('/api/dias_entrega', diasEntregaRoutes);
app.use('/api/camiones_dias', camionesDiasRoutes);

// Puerto
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API escuchando en puerto ${PORT}`));
