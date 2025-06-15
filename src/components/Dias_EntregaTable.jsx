import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function DiasEntregaTable() {
  const [dias, setDias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ descripcion: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchDias();
  }, []);

  async function fetchDias() {
    setLoading(true);
    const { data, error } = await supabase
      .from("dias_entrega")
      .select("*")
      .order("id", { ascending: true });
    if (!error) setDias(data);
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (editId) {
      await supabase.from("dias_entrega").update(form).eq("id", editId);
    } else {
      await supabase.from("dias_entrega").insert([form]);
    }
    setForm({ descripcion: "" });
    setEditId(null);
    fetchDias();
  }

  async function handleDelete(id) {
    await supabase.from("dias_entrega").delete().eq("id", id);
    fetchDias();
  }

  function handleEdit(dia) {
    setForm({ descripcion: dia.descripcion });
    setEditId(dia.id);
  }

  return (
    <div className="container mt-4">
      <h2>Días de Entrega</h2>
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
              {dias.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-4">
                    No hay días de entrega registrados.
                  </td>
                </tr>
              ) : (
                dias.map(dia => (
                  <tr key={dia.id}>
                    <td>{dia.id}</td>
                    <td>{dia.descripcion}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          title="Editar"
                          onClick={() => handleEdit(dia)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          title="Eliminar"
                          onClick={() => handleDelete(dia.id)}
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