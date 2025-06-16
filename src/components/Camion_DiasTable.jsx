import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";

function CamionesDiasTable() {
  const [registros, setRegistros] = useState([]);
  const [camiones, setCamiones] = useState([]);
  const [dias, setDias] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    camion_id: "",
    dia_id: "",
  });
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const { data: registrosData } = await supabase
      .from("camiones_dias") 
      .select("id, camion_id, dia_id, camiones(descripcion), dias_entrega(descripcion)");
    setRegistros(registrosData || []);
    console.log("Registros:", registrosData);

    const { data: camionesData } = await supabase.from("camiones").select("*");
    setCamiones(camionesData || []);

    const { data: diasData } = await supabase.from("dias_entrega").select("*");
    setDias(diasData || []);
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
        .from("camion_dia") // Cambia por el nombre real de tu tabla
        .update(form)
        .eq("id", editId);
      if (error) {
        setMensaje("Error al actualizar: " + error.message);
        return;
      }
      setMensaje("Registro actualizado.");
    } else {
      const { error } = await supabase
        .from("camion_dia") // Cambia por el nombre real de tu tabla
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
        .from("camion_dia") // Cambia por el nombre real de tu tabla
        .delete()
        .eq("id", id);
      if (!error) {
        fetchAll();
      }
    }
  };

  return (
    <div>
      <h2>Camiones - Días</h2>
      <button className="btn btn-success mb-3" onClick={() => openModal()}>
        Agregar registro
      </button>
      <table className="table table-striped table-hover align-middle w-100">
        <thead className="table-dark">
          <tr>
            <th>Camión</th>
            <th>Día</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((r) => (
            <tr key={r.id}>
              <td>{r.camiones?.nombre || r.camion_id}</td>
              <td>{r.dias_entrega?.nombre || r.dia_id}</td>
              <td>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
                          {c.nombre}
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
                          {d.nombre}
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

export default CamionesDiasTable;