// controllers/clientesController.js
// Controlador para operaciones relacionadas con clientes. Gestiona la lógica de negocio de clientes.
import pool from '../config/db.js';

// Obtiene la lista de todos los clientes
export const getClientes = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM clientes');
    // Emitir log informativo al frontend vía Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.emit('info', { message: 'Lista de clientes consultada', timestamp: new Date().toISOString() });
    }
    res.json(result.rows);
  } catch (err) {
    err.status = 500;
    err.message = 'Error al obtener clientes';
    next(err);
  }
};
