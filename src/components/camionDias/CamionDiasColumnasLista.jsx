import React, { useMemo, useCallback } from "react";

const CamionDiasColumnasLista = React.memo(function CamionDiasColumnasLista({
  columnasPorDia,
  onVerMapa,
  onEditar,
  onEliminar,
}) {
  const handleVerMapa = useCallback(
    (cd) => onVerMapa(cd),
    [onVerMapa]
  );
  const handleEditar = useCallback(
    (cd) => onEditar(cd),
    [onEditar]
  );
  const handleEliminar = useCallback(
    (id) => onEliminar(id),
    [onEliminar]
  );

  const columnasRender = useMemo(
    () =>
      columnasPorDia.map((dia) => (
        <div
          className="col mb-4"
          key={dia.id}
          aria-label={`Columna de camiones para el día ${dia.descripcion}`}
        >
          <h5 className="text-center" tabIndex={0}>
            {dia.descripcion}
          </h5>
          {dia.registros.map((cd) => (
            <div
              className="card mb-3 p-2"
              key={cd.id}
              role="region"
              aria-label={`Camión ${cd.camiones?.descripcion || cd.camion_id} con ${cd.clientesAsignados?.length || 0} clientes asignados`}
              style={{ minHeight: "unset" }}
            >
              <div>
                <h6 className="card-title mb-1">
                  {cd.camiones?.descripcion || cd.camion_id}
                </h6>
                <div className="card-text">
                  <strong>Total de clientes:</strong>{" "}
                  {cd.clientesAsignados?.length || 0}
                </div>
              </div>
              <div className="d-flex flex-wrap gap-2 justify-content-center mt-2">
                <button
                  className="btn btn-outline-info btn-sm"
                  onClick={() => handleVerMapa(cd)}
                  aria-label={`Ver mapa de clientes asignados al camión ${cd.camiones?.descripcion || cd.camion_id}`}
                >
                  Ver Mapa
                </button>
                <button
                  className="btn btn-outline-warning btn-sm"
                  onClick={() => handleEditar(cd)}
                  aria-label={`Editar camión ${cd.camiones?.descripcion || cd.camion_id}`}
                >
                  Editar
                </button>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleEliminar(cd.id)}
                  aria-label={`Eliminar camión ${cd.camiones?.descripcion || cd.camion_id}`}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          {dia.registros.length === 0 && (
            <div className="text-muted text-center" tabIndex={0}>
              Sin camiones
            </div>
          )}
        </div>
      )),
    [columnasPorDia, handleVerMapa, handleEditar, handleEliminar]
  );

  // row-cols-lg-auto hace que todas las columnas entren en una fila en pantallas grandes
  return (
    <div className="row flex-nowrap overflow-auto" style={{ gap: "1rem" }} role="list" aria-label="Listado de columnas por día">
      {columnasRender}
    </div>
  );
});

export default CamionDiasColumnasLista;