import React from "react";

function DiasEntregaForm({ form, editId, onChange, onSubmit }) {
  return (
    <form className="row g-3 mb-4" onSubmit={onSubmit}>
      <div className="col-md-8">
        <input
          className="form-control"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={e => onChange({ ...form, descripcion: e.target.value })}
          required
        />
      </div>
      <div className="col-md-4">
        <button className="btn btn-primary w-100" type="submit">
          {editId ? "Actualizar" : "Agregar"}
        </button>
      </div>
    </form>
  );
}

export default DiasEntregaForm;