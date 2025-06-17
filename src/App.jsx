import { Routes, Route } from "react-router-dom";
import Menu from "./components/Menu";
import Dashboard from "./components/Dashboard";
import ClientesTable from "./components/ClientesTable";
import CamionesTable from "./components/CamionesTable";
import Dias_EntregaTable from "./components/Dias_EntregaTable";
import Camion_DiasTable from "./components/Camion_DiasTable"; 
import CamionDiaDetalle from "./components/CamionDiaDetalle";

function App() {
  return (
    <>
      <Menu />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/clientes" element={<ClientesTable />} />
        <Route path="/camiones" element={<CamionesTable />} />
        <Route path="/dias-entrega" element={<Dias_EntregaTable />} />
        <Route path="/camion-dias" element={<Camion_DiasTable />} />
        <Route path="/camion-dia/:id" element={<CamionDiaDetalle />} />
      </Routes>
    </>
  );
}

export default App;