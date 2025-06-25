// ClienteModalMapa.jsx
// Modal que muestra la ubicación de un cliente en un mapa interactivo.
// Utiliza react-leaflet para la visualización y permite cerrar el modal.

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Modal, Alert } from "react-bootstrap";
import './modal-animacion.css';

const ClientesPanelModalMapa = ({ coords, onClose }) => {
  // Prevenir error si coords es undefined o null
  const lat = coords?.lat;
  const lng = coords?.lng;
  return (
    <Modal
      show={!!coords}
      onHide={onClose}
      size="lg"
      centered
      aria-labelledby="modal-mapa-titulo"
      dialogClassName="modal-fade-animado"
      backdropClassName="modal-backdrop-animado"
      animation={true}
    >
      <Modal.Header closeButton>
        <Modal.Title id="modal-mapa-titulo">Ubicación en el Mapa</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ height: "400px" }}>
        {lat && lng ? (
          <MapContainer
            center={[lat, lng]}
            zoom={16}
            style={{ height: "100%", width: "100%" }}
            aria-label="Mapa de ubicación del cliente"
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[lat, lng]}>
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
