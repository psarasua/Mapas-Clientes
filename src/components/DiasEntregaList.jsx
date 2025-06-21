import React from "react";

function DiasEntregaList({ dias, loading, onEdit, onDelete }) {
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
        <tbody>
          {dias.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center py-4">
                No hay días de entrega registrados.
              </td>
            </tr>
          ) : (
            dias.map(dia => (
              <tr key={dia.id}>
                <td>{dia.id}</td>
                <td>{dia.descripcion}</td>
                <td>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      title="Editar"
                      onClick={() => onEdit(dia)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      title="Eliminar"
                      onClick={() => onDelete(dia.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DiasEntregaList;