// api.js
// Servicio centralizado para realizar peticiones HTTP seguras al backend.
// Usa fetch, variables de entorno para la URL base y maneja errores globalmente.
// Facilita la reutilización y la protección de datos sensibles.

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      credentials: 'include', // Para cookies/CSRF si es necesario
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    // Aquí puedes agregar logging o mostrar notificaciones globales
    throw error;
  }
}
