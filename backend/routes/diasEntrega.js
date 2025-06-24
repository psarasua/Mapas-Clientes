import express from 'express';
import { getDiasEntrega } from '../controllers/diasEntregaController.js';
const router = express.Router();

router.get('/', getDiasEntrega);

export default router;
