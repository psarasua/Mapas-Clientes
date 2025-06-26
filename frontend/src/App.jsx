import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ClientesPanel from "./components/clientes/ClientesPanel";
import CamionesPanel from "./components/camiones/CamionesPanel";
import DiasEntregaPanel from "./components/diasEntrega/DiasEntregaPanel";
import Menu from "./components/menu/MenuPrincipal";
import { Toaster } from "sonner";
import ConfiguracionPanel from "./components/configuracion/ConfiguracionPanel";

const App = () => {
  return (
    <BrowserRouter>
      <Menu />
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/clientes" element={<ClientesPanel />} />
        <Route path="/camiones" element={<CamionesPanel />} />
        <Route path="/dias-entrega" element={<DiasEntregaPanel />} />
        <Route path="/configuracion" element={<ConfiguracionPanel />} />
        <Route path="*" element={<ClientesPanel />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
