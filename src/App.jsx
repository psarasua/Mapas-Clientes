import React, { useMemo } from "react";
import { Routes, Route } from "react-router-dom"; // Importa componentes de rutas de React Router
import MenuPrincipal from "./components/menu/MenuPrincipal"; // Nuevo path para el menú de navegación principal
import PanelPrincipal from "./components/PanelPrincipal"; // El dashboard puede quedar igual si no lo moviste
import ClientesPanel from "./components/clientes/ClientesPanel"; // Nuevo path para la tabla de clientes
import CamionesPanel from "./components/camiones/CamionesPanel"; // Nuevo path para la tabla de camiones
import DiasEntregaTable from "./components/diasEntrega/DiasEntregaPanel"; // Nuevo path para la tabla de días de entrega
import CamionDiasTable from "./components/camionDias/CamionDiasPanel"; // Nuevo path para la tabla de repartos

const App = React.memo(function App() {
  // Memoiza las rutas para evitar renders innecesarios si los componentes no cambian
  const routes = useMemo(
    () => (
      <Routes>
        {/* Ruta para el dashboard/inicio */}
        <Route path="/" element={<PanelPrincipal />} />
        {/* Ruta para la tabla de clientes */}
        <Route path="/clientes" element={<ClientesPanel />} />
        {/* Ruta para la tabla de camiones */}
        <Route path="/camiones" element={<CamionesPanel />} />
        {/* Ruta para la tabla de días de entrega */}
        <Route path="/dias-entrega" element={<DiasEntregaTable />} />
        {/* Ruta para la tabla de repartos (camión-día) */}
        <Route path="/camion-dias" element={<CamionDiasTable />} />
      </Routes>
    ),
    []
  );

  // Componente principal de la aplicación
  return (
    <>
      {/* Menú de navegación persistente en todas las páginas */}
      <MenuPrincipal />
      {/* Definición de rutas de la aplicación */}
      {routes}
    </>
  );
});

export default App; // Exporta el componente principal para su uso en index.js