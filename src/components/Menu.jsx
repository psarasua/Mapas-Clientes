import { Link } from "react-router-dom"; // Importa Link para navegación sin recarga

// Componente de menú de navegación principal
export default function Menu() {
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
            {/* Link a la página de inicio */}
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Inicio
              </Link>
            </li>
            {/* Link a la sección de clientes */}
            <li className="nav-item">
              <Link className="nav-link" to="/clientes">
                Clientes
              </Link>
            </li>
            {/* Link a la sección de camiones */}
            <li className="nav-item">
              <Link className="nav-link" to="/camiones">
                Camiones
              </Link>
            </li>
            {/* Link a la sección de días de entrega */}
            <li className="nav-item">
              <Link className="nav-link" to="/dias-entrega">
                Días de Entrega
              </Link>
            </li>
            {/* Link a la sección de repartos */}
            <li className="nav-item">
              <Link className="nav-link" to="/camion-dias">
                Repartos
              </Link>
            </li>
          </ul>
          {/* Aquí puedes agregar más elementos a la derecha si lo necesitas */}
        </div>
      </div>
    </nav>
  );
}