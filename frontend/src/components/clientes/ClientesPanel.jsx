// ClientesPanel.jsx
// Panel principal para la gestión de clientes.
// Permite ver, crear, editar, eliminar y buscar clientes, así como ver su ubicación en el mapa.
// Maneja el estado y la lógica de interacción de la vista principal.

import React, { useEffect, useState, useCallback } from "react";
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

const MySwal = withReactContent(Swal);

const ClientesPanel = React.memo(function ClientesPanel() {
  const [clientes, setClientes] = useState([]);
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

  const table = useReactTable({
    data: clientes,
    columns: [
      // ...definición de columnas
    ],
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
        const data = await apiFetch('/clientes');
        setClientes(data);
      } catch (err) {
        // Manejo de error
      }
    };
    fetchClientes();
  }, []);

  const checkBackend = useCallback(async () => {
    try {
      await apiFetch('/ping');
    } catch (err) {
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

  const handleRowClick = useCallback((cliente) => {
    setClienteEdit(cliente);
    setShowEditModal(true);
  }, []);

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
      <ClientesTabla
        table={table}
        onRowClick={handleRowClick}
        onMapClick={handleMapClick}
      />
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
          onSave={handleSaveCliente}
          // ...otras props
        />
      )}
      {showAltaModal && (
        <ClienteModalFormulario
          onClose={handleCloseAltaModal}
          onSave={handleSaveCliente}
          // ...otras props
        />
      )}
    </div>
  );
});

export default ClientesPanel;
