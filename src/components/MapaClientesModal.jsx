import React from "react";
import MapaClientes from "./MapaClientes";

function MapaClientesModal({ clientes, onClose }) {
  return (
    <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.3)" }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Mapa de Clientes</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body" style={{ height: 500 }}>
            <MapaClientes clientes={clientes} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapaClientesModal;