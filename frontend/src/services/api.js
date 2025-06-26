// api.js
// Servicio centralizado para realizar peticiones HTTP seguras al backend.
// Usa fetch, variables de entorno para la URL base y maneja errores globalmente.
// Facilita la reutilización y la protección de datos sensibles.

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    credentials: 'include', // Para cookies/CSRF si es necesario
  });
  if (!response.ok) {
    const errorMsg = `Error ${response.status}: ${response.statusText}`;
    throw new Error(errorMsg);
  }
  const data = await response.json();
  return data;
}

// Métodos cortos para post y get
const api = {
  post: async (endpoint, data) => {
    return apiFetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  get: async (endpoint) => {
    return apiFetch(endpoint);
  },
  // Puedes agregar put, delete, etc. si lo necesitas
};

export default api;
