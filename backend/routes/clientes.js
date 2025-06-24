import express from 'express';
import { getClientes } from '../controllers/clientesController.js';
const router = express.Router();

router.get('/', getClientes);

export default router;
