import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ClientesPanel from "./components/clientes/ClientesPanel";
import CamionesPanel from "./components/camiones/CamionesPanel";
import DiasEntregaPanel from "./components/diasEntrega/DiasEntregaPanel";
import Menu from "./components/menu/MenuPrincipal";
import { Toaster } from "sonner";
import ConfiguracionPanel from "./components/configuracion/ConfiguracionPanel";
import LoginForm from "./components/ui/LoginForm";
import SignupForm from "./components/ui/SignupForm";
import PrivateRoute from "./components/ui/PrivateRoute";
import { isAuthenticated, logout } from "./services/auth";

const App = () => {
  const [authed, setAuthed] = useState(isAuthenticated());

  useEffect(() => {
    setAuthed(isAuthenticated());
  }, []);

  const handleLogin = () => {
    setAuthed(true);
  };

  const handleLogout = () => {
    logout();
    setAuthed(false);
  };

  return (
    <BrowserRouter>
      {authed && <Menu onLogout={handleLogout} />}
      <Toaster position="top-right" richColors />
      <Routes>
        <Route
          path="/login"
          element={
            authed ? (
              <Navigate to="/clientes" />
            ) : (
              <LoginForm onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            authed ? (
              <Navigate to="/clientes" />
            ) : (
              <SignupForm />
            )
          }
        />
        <Route
          path="/clientes"
          element={
            <PrivateRoute>
              <ClientesPanel />
            </PrivateRoute>
          }
        />
        <Route
          path="/camiones"
          element={
            <PrivateRoute>
              <CamionesPanel />
            </PrivateRoute>
          }
        />
        <Route
          path="/dias-entrega"
          element={
            <PrivateRoute>
              <DiasEntregaPanel />
            </PrivateRoute>
          }
        />
        <Route
          path="/configuracion"
          element={
            <PrivateRoute>
              <ConfiguracionPanel />
            </PrivateRoute>
          }
        />
        <Route
          path="*"
          element={<Navigate to={authed ? "/clientes" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
