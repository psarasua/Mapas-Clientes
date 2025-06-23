import React, { useCallback, useMemo } from "react";

const DiaEntregaFormulario = React.memo(function DiaEntregaFormulario({
  form,
  editId,
  onChange,
  onSubmit,
  ariaLabelledby = "dias-entrega-titulo",
}) {
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
    <form
      className="row g-3 mb-4"
      onSubmit={onSubmit}
      aria-labelledby={ariaLabelledby}
      role="form"
    >
      <div className="col-md-8">
        <label htmlFor="descripcion-dia" className="form-label visually-hidden">
          Descripción del día de entrega
        </label>
        <input
          id="descripcion-dia"
          className="form-control"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleInputChange}
          required
          aria-required="true"
          aria-label="Descripción del día de entrega"
          autoComplete="off"
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

export default DiaEntregaFormulario;