import React from "react";
import SelectorCoordenadas from "./SelectorCoordenadas";

const ClientesTableModalEditar = ({
  showEditModal,
  clienteEdit,
  setShowEditModal,
  setClienteEdit,
  fetchClientes,
  supabase,
}) => {
  if (!showEditModal || !clienteEdit) return null;

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
              <h5 className="modal-title">Editar Cliente</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setShowEditModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const { error } = await supabase
                    .from("clientes")
                    .update(clienteEdit)
                    .eq("id", clienteEdit.id);
                  if (!error) {
                    fetchClientes();
                    setShowEditModal(false);
                  }
                }}
              >
                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label className="form-label d-flex align-items-center">
                      <i className="bi bi-upc me-2"></i>
                      Código Alternativo
                    </label>
                    <input
                      className="form-control"
                      value={clienteEdit.codigo_alternativo || ""}
                      onChange={(e) =>
                        setClienteEdit({
                          ...clienteEdit,
                          codigo_alternativo: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label className="form-label d-flex align-items-center">
                      <i className="bi bi-person-fill me-2"></i>
                      Nombre
                    </label>
                    <input
                      className="form-control"
                      value={clienteEdit.nombre || ""}
                      onChange={(e) =>
                        setClienteEdit({
                          ...clienteEdit,
                          nombre: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label className="form-label d-flex align-items-center">
                      <i className="bi bi-briefcase-fill me-2"></i>
                      Razón
                    </label>
                    <input
                      className="form-control"
                      value={clienteEdit.razon || ""}
                      onChange={(e) =>
                        setClienteEdit({
                          ...clienteEdit,
                          razon: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label className="form-label d-flex align-items-center">
                      <i className="bi bi-geo-alt-fill me-2"></i>
                      Dirección
                    </label>
                    <input
                      className="form-control"
                      value={clienteEdit.direccion || ""}
                      onChange={(e) =>
                        setClienteEdit({
                          ...clienteEdit,
                          direccion: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label className="form-label d-flex align-items-center">
                      <i className="bi bi-telephone-fill me-2"></i>
                      Teléfono
                    </label>
                    <input
                      className="form-control"
                      value={clienteEdit.telefono || ""}
                      onChange={(e) =>
                        setClienteEdit({
                          ...clienteEdit,
                          telefono: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label className="form-label d-flex align-items-center">
                      <i className="bi bi-card-text me-2"></i>
                      RUT
                    </label>
                    <input
                      className="form-control"
                      value={clienteEdit.rut || ""}
                      onChange={(e) =>
                        setClienteEdit({
                          ...clienteEdit,
                          rut: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label className="form-label d-flex align-items-center">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      Activo
                    </label>
                    <select
                      className="form-select"
                      value={clienteEdit.activo ? "true" : "false"}
                      onChange={(e) =>
                        setClienteEdit({
                          ...clienteEdit,
                          activo: e.target.value === "true",
                        })
                      }
                    >
                      <option value="true">Sí</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div className="mb-3 col-md-6">
                    <label className="form-label d-flex align-items-center">
                      <i className="bi bi-geo me-2"></i>
                      Coordenada X (Longitud)
                    </label>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      value={clienteEdit.x || ""}
                      onChange={e =>
                        setClienteEdit({
                          ...clienteEdit,
                          x: e.target.value
                        })
                      }
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
                      value={clienteEdit.y || ""}
                      onChange={e =>
                        setClienteEdit({
                          ...clienteEdit,
                          y: e.target.value
                        })
                      }
                    />
                  </div>
                  <div className="mb-3 col-12">
                    <label className="form-label d-flex align-items-center">
                      <i className="bi bi-map me-2"></i>
                      Seleccionar ubicación en el mapa
                    </label>
                    <SelectorCoordenadas
                      value={{ x: clienteEdit.x, y: clienteEdit.y }}
                      onChange={({ x, y }) =>
                        setClienteEdit({
                          ...clienteEdit,
                          x,
                          y,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="text-end">
                  <button type="submit" className="btn btn-primary">
                    Guardar Cambios
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
        onClick={() => setShowEditModal(false)}
      ></div>
    </>
  );
};

export default ClientesTableModalEditar;