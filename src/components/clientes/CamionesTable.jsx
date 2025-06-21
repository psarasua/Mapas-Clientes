import React, { useEffect, useState, useCallback } from "react"; // Importa useCallback para funciones memorizadas
import supabase from "../../supabaseClient";

export default function CamionesTable() {
  // Estado para la lista de camiones
  const [camiones, setCamiones] = useState([]);
  // Estado para mostrar spinner de carga
  const [loading, setLoading] = useState(true);
  // Estado para el formulario (agregar/editar)
  const [form, setForm] = useState({ descripcion: "" });
  // Estado para saber si se está editando y el id correspondiente
  const [editId, setEditId] = useState(null);

  // Carga los camiones al montar el componente
  useEffect(() => {
    fetchCamiones();
  }, []);

  // Función para obtener camiones de la base de datos (memorizada)
  const fetchCamiones = useCallback(async () => {
    setLoading(true); // Activa spinner
    const { data, error } = await supabase
      .from("camiones")
      .select("*")
      .order("id", { ascending: true });
    if (!error) setCamiones(data); // Actualiza estado si no hay error
    setLoading(false); // Desactiva spinner
  }, []);

  // Maneja el envío del formulario para agregar o actualizar
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault(); // Previene recarga de página
    if (editId) {
      // Actualiza camión existente
      await supabase.from("camiones").update(form).eq("id", editId);
    } else {
      // Inserta nuevo camión
      await supabase.from("camiones").insert([form]);
    }
    setForm({ descripcion: "" }); // Limpia formulario
    setEditId(null); // Sale del modo edición
    fetchCamiones(); // Refresca lista
  }, [editId, form, fetchCamiones]);

  // Maneja la eliminación de un camión
  const handleDelete = useCallback(async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este camión?")) {
      await supabase.from("camiones").delete().eq("id", id);
      fetchCamiones(); // Refresca lista
    }
  }, [fetchCamiones]);

  // Maneja la edición de un camión (carga datos al formulario)
  const handleEdit = useCallback((camion) => {
    setForm({ descripcion: camion.descripcion });
    setEditId(camion.id);
  }, []);

  // Renderizado principal
  return (
    <div className="container mt-4">
      <h2>Camiones</h2>
      {/* Formulario para agregar o editar camión */}
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
        // Tabla de camiones
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
                        {/* Botón para editar */}
                        <button
                          className="btn btn-outline-primary btn-sm"
                          title="Editar"
                          onClick={() => handleEdit(camion)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        {/* Botón para eliminar */}
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