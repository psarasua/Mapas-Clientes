import React, { useMemo, useCallback } from "react";

// Envuelve el componente con React.memo para evitar renders innecesarios si las props no cambian
const CamionDiaModalFormulario = React.memo(function CamionDiaModalFormulario({
  editId,
  form,
  camiones,
  dias,
  handleChange,
  handleSubmit,
  closeModal,
  clientesAsignados,
  eliminarCliente,
  busqueda,
  setBusqueda,
  clientesFiltrados,
  agregarCliente,
  mensaje,
  // Props de accesibilidad
  role = "dialog",
  ariaModal = "true",
  ariaLabelledby = "modal-titulo",
}) {
  // Memoiza la lista de opciones de camiones
  const camionesOptions = useMemo(
    () =>
      camiones.map((c) => (
        <option key={c.id} value={c.id}>
          {c.descripcion}
        </option>
      )),
    [camiones]
  );

  // Memoiza la lista de opciones de días
  const diasOptions = useMemo(
    () =>
      dias.map((d) => (
        <option key={d.id} value={d.id}>
          {d.descripcion}
        </option>
      )),
    [dias]
  );

  // Memoiza los handlers para evitar que cambien en cada render
  const handleEliminarCliente = useCallback(
    (id) => eliminarCliente(id),
    [eliminarCliente]
  );
  const handleAgregarCliente = useCallback(
    (c) => agregarCliente(c),
    [agregarCliente]
  );
  const handleBusquedaChange = useCallback(
    (e) => setBusqueda(e.target.value),
    [setBusqueda]
  );

  // Memoiza la lista de clientes asignados
  const clientesAsignadosList = useMemo(
    () =>
      clientesAsignados.length > 0 ? (
        clientesAsignados.map((c) => (
          <li
            key={c.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>{c.nombre}</span>
            <button
              className="btn btn-sm btn-danger"
              type="button"
              onClick={() => handleEliminarCliente(c.id)}
              aria-label={`Eliminar cliente ${c.nombre}`}
            >
              Eliminar
            </button>
          </li>
        ))
      ) : (
        <li className="list-group-item text-muted">Sin clientes asignados</li>
      ),
    [clientesAsignados, handleEliminarCliente]
  );

  // Memoiza la lista de resultados de búsqueda de clientes
  const clientesFiltradosList = useMemo(() => {
    if (busqueda.length === 0) return null;
    if (clientesFiltrados.length === 0)
      return (
        <li className="list-group-item text-muted">Sin resultados</li>
      );
    return clientesFiltrados.map((c) => {
      const yaAsignado = clientesAsignados.some((a) => a.id === c.id);
      return (
        <li
          key={c.id}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <span>
            {c.nombre}{" "}
            {c.razon && <span className="text-muted">({c.razon})</span>}
          </span>
          {yaAsignado ? (
            <button className="btn btn-sm btn-secondary" disabled aria-disabled="true">
              Ya asignado
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-sm btn-success"
              onClick={() => handleAgregarCliente(c)}
              aria-label={`Agregar cliente ${c.nombre}`}
            >
              Agregar
            </button>
          )}
        </li>
      );
    });
  }, [busqueda, clientesFiltrados, clientesAsignados, handleAgregarCliente]);

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ background: "rgba(0,0,0,0.3)" }}
      role={role}
      aria-modal={ariaModal}
      aria-labelledby={ariaLabelledby}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document" style={{ maxWidth: 650, margin: "auto" }}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={ariaLabelledby}>
              {editId ? "Editar" : "Agregar"} registro
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Cerrar modal"
              onClick={closeModal}
            ></button>
          </div>
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="modal-body">
              {/* Selector de camión */}
              <div className="mb-3">
                <label htmlFor="camion_id" className="form-label">
                  Camión:
                </label>
                <select
                  className="form-select"
                  id="camion_id"
                  name="camion_id"
                  value={form.camion_id}
                  onChange={handleChange}
                  required
                  disabled={!!editId}
                  aria-required="true"
                >
                  <option value="">Seleccione</option>
                  {camionesOptions}
                </select>
              </div>
              {/* Selector de día */}
              <div className="mb-3">
                <label htmlFor="dia_id" className="form-label">
                  Día:
                </label>
                <select
                  className="form-select"
                  id="dia_id"
                  name="dia_id"
                  value={form.dia_id}
                  onChange={handleChange}
                  required
                  disabled={!!editId}
                  aria-required="true"
                >
                  <option value="">Seleccione</option>
                  {diasOptions}
                </select>
              </div>
              {/* Lista de clientes asignados */}
              <div className="mb-3">
                <label className="form-label" htmlFor="clientes_asignados">
                  Clientes asignados:
                </label>
                <ul className="list-group mb-2" id="clientes_asignados">
                  {clientesAsignadosList}
                </ul>
                {/* Buscador de clientes */}
                <label htmlFor="busqueda_cliente" className="form-label visually-hidden">
                  Buscar cliente por nombre o razón social
                </label>
                <input
                  type="text"
                  className="form-control mb-2"
                  id="busqueda_cliente"
                  placeholder="Buscar cliente por nombre o razón..."
                  value={busqueda}
                  onChange={handleBusquedaChange}
                  onKeyDown={e => { if (e.key === "Enter") e.preventDefault(); }}
                  aria-label="Buscar cliente por nombre o razón social"
                  autoComplete="off"
                />
                {/* Resultados de búsqueda */}
                {busqueda.length > 0 && (
                  <ul className="list-group">{clientesFiltradosList}</ul>
                )}
              </div>
              {/* Mensaje de feedback */}
              {mensaje && (
                <div className="alert alert-info" role="status">{mensaje}</div>
              )}
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">
                {editId ? "Actualizar" : "Agregar"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

export default CamionDiaModalFormulario;