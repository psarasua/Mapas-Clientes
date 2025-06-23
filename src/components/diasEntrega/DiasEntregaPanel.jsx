import React, { useEffect, useState, useCallback, useMemo } from "react";
import supabase from "../../supabaseClient";
import DiaEntregaFormulario from "./DiaEntregaFormulario";
import DiasEntregaLista from "./DiasEntregaLista";

const DiasEntregaPanel = React.memo(function DiasEntregaPanel() {
  const [dias, setDias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ descripcion: "" });
  const [editId, setEditId] = useState(null);

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

  const diasMemo = useMemo(() => dias, [dias]);

  return (
    <div className="container my-4" style={{ maxWidth: 1200 }}>
      <h2 className="text-center mb-4 mt-3" id="dias-entrega-titulo" tabIndex={0}>
        Días de Entrega
      </h2>
      <div className="row">
        <div className="col-12 mb-4">
          <DiaEntregaFormulario
            form={form}
            editId={editId}
            onChange={setForm}
            onSubmit={handleSubmit}
            ariaLabelledby="dias-entrega-titulo"
          />
        </div>
        <div className="col-12">
          <DiasEntregaLista
            dias={diasMemo}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            ariaLabelledby="dias-entrega-titulo"
          />
        </div>
      </div>
    </div>
  );
});

export default DiasEntregaPanel;