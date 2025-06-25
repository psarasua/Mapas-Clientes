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

  const handleRowClick = useCallback((cliente) => {
    setClienteEdit(cliente);
    setShowEditModal(true);
  }, []);

  const handleDeleteCliente = useCallback(async (id) => {
    await apiFetch(`/clientes/${id}`, { method: "DELETE" });
    setClientes((prev) => prev.filter((c) => c.id !== id));
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

  const table = useReactTable({
    data: clientes,
    columns,
    pageCount: Math.ceil(clientes.length / pagination.pageSize),
    state: {
      pagination,
      columnVisibility,
      sorting,
      globalFilter: filter,
    },
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    onGlobalFilterChange: setFilter,
    getCoreRowModel: getCoreRowModel(),
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

  return (
    <div>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <ClientesTabla
          table={table}
          onRowClick={handleRowClick}
          onMapClick={handleMapClick}
        />
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
