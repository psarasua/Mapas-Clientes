import React, { useMemo, useCallback } from "react";

// Lista de clientes asignados y buscador/agregador de clientes
const ClientesAsignadosList = React.memo(function ClientesAsignadosList({
  clientesAsignados,
  eliminarCliente,
  busqueda,
  setBusqueda,
  clientesFiltrados,
  agregarCliente,
}) {
  // Memoiza la lista de clientes asignados
  const asignadosList = useMemo(
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
        <li className="list-group-item text-muted">
          Sin clientes asignados
        </li>
      ),
    [clientesAsignados, eliminarCliente]
  );

  // Memoiza la lista de resultados de búsqueda
  const filtradosList = useMemo(() => {
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

  // Memoiza los handlers para evitar recrearlos en cada render
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
    <div className="mb-3">
      <label className="form-label">Clientes asignados:</label>
      <ul className="list-group mb-2">{asignadosList}</ul>
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
        <ul className="list-group">{filtradosList}</ul>
      )}
    </div>
  );
});

export default ClientesAsignadosList;