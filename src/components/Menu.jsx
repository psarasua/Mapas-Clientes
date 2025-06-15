import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { supabase } from "../supabaseClient";

export default function Menu() {
  const { user } = useAuth();
  const [nombreUsuario, setNombreUsuario] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchNombreUsuario() {
      if (user?.email) {
        const { data, error } = await supabase
          .from("usuarios")
          .select("usuario")
          .eq("email", user.email)
          .single();
        if (data && data.usuario) setNombreUsuario(data.usuario);
        else setNombreUsuario(user.email); // fallback
      }
    }
    fetchNombreUsuario();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          ClientesApp
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/clientes">
                Clientes
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/camiones">
                Camiones
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/dias-entrega">
                Días de Entrega
              </Link>
            </li>
          </ul>
          {user && (
            <div className="d-flex align-items-center">
              <span className="text-light me-3">
                <i className="bi bi-person-circle me-1"></i>
                {nombreUsuario}
              </span>
              <button
                className="btn btn-outline-light btn-sm"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}