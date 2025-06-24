// controllers/camionesDiasController.js
// Controlador para operaciones relacionadas con la asignación de camiones a días. Gestiona la lógica de negocio de asignaciones.
import pool from '../config/db.js';

export const getCamionesDias = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM camiones_dias');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener camiones_dias' });
  }
};

export const getClientesAsignados = async (req, res) => {
  try {
    const { camion_dia } = req.params;
    const result = await pool.query('SELECT * FROM camion_dias_entrega WHERE camion_dia = $1', [camion_dia]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener clientes asignados' });
  }
};
