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
import { Button, Spinner } from "react-bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Toaster, toast } from 'sonner';

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

  const handleDeleteCliente = async (id, nombre) => {
    const result = await MySwal.fire({
      title: '¿Eliminar cliente?',
      text: `¿Seguro que deseas eliminar a "${nombre}"? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
    });
    if (result.isConfirmed) {
      setLoading(true);
      try {
        await apiFetch(`/clientes/${id}`, { method: "DELETE" });
        fetchClientes();
        toast.success('Cliente eliminado correctamente');
      } catch (e) {
        toast.error('Error al eliminar el cliente');
      } finally {
        setLoading(false);
      }
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
    {
      name: 'Ubicación',
      selector: row => row.x && row.y,
      cell: row => (
        <button
          type="button"
          className="bg-transparent border-0 p-0 m-0 d-flex align-items-center justify-content-center"
          style={{ width: 36, height: 36, cursor: row.x && row.y ? 'pointer' : 'not-allowed' }}
          title={row.x && row.y ? `X: ${row.x}, Y: ${row.y}` : 'Sin coordenadas'}
          aria-label={row.x && row.y ? 'Ver ubicación en el mapa' : 'Sin ubicación'}
          tabIndex={row.x && row.y ? 0 : -1}
          disabled={!(row.x && row.y)}
          onClick={row.x && row.y ? () => { setMapCoords({ lat: row.y, lng: row.x }); setShowModal(true); } : undefined}
        >
          <i
            className="bi bi-flag-fill"
            style={{ fontSize: 18, color: row.x && row.y ? '#198754' : '#dc3545' }}
          ></i>
        </button>
      ),
      sortable: false,
      width: '56px',
    },
    {
      name: 'Acciones',
      cell: row => (
        <div className="d-flex gap-2">
          <Button variant="outline-warning" size="sm" title={`Editar cliente ${row.nombre}`} aria-label={`Editar cliente ${row.nombre}`} onClick={() => handleRowClick(row)}>
            <FaPencilAlt aria-hidden="true" />
          </Button>
          <Button variant="outline-danger" size="sm" title={`Eliminar cliente ${row.nombre}`} aria-label={`Eliminar cliente ${row.nombre}`} onClick={() => handleDeleteCliente(row.id, row.nombre)}>
            <FaTrash aria-hidden="true" />
          </Button>
        </div>
      ),
      ignoreRowClick: true,
      width: '120px',
    },
  ];

  // Filtro global
  const filteredData = filter.trim()
    ? clientes.filter(c => Object.values(c).some(val => val && String(val).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(filter.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''))))
    : clientes;

  return (
    <>
      <Toaster richColors position="top-right" />
      <div>
        <div className="mb-4 d-flex justify-content-center align-items-center gap-3">
          <input
            type="search"
            className="form-control text-center shadow-sm border-0 rounded-pill px-4 py-2"
            style={{ maxWidth: 350, fontSize: 18, background: "#f8f9fa" }}
            placeholder="🔍 Buscar clientes..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            aria-label="Buscar clientes"
          />
          <Button
            variant="success"
            className="rounded-pill px-4 py-2 shadow-sm"
            style={{ fontSize: 18 }}
            onClick={() => {
              setShowAltaModal(true);
              toast.info('Formulario de alta de cliente abierto');
            }}
          >
            + Nuevo Cliente
          </Button>
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
            fetchClientes={fetchClientes}
            setClienteEdit={setClienteEdit}
          />
        )}
        {showAltaModal && (
          <ClienteModalFormulario
            onClose={() => setShowAltaModal(false)}
            // ...otras props
          />
        )}
      </div>
    </>
  );
});

export default ClientesPanel;
