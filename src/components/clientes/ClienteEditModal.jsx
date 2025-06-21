import React from "react";
import SelectorCoordenadas from "./SelectorCoordenadas";

function ClienteEditModal({
  showEditModal,
  clienteEdit,
  setClienteEdit,
  onClose,
  fetchClientes,
}) {
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
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const { error } = await window.supabase
                    .from("clientes")
                    .update(clienteEdit)
                    .eq("id", clienteEdit.id);
                  if (!error) {
                    fetchClientes();
                    onClose();
                  }
                }}
              >
                <div className="row">
                  {/* Campos del formulario de edición */}
                  <div className="mb-3 col-md-6">
                    <label className="form-label">Código Alternativo</label>
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
                    <label className="form-label">Nombre</label>
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
                    <label className="form-label">Razón</label>
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
                    <label className="form-label">Dirección</label>
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
                    <label className="form-label">Teléfono</label>
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
                    <label className="form-label">RUT</label>
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
                    <label className="form-label">Activo</label>
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
                    <label className="form-label">Coordenada X (Longitud)</label>
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
                    <label className="form-label">Coordenada Y (Latitud)</label>
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
                    <label className="form-label">Seleccionar ubicación en el mapa</label>
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
        onClick={onClose}
      ></div>
    </>
  );
}

export default ClienteEditModal;