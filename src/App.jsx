import { Routes, Route } from "react-router-dom"; // Importa componentes de rutas de React Router
import Menu from "./components/Menu"; // Importa el menú de navegación principal
import Dashboard from "./components/Dashboard"; // Importa el dashboard/inicio
import ClientesTable from "./components/ClientesTable"; // Importa la tabla de clientes
import CamionesTable from "./components/CamionesTable"; // Importa la tabla de camiones
import Dias_EntregaTable from "./components/Dias_EntregaTable"; // Importa la tabla de días de entrega
import Camion_DiasTable from "./components/Camion_DiasTable"; // Importa la tabla de repartos

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
        <Route path="/dias-entrega" element={<Dias_EntregaTable />} />
        {/* Ruta para la tabla de repartos (camión-día) */}
        <Route path="/camion-dias" element={<Camion_DiasTable />} />
      </Routes>
    </>
  );
}

export default App; // Exporta el componente principal para su uso en index.js