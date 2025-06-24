// controllers/diasEntregaController.js
// Controlador para operaciones relacionadas con días de entrega. Gestiona la lógica de negocio de días de entrega.
import pool from '../config/db.js';

// Obtiene todos los días de entrega
export const getDiasEntrega = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM dias_entrega');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener días de entrega' });
  }
};
