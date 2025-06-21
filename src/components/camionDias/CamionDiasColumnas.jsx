import React, { useMemo, useCallback } from "react";

// Envuelve el componente con React.memo para evitar renders innecesarios si las props no cambian
const CamionDiasColumnas = React.memo(function CamionDiasColumnas({
  columnasPorDia,
  onVerMapa,
  onEditar,
  onEliminar,
}) {
  // Memoiza el renderizado de las columnas para evitar cálculos innecesarios si columnasPorDia no cambia
  const columnasRender = useMemo(
    () =>
      columnasPorDia.map((dia) => (
        <div className="col" key={dia.id}>
          <h5 className="text-center">{dia.descripcion}</h5>
          {dia.registros.map((cd) => (
            <div className="card mb-3" key={cd.id}>
              <div className="card-body">
                <h6 className="card-title">
                  {cd.camiones?.descripcion || cd.camion_id}
                </h6>
                <p className="card-text">
                  <strong>Total de clientes:</strong>{" "}
                  {cd.clientesAsignados?.length || 0}
                </p>
                <div className="d-flex gap-2 mt-2">
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => handleVerMapa(cd)}
                  >
                    Ver Mapa
                  </button>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleEditar(cd)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleEliminar(cd.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
          {dia.registros.length === 0 && (
            <div className="text-muted text-center">Sin camiones</div>
          )}
        </div>
      )),
    // Solo se recalcula si columnasPorDia cambia
    [columnasPorDia, onVerMapa, onEditar, onEliminar]
  );

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

  // Renderiza las columnas memorizadas
  return <div className="row">{columnasRender}</div>;
});

export default CamionDiasColumnas;