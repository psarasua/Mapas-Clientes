import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

// Componente de menú de navegación principal
const MenuPrincipal = React.memo(function MenuPrincipal() {
  const location = useLocation();

  // Memoiza la lista de links del menú para evitar renders innecesarios
  const menuLinks = useMemo(
    () => [
      { to: "/", label: "Inicio" },
      { to: "/clientes", label: "Clientes" },
      { to: "/camiones", label: "Camiones" },
      { to: "/dias-entrega", label: "Días de Entrega" },
      { to: "/camion-dias", label: "Repartos" },
    ],
    []
  );

  // Renderizado principal del menú
  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-dark mb-4"
      role="navigation"
      aria-label="Menú principal"
    >
      {/* Usar container para alinear el menú con el contenido */}
      <div className="container">
        {/* Logo o nombre de la app, navega al inicio */}
        <Link className="navbar-brand" to="/" aria-label="Ir a inicio">
          MapaClientes
        </Link>
        {/* Botón para mostrar/ocultar menú en pantallas pequeñas */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Mostrar u ocultar menú de navegación"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        {/* Contenedor de los links del menú */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto" role="menubar">
            {menuLinks.map((link) => (
              <li className="nav-item" key={link.to} role="none">
                <Link
                  className={`nav-link${
                    location.pathname === link.to ? " active" : ""
                  }`}
                  to={link.to}
                  role="menuitem"
                  aria-current={
                    location.pathname === link.to ? "page" : undefined
                  }
                  tabIndex={0}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          {/* Aquí puedes agregar más elementos a la derecha si lo necesitas */}
        </div>
      </div>
    </nav>
  );
});

export default MenuPrincipal;
