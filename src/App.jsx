import { Routes, Route } from "react-router-dom"; // Importa componentes de rutas de React Router
import Menu from "./components/menu/Menu"; // Nuevo path para el menú de navegación principal
import Dashboard from "./components/Dashboard"; // El dashboard puede quedar igual si no lo moviste
import ClientesTable from "./components/clientes/ClientesTable"; // Nuevo path para la tabla de clientes
import CamionesTable from "./components/camiones/CamionesTable"; // Nuevo path para la tabla de camiones
import DiasEntregaTable from "./components/diasEntrega/Dias_EntregaTable"; // Nuevo path para la tabla de días de entrega
import CamionDiasTable from "./components/camionDias/Camion_DiasTable"; // Nuevo path para la tabla de repartos

function App() {
  // Componente principal de la aplicación
  return (
    <>
      {/* Menú de navegación persistente en todas las páginas */}
      <Menu />
      {/* Definición de rutas de la aplicación */}
      <Routes>
        {/* Ruta para el dashboard/inicio */}
        <Route path="/" element={<Dashboard />} />
        {/* Ruta para la tabla de clientes */}
        <Route path="/clientes" element={<ClientesTable />} />
        {/* Ruta para la tabla de camiones */}
        <Route path="/camiones" element={<CamionesTable />} />
        {/* Ruta para la tabla de días de entrega */}
        <Route path="/dias-entrega" element={<DiasEntregaTable />} />
        {/* Ruta para la tabla de repartos (camión-día) */}
        <Route path="/camion-dias" element={<CamionDiasTable />} />
      </Routes>
    </>
  );
}

export default App; // Exporta el componente principal para su uso en index.js