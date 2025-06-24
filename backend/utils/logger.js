// utils/logger.js
// Logger simple para registrar eventos y errores en el servidor.
export function log(message) {
  console.log(`[LOG] ${new Date().toISOString()}: ${message}`);
}

export function logError(error) {
  console.error(`[ERROR] ${new Date().toISOString()}:`, error);
}
