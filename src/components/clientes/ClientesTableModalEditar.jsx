import React, { useEffect, useState } from "react";
import SelectorCoordenadas from "./SelectorCoordenadas";

const camposVacios = {
  codigo_alternativo: "",
  nombre: "",
  razon: "",
  direccion: "",
  telefono: "",
  rut: "",
  activo: true,
  x: "",
  y: "",
};

const ClientesTableModalEditar = ({
  showEditModal,
  clienteEdit,
  setShowEditModal,
  setClienteEdit,
  fetchClientes,
  supabase,
}) => {
  // Detectar modo
  const esAlta = !clienteEdit;

  // Estado local del formulario
  const [form, setForm] = useState(esAlta ? camposVacios : clienteEdit);

  // Sincronizar cuando cambia clienteEdit o se abre el modal
  useEffect(() => {
    setForm(esAlta ? camposVacios : clienteEdit);
  }, [clienteEdit, showEditModal]);

  if (!showEditModal) return null;

  const handleChange = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    if (!esAlta && setClienteEdit) {
      setClienteEdit((prev) => ({ ...prev, [campo]: valor }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let error = null;
    if (esAlta) {
      ({ error } = await supabase.from("clientes").insert([{ ...form, activo: true }]));
    } else {
      ({ error } = await supabase.from("clientes").update(form).eq("id", form.id));
    }
    if (!error) {
      fetchClientes();
      setShowEditModal(false);
      if (setClienteEdit) setClienteEdit(null);
    }
  };

  return (
    <>
      <div
        className="modal fade show"
        style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{esAlta ? "Crear Cliente" : "Editar Cliente"}</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => {
                  setShowEditModal(false);
                  if (setClienteEdit) setClienteEdit(null);
                }}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label className="form-label d-flex align-items-center">
                      <i className="bi bi-upc me-2"></i>
                      Código Alternativo
                    </label>
                    <input
                      className="form-control"
                      value={form.codigo_alternativo || ""}
                      onChange={(e) => handleChange("codigo_alternativo", e.target.value)}
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label className="form-label d-flex align-items-center">
                      <i className="bi bi-person-fill me-2"></i>
                      Nombre
                    </label>
                    <input
                      className="form-control"
                      value={form.nombre || ""}
                      onChange={(e) => handleChange("nombre", e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label className="form-label d-flex align-items-center">
                      <i className="bi bi-briefcase-fill me-2"></i>
                      Razón
                    </label>
                    <input
                      className="form-control"
                      value={form.razon || ""}
                      onChange={(e) => handleChange("razon", e.target.value)}
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label className="form-label d-flex align-items-center">
                      <i className="bi bi-geo-alt-fill me-2"></i>
                      Dirección
                    </label>
                    <input
                      className="form-control"
                      value={form.direccion || ""}
                      onChange={(e) => handleChange("direccion", e.target.value)}
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label className="form-label d-flex align-items-center">
                      <i className="bi bi-telephone-fill me-2"></i>
                      Teléfono
                    </label>
                    <input
                      className="form-control"
                      value={form.telefono || ""}
                      onChange={(e) => handleChange("telefono", e.target.value)}
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label className="form-label d-flex align-items-center">
                      <i className="bi bi-card-text me-2"></i>
                      RUT
                    </label>
                    <input
                      className="form-control"
                      value={form.rut || ""}
                      onChange={(e) => handleChange("rut", e.target.value)}
                    />
                  </div>
                  {!esAlta && (
                    <div className="mb-3 col-md-6">
                      <label className="form-label d-flex align-items-center">
                        <i className="bi bi-check-circle-fill me-2"></i>
                        Activo
                      </label>
                      <select
                        className="form-select"
                        value={form.activo ? "true" : "false"}
                        onChange={(e) => handleChange("activo", e.target.value === "true")}
                      >
                        <option value="true">Sí</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                  )}
                  <div className="mb-3 col-md-6">
                    <label className="form-label d-flex align-items-center">
                      <i className="bi bi-geo me-2"></i>
                      Coordenada X (Longitud)
                    </label>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      value={form.x || ""}
                      onChange={e => handleChange("x", e.target.value)}
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label className="form-label d-flex align-items-center">
                      <i className="bi bi-geo me-2"></i>
                      Coordenada Y (Latitud)
                    </label>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      value={form.y || ""}
                      onChange={e => handleChange("y", e.target.value)}
                    />
                  </div>
                  <div className="mb-3 col-12">
                    <label className="form-label d-flex align-items-center">
                      <i className="bi bi-map me-2"></i>
                      Seleccionar ubicación en el mapa
                    </label>
                    <SelectorCoordenadas
                      value={{ x: form.x, y: form.y }}
                      onChange={({ x, y }) => handleChange("x", x) || handleChange("y", y)}
                    />
                  </div>
                </div>
                <div className="text-end">
                  <button type="submit" className="btn btn-primary">
                    {esAlta ? "Crear Cliente" : "Guardar Cambios"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1040 }}
        onClick={() => {
          setShowEditModal(false);
          if (setClienteEdit) setClienteEdit(null);
        }}
      ></div>
    </>
  );
};

export default ClientesTableModalEditar;