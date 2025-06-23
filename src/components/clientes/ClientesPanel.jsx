import React, { useEffect, useState, useMemo, useCallback } from "react";
import supabase from "../../supabaseClient";
import {
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";
import BarraCarga from "../ui/BarraCarga";
import ClientesTabla from "./ClientesTabla";
import ClienteModalMapa from "./ClienteModalMapa";
import ClienteModalFormulario from "./ClienteModalFormulario";

const ClientesPanel = React.memo(function ClientesPanel() {
  const [clientes, setClientes] = useState([]);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [mapCoords, setMapCoords] = useState({ lat: null, lng: null });
  const [clienteEdit, setClienteEdit] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAltaModal, setShowAltaModal] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  // Calcula el número total de páginas
  const pageCount = useMemo(
    () => Math.ceil(total / pagination.pageSize) || 1,
    [total, pagination.pageSize]
  );

  // Trae solo la página actual de clientes
  const fetchClientes = useCallback(async () => {
    setLoading(true);
    setProgress(10);

    const from = pagination.pageIndex * pagination.pageSize;
    const to = from + pagination.pageSize - 1;

    let query = supabase
      .from("clientes")
      .select("*", { count: "exact" })
      .eq("activo", true)
      .order("nombre", { ascending: true })
      .range(from, to);

    // Filtro simple por nombre (puedes mejorarlo)
    if (filter) {
      query = query.ilike("nombre", `%${filter}%`);
    }

    const { data, error, count } = await query;

    setProgress(70);
    if (!error) {
      setClientes(data);
      setTotal(count || 0);
    }
    setProgress(100);
    setTimeout(() => setLoading(false), 300);
    setTimeout(() => setProgress(0), 600);
  }, [pagination, filter]);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  const handleEdit = useCallback((cliente) => {
    setClienteEdit(cliente);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback(async (clienteId) => {
    if (window.confirm("¿Seguro que deseas eliminar este cliente?")) {
      const { error } = await supabase
        .from("clientes")
        .update({ activo: false })
        .eq("id", clienteId);
      if (!error) fetchClientes();
    }
  }, [fetchClientes]);

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
              aria-label={`Ver mapa del cliente ${row.original.nombre}`}
              onClick={() => {
                setMapCoords({ lat: Number(lat), lng: Number(lng) });
                setShowModal(true);
              }}
            >
              <i
                className="bi bi-flag-fill"
                style={{ color: "green", fontSize: "1.5rem" }}
                aria-hidden="true"
              ></i>
              <span className="visually-hidden">Ver Mapa</span>
            </button>
          ) : (
            <span title="No GeoReferenciado">
              <i
                className="bi bi-flag-fill"
                style={{ color: "red", fontSize: "1.5rem" }}
                aria-hidden="true"
              ></i>
              <span className="visually-hidden">No georreferenciado</span>
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
                className="btn btn-outline-warning btn-sm"
                title="Editar"
                aria-label={`Editar cliente ${cliente.nombre}`}
                onClick={() => handleEdit(cliente)}
              >
                <i className="bi bi-pencil" aria-hidden="true"></i>
                <span className="visually-hidden">Editar</span>
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                title="Eliminar"
                aria-label={`Eliminar cliente ${cliente.nombre}`}
                onClick={() => handleDelete(cliente.id)}
              >
                <i className="bi bi-trash" aria-hidden="true"></i>
                <span className="visually-hidden">Eliminar</span>
              </button>
            </div>
          );
        },
      },
    ],
    [handleEdit, handleDelete]
  );

  // Configuración de react-table en modo paginación manual
  const table = useReactTable({
    data: clientes,
    columns,
    pageCount,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  });

  const paginationControls = useMemo(() => (
    <nav
      className="d-flex justify-content-between align-items-center mt-3"
      aria-label="Paginación de la tabla de clientes"
    >
      <div>
        Página{" "}
        <strong>
          {table.getState().pagination.pageIndex + 1} de {pageCount}
        </strong>
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
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
        }}
        aria-label="Seleccionar cantidad de filas por página"
      >
        {[20, 50, 100].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Mostrar {pageSize}
          </option>
        ))}
      </select>
    </nav>
  ), [table, pageCount]);

  return (
    <div className="container my-4" style={{ maxWidth: 1200 }}>
      <h2 className="text-center mb-4 mt-3" id="clientes-titulo" tabIndex={0}>
        Clientes
      </h2>
      <div className="d-flex justify-content-end align-items-center mb-3">
        <button
          className="btn btn-success btn-sm d-flex align-items-center"
          style={{ minWidth: "auto" }}
          onClick={() => setShowAltaModal(true)}
          aria-label="Crear nuevo cliente"
        >
          <i className="bi bi-plus-lg me-1" aria-hidden="true"></i>
          <span className="visually-hidden">Crear Cliente</span>
          Crear Cliente
        </button>
      </div>
      <div className="mb-3">
        <label htmlFor="clientes-busqueda" className="visually-hidden">
          Buscar clientes
        </label>
        <input
          id="clientes-busqueda"
          value={filter ?? ""}
          onChange={(e) => {
            setFilter(e.target.value);
            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
          }}
          placeholder="Buscar clientes..."
          className="form-control"
          aria-label="Buscar clientes"
          autoComplete="off"
        />
      </div>
      <div>
        {loading ? (
          <BarraCarga progress={progress} text="Cargando clientes..." />
        ) : (
          <>
            <ClientesTabla table={table} columns={columns} />
            {paginationControls}
          </>
        )}
      </div>
      <ClienteModalMapa showModal={showModal} mapCoords={mapCoords} setShowModal={setShowModal} />
      {/* Modal para crear cliente */}
      <ClienteModalFormulario
        showEditModal={showAltaModal}
        clienteEdit={null}
        setShowEditModal={setShowAltaModal}
        fetchClientes={fetchClientes}
        supabase={supabase}
      />

      {/* Modal para editar cliente */}
      <ClienteModalFormulario
        showEditModal={showEditModal}
        clienteEdit={clienteEdit}
        setShowEditModal={setShowEditModal}
        setClienteEdit={setClienteEdit}
        fetchClientes={fetchClientes}
        supabase={supabase}
      />
    </div>
  );
});

export default ClientesPanel;