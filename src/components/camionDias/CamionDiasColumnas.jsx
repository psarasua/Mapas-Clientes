import React, { useMemo, useCallback } from "react";

// Envuelve el componente con React.memo para evitar renders innecesarios si las props no cambian
const CamionDiasColumnas = React.memo(function CamionDiasColumnas({
  columnasPorDia,
  onVerMapa,
  onEditar,
  onEliminar,
}) {
  // Memoiza los handlers para evitar que cambien en cada render
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

  // Memoiza el renderizado de las columnas para evitar cálculos innecesarios si columnasPorDia no cambia
  const columnasRender = useMemo(
    () =>
      columnasPorDia.map((dia) => (
        <div
          className="col-12 col-md-6 col-lg-4 mb-4"
          key={dia.id}
          aria-label={`Columna de camiones para el día ${dia.descripcion}`}
        >
          <h5 className="text-center" tabIndex={0}>
            {dia.descripcion}
          </h5>
          {dia.registros.map((cd) => (
            <div
              className="card mb-3 h-100"
              key={cd.id}
              role="region"
              aria-label={`Camión ${cd.camiones?.descripcion || cd.camion_id} con ${cd.clientesAsignados?.length || 0} clientes asignados`}
            >
              <div className="card-body d-flex flex-column">
                <h6 className="card-title">
                  {cd.camiones?.descripcion || cd.camion_id}
                </h6>
                <p className="card-text">
                  <strong>Total de clientes:</strong>{" "}
                  {cd.clientesAsignados?.length || 0}
                </p>
                <div className="d-flex flex-wrap gap-2 mt-auto">
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

  // Renderiza las columnas memorizadas
  return (
    <div className="row" role="list" aria-label="Listado de columnas por día">
      {columnasRender}
    </div>
  );
});

export default CamionDiasColumnas;