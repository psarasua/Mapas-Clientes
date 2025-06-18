import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import MapaClientes from "./MapaClientes";

function CamionesDiasCards() {
  const [registros, setRegistros] = useState([]);
  const [dias, setDias] = useState([]);
  const [camiones, setCamiones] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    camion_id: "",
    dia_id: "",
  });
  const [mensaje, setMensaje] = useState("");
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [clientesMapa, setClientesMapa] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const { data: registrosData } = await supabase
      .from("camiones_dias")
      .select(`
        id,
        camion_id,
        dia_id,
        camiones(descripcion),
        dias_entrega(descripcion),
        clientesAsignados:camion_dias_entrega (
          id,
          cliente_id,
          clientes(nombre, x, y)
        )
      `);
    setRegistros(registrosData || []);

    const { data: diasData } = await supabase.from("dias_entrega").select("*");
    setDias(diasData || []);

    const { data: camionesData } = await supabase.from("camiones").select("*");
    setCamiones(camionesData || []);
  };

  // Agrupa los registros por día y luego por id
  const agrupadosPorDia = dias.map((dia) => ({
    ...dia,
    registros: registros.filter((r) => r.dia_id === dia.id)
  }));

  const openModal = (registro = null) => {
    if (registro) {
      setEditId(registro.id);
      setForm({
        camion_id: registro.camion_id,
        dia_id: registro.dia_id,
      });
    } else {
      setEditId(null);
      setForm({ camion_id: "", dia_id: "" });
    }
    setMensaje("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setMensaje("");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      const { error } = await supabase
        .from("camiones_dias")
        .update(form)
        .eq("id", editId);
      if (error) {
        setMensaje("Error al actualizar: " + error.message);
        return;
      }
      setMensaje("Registro actualizado.");
    } else {
      const { error } = await supabase
        .from("camiones_dias")
        .insert([form]);
      if (error) {
        setMensaje("Error al agregar: " + error.message);
        return;
      }
      setMensaje("Registro agregado.");
    }
    fetchAll();
    setTimeout(closeModal, 1000);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este registro?")) {
      const { error } = await supabase
        .from("camiones_dias")
        .delete()
        .eq("id", id);
      if (!error) {
        fetchAll();
      }
    }
  };

  const handleVerMapa = (cd) => {
    // Transforma cada cliente asignado al formato esperado
    const clientes = (cd.clientesAsignados || [])
      .filter(ca => ca.clientes && ca.clientes.x && ca.clientes.y)
      .map(ca => ({
        id: ca.id,
        nombre: ca.clientes.nombre,
        x: ca.clientes.x,
        y: ca.clientes.y
      }));
    setClientesMapa(clientes);
    setMostrarMapa(true);
  };

  return (
    <div>
      <h2>Camiones agrupados por día</h2>
      <button className="btn btn-success mb-3" onClick={() => openModal()}>
        Agregar registro
      </button>

      {/* Agrupados por día */}
      {agrupadosPorDia.map((dia) => (
        <div key={dia.id} className="mb-4">
          <h4>{dia.descripcion}</h4>
          <div className="row">
            {dia.registros.map((cd) => (
              <div className="col-md-4 mb-3" key={cd.id}>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">
                      {cd.camiones?.descripcion || cd.camion_id}
                    </h5>
                    <p className="card-text">
                      <strong>Día:</strong> {cd.dias_entrega?.descripcion || cd.dia_id}
                    </p>
                    <p className="card-text">
                      <strong>Total de clientes:</strong> {cd.clientesAsignados?.length || 0}
                    </p>
                    <button
                      className="btn btn-info me-2"
                      onClick={() => handleVerMapa(cd)}
                    >
                      Ver Mapa
                    </button>
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => openModal(cd)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(cd.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {dia.registros.length === 0 && (
              <div className="col-12 text-muted">Sin camiones para este día.</div>
            )}
          </div>
        </div>
      ))}

      {/* Modal de agregar/editar */}
      {modalOpen && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.3)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editId ? "Editar" : "Agregar"} registro
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Camión:</label>
                    <select
                      className="form-select"
                      name="camion_id"
                      value={form.camion_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccione</option>
                      {camiones.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.descripcion}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Día:</label>
                    <select
                      className="form-select"
                      name="dia_id"
                      value={form.dia_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccione</option>
                      {dias.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.descripcion}
                        </option>
                      ))}
                    </select>
                  </div>
                  {mensaje && (
                    <div className="alert alert-info">{mensaje}</div>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    {editId ? "Actualizar" : "Agregar"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal del mapa */}
      {mostrarMapa && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.3)" }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Mapa de Clientes</h5>
                <button type="button" className="btn-close" onClick={() => setMostrarMapa(false)}></button>
              </div>
              <div className="modal-body" style={{ height: 500 }}>
                <MapaClientes clientes={clientesMapa} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CamionesDiasCards;