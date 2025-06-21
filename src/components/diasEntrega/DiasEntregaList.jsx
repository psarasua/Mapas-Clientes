import React, { useMemo, useCallback } from "react";

const DiasEntregaList = React.memo(function DiasEntregaList({ dias, loading, onEdit, onDelete }) {
  // Memoiza el handler de edición
  const handleEdit = useCallback(
    (dia) => onEdit(dia),
    [onEdit]
  );

  // Memoiza el handler de eliminación
  const handleDelete = useCallback(
    (id) => onDelete(id),
    [onDelete]
  );

  // Memoiza el renderizado de las filas de la tabla
  const rows = useMemo(() => {
    if (dias.length === 0) {
      return (
        <tr>
          <td colSpan={3} className="text-center py-4">
            No hay días de entrega registrados.
          </td>
        </tr>
      );
    }
    return dias.map(dia => (
      <tr key={dia.id}>
        <td>{dia.id}</td>
        <td>{dia.descripcion}</td>
        <td>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-primary btn-sm"
              title="Editar"
              onClick={() => handleEdit(dia)}
            >
              <i className="bi bi-pencil"></i>
            </button>
            <button
              className="btn btn-outline-danger btn-sm"
              title="Eliminar"
              onClick={() => handleDelete(dia.id)}
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    ));
  }, [dias, handleEdit, handleDelete]);

  if (loading) {
    return (
      <div className="text-center py-4 flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="table-responsive flex-grow-1">
      <table className="table table-striped table-hover align-middle w-100">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
});

export default DiasEntregaList;