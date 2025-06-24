// controllers/clientesController.js
// Controlador para operaciones relacionadas con clientes. Gestiona la lógica de negocio de clientes.
import pool from '../config/db.js';

// Obtiene la lista de todos los clientes
export const getClientes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clientes');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
};
