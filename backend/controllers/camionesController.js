// controllers/camionesController.js
// Controlador para operaciones relacionadas con camiones. Gestiona la lógica de negocio de camiones.
import pool from '../config/db.js';

// Obtiene la lista de camiones de la base de datos
export const getCamiones = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM camiones');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener camiones' });
  }
};
