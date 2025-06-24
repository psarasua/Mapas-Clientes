// CamionDiaModalFormulario.jsx
// Modal con formulario para crear o editar la asignación de un camión a un día.
// Permite seleccionar camión, día y gestionar clientes asignados.
// Incluye validaciones y mensajes informativos.

import React, { useMemo, useCallback } from "react";
import ClientesAsignadosLista from "./ClientesAsignadosLista";

const CamionDiaModalFormulario = React.memo(function CamionDiaModalFormulario({
  editId,
  form = {},
  camiones = [],
  dias = [],
  handleChange = () => {},
  handleSubmit = () => {},
  closeModal = () => {},
  clientesAsignados = [],
  eliminarCliente = () => {},
  busqueda = "",
  setBusqueda = () => {},
  clientesFiltrados = [],
  agregarCliente = () => {},
  mensaje = "",
  role = "dialog",
  ariaModal = "true",
  ariaLabelledby = "modal-titulo",
}) {
  const onFormChange = useCallback(
    (e) => handleChange(e),
    [handleChange]
  );
  const onFormSubmit = useCallback(
    (e) => {
      e.preventDefault();
      handleSubmit();
    },
    [handleSubmit]
  );
  return (
    <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.3)" }} role={role} aria-modal={ariaModal} aria-labelledby={ariaLabelledby}>
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={ariaLabelledby}>{editId ? "Editar" : "Nuevo"} Camión Día</h5>
            <button type="button" className="btn-close" aria-label="Cerrar modal" onClick={closeModal}></button>
          </div>
          <form onSubmit={onFormSubmit}>
            <div className="modal-body">
              {mensaje && <div className="alert alert-info">{mensaje}</div>}
              <div className="mb-3">
                <label className="form-label">Camión</label>
                <select className="form-select" name="camion_id" value={form.camion_id || ""} onChange={onFormChange} required>
                  <option value="">Seleccione un camión</option>
                  {camiones.map((c) => (
                    <option key={c.id} value={c.id}>{c.descripcion}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Día</label>
                <select className="form-select" name="dia_id" value={form.dia_id || ""} onChange={onFormChange} required>
                  <option value="">Seleccione un día</option>
                  {dias.map((d) => (
                    <option key={d.id} value={d.id}>{d.descripcion}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Clientes asignados</label>
                <ClientesAsignadosLista
                  clientesAsignados={clientesAsignados}
                  eliminarCliente={eliminarCliente}
                  busqueda={busqueda}
                  setBusqueda={setBusqueda}
                  clientesFiltrados={clientesFiltrados}
                  agregarCliente={agregarCliente}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
              <button type="submit" className="btn btn-primary">{editId ? "Guardar cambios" : "Crear"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

export default CamionDiaModalFormulario;
