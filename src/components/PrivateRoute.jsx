import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}