import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ClientesPanel from "./components/clientes/ClientesPanel";
import CamionesPanel from "./components/camiones/CamionesPanel";
import DiasEntregaPanel from "./components/diasEntrega/DiasEntregaPanel";
import Menu from "./components/menu/MenuPrincipal";
import { Toaster, toast } from "sonner";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

const App = () => {
  useEffect(() => {
    socket.on("info", (data) => {
      toast.info(data.message || "Evento informativo", { description: data.timestamp });
    });
    return () => {
      socket.off("info");
    };
  }, []);

  return (
    <BrowserRouter>
      <Menu />
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/clientes" element={<ClientesPanel />} />
        <Route path="/camiones" element={<CamionesPanel />} />
        <Route path="/dias-entrega" element={<DiasEntregaPanel />} />
        <Route path="*" element={<ClientesPanel />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
