// ClientesTabla.jsx
// Tabla que muestra la lista de clientes con sus datos principales.
// Utiliza react-table para el renderizado y flexibilidad de columnas.

import React from "react";
import { flexRender } from "@tanstack/react-table";

function ClientesPanelContent({ table }) {
  // Obtener las columnas visibles desde la tabla
  const visibleColumns = table.getVisibleLeafColumns ? table.getVisibleLeafColumns() : [];
  return (
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
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getPaginationRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={visibleColumns.length || 1} className="text-center py-4">
                No se encontraron resultados
              </td>
            </tr>
          ) : (
            table.getPaginationRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ClientesPanelContent;
