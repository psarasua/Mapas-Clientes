// DiasEntregaPanel.jsx
// Panel principal para la gestión de días de entrega.
// Permite ver, crear, editar y eliminar días, mostrando la lista y el formulario correspondiente.
// Maneja el estado y la lógica de interacción de la vista de días de entrega.

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { apiFetch } from "../../services/api";
import DiaEntregaFormulario from "./DiaEntregaFormulario";
import TablaPanel from "../ui/TablaPanel";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { Button } from "react-bootstrap";

const DiasEntregaPanel = React.memo(function DiasEntregaPanel() {
  const [dias, setDias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ descripcion: "" });
  const [editId, setEditId] = useState(null);

  const fetchDias = useCallback(async () => {
    setLoading(true);
    const data = await apiFetch("/dias_entrega");
    setDias(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDias();
  }, [fetchDias]);

  const handleDelete = async (id) => {
    await apiFetch(`/dias_entrega/${id}`, { method: "DELETE" });
    fetchDias();
  };

  const handleEdit = (dia) => {
    setForm(dia);
    setEditId(dia.id);
  };

  const handleCancelEdit = () => {
    setForm({ descripcion: "" });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await apiFetch(`/dias_entrega/${editId}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });
    } else {
      await apiFetch("/dias_entrega", {
        method: "POST",
        body: JSON.stringify(form),
      });
    }
    fetchDias();
    setForm({ descripcion: "" });
    setEditId(null);
  };

  // Columnas para TablaPanel
  const columns = [
    { name: 'ID', selector: row => row.id, sortable: true, width: '70px' },
    { name: 'Descripción', selector: row => row.descripcion, sortable: true },
    {
      name: 'Acciones',
      cell: row => (
        <div className="d-flex gap-2">
          <Button variant="outline-warning" size="sm" title={`Editar día de entrega ${row.descripcion}`} aria-label={`Editar día de entrega ${row.descripcion}`} onClick={() => handleEdit(row)}>
            <FaPencilAlt aria-hidden="true" />
          </Button>
          <Button variant="outline-danger" size="sm" title={`Eliminar día de entrega ${row.descripcion}`} aria-label={`Eliminar día de entrega ${row.descripcion}`} onClick={() => handleDelete(row.id)}>
            <FaTrash aria-hidden="true" />
          </Button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '120px',
    },
  ];

  const diasMemo = useMemo(() => dias, [dias]);

  return (
    <div className="container my-4" style={{ maxWidth: 900 }}>
      <h2 className="text-center mb-4 mt-3" id="dias-entrega-titulo" tabIndex={0}>
        Días de Entrega
      </h2>
      <DiaEntregaFormulario
        form={form}
        setForm={setForm}
        handleSubmit={handleSubmit}
        editId={editId}
        handleCancelEdit={handleCancelEdit}
      />
      <TablaPanel
        columns={columns}
        data={diasMemo}
        loading={loading}
        title=""
        searchPlaceholder="Buscar días de entrega..."
        noDataText="No hay días de entrega registrados."
      />
    </div>
  );
});

export default DiasEntregaPanel;
