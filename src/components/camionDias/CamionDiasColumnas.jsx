import React from "react";

function CamionDiasColumnas({ columnasPorDia, onVerMapa, onEditar, onEliminar }) {
  return (
    <div className="row">
      {columnasPorDia.map((dia) => (
        <div className="col" key={dia.id}>
          <h5 className="text-center">{dia.descripcion}</h5>
          {dia.registros.map((cd) => (
            <div className="card mb-3" key={cd.id}>
              <div className="card-body">
                <h6 className="card-title">
                  {cd.camiones?.descripcion || cd.camion_id}
                </h6>
                <p className="card-text">
                  <strong>Total de clientes:</strong> {cd.clientesAsignados?.length || 0}
                </p>
                <div className="d-flex gap-2 mt-2">
                  <button className="btn btn-info btn-sm" onClick={() => onVerMapa(cd)}>
                    Ver Mapa
                  </button>
                  <button className="btn btn-warning btn-sm" onClick={() => onEditar(cd)}>
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onEliminar(cd.id)}
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
      ))}
    </div>
  );
}

export default CamionDiasColumnas;