import React, { useEffect, useState, useMemo } from "react";
import supabase  from "../supabaseClient";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Componente auxiliar para seleccionar coordenadas en el mapa
function SelectorCoordenadas({ value, onChange }) {
  // value: { x, y }
  const [marker, setMarker] = useState(
    value && value.x && value.y ? { lat: Number(value.y), lng: Number(value.x) } : null
  );

  // Actualiza el marcador si cambian las coordenadas desde fuera
  React.useEffect(() => {
    if (value && value.x && value.y) {
      setMarker({ lat: Number(value.y), lng: Number(value.x) });
    }
  }, [value.x, value.y]);

  function MapClicker() {
    useMapEvents({
      click(e) {
        setMarker(e.latlng);
        onChange({ x: e.latlng.lng, y: e.latlng.lat });
      },
    });
    return null;
  }

  return (
    <div style={{ height: 300, width: "100%" }}>
      <MapContainer
        center={
          marker
            ? [marker.lat, marker.lng]
            : [-34.9, -56.2] // Montevideo por defecto
        }
        zoom={marker ? 16 : 12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClicker />
        {marker && (
          <Marker position={[marker.lat, marker.lng]}>
            <Popup>
              Coordenadas seleccionadas:<br />
              Lat: {marker.lat.toFixed(6)}<br />
              Lng: {marker.lng.toFixed(6)}
            </Popup>
          </Marker>
        )}
      </MapContainer>
      <div className="form-text">
        Haga clic en el mapa para seleccionar la ubicación del cliente.
      </div>
    </div>
  );
}

export default function ClientesTable() {
  const [clientes, setClientes] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [mapCoords, setMapCoords] = useState({ lat: null, lng: null });
  const [clienteEdit, setClienteEdit] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  // Estado para la paginación
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });
  const handleEdit = (cliente) => {
    setClienteEdit(cliente);
    setShowEditModal(true);
  };

  const handleDelete = (clienteId) => {
    console.log("Eliminar cliente con ID:", clienteId);
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  async function fetchClientes() {
    setLoading(true);
    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .eq("activo", true)
      .order("nombre", { ascending: true });
    if (error) {
      console.error("Error al cargar clientes:", error.message);
    } else {
      setClientes(data);
    }
    setLoading(false);
  }

  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "codigo_alternativo", header: "Código Alternativo" },
      { accessorKey: "nombre", header: "Nombre" },
      { accessorKey: "razon", header: "Razón" },
      { accessorKey: "direccion", header: "Dirección" },
      { accessorKey: "telefono", header: "Teléfono" },
      { accessorKey: "rut", header: "RUT" },
      { accessorKey: "activo", header: "Activo" },
      {
        header: "Ver Mapa",
        cell: ({ row }) => {
          const lat = row.original.y;
          const lng = row.original.x;
          const tieneCoords =
            lat !== null &&
            lat !== undefined &&
            lng !== null &&
            lng !== undefined &&
            lat !== 0 &&
            lng !== 0;
          return tieneCoords ? (
            <button
              className="btn btn-link p-0"
              title="Ver Mapa"
              onClick={() => {
                setMapCoords({ lat: Number(lat), lng: Number(lng) });
                setShowModal(true);
              }}
            >
              <i
                className="bi bi-flag-fill"
                style={{ color: "green", fontSize: "1.5rem" }}
              ></i>
            </button>
          ) : (
            <span title="No GeoReferenciado">
              <i
                className="bi bi-flag-fill"
                style={{ color: "red", fontSize: "1.5rem" }}
              ></i>
            </span>
          );
        },
      },
      {
        header: "Acciones",
        cell: ({ row }) => {
          const cliente = row.original;

          return (
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-primary btn-sm"
                title="Editar"
                onClick={() => handleEdit(cliente)}
              >
                <i className="bi bi-pencil"></i>
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                title="Eliminar"
                onClick={() => handleDelete(cliente.id)}
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: clientes,
    columns,
    state: {
      globalFilter: filter,
      pagination,
    },
    onGlobalFilterChange: setFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div
      className="vw-100 vh-100 d-flex flex-column"
      style={{ minHeight: "100vh", minWidth: "100vw", padding: 0, margin: 0 }}
    >
      <div className="flex-grow-1 d-flex flex-column">
        <h2 className="text-center mb-4 mt-3">Clientes</h2>

        <div className="px-3 mb-3">
          <input
            value={filter ?? ""}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Buscar clientes..."
            className="form-control"
          />
        </div>

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
                        <td
                          colSpan={columns.length}
                          className="text-center py-4"
                        >
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
      </div>

      {/* Modal para mostrar el mapa con Leaflet */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
          role="dialog"
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Ubicación en el Mapa</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body" style={{ height: "400px" }}>
                {mapCoords.lat && mapCoords.lng ? (
                  <MapContainer
                    center={[mapCoords.lat, mapCoords.lng]}
                    zoom={16}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[mapCoords.lat, mapCoords.lng]}>
                      <Popup>Ubicación del cliente</Popup>
                    </Marker>
                  </MapContainer>
                ) : (
                  <div className="text-center text-danger">
                    No GeoReferenciado
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Fondo del modal para cerrar al hacer click fuera */}
      {showModal && (
        <div
          className="modal-backdrop fade show"
          style={{ zIndex: 1040 }}
          onClick={() => setShowModal(false)}
        ></div>
      )}

      {/* Modal de edición de cliente */}
      {showEditModal && clienteEdit && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
          role="dialog"
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Cliente</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const { error } = await supabase
                      .from("clientes")
                      .update(clienteEdit)
                      .eq("id", clienteEdit.id);
                    if (!error) {
                      fetchClientes();
                      setShowEditModal(false);
                    }
                  }}
                >
                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label className="form-label d-flex align-items-center">
                        <i className="bi bi-upc me-2"></i>
                        Código Alternativo
                      </label>
                      <input
                        className="form-control"
                        value={clienteEdit.codigo_alternativo || ""}
                        onChange={(e) =>
                          setClienteEdit({
                            ...clienteEdit,
                            codigo_alternativo: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label className="form-label d-flex align-items-center">
                        <i className="bi bi-person-fill me-2"></i>
                        Nombre
                      </label>
                      <input
                        className="form-control"
                        value={clienteEdit.nombre || ""}
                        onChange={(e) =>
                          setClienteEdit({
                            ...clienteEdit,
                            nombre: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label className="form-label d-flex align-items-center">
                        <i className="bi bi-briefcase-fill me-2"></i>
                        Razón
                      </label>
                      <input
                        className="form-control"
                        value={clienteEdit.razon || ""}
                        onChange={(e) =>
                          setClienteEdit({
                            ...clienteEdit,
                            razon: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label className="form-label d-flex align-items-center">
                        <i className="bi bi-geo-alt-fill me-2"></i>
                        Dirección
                      </label>
                      <input
                        className="form-control"
                        value={clienteEdit.direccion || ""}
                        onChange={(e) =>
                          setClienteEdit({
                            ...clienteEdit,
                            direccion: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label className="form-label d-flex align-items-center">
                        <i className="bi bi-telephone-fill me-2"></i>
                        Teléfono
                      </label>
                      <input
                        className="form-control"
                        value={clienteEdit.telefono || ""}
                        onChange={(e) =>
                          setClienteEdit({
                            ...clienteEdit,
                            telefono: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label className="form-label d-flex align-items-center">
                        <i className="bi bi-card-text me-2"></i>
                        RUT
                      </label>
                      <input
                        className="form-control"
                        value={clienteEdit.rut || ""}
                        onChange={(e) =>
                          setClienteEdit({
                            ...clienteEdit,
                            rut: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label className="form-label d-flex align-items-center">
                        <i className="bi bi-check-circle-fill me-2"></i>
                        Activo
                      </label>
                      <select
                        className="form-select"
                        value={clienteEdit.activo ? "true" : "false"}
                        onChange={(e) =>
                          setClienteEdit({
                            ...clienteEdit,
                            activo: e.target.value === "true",
                          })
                        }
                      >
                        <option value="true">Sí</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                    <div className="mb-3 col-md-6">
                      <label className="form-label d-flex align-items-center">
                        <i className="bi bi-geo me-2"></i>
                        Coordenada X (Longitud)
                      </label>
                      <input
                        type="number"
                        step="any"
                        className="form-control"
                        value={clienteEdit.x || ""}
                        onChange={e =>
                          setClienteEdit({
                            ...clienteEdit,
                            x: e.target.value
                          })
                        }
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label className="form-label d-flex align-items-center">
                        <i className="bi bi-geo me-2"></i>
                        Coordenada Y (Latitud)
                      </label>
                      <input
                        type="number"
                        step="any"
                        className="form-control"
                        value={clienteEdit.y || ""}
                        onChange={e =>
                          setClienteEdit({
                            ...clienteEdit,
                            y: e.target.value
                          })
                        }
                      />
                    </div>
                    <div className="mb-3 col-12">
                      <label className="form-label d-flex align-items-center">
                        <i className="bi bi-map me-2"></i>
                        Seleccionar ubicación en el mapa
                      </label>
                      <SelectorCoordenadas
                        value={{ x: clienteEdit.x, y: clienteEdit.y }}
                        onChange={({ x, y }) =>
                          setClienteEdit({
                            ...clienteEdit,
                            x,
                            y,
                          })
                        }
                      />
                    </div>
                    {/* Agrega más campos aquí si tu tabla tiene más */}
                  </div>
                  <div className="text-end">
                    <button type="submit" className="btn btn-primary">
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Fondo del modal de edición para cerrar al hacer click fuera */}
      {showEditModal && (
        <div
          className="modal-backdrop fade show"
          style={{ zIndex: 1040 }}
          onClick={() => setShowEditModal(false)}
        ></div>
      )}
    </div>
  );
}