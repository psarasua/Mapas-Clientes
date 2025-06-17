import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";

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
  const navigate = useNavigate();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const { data: registrosData } = await supabase
      .from("camiones_dias")
      .select("id, camion_id, dia_id, camiones(descripcion), dias_entrega(descripcion)");
    setRegistros(registrosData || []);

    const { data: diasData } = await supabase.from("dias_entrega").select("*");
    setDias(diasData || []);

    const { data: camionesData } = await supabase.from("camiones").select("*");
    setCamiones(camionesData || []);
  };

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

  // Agrupa los registros por dia_id
  const registrosPorDia = dias.reduce((acc, dia) => {
    acc[dia.id] = registros.filter((r) => r.dia_id === dia.id);
    return acc;
  }, {});

  return (
    <div>
      <h2>Camiones agrupados por día</h2>
      <button className="btn btn-success mb-3" onClick={() => openModal()}>
        Agregar registro
      </button>
      <div className="row">
        {dias.map((dia) => (
          <div className="col" key={dia.id}>
            <h5 className="text-center">{dia.descripcion}</h5>
            {registrosPorDia[dia.id] && registrosPorDia[dia.id].length > 0 ? (
              registrosPorDia[dia.id].map((r) => (
                <div
                  className="card mb-3"
                  key={r.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/camion-dia/${r.id}`)}
                >
                  <div className="card-body">
                    <h6 className="card-title">
                      {r.camiones?.descripcion}
                     
                    </h6>
                  </div>
                  <div
                    className="card-footer d-flex justify-content-end"
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => openModal(r)}
                      title="Editar"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(r.id)}
                      title="Eliminar"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted">Sin camiones</div>
            )}
          </div>
        ))}
      </div>

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
    </div>
  );
}

export default CamionesDiasCards;