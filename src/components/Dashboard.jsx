import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { supabase } from "../supabaseClient";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClientes();
  }, []);

  async function fetchClientes() {
    setLoading(true);
    const { data, error } = await supabase.from("clientes").select("*");
    if (!error) setClientes(data);
    setLoading(false);
  }

  // Cálculos
  const total = clientes.length;
  const activos = clientes.filter((c) => c.activo).length;
  const inactivos = total - activos;

  const conCoords = clientes.filter(
    (c) =>
      c.x !== undefined &&
      c.y !== undefined &&
      Number(c.x) !== 0 &&
      Number(c.y) !== 0 &&
      !isNaN(Number(c.x)) &&
      !isNaN(Number(c.y))
  ).length;
  const sinCoords = total - conCoords;

  const dataActivos = {
    labels: ["Activos", "Inactivos"],
    datasets: [
      {
        data: [activos, inactivos],
        backgroundColor: ["#198754", "#dc3545"],
        borderWidth: 1,
      },
    ],
  };

  const dataCoords = {
    labels: ["Con coordenadas", "Sin coordenadas"],
    datasets: [
      {
        data: [conCoords, sinCoords],
        backgroundColor: ["#0d6efd", "#ffc107"],
        borderWidth: 1,
      },
    ],
  };


  return (
    <div className="container-fluid mt-4">
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <div className="row">
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Clientes Activos/Inactivos</h5>
                <Pie data={dataActivos} />
                <div className="mt-3">
                  <span className="badge bg-success me-2">
                    Activos:{" "}
                    {activos}{" "}
                    ({total > 0 ? ((activos / total) * 100).toFixed(1) : 0}%)
                  </span>
                  <span className="badge bg-danger">
                    Inactivos:{" "}
                    {inactivos}{" "}
                    ({total > 0 ? ((inactivos / total) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Clientes con/sin coordenadas</h5>
                <Pie data={dataCoords} />
                <div className="mt-3">
                  <span className="badge bg-primary me-2">
                    Con coordenadas:{" "}
                    {conCoords}{" "}
                    ({total > 0 ? ((conCoords / total) * 100).toFixed(1) : 0}%)
                  </span>
                  <span className="badge bg-warning text-dark">
                    Sin coordenadas:{" "}
                    {sinCoords}{" "}
                    ({total > 0 ? ((sinCoords / total) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}