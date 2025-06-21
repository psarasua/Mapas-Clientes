import React, { useEffect, useState, useCallback } from "react"; // Importa hooks principales y useCallback para funciones memorizadas
import supabase from "../supabaseClient"; // Cliente de Supabase

export default function DiasEntregaTable() {
  // Estado para la lista de días de entrega
  const [dias, setDias] = useState([]);
  // Estado para mostrar spinner de carga
  const [loading, setLoading] = useState(true);
  // Estado para el formulario (agregar/editar)
  const [form, setForm] = useState({ descripcion: "" });
  // Estado para saber si se está editando y el id correspondiente
  const [editId, setEditId] = useState(null);

  // Carga los días de entrega al montar el componente
  useEffect(() => {
    fetchDias();
  }, []);

  // Función para obtener días de entrega de la base de datos (memorizada)
  const fetchDias = useCallback(async () => {
    setLoading(true); // Activa spinner
    const { data, error } = await supabase
      .from("dias_entrega")
      .select("*")
      .order("id", { ascending: true });
    if (!error) setDias(data); // Actualiza estado si no hay error
    setLoading(false); // Desactiva spinner
  }, []);

  // Maneja el envío del formulario para agregar o actualizar
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault(); // Previene recarga de página
    if (editId) {
      // Actualiza día existente
      await supabase.from("dias_entrega").update(form).eq("id", editId);
    } else {
      // Inserta nuevo día
      await supabase.from("dias_entrega").insert([form]);
    }
    setForm({ descripcion: "" }); // Limpia formulario
    setEditId(null); // Sale del modo edición
    fetchDias(); // Refresca lista
  }, [editId, form, fetchDias]);

  // Maneja la eliminación de un día
  const handleDelete = useCallback(async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este día?")) {
      await supabase.from("dias_entrega").delete().eq("id", id);
      fetchDias(); // Refresca lista
    }
  }, [fetchDias]);

  // Maneja la edición de un día (carga datos al formulario)
  const handleEdit = useCallback((dia) => {
    setForm({ descripcion: dia.descripcion });
    setEditId(dia.id);
  }, []);

  // Render principal del componente
  return (
    <div className="container mt-4">
      <h2>Días de Entrega</h2>
      {/* Formulario para agregar o editar día */}
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
      {/* Spinner de carga */}
      {loading ? (
        <div className="text-center py-4 flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        // Tabla de días de entrega
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
                        {/* Botón para editar */}
                        <button
                          className="btn btn-outline-primary btn-sm"
                          title="Editar"
                          onClick={() => handleEdit(dia)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        {/* Botón para eliminar */}
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