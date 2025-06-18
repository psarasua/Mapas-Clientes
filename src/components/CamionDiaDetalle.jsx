import  { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../supabaseClient";
import MapaClientes from "./MapaClientes"; // Ajusta la ruta si es necesario

function CamionDiaDetalle() {
  const { id } = useParams(); // id del camion_dia
  const [detalle, setDetalle] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [clientesAsignados, setClientesAsignados] = useState([]);
  const [clienteId, setClienteId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [clientesSeleccionados, setClientesSeleccionados] = useState([]);
  const [mostrarMapa, setMostrarMapa] = useState(false);

  // Cargar detalle del camion_dia y clientes asignados
  useEffect(() => {
    const fetchDetalle = async () => {
      const { data, error } = await supabase
        .from("camiones_dias")
        .select(`
          id,
          camion_id,
          dia_id,
          camiones(descripcion),
          dias_entrega(descripcion)
        `)
        .eq("id", id)
        .maybeSingle();
      setDetalle(data);
      setLoading(false);
    };

    const fetchClientesAsignados = async () => {
      const { data } = await supabase
        .from("camion_dias_entrega")
        .select("id, cliente_id, clientes(nombre, x, y)")
        .eq("camion_dia", id);
      setClientesAsignados(data || []);
    };

    fetchDetalle();
    fetchClientesAsignados();
  }, [id]);

  // Cargar clientes activos para el select
  useEffect(() => {
    if (modalOpen) {
      supabase
        .from("clientes")
        .select("*")
        .eq("activo", true)
        .then(({ data }) => setClientes(data || []));
    }
  }, [modalOpen]);

  // Agregar cliente
  const handleAgregar = async (e) => {
    e.preventDefault();
    if (clientesSeleccionados.length === 0) return;
    const inserts = clientesSeleccionados.map(cliente_id => ({
      camion_dia: id,
      cliente_id
    }));
    const { error } = await supabase
      .from("camion_dias_entrega")
      .insert(inserts);
    if (error) {
      setMensaje("Error al agregar: " + error.message);
      return;
    }
    setMensaje("Clientes agregados.");
    setClientesSeleccionados([]);
    setModalOpen(false);
    // Refresca la lista
    const { data } = await supabase
      .from("camion_dias_entrega")
      .select("id, cliente_id, clientes(nombre, x, y)")
      .eq("camion_dia", id);
    setClientesAsignados(data || []);
  };

  // Eliminar cliente
  const handleEliminar = async (asignacionId) => {
    if (window.confirm("¿Eliminar este cliente del reparto?")) {
      await supabase
        .from("camion_dias_entrega")
        .delete()
        .eq("id", asignacionId);
      // Refresca la lista
      const { data } = await supabase
        .from("camion_dias_entrega")
        .select("id, cliente_id, clientes(nombre)")
        .eq("camion_dia", id);
      setClientesAsignados(data || []);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (!detalle) return <div>No se encontró el registro.</div>;

  return (
    <div className="container mt-4">
      <div className="card mb-4">
        <div className="card-header">
          <h4>Detalle Camión/Día</h4>
        </div>
        <div className="card-body">
          <p>
            <strong>Camión:</strong> {detalle.camiones?.descripcion || detalle.camion_id}
          </p>
          <p>
            <strong>Día:</strong> {detalle.dias_entrega?.descripcion || detalle.dia_id}
          </p>
        </div>
      </div>

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Clientes asignados</h5>
        <div>
          <button className="btn btn-info mb-3" onClick={() => setMostrarMapa(true)}>
            Ver Mapa
          </button>
          <button className="btn btn-success" onClick={() => setModalOpen(true)}>
            Agregar Cliente
          </button>
        </div>
      </div>

      {mostrarMapa && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.3)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Mapa de Clientes</h5>
                <button type="button" className="btn-close" onClick={() => setMostrarMapa(false)}></button>
              </div>
              <div className="modal-body" style={{ height: 400 }}>
                <MapaClientes clientes={clientesAsignados.map(c => c.clientes)} />
              </div>
            </div>
          </div>
        </div>
      )}

      <ul className="list-group mb-4">
        {clientesAsignados.length === 0 && (
          <li className="list-group-item text-muted">Sin clientes asignados</li>
        )}
        {clientesAsignados.map((c) => (
          <li className="list-group-item d-flex justify-content-between align-items-center" key={c.id}>
            {c.clientes?.nombre || c.cliente_id}
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleEliminar(c.id)}
              title="Eliminar"
            >
              <i className="bi bi-trash"></i>
            </button>
          </li>
        ))}
      </ul>

      {/* Modal para agregar cliente */}
      {modalOpen && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.3)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agregar Cliente</h5>
                <button type="button" className="btn-close" onClick={() => setModalOpen(false)}></button>
              </div>
              <form onSubmit={handleAgregar}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Buscar cliente:</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar por nombre"
                      value={busqueda}
                      onChange={e => setBusqueda(e.target.value)}
                    />
                  </div>
                  <div className="mb-3" style={{ maxHeight: 250, overflowY: "auto" }}>
                    <label className="form-label">Clientes:</label>
                    <div className="list-group">
                      {clientes
                        .filter(c =>
                          c.nombre.toLowerCase().includes(busqueda.toLowerCase())
                        )
                        .map(c => (
                          <label key={c.id} className="list-group-item">
                            <input
                              type="checkbox"
                              className="form-check-input me-2"
                              checked={clientesSeleccionados.includes(c.id)}
                              onChange={e => {
                                if (e.target.checked) {
                                  setClientesSeleccionados([...clientesSeleccionados, c.id]);
                                } else {
                                  setClientesSeleccionados(
                                    clientesSeleccionados.filter(id => id !== c.id)
                                  );
                                }
                              }}
                            />
                            {c.nombre}
                          </label>
                        ))}
                    </div>
                  </div>
                  {mensaje && <div className="alert alert-info">{mensaje}</div>}
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary" disabled={clientesSeleccionados.length === 0}>
                    Agregar
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CamionDiaDetalle;