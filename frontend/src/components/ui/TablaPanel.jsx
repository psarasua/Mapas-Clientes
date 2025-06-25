// TablaPanel.jsx
// Componente reutilizable de tabla con buscador, paginación, orden y acciones, usando react-data-table-component y estilos Bootswatch.

import React, { useState, useMemo } from "react";
import DataTable from "react-data-table-component";

const TablaPanel = ({
  columns,
  data,
  loading = false,
  title = "",
  searchPlaceholder = "Buscar...",
  paginationPerPage = 20,
  paginationRowsPerPageOptions = [20, 50, 100],
  noDataText = "No se encontraron resultados.",
  dense = true,
  striped = true,
  highlightOnHover = true,
  pointerOnHover = true,
  responsive = true,
  extraHeader = null,
}) => {
  const [filter, setFilter] = useState("");
  const filteredData = useMemo(() =>
    filter.trim()
      ? data.filter(row => Object.values(row).some(val => val && String(val).toLowerCase().normalize('NFD').replace(/\u0300-\u036f/g, '').includes(filter.toLowerCase().normalize('NFD').replace(/\u0300-\u036f/g, ''))))
      : data,
    [data, filter]
  );

  return (
    <div>
      {title && <h2 className="text-center mb-4 mt-3">{title}</h2>}
      {extraHeader}
      <div className="mb-4 d-flex justify-content-center">
        <input
          type="search"
          className="form-control text-center shadow-sm border-0 rounded-pill px-4 py-2"
          style={{ maxWidth: 350, fontSize: 18, background: "#f8f9fa" }}
          placeholder={searchPlaceholder}
          value={filter}
          onChange={e => setFilter(e.target.value)}
          aria-label={searchPlaceholder}
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredData}
        progressPending={loading}
        pagination
        paginationPerPage={paginationPerPage}
        paginationRowsPerPageOptions={paginationRowsPerPageOptions}
        highlightOnHover={highlightOnHover}
        pointerOnHover={pointerOnHover}
        noDataComponent={<div className="text-center text-muted py-5" style={{fontSize: 18}}>{noDataText}</div>}
        responsive={responsive}
        striped={striped}
        dense={dense}
      />
    </div>
  );
};

export default TablaPanel;
