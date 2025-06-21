import React, { useMemo, useCallback } from "react";

// Envuelve el componente con React.memo para evitar renders innecesarios si las props no cambian
const CamionDiasModal = React.memo(function CamionDiasModal({
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

  // Memoiza la lista de clientes asignados
  const clientesAsignadosList = useMemo(
    () =>
      clientesAsignados.length > 0 ? (
        clientesAsignados.map((c) => (
          <li
            key={c.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {c.nombre}
            <button
              className="btn btn-sm btn-danger"
              type="button"
              onClick={() => handleEliminarCliente(c.id)}
            >
              Eliminar
            </button>
          </li>
        ))
      ) : (
        <li className="list-group-item text-muted">Sin clientes asignados</li>
      ),
    [clientesAsignados, eliminarCliente]
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
          {c.nombre}{" "}
          {c.razon && <span className="text-muted">({c.razon})</span>}
          {yaAsignado ? (
            <button className="btn btn-sm btn-secondary" disabled>
              Ya asignado
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-sm btn-success"
              onClick={() => handleAgregarCliente(c)}
            >
              Agregar
            </button>
          )}
        </li>
      );
    });
  }, [busqueda, clientesFiltrados, clientesAsignados, agregarCliente]);

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

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ background: "rgba(0,0,0,0.3)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {editId ? "Editar" : "Agregar"} registro
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={closeModal}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Selector de camión */}
              <div className="mb-3">
                <label className="form-label">Camión:</label>
                <select
                  className="form-select"
                  name="camion_id"
                  value={form.camion_id}
                  onChange={handleChange}
                  required
                  disabled={!!editId}
                >
                  <option value="">Seleccione</option>
                  {camionesOptions}
                </select>
              </div>
              {/* Selector de día */}
              <div className="mb-3">
                <label className="form-label">Día:</label>
                <select
                  className="form-select"
                  name="dia_id"
                  value={form.dia_id}
                  onChange={handleChange}
                  required
                  disabled={!!editId}
                >
                  <option value="">Seleccione</option>
                  {diasOptions}
                </select>
              </div>
              {/* Lista de clientes asignados */}
              <div className="mb-3">
                <label className="form-label">Clientes asignados:</label>
                <ul className="list-group mb-2">{clientesAsignadosList}</ul>
                {/* Buscador de clientes */}
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Buscar cliente por nombre o razón..."
                  value={busqueda}
                  onChange={handleBusquedaChange}
                  onKeyDown={e => { if (e.key === "Enter") e.preventDefault(); }}
                />
                {/* Resultados de búsqueda */}
                {busqueda.length > 0 && (
                  <ul className="list-group">{clientesFiltradosList}</ul>
                )}
              </div>
              {/* Mensaje de feedback */}
              {mensaje && (
                <div className="alert alert-info">{mensaje}</div>
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

export default CamionDiasModal;