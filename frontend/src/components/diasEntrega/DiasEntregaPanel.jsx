// DiasEntregaPanel.jsx
// Panel principal para la gestión de días de entrega.
// Permite ver, crear, editar y eliminar días, mostrando la lista y el formulario correspondiente.
// Maneja el estado y la lógica de interacción de la vista de días de entrega.

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { apiFetch } from "../../services/api";
import DiaEntregaFormulario from "./DiaEntregaFormulario";
import DiasEntregaLista from "./DiasEntregaLista";

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
      {loading ? (
        <div className="text-center py-4">Cargando días de entrega...</div>
      ) : (
        <DiasEntregaLista
          dias={diasMemo}
          loading={loading}
          onDelete={handleDelete}
          onEdit={handleEdit}
          ariaLabelledby="dias-entrega-titulo"
        />
      )}
    </div>
  );
});

export default DiasEntregaPanel;
