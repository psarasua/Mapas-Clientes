import { Link } from "react-router-dom";
export default function Menu() {
  
 

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
            <li className="nav-item">
              <Link className="nav-link" to="/camion-dias">
               Repartos
              </Link>
            </li>
          </ul>
         
        </div>
      </div>
    </nav>
  );
}