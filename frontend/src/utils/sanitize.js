// sanitize.js
// Utilidades para sanitizar y validar datos de formularios antes de enviarlos al backend.
// Incluye funciones para limpiar strings y objetos, previniendo inyecciones y datos peligrosos.

/**
 * Elimina espacios, caracteres peligrosos y normaliza strings.
 * @param {string} value
 * @returns {string}
 */
export function sanitizeString(value) {
  if (typeof value !== 'string') return '';
  // Elimina espacios al inicio/fin y caracteres especiales básicos
  return value.trim().replace(/[<>"'`]/g, '');
}

/**
 * Sanitiza todos los campos string de un objeto (ej: datos de formulario)
 * @param {object} data
 * @returns {object}
 */
export function sanitizeFormData(data) {
  const sanitized = {};
  for (const key in data) {
    if (typeof data[key] === 'string') {
      sanitized[key] = sanitizeString(data[key]);
    } else {
      sanitized[key] = data[key];
    }
  }
  return sanitized;
}
