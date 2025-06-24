// ClientesTablaInteractiva.jsx
// Tabla interactiva para gestionar clientes con paginación, edición, eliminación y visualización en mapa.
// Utiliza react-table y permite acciones sobre cada fila.

import React, { useMemo, useCallback } from "react";
import { flexRender } from "@tanstack/react-table";

// Envuelve el componente con React.memo para evitar renders innecesarios si las props no cambian
const ClientesTablaInteractiva = React.memo(function ClientesTablaInteractiva({
  loading,
  table,
  columns,
  handleEdit,
  handleDelete,
  setMapCoords,
  setShowModal,
}) {
  // Memoiza los handlers de paginación para evitar recrearlos en cada render
  const handlePrevPage = useCallback(() => table.previousPage(), [table]);
  const handleNextPage = useCallback(() => table.nextPage(), [table]);
  const handlePageSizeChange = useCallback(
    (e) => table.setPageSize(Number(e.target.value)),
    [table]
  );

  // Memoiza el renderizado de la tabla para evitar renders innecesarios
  const tableContent = useMemo(
    () => (
      <div className="table-responsive flex-grow-1">
        <table
          className="table table-striped table-hover align-middle w-100"
          role="table"
          aria-label="Tabla de clientes"
        >
          <thead className="table-dark">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    tabIndex={0}
                    aria-label={typeof header.column.columnDef.header === "string"
                      ? header.column.columnDef.header
                      : undefined}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  No se encontraron resultados
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    ),
    [table, columns]
  );

  // Memoiza el renderizado de los controles de paginación
  const paginationControls = useMemo(
    () => (
      <nav
        className="d-flex justify-content-between align-items-center mt-3"
        aria-label="Paginación de la tabla de clientes"
      >
        <div>
          Página{" "}
          <strong>
            {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </strong>
        </div>
        <div>
          <button
            className="btn btn-outline-primary btn-sm me-2"
            onClick={handlePrevPage}
            disabled={!table.getCanPreviousPage()}
            aria-label="Página anterior"
          >
            {"<"}
          </button>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={handleNextPage}
            disabled={!table.getCanNextPage()}
            aria-label="Página siguiente"
          >
            {">"}
          </button>
        </div>
        <label htmlFor="pageSizeSelect" className="visually-hidden">
          Seleccionar cantidad de filas por página
        </label>
        <select
          id="pageSizeSelect"
          className="form-select form-select-sm w-auto"
          value={table.getState().pagination.pageSize}
          onChange={handlePageSizeChange}
          aria-label="Seleccionar cantidad de filas por página"
        >
          {[20, 50, 100].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Mostrar {pageSize}
            </option>
          ))}
        </select>
      </nav>
    ),
    [table, handlePrevPage, handleNextPage, handlePageSizeChange]
  );

  // Render principal
  return (
    <div className="flex-grow-1 d-flex flex-column px-3">
      {loading ? (
        <div className="text-center py-4 flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="spinner-border text-primary" role="status" aria-live="polite">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <>
          {tableContent}
          {paginationControls}
        </>
      )}
    </div>
  );
});

export default ClientesTablaInteractiva;
