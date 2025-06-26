// auth.js
// Utilidades para autenticación y protección de rutas en frontend

export function isAuthenticated() {
  return Boolean(localStorage.getItem('token'));
}

export function logout() {
  localStorage.removeItem('token');
}
