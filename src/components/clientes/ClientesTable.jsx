import React, { useEffect, useState, useMemo, useCallback } from "react";
import supabase from "../../supabaseClient";
import {
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";
import LoadingBar from "../ui/LoadingBar";
import ClientesTableContent from "./ClientesTableContent";
import ClientesTableModalMapa from "./ClientesTableModalMapa";
import ClientesTableModalEditar from "./ClientesTableModalEditar";

const ClientesTable = React.memo(function ClientesTable() {
  const [clientes, setClientes] = useState([]);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [mapCoords, setMapCoords] = useState({ lat: null, lng: null });
  const [clienteEdit, setClienteEdit] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
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
    <div className="d-flex justify-content-between align-items-center mt-3">
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
  ), [table, pageCount]);

  return (
    <div className="vw-100 vh-100 d-flex flex-column" style={{ minHeight: "100vh", minWidth: "100vw", padding: 0, margin: 0 }}>
      <div className="flex-grow-1 d-flex flex-column">
        <h2 className="text-center mb-4 mt-3">Clientes</h2>
        <div className="px-3 mb-3">
          <input
            value={filter ?? ""}
            onChange={(e) => {
              setFilter(e.target.value);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
            placeholder="Buscar clientes..."
            className="form-control"
          />
        </div>
        <div className="flex-grow-1 d-flex flex-column px-3">
          {loading ? (
            <LoadingBar progress={progress} text="Cargando clientes..." />
          ) : (
            <>
              <ClientesTableContent table={table} columns={columns} />
              {paginationControls}
            </>
          )}
        </div>
      </div>
      <ClientesTableModalMapa showModal={showModal} mapCoords={mapCoords} setShowModal={setShowModal} />
      <ClientesTableModalEditar
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

export default ClientesTable;