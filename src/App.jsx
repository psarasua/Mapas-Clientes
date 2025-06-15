import { Routes, Route } from "react-router-dom";
import ClientesTable from "./components/ClientesTable";
import Menu from "./components/Menu";
import Dashboard from "./components/Dashboard";
import CamionesTable from "./components/CamionesTable";
import Dias_EntregaTable from "./components/Dias_EntregaTable";
function App() {
  return (
    <div>
      <Menu />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/clientes" element={<ClientesTable />} />
        <Route path="/camiones" element={<CamionesTable />} />
        <Route path="/dias_entrega" element={<Dias_EntregaTable />} />
      </Routes>
    </div>
  );
}

export default App;
