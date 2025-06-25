// CamionDiaMapaModal.jsx
// Modal que muestra un mapa con los clientes asignados a un camión en un día específico.
// Utiliza el componente ClientesMapa para la visualización geográfica.
// Permite cerrar el modal y muestra un mensaje si no hay clientes asignados.

import React, { useCallback } from "react";
import { Modal, Alert } from "react-bootstrap";
import ClientesMapa from "../mapas/ClientesMapa";

const CamionDiaMapaModal = React.memo(function CamionDiaMapaModal({ clientes, onClose }) {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Modal
      show={true}
      onHide={handleClose}
      size="xl"
      centered
      aria-labelledby="mapa-modal-titulo"
    >
      <Modal.Header closeButton>
        <Modal.Title id="mapa-modal-titulo">Mapa de Clientes</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ height: 500 }}>
        {clientes && clientes.length > 0 ? (
          <ClientesMapa clientes={clientes} />
        ) : (
          <Alert variant="info" className="text-center my-4" role="status" aria-live="polite">
            No hay clientes asignados para mostrar en el mapa.
          </Alert>
        )}
      </Modal.Body>
    </Modal>
  );
});

export default CamionDiaMapaModal;
