// CamionesPanel.jsx
// Panel principal para la gestión de camiones.
// Permite ver, crear, editar y eliminar camiones, mostrando la lista y el formulario correspondiente.
// Maneja el estado y la lógica de interacción de la vista de camiones.

import React, { useEffect, useState, useCallback } from "react";
import { apiFetch } from "../../services/api";
import { FaPencilAlt, FaTrash } from "react-icons/fa";

// Envuelve el componente con React.memo para evitar renders innecesarios si las props no cambian
const CamionesPanel = React.memo(function CamionesPanel() {
  // Estado para la lista de camiones
  const [camiones, setCamiones] = useState([]);
  // Estado para el formulario (agregar/editar)
  const [form, setForm] = useState({ descripcion: "" });
  // Estado para saber si se está editando y el id correspondiente
  const [editId, setEditId] = useState(null);

  // useCallback para evitar recrear la función en cada render
  const fetchCamiones = useCallback(async () => {
    const data = await apiFetch("/camiones");
    setCamiones(data);
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
        await apiFetch(`/camiones/${editId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await apiFetch("/camiones", {
          method: "POST",
          body: JSON.stringify(form),
        });
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
      await apiFetch(`/camiones/${id}`, { method: "DELETE" });
      fetchCamiones();
    },
    [fetchCamiones]
  );

  // useCallback para manejar la edición de un camión
  const handleEdit = useCallback((camion) => {
    setForm({ descripcion: camion.descripcion });
    setEditId(camion.id);
  }, []);

  // Renderizado principal
  return (
    <div className="container my-4" style={{ maxWidth: 900 }}>
      <h2 className="text-center mb-4 mt-3" id="camiones-titulo" tabIndex={0}>
        Camiones
      </h2>
      {/* Formulario para agregar o editar camión */}
      <form className="row g-3 mb-4" onSubmit={handleSubmit} aria-labelledby="camiones-titulo" role="form">
        <div className="col-md-8">
          <label htmlFor="descripcion-camion" className="form-label visually-hidden">
            Descripción del camión
          </label>
          <input
            id="descripcion-camion"
            className="form-control"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={(e) => setForm({ descripcion: e.target.value })}
            required
            aria-required="true"
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
      <div>
        {/* Tabla de camiones con encabezado */}
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
                        <button
                          className="btn btn-outline-warning btn-sm"
                          title="Editar"
                          aria-label={`Editar camión ${camion.descripcion}`}
                          onClick={() => handleEdit(camion)}
                        >
                          <FaPencilAlt aria-hidden="true" />
                          <span className="visually-hidden">Editar</span>
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          title="Eliminar"
                          aria-label={`Eliminar camión ${camion.descripcion}`}
                          onClick={() => handleDelete(camion.id)}
                        >
                          <FaTrash aria-hidden="true" />
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
      </div>
    </div>
  );
});

export default CamionesPanel;
