import React, { useCallback } from "react";
import SelectorCoordenadas from "./SelectorCoordenadas";

// Envuelve el componente con React.memo para evitar renders innecesarios si las props no cambian
const ClienteEditModal = React.memo(function ClienteEditModal({
  showEditModal,
  clienteEdit,
  setClienteEdit,
  onClose,
  fetchClientes,
}) {
  // Memoiza el handler de cierre
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Memoiza el handler de cambio de campos del formulario
  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setClienteEdit((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [setClienteEdit]
  );

  // Memoiza el handler para el cambio de coordenadas
  const handleCoordsChange = useCallback(
    ({ x, y }) => {
      setClienteEdit((prev) => ({
        ...prev,
        x,
        y,
      }));
    },
    [setClienteEdit]
  );

  // Memoiza el submit del formulario
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const { error } = await window.supabase
        .from("clientes")
        .update(clienteEdit)
        .eq("id", clienteEdit.id);
      if (!error) {
        fetchClientes();
        onClose();
      }
    },
    [clienteEdit, fetchClientes, onClose]
  );

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
                onClick={handleClose}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Campos del formulario de edición */}
                  <div className="mb-3 col-md-6">
                    <label className="form-label">Código Alternativo</label>
                    <input
                      className="form-control"
                      name="codigo_alternativo"
                      value={clienteEdit.codigo_alternativo || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label className="form-label">Nombre</label>
                    <input
                      className="form-control"
                      name="nombre"
                      value={clienteEdit.nombre || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label className="form-label">Razón</label>
                    <input
                      className="form-control"
                      name="razon"
                      value={clienteEdit.razon || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label className="form-label">Dirección</label>
                    <input
                      className="form-control"
                      name="direccion"
                      value={clienteEdit.direccion || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label className="form-label">Teléfono</label>
                    <input
                      className="form-control"
                      name="telefono"
                      value={clienteEdit.telefono || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label className="form-label">RUT</label>
                    <input
                      className="form-control"
                      name="rut"
                      value={clienteEdit.rut || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label className="form-label">Activo</label>
                    <select
                      className="form-select"
                      name="activo"
                      value={clienteEdit.activo ? "true" : "false"}
                      onChange={e =>
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
                      name="x"
                      value={clienteEdit.x || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label className="form-label">Coordenada Y (Latitud)</label>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      name="y"
                      value={clienteEdit.y || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3 col-12">
                    <label className="form-label">Seleccionar ubicación en el mapa</label>
                    <SelectorCoordenadas
                      value={{ x: clienteEdit.x, y: clienteEdit.y }}
                      onChange={handleCoordsChange}
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
        onClick={handleClose}
      ></div>
    </>
  );
});

export default ClienteEditModal;