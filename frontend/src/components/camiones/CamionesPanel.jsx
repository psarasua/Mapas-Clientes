// CamionesPanel.jsx
// Panel principal para la gestión de camiones.
// Permite ver, crear, editar y eliminar camiones, mostrando la lista y el formulario correspondiente.
// Maneja el estado y la lógica de interacción de la vista de camiones.

import React, { useEffect, useState, useCallback } from "react";
import { apiFetch } from "../../services/api";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import TablaPanel from "../ui/TablaPanel";

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

  // Columnas para TablaPanel
  const columns = [
    { name: 'ID', selector: row => row.id, sortable: true, width: '70px' },
    { name: 'Descripción', selector: row => row.descripcion, sortable: true },
    {
      name: 'Acciones',
      cell: row => (
        <div className="d-flex gap-2">
          <button className="btn btn-outline-warning btn-sm" title="Editar" aria-label={`Editar camión ${row.descripcion}`} onClick={() => handleEdit(row)}>
            <FaPencilAlt aria-hidden="true" />
          </button>
          <button className="btn btn-outline-danger btn-sm" title="Eliminar" aria-label={`Eliminar camión ${row.descripcion}`} onClick={() => handleDelete(row.id)}>
            <FaTrash aria-hidden="true" />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '120px',
    },
  ];

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
      <TablaPanel
        columns={columns}
        data={camiones}
        loading={false}
        title=""
        searchPlaceholder="Buscar camiones..."
        noDataText="No hay camiones registrados."
      />
    </div>
  );
});

export default CamionesPanel;
