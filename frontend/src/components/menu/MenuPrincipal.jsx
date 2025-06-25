// MenuPrincipal.jsx
// Menú de navegación principal de la aplicación.
// Permite navegar entre las diferentes vistas del sistema de mapas y clientes.

import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

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
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      className="mb-4"
      role="navigation"
      aria-label="Menú principal"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" aria-label="Ir a inicio">
          MapaClientes
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="me-auto" as="ul" role="menubar">
            {menuLinks.map((link) => (
              <Nav.Item as="li" key={link.to} role="none">
                <Nav.Link
                  as={Link}
                  to={link.to}
                  active={location.pathname === link.to}
                  role="menuitem"
                  aria-current={
                    location.pathname === link.to ? "page" : undefined
                  }
                  tabIndex={0}
                >
                  {link.label}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
          {/* Aquí puedes agregar más elementos a la derecha si lo necesitas */}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
});

export default MenuPrincipal;
