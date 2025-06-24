import React, { useEffect, useState } from "react";
import SelectorCoordenadasMapa from "./SelectorCoordenadasMapa";

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

const ClientesPanelModalEditar = ({
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
  if (!form) {
    return (
      <div className="alert alert-warning text-center my-4" role="status" aria-live="polite">
        No hay datos del cliente para mostrar o editar.
      </div>
    );
  }

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
        style={{ display: "block", background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cliente-modal-titulo"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document" style={{ maxWidth: 600, margin: "auto" }}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="cliente-modal-titulo">
                {esAlta ? "Crear Cliente" : "Editar Cliente"}
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Cerrar modal"
                onClick={() => {
                  setShowEditModal(false);
                  if (setClienteEdit) setClienteEdit(null);
                }}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} autoComplete="off">
                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label htmlFor="codigo_alternativo" className="form-label d-flex align-items-center">
                      <i className="bi bi-upc me-2"></i>
                      Código Alternativo
                    </label>
                    <input
                      id="codigo_alternativo"
                      className="form-control"
                      value={form.codigo_alternativo || ""}
                      onChange={(e) => handleChange("codigo_alternativo", e.target.value)}
                      aria-label="Código alternativo"
                      autoComplete="off"
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="nombre" className="form-label d-flex align-items-center">
                      <i className="bi bi-person-fill me-2"></i>
                      Nombre
                    </label>
                    <input
                      id="nombre"
                      className="form-control"
                      value={form.nombre || ""}
                      onChange={(e) => handleChange("nombre", e.target.value)}
                      required
                      aria-required="true"
                      aria-label="Nombre"
                      autoComplete="off"
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="razon" className="form-label d-flex align-items-center">
                      <i className="bi bi-briefcase-fill me-2"></i>
                      Razón
                    </label>
                    <input
                      id="razon"
                      className="form-control"
                      value={form.razon || ""}
                      onChange={(e) => handleChange("razon", e.target.value)}
                      aria-label="Razón"
                      autoComplete="off"
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="direccion" className="form-label d-flex align-items-center">
                      <i className="bi bi-geo-alt-fill me-2"></i>
                      Dirección
                    </label>
                    <input
                      id="direccion"
                      className="form-control"
                      value={form.direccion || ""}
                      onChange={(e) => handleChange("direccion", e.target.value)}
                      aria-label="Dirección"
                      autoComplete="off"
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="telefono" className="form-label d-flex align-items-center">
                      <i className="bi bi-telephone-fill me-2"></i>
                      Teléfono
                    </label>
                    <input
                      id="telefono"
                      className="form-control"
                      value={form.telefono || ""}
                      onChange={(e) => handleChange("telefono", e.target.value)}
                      aria-label="Teléfono"
                      autoComplete="off"
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="rut" className="form-label d-flex align-items-center">
                      <i className="bi bi-card-text me-2"></i>
                      RUT
                    </label>
                    <input
                      id="rut"
                      className="form-control"
                      value={form.rut || ""}
                      onChange={(e) => handleChange("rut", e.target.value)}
                      aria-label="RUT"
                      autoComplete="off"
                    />
                  </div>
                  {!esAlta && (
                    <div className="mb-3 col-md-6">
                      <label htmlFor="activo" className="form-label d-flex align-items-center">
                        <i className="bi bi-check-circle-fill me-2"></i>
                        Activo
                      </label>
                      <select
                        id="activo"
                        className="form-select"
                        value={form.activo ? "true" : "false"}
                        onChange={(e) => handleChange("activo", e.target.value === "true")}
                        aria-label="Activo"
                      >
                        <option value="true">Sí</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                  )}
                  <div className="mb-3 col-md-6">
                    <label htmlFor="coordenada_x" className="form-label d-flex align-items-center">
                      <i className="bi bi-geo me-2"></i>
                      Coordenada X (Longitud)
                    </label>
                    <input
                      id="coordenada_x"
                      type="number"
                      step="any"
                      className="form-control"
                      value={form.x || ""}
                      onChange={e => handleChange("x", e.target.value)}
                      aria-label="Coordenada X (Longitud)"
                      autoComplete="off"
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="coordenada_y" className="form-label d-flex align-items-center">
                      <i className="bi bi-geo me-2"></i>
                      Coordenada Y (Latitud)
                    </label>
                    <input
                      id="coordenada_y"
                      type="number"
                      step="any"
                      className="form-control"
                      value={form.y || ""}
                      onChange={e => handleChange("y", e.target.value)}
                      aria-label="Coordenada Y (Latitud)"
                      autoComplete="off"
                    />
                  </div>
                  <div className="mb-3 col-12">
                    <label htmlFor="selector-coordenadas" className="form-label d-flex align-items-center">
                      <i className="bi bi-map me-2"></i>
                      Seleccionar ubicación en el mapa
                    </label>
                    <SelectorCoordenadasMapa
                      id="selector-coordenadas"
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
        aria-hidden="true"
        onClick={() => {
          setShowEditModal(false);
          if (setClienteEdit) setClienteEdit(null);
        }}
      ></div>
    </>
  );
};

export default ClientesPanelModalEditar;