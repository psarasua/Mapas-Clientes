// api.js
// Servicio centralizado para realizar peticiones HTTP seguras al backend.
// Usa fetch, variables de entorno para la URL base y maneja errores globalmente.
// Facilita la reutilización y la protección de datos sensibles.

import { toast } from 'sonner';

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
      const errorMsg = `Error ${response.status}: ${response.statusText}`;
      toast.error(errorMsg, { closeButton: true });
      throw new Error(errorMsg);
    }
    const data = await response.json();
    toast.success(`Petición exitosa a ${endpoint}`, { closeButton: true });
    return data;
  } catch (error) {
    toast.error(error.message || 'Error en la petición', { closeButton: true });
    throw error;
  }
}
