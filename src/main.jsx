import { StrictMode } from "react"; // Activa comprobaciones adicionales en desarrollo
import { createRoot } from "react-dom/client"; // Nueva API de React 18 para crear el root
import App from "./App.jsx"; // Importa el componente principal de la app

import "leaflet/dist/leaflet.css"; // Estilos de Leaflet para mapas
import 'bootstrap-icons/font/bootstrap-icons.css'; // Iconos de Bootstrap
import { BrowserRouter } from "react-router-dom"; // Proveedor de rutas para SPA
import "bootswatch/dist/flatly/bootstrap.min.css"; // Tema Flatly de Bootswatch para Bootstrap

// Monta la aplicación en el elemento root del HTML
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Proveedor de rutas para navegación SPA */}
    <BrowserRouter>
      <App /> {/* Componente principal de la aplicación */}
    </BrowserRouter>
  </StrictMode>
);
