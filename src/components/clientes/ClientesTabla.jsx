import React from "react";
import { flexRender } from "@tanstack/react-table";

const ClientesPanelContent = React.memo(function ClientesPanelContent({ table, columns }) {
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
});

export default ClientesPanelContent;