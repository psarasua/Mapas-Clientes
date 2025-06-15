import { Routes, Route } from "react-router-dom";
import ClientesTable from "./components/ClientesTable";
import Menu from "./components/Menu";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <div>
      <Menu />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/clientes" element={<ClientesTable />} />
      </Routes>
    </div>
  );
}

export default App;
