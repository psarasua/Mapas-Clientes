import React, { useMemo } from "react";
import { Link } from "react-router-dom"; // Importa Link para navegación sin recarga

// Componente de menú de navegación principal
const Menu = React.memo(function Menu() {
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
    // Barra de navegación con Bootstrap
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container-fluid">
        {/* Logo o nombre de la app, navega al inicio */}
        <Link className="navbar-brand" to="/">
          ClientesApp
        </Link>
        {/* Botón para mostrar/ocultar menú en pantallas pequeñas */}
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
        {/* Contenedor de los links del menú */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {menuLinks.map((link) => (
              <li className="nav-item" key={link.to}>
                <Link className="nav-link" to={link.to}>
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

export default Menu;