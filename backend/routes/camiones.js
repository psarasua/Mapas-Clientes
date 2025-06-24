import express from 'express';
import { getCamiones } from '../controllers/camionesController.js';
const router = express.Router();

router.get('/', getCamiones);

export default router;
