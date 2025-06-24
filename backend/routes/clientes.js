// routes/clientes.js
// Define las rutas para operaciones sobre clientes. Conecta las rutas HTTP con el controlador correspondiente.
import express from 'express';
import { getClientes } from '../controllers/clientesController.js';
const router = express.Router();

// Obtener todos los clientes
router.get('/', getClientes);

export default router;
