// ClientesPanel.jsx
// Panel principal para la gestión de clientes.
// Permite ver, crear, editar, eliminar y buscar clientes, así como ver su ubicación en el mapa.
// Maneja el estado y la lógica de interacción de la vista principal.

import React, { useEffect, useState, useCallback } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { apiFetch } from '../../services/api';
import ClienteModalMapa from "./ClienteModalMapa";
import ClienteModalFormulario from "./ClienteModalFormulario";

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

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/clientes');
      setClientes(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchClientes(); }, [fetchClientes]);

  const handleRowClick = (cliente) => {
    setClienteEdit(cliente);
    setShowEditModal(true);
  };

  const handleDeleteCliente = async (id) => {
    setLoading(true);
    try {
      await apiFetch(`/clientes/${id}`, { method: "DELETE" });
      fetchClientes();
    } finally {
      setLoading(false);
    }
  };

  // Columnas para react-data-table-component
  const columns = [
    { name: 'ID', selector: row => row.id, sortable: true, width: '70px' },
    { name: 'Nombre', selector: row => row.nombre, sortable: true },
    { name: 'Razón Social', selector: row => row.razon, sortable: true },
    { name: 'Código Alternativo', selector: row => row.codigo_alternativo, sortable: true },
    { name: 'Dirección', selector: row => row.direccion, sortable: true },
    { name: 'Teléfono', selector: row => row.telefono, sortable: true },
    { name: 'RUT', selector: row => row.rut, sortable: true },
    { name: 'Activo', selector: row => row.activo ? 'Sí' : 'No', sortable: true, width: '80px' },
    { name: 'X', selector: row => row.x, sortable: true, width: '80px' },
    { name: 'Y', selector: row => row.y, sortable: true, width: '80px' },
    {
      name: 'Acciones',
      cell: row => (
        <div className="d-flex gap-2">
          <button className="btn btn-outline-warning btn-sm" title="Editar" aria-label={`Editar cliente ${row.nombre}`} onClick={() => handleRowClick(row)}>
            <FaPencilAlt aria-hidden="true" />
          </button>
          <button className="btn btn-outline-danger btn-sm" title="Eliminar" aria-label={`Eliminar cliente ${row.nombre}`} onClick={() => handleDeleteCliente(row.id)}>
            <FaTrash aria-hidden="true" />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '120px',
    },
  ];

  // Filtro global
  const filteredData = filter.trim()
    ? clientes.filter(c => Object.values(c).some(val => val && String(val).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(filter.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''))))
    : clientes;

  return (
    <div>
      <div className="mb-4 d-flex justify-content-center">
        <input
          type="search"
          className="form-control text-center shadow-sm border-0 rounded-pill px-4 py-2"
          style={{ maxWidth: 350, fontSize: 18, background: "#f8f9fa" }}
          placeholder="🔍 Buscar clientes..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          aria-label="Buscar clientes"
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredData}
        progressPending={loading}
        pagination
        paginationPerPage={20}
        paginationRowsPerPageOptions={[20, 50, 100]}
        highlightOnHover
        pointerOnHover
        noDataComponent={<div className="text-center text-muted py-5" style={{fontSize: 18}}>No se encontraron clientes para el filtro actual.</div>}
        responsive
        striped
        dense
      />
      {/* Modales */}
      {showModal && (
        <ClienteModalMapa
          coords={mapCoords}
          onClose={() => setShowModal(false)}
          // ...otras props
        />
      )}
      {showEditModal && (
        <ClienteModalFormulario
          cliente={clienteEdit}
          onClose={() => setShowEditModal(false)}
          // ...otras props
        />
      )}
      {showAltaModal && (
        <ClienteModalFormulario
          onClose={() => setShowAltaModal(false)}
          // ...otras props
        />
      )}
    </div>
  );
});

export default ClientesPanel;
