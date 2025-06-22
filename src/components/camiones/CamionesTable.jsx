import React, { useEffect, useState, useCallback, useMemo } from "react";
import supabase from "../../supabaseClient";

// Envuelve el componente con React.memo para evitar renders innecesarios si las props no cambian
const CamionesTable = React.memo(function CamionesTable() {
  // Estado para la lista de camiones
  const [camiones, setCamiones] = useState([]);
  // Estado para mostrar spinner de carga
  const [loading, setLoading] = useState(true);
  // Estado para el formulario (agregar/editar)
  const [form, setForm] = useState({ descripcion: "" });
  // Estado para saber si se está editando y el id correspondiente
  const [editId, setEditId] = useState(null);

  // useCallback para evitar recrear la función en cada render
  const fetchCamiones = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("camiones")
      .select("*")
      .order("id", { ascending: true });
    if (!error) setCamiones(data);
    setLoading(false);
  }, []);

  // Carga los camiones al montar el componente
  useEffect(() => {
    fetchCamiones();
  }, [fetchCamiones]);

  // useCallback para manejar el envío del formulario
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (editId) {
        await supabase.from("camiones").update(form).eq("id", editId);
      } else {
        await supabase.from("camiones").insert([form]);
      }
      setForm({ descripcion: "" });
      setEditId(null);
      fetchCamiones();
    },
    [editId, form, fetchCamiones]
  );

  // useCallback para manejar la eliminación de un camión
  const handleDelete = useCallback(
    async (id) => {
      if (window.confirm("¿Seguro que deseas eliminar este camión?")) {
        await supabase.from("camiones").delete().eq("id", id);
        fetchCamiones();
      }
    },
    [fetchCamiones]
  );

  // useCallback para manejar la edición de un camión
  const handleEdit = useCallback((camion) => {
    setForm({ descripcion: camion.descripcion });
    setEditId(camion.id);
  }, []);

  // useMemo para memorizar la tabla de camiones y evitar renders innecesarios
  const camionesTable = useMemo(
    () => (
      <div className="table-responsive flex-grow-1">
        <table
          className="table table-striped table-hover align-middle w-100"
          role="table"
          aria-label="Tabla de camiones"
        >
          <thead className="table-dark">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Descripción</th>
              <th scope="col">Acciones</th>
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
              camiones.map((camion) => (
                <tr key={camion.id}>
                  <td>{camion.id}</td>
                  <td>{camion.descripcion}</td>
                  <td>
                    <div className="d-flex gap-2">
                      {/* Botón para editar */}
                      <button
                        className="btn btn-outline-primary btn-sm"
                        title="Editar"
                        aria-label={`Editar camión ${camion.descripcion}`}
                        onClick={() => handleEdit(camion)}
                      >
                        <i className="bi bi-pencil" aria-hidden="true"></i>
                        <span className="visually-hidden">Editar</span>
                      </button>
                      {/* Botón para eliminar */}
                      <button
                        className="btn btn-outline-danger btn-sm"
                        title="Eliminar"
                        aria-label={`Eliminar camión ${camion.descripcion}`}
                        onClick={() => handleDelete(camion.id)}
                      >
                        <i className="bi bi-trash" aria-hidden="true"></i>
                        <span className="visually-hidden">Eliminar</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    ),
    [camiones, handleEdit, handleDelete]
  );

  // Renderizado principal
  return (
    <div className="container mt-4">
      <h2 id="camiones-titulo" tabIndex={0}>Camiones</h2>
      {/* Formulario para agregar o editar camión */}
      <form className="row g-3 mb-4" onSubmit={handleSubmit} aria-labelledby="camiones-titulo">
        <div className="col-md-8">
          <label htmlFor="descripcion_camion" className="form-label visually-hidden">
            Descripción del camión
          </label>
          <input
            className="form-control"
            id="descripcion_camion"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            required
            aria-label="Descripción del camión"
            autoComplete="off"
          />
        </div>
        <div className="col-md-4">
          <button className="btn btn-primary w-100" type="submit">
            {editId ? "Actualizar" : "Agregar"}
          </button>
        </div>
      </form>
      {/* Spinner de carga o tabla */}
      {loading ? (
        <div className="text-center py-4 flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="spinner-border text-primary" role="status" aria-live="polite">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        camionesTable
      )}
    </div>
  );
});

export default CamionesTable;