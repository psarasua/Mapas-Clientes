import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const ClientesTableModalMapa = ({ showModal, mapCoords, setShowModal }) => {
  if (!showModal) return null;
  return (
    <>
      <div
        className="modal fade show"
        style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Ubicación en el Mapa</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <div className="modal-body" style={{ height: "400px" }}>
              {mapCoords.lat && mapCoords.lng ? (
                <MapContainer
                  center={[mapCoords.lat, mapCoords.lng]}
                  zoom={16}
                  style={{ height: "100%", width: "100%" }}
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
                <div className="text-center text-danger">No GeoReferenciado</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1040 }}
        onClick={() => setShowModal(false)}
      ></div>
    </>
  );
};

export default ClientesTableModalMapa;