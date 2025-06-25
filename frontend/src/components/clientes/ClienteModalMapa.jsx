// ClienteModalMapa.jsx
// Modal que muestra la ubicación de un cliente en un mapa interactivo.
// Utiliza react-leaflet para la visualización y permite cerrar el modal.

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Modal, Alert } from "react-bootstrap";

const ClientesPanelModalMapa = ({ showModal, mapCoords, setShowModal }) => {
  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      size="lg"
      centered
      aria-labelledby="modal-mapa-titulo"
    >
      <Modal.Header closeButton>
        <Modal.Title id="modal-mapa-titulo">Ubicación en el Mapa</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ height: "400px" }}>
        {mapCoords.lat && mapCoords.lng ? (
          <MapContainer
            center={[mapCoords.lat, mapCoords.lng]}
            zoom={16}
            style={{ height: "100%", width: "100%" }}
            aria-label="Mapa de ubicación del cliente"
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[mapCoords.lat, mapCoords.lng]}>
              <Popup>Ubicación del cliente</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <Alert variant="info" className="text-center my-4" role="status" aria-live="polite">
            No hay coordenadas para mostrar en el mapa.
          </Alert>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ClientesPanelModalMapa;
