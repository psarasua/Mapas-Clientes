import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function CamionesTable() {
  const [camiones, setCamiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ descripcion: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCamiones();
  }, []);

  async function fetchCamiones() {
    setLoading(true);
    const { data, error } = await supabase
      .from("camiones")
      .select("*")
      .order("id", { ascending: true });
    if (!error) setCamiones(data);
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (editId) {
      await supabase.from("camiones").update(form).eq("id", editId);
    } else {
      await supabase.from("camiones").insert([form]);
    }
    setForm({ descripcion: "" });
    setEditId(null);
    fetchCamiones();
  }

  async function handleDelete(id) {
    await supabase.from("camiones").delete().eq("id", id);
    fetchCamiones();
  }

  function handleEdit(camion) {
    setForm({ descripcion: camion.descripcion });
    setEditId(camion.id);
  }

  return (
    <div className="container mt-4">
      <h2>Camiones</h2>
      <form className="row g-3 mb-4" onSubmit={handleSubmit}>
        <div className="col-md-8">
          <input
            className="form-control"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={e => setForm({ ...form, descripcion: e.target.value })}
            required
          />
        </div>
        <div className="col-md-4">
          <button className="btn btn-primary w-100" type="submit">
            {editId ? "Actualizar" : "Agregar"}
          </button>
        </div>
      </form>
      {loading ? (
        <div className="text-center py-4 flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive flex-grow-1">
          <table className="table table-striped table-hover align-middle w-100">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {camiones.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-4">
                    No hay camiones registrados.
                  </td>
                </tr>
              ) : (
                camiones.map(camion => (
                  <tr key={camion.id}>
                    <td>{camion.id}</td>
                    <td>{camion.descripcion}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          title="Editar"
                          onClick={() => handleEdit(camion)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          title="Eliminar"
                          onClick={() => handleDelete(camion.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}