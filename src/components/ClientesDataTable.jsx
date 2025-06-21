import React from "react";
import { flexRender } from "@tanstack/react-table";

function ClientesDataTable({
  loading,
  table,
  columns,
  handleEdit,
  handleDelete,
  setMapCoords,
  setShowModal,
}) {
  return (
    <div className="flex-grow-1 d-flex flex-column px-3">
      {loading ? (
        <div className="text-center py-4 flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="table-responsive flex-grow-1">
            <table className="table table-striped table-hover align-middle w-100">
              <thead className="table-dark">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} scope="col">
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
          {/* Controles de paginación */}
          <div className="d-flex justify-content-between align-items-center mt-3">
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
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {"<"}
              </button>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {">"}
              </button>
            </div>
            <select
              className="form-select form-select-sm w-auto"
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[20, 50, 100].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Mostrar {pageSize}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  );
}

export default ClientesDataTable;