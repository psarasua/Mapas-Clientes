// middlewares/errorHandler.js
// Middleware para manejo centralizado de errores. Captura errores y responde de forma segura.
export function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
}
