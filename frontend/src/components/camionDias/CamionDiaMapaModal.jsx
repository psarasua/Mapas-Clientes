// CamionDiaMapaModal.jsx
// Modal que muestra un mapa con los clientes asignados a un camión en un día específico.
// Utiliza el componente ClientesMapa para la visualización geográfica.
// Permite cerrar el modal y muestra un mensaje si no hay clientes asignados.

import React, { useCallback } from "react";
import ClientesMapa from "../mapas/ClientesMapa";

const CamionDiaMapaModal = React.memo(function CamionDiaMapaModal({ clientes, onClose }) {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ background: "rgba(0,0,0,0.3)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mapa-modal-titulo"
    >
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document" style={{ maxWidth: 900, margin: "auto" }}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="mapa-modal-titulo">
              Mapa de Clientes
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Cerrar modal"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body" style={{ height: 500 }}>
            {clientes && clientes.length > 0 ? (
              <ClientesMapa clientes={clientes} />
            ) : (
              <div className="alert alert-info text-center my-4" role="status" aria-live="polite">
                No hay clientes asignados para mostrar en el mapa.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default CamionDiaMapaModal;
