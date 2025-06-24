import React, { useEffect, useState, useCallback, useMemo } from "react";
// import supabase from "../../supabaseClient";
import DiaEntregaFormulario from "./DiaEntregaFormulario";
import DiasEntregaLista from "./DiasEntregaLista";

const API_URL = "http://localhost:3001/api";

const DiasEntregaPanel = React.memo(function DiasEntregaPanel() {
  const [dias, setDias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ descripcion: "" });
  const [editId, setEditId] = useState(null);

  const fetchDias = useCallback(async () => {
    setLoading(true);
    const response = await fetch(`${API_URL}/dias`);
    const data = await response.json();
    setDias(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDias();
  }, [fetchDias]);

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/dias/${id}`, {
      method: "DELETE",
    });
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
      await fetch(`${API_URL}/dias/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
    } else {
      await fetch(`${API_URL}/dias`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
    }
    setForm({ descripcion: "" });
    setEditId(null);
    fetchDias();
  };

  const diasMemo = useMemo(() => dias, [dias]);

  return (
    <div>
      <h1>Días de Entrega</h1>
      <DiaEntregaFormulario
        form={form}
        setForm={setForm}
        handleSubmit={handleSubmit}
        editId={editId}
        handleCancelEdit={handleCancelEdit}
      />
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <DiasEntregaLista
          dias={diasMemo}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      )}
    </div>
  );
});

export default DiasEntregaPanel;
