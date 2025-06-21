import React, { useEffect, useState, useCallback } from "react";
import supabase from "../../supabaseClient";
import DiasEntregaForm from "./DiasEntregaForm";
import DiasEntregaList from "./DiasEntregaList";

export default function DiasEntregaTable() {
  const [dias, setDias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ descripcion: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchDias();
  }, []);

  const fetchDias = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("dias_entrega")
      .select("*")
      .order("id", { ascending: true });
    if (!error) setDias(data);
    setLoading(false);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (editId) {
        await supabase.from("dias_entrega").update(form).eq("id", editId);
      } else {
        await supabase.from("dias_entrega").insert([form]);
      }
      setForm({ descripcion: "" });
      setEditId(null);
      fetchDias();
    },
    [editId, form, fetchDias]
  );

  const handleDelete = useCallback(
    async (id) => {
      if (window.confirm("¿Seguro que deseas eliminar este día?")) {
        await supabase.from("dias_entrega").delete().eq("id", id);
        fetchDias();
      }
    },
    [fetchDias]
  );

  const handleEdit = useCallback(
    (dia) => {
      setForm({ descripcion: dia.descripcion });
      setEditId(dia.id);
    },
    []
  );

  return (
    <div className="container mt-4">
      <h2>Días de Entrega</h2>
      <DiasEntregaForm
        form={form}
        editId={editId}
        onChange={setForm}
        onSubmit={handleSubmit}
      />
      <DiasEntregaList
        dias={dias}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}