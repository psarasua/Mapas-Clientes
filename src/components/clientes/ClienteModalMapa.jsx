import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const ClientesPanelModalMapa = ({ showModal, mapCoords, setShowModal }) => {
  if (!showModal) return null;
  return (
    <>
      <div
        className="modal fade show"
        style={{ display: "block", background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-mapa-titulo"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document" style={{ maxWidth: 700, margin: "auto" }}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modal-mapa-titulo">
                Ubicación en el Mapa
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Cerrar modal"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <div className="modal-body" style={{ height: "400px" }}>
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
                <div className="text-center text-danger" role="status" aria-live="polite">
                  No GeoReferenciado
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1040 }}
        aria-hidden="true"
        onClick={() => setShowModal(false)}
      ></div>
    </>
  );
};

export default ClientesPanelModalMapa;