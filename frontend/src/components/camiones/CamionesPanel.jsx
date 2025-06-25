// CamionesPanel.jsx
// Panel principal para la gestión de camiones.
// Permite ver, crear, editar y eliminar camiones, mostrando la lista y el formulario correspondiente.
// Maneja el estado y la lógica de interacción de la vista de camiones.

import React, { useEffect, useState, useCallback } from "react";
import { apiFetch } from "../../services/api";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { Button } from "react-bootstrap";
import TablaPanel from "../ui/TablaPanel";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// Envuelve el componente con React.memo para evitar renders innecesarios si las props no cambian
const CamionesPanel = React.memo(function CamionesPanel() {
  // Estado para la lista de camiones
  const [camiones, setCamiones] = useState([]);
  // Estado para el formulario (agregar/editar)
  const [form, setForm] = useState({ descripcion: "" });
  // Estado para saber si se está editando y el id correspondiente
  const [editId, setEditId] = useState(null);
  // Estado para manejar la carga de datos
  const [loading, setLoading] = useState(false);

  const MySwal = withReactContent(Swal);

  // useCallback para evitar recrear la función en cada render
  const fetchCamiones = useCallback(async () => {
    setLoading(true);
    const data = await apiFetch("/camiones");
    setCamiones(data);
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
      setLoading(true);
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
    async (id, descripcion) => {
      const result = await MySwal.fire({
        title: '¿Eliminar camión?',
        text: `¿Seguro que deseas eliminar "${descripcion}"? Esta acción no se puede deshacer.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
      });
      if (result.isConfirmed) {
        setLoading(true);
        await apiFetch(`/camiones/${id}`, { method: "DELETE" });
        fetchCamiones();
        MySwal.fire('Eliminado', 'El camión fue eliminado correctamente.', 'success');
      }
    },
    [fetchCamiones, MySwal]
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
          <Button variant="outline-warning" size="sm" title={`Editar camión ${row.descripcion}`} aria-label={`Editar camión ${row.descripcion}`} onClick={() => handleEdit(row)}>
            <FaPencilAlt aria-hidden="true" />
          </Button>
          <Button variant="outline-danger" size="sm" title={`Eliminar camión ${row.descripcion}`} aria-label={`Eliminar camión ${row.descripcion}`} onClick={() => handleDelete(row.id, row.descripcion)}>
            <FaTrash aria-hidden="true" />
          </Button>
        </div>
      ),
      ignoreRowClick: true,
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
        loading={loading}
        title=""
        searchPlaceholder="Buscar camiones..."
        noDataText="No hay camiones registrados."
      />
    </div>
  );
});

export default CamionesPanel;
