// ClientesAsignadosLista.jsx
// Lista interactiva de clientes asignados a un camión en un día.
// Permite eliminar clientes asignados y agregar nuevos mediante búsqueda.
// Incluye mensajes y controles accesibles.

import React, { useMemo, useCallback } from "react";

const ClientesAsignadosLista = React.memo(function ClientesAsignadosLista({
  clientesAsignados,
  eliminarCliente,
  busqueda,
  setBusqueda,
  clientesFiltrados,
  agregarCliente,
}) {
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

  // Memoiza la lista de clientes asignados
  const asignadosList = useMemo(
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
        <li className="list-group-item text-muted">
          Sin clientes asignados
        </li>
      ),
    [clientesAsignados, handleEliminarCliente]
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
    <div className="mb-3">
      <label className="form-label" htmlFor="clientes_asignados_list">
        Clientes asignados:
      </label>
      <ul
        className="list-group mb-2"
        id="clientes_asignados_list"
        role="list"
        aria-label="Lista de clientes asignados"
      >
        {asignadosList}
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
        <ul className="list-group" role="list" aria-label="Resultados de búsqueda de clientes">
          {filtradosList}
        </ul>
      )}
    </div>
  );
});

export default ClientesAsignadosLista;
