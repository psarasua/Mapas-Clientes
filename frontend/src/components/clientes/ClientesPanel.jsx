// ClientesPanel.jsx
// Panel principal para la gestión de clientes.
// Permite ver, crear, editar, eliminar y buscar clientes, así como ver su ubicación en el mapa.
// Maneja el estado y la lógica de interacción de la vista principal.

import React, { useEffect, useState, useCallback, useMemo } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import ClientesTabla from "./ClientesTabla";
import ClienteModalMapa from "./ClienteModalMapa";
import ClienteModalFormulario from "./ClienteModalFormulario";
import { apiFetch } from '../../services/api';
import { FaPencilAlt, FaTrash } from "react-icons/fa";

const MySwal = withReactContent(Swal);

const ClientesPanel = React.memo(function ClientesPanel() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [mapCoords, setMapCoords] = useState({ lat: null, lng: null });
  const [clienteEdit, setClienteEdit] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAltaModal, setShowAltaModal] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });
  const [columnVisibility, setColumnVisibility] = useState({});
  const [sorting, setSorting] = useState([]);
  // Loading visual al cambiar de página
  const [pageLoading, setPageLoading] = useState(false);

  const handleRowClick = useCallback((cliente) => {
    setClienteEdit(cliente);
    setShowEditModal(true);
  }, []);

  const handleDeleteCliente = useCallback(async (id) => {
    setLoading(true);
    try {
      await apiFetch(`/clientes/${id}`, { method: "DELETE" });
      // Refrescar datos desde el backend tras eliminar
      const data = await apiFetch('/clientes');
      setClientes(data);
    } catch {
      // Manejo de error opcional
    } finally {
      setLoading(false);
    }
  }, []);

  const columns = useMemo(() => [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'nombre',
      header: 'Nombre',
    },
    {
      accessorKey: 'razon',
      header: 'Razón Social',
    },
    {
      accessorKey: 'codigo_alternativo',
      header: 'Código Alternativo',
    },
    {
      accessorKey: 'direccion',
      header: 'Dirección',
    },
    {
      accessorKey: 'telefono',
      header: 'Teléfono',
    },
    {
      accessorKey: 'rut',
      header: 'RUT',
    },
    {
      accessorKey: 'activo',
      header: 'Activo',
      cell: info => info.getValue() ? 'Sí' : 'No',
    },
    {
      accessorKey: 'x',
      header: 'X',
    },
    {
      accessorKey: 'y',
      header: 'Y',
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-warning btn-sm"
            title="Editar"
            aria-label={`Editar cliente ${row.original.nombre}`}
            onClick={() => handleRowClick(row.original)}
          >
            <FaPencilAlt aria-hidden="true" />
            <span className="visually-hidden">Editar</span>
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            title="Eliminar"
            aria-label={`Eliminar cliente ${row.original.nombre}`}
            onClick={() => handleDeleteCliente(row.original.id)}
          >
            <FaTrash aria-hidden="true" />
            <span className="visually-hidden">Eliminar</span>
          </button>
        </div>
      ),
      enableSorting: false,
      enableColumnFilter: false,
    },
  ], [handleRowClick, handleDeleteCliente]);

  // Filtro global manual para todos los campos (ignora tildes/acentos y tipos, compatible universal)
  const normalize = str => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const filteredClientes = useMemo(() => {
    const search = normalize((filter || '').toString().trim());
    if (!search) return clientes;
    return clientes.filter(c =>
      Object.values(c).some(val => {
        if (val === null || val === undefined) return false;
        return normalize(String(val)).includes(search);
      })
    );
  }, [clientes, filter]);

  const table = useReactTable({
    data: filteredClientes,
    columns,
    state: {
      pagination,
      columnVisibility,
      sorting,
    },
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
  });

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoading(true);
        const data = await apiFetch('/clientes');
        setClientes(data);
      } catch {
        // Manejo de error
      } finally {
        setLoading(false);
      }
    };
    fetchClientes();
  }, []);

  const checkBackend = useCallback(async () => {
    try {
      await apiFetch('/ping');
    } catch {
      MySwal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar con el backend. Por favor, verifique que el servidor esté en funcionamiento.",
        confirmButtonText: "Reintentar",
        allowOutsideClick: false,
        allowEscapeKey: false
      }).then(() => {
        checkBackend();
      });
    }
  }, []);

  useEffect(() => {
    checkBackend();
  }, [checkBackend]);

  const handleMapClick = useCallback((coords) => {
    setMapCoords(coords);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setMapCoords({ lat: null, lng: null });
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setShowEditModal(false);
    setClienteEdit(null);
  }, []);

  const handleCloseAltaModal = useCallback(() => {
    setShowAltaModal(false);
  }, []);

  // Buscador global
  const handleSearch = (e) => {
    setFilter(e.target.value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  // Si el pageIndex está fuera de rango tras filtrar, volver a la primera página
  React.useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(filteredClientes.length / pagination.pageSize) - 1);
    if (pagination.pageIndex > maxPage) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
  }, [filteredClientes.length, pagination.pageIndex, pagination.pageSize]);

  // Loading visual al cambiar de página
  useEffect(() => {
    if (pagination.pageIndex === 0) return; // No mostrar loading en la primera carga
    setPageLoading(true);
    const timeout = setTimeout(() => setPageLoading(false), 300);
    return () => clearTimeout(timeout);
  }, [pagination.pageIndex, pagination.pageSize]);

  return (
    <div>
      <div className="mb-4 d-flex justify-content-center">
        <input
          type="search"
          className="form-control text-center shadow-sm border-0 rounded-pill px-4 py-2"
          style={{ maxWidth: 350, fontSize: 18, background: "#f8f9fa" }}
          placeholder="🔍 Buscar clientes..."
          value={filter}
          onChange={handleSearch}
          aria-label="Buscar clientes"
        />
      </div>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        filteredClientes.length === 0 ? (
          <div className="text-center text-muted py-5" style={{fontSize: 18}}>
            No se encontraron clientes para el filtro actual.
          </div>
        ) : (
          <>
            {pageLoading ? (
              <div className="d-flex justify-content-center align-items-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando página...</span>
                </div>
              </div>
            ) : (
              <ClientesTabla
                table={table}
                onRowClick={handleRowClick}
                onMapClick={handleMapClick}
              />
            )}
            {/* Controles de paginación */}
            <nav className="d-flex justify-content-between align-items-center mt-3" aria-label="Paginación de la tabla de clientes">
              <div>
                Página <strong>{table.getState().pagination.pageIndex + 1} de {table.getPageCount()}</strong>
              </div>
              <div>
                <button
                  className="btn btn-outline-primary btn-sm me-2"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Página anterior"
                >
                  {"<"}
                </button>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => table.nextPage()}
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
                onChange={e => table.setPageSize(Number(e.target.value))}
                aria-label="Seleccionar cantidad de filas por página"
              >
                {[20, 50, 100].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    Mostrar {pageSize}
                  </option>
                ))}
              </select>
            </nav>
          </>
        )
      )}
      {showModal && (
        <ClienteModalMapa
          coords={mapCoords}
          onClose={handleCloseModal}
          // ...otras props
        />
      )}
      {showEditModal && (
        <ClienteModalFormulario
          cliente={clienteEdit}
          onClose={handleCloseEditModal}
          // ...otras props
        />
      )}
      {showAltaModal && (
        <ClienteModalFormulario
          onClose={handleCloseAltaModal}
          // ...otras props
        />
      )}
    </div>
  );
});

export default ClientesPanel;
