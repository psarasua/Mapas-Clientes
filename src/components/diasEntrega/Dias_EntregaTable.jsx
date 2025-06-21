import React, { useEffect, useState, useCallback, useMemo } from "react";
import supabase from "../../supabaseClient";
import DiasEntregaForm from "./DiasEntregaForm";
import DiasEntregaList from "./DiasEntregaList";

// Envuelve el componente con React.memo para evitar renders innecesarios si las props no cambian
const DiasEntregaTable = React.memo(function DiasEntregaTable() {
  const [dias, setDias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ descripcion: "" });
  const [editId, setEditId] = useState(null);

  // Memoiza la función para obtener los días de entrega
  const fetchDias = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("dias_entrega")
      .select("*")
      .order("id", { ascending: true });
    if (!error) setDias(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDias();
  }, [fetchDias]);

  // Memoiza el submit del formulario
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

  // Memoiza el handler de eliminación
  const handleDelete = useCallback(
    async (id) => {
      if (window.confirm("¿Seguro que deseas eliminar este día?")) {
        await supabase.from("dias_entrega").delete().eq("id", id);
        fetchDias();
      }
    },
    [fetchDias]
  );

  // Memoiza el handler de edición
  const handleEdit = useCallback(
    (dia) => {
      setForm({ descripcion: dia.descripcion });
      setEditId(dia.id);
    },
    []
  );

  // Memoiza la lista de días para evitar renders innecesarios en DiasEntregaList
  const diasMemo = useMemo(() => dias, [dias]);

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
        dias={diasMemo}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
});

export default DiasEntregaTable;