import React, { useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import MenuPrincipal from "./components/menu/MenuPrincipal";
import ClientesPanel from "./components/clientes/ClientesPanel";
import CamionesPanel from "./components/camiones/CamionesPanel";
import DiasEntregaTable from "./components/diasEntrega/DiasEntregaPanel";
import CamionDiasTable from "./components/camionDias/CamionDiasPanel";

const App = React.memo(function App() {
  // Memoiza las rutas para evitar renders innecesarios si los componentes no cambian
  const routes = useMemo(
    () => (
      <Routes>
        <Route path="/" element={<CamionDiasTable />} />
        <Route path="/clientes" element={<ClientesPanel />} />
        <Route path="/camiones" element={<CamionesPanel />} />
        <Route path="/dias-entrega" element={<DiasEntregaTable />} />
        <Route path="/camion-dias" element={<CamionDiasTable />} />
      </Routes>
    ),
    []
  );

  // Componente principal de la aplicación
  return (
    <>
      <MenuPrincipal />
      {routes}
    </>
  );
});

export default App; // Exporta el componente principal para su uso en index.js