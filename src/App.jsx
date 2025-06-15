import React from "react";
import { Routes, Route } from "react-router-dom";
import Menu from "./components/Menu";
import Dashboard from "./components/Dashboard";
import ClientesTable from "./components/ClientesTable";
import CamionesTable from "./components/CamionesTable";
import Dias_EntregaTable from "./components/Dias_EntregaTable";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./AuthContext";

function App() {
  return (
    <AuthProvider>
      <Menu />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/clientes"
          element={
            <PrivateRoute>
              <ClientesTable />
            </PrivateRoute>
          }
        />
        <Route
          path="/camiones"
          element={
            <PrivateRoute>
              <CamionesTable />
            </PrivateRoute>
          }
        />
        <Route
          path="/dias-entrega"
          element={
            <PrivateRoute>
              <Dias_EntregaTable />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
