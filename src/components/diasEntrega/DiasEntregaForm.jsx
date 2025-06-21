import React, { useCallback, useMemo } from "react";

const DiasEntregaForm = React.memo(function DiasEntregaForm({ form, editId, onChange, onSubmit }) {
  // Memoiza el handler de cambio de input
  const handleInputChange = useCallback(
    (e) => {
      onChange({ ...form, descripcion: e.target.value });
    },
    [form, onChange]
  );

  // Memoiza el texto del botón
  const buttonText = useMemo(
    () => (editId ? "Actualizar" : "Agregar"),
    [editId]
  );

  return (
    <form className="row g-3 mb-4" onSubmit={onSubmit}>
      <div className="col-md-8">
        <input
          className="form-control"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="col-md-4">
        <button className="btn btn-primary w-100" type="submit">
          {buttonText}
        </button>
      </div>
    </form>
  );
});

export default DiasEntregaForm;