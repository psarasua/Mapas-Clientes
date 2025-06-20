import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Crea un icono con número usando divIcon
function getNumeroIcon(numero) {
  return L.divIcon({
    className: "numero-marker",
    html: `<div style="
      background:#fff;
      border:1.5px solid #888;
      border-radius:50%;
      width:24px;
      height:24px;
      display:flex;
      align-items:center;
      justify-content:center;
      font-weight:400;
      font-size:14px;
      color:#222;
      ">
      ${numero}
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24]
  });
}

// Componente auxiliar para centrar el mapa en un cliente seleccionado
function FlyTo({ position }) {
  const map = useMap();
  if (position) map.flyTo(position, 16);
  return null;
}

function MapaClientes({ clientes }) {
  const [fullscreen, setFullscreen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);

  const clientesConUbicacion = clientes.filter(
    c => !isNaN(Number(c.x)) && !isNaN(Number(c.y))
  );
  if (!clientesConUbicacion.length) return <div>No hay clientes con ubicación.</div>;
  const center = [clientesConUbicacion[0].y, clientesConUbicacion[0].x];

  return (
    <div>
      {/* Botón fullscreen */}
      {fullscreen && (
        <button
          className="btn btn-danger"
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 3000
          }}
          onClick={() => setFullscreen(false)}
        >
          Salir de Fullscreen
        </button>
      )}
      {!fullscreen && (
        <button
          className="btn btn-secondary"
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 1000
          }}
          onClick={() => setFullscreen(true)}
        >
          Fullscreen
        </button>
      )}
      <div
        className="row"
        style={{
          height: fullscreen ? "100vh" : 400,
          width: fullscreen ? "100vw" : "100%",
          position: fullscreen ? "fixed" : "relative",
          top: fullscreen ? 0 : "auto",
          left: fullscreen ? 0 : "auto",
          zIndex: fullscreen ? 2000 : "auto",
          background: "#fff"
        }}
      >
        {/* Lista de clientes */}
        <div className="col-md-3" style={{ overflowY: "auto", maxHeight: "100%" }}>
          <ul className="list-group">
            {clientesConUbicacion.map((c, idx) => (
              <li
                key={c.id || idx}
                className="list-group-item d-flex align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedPosition([c.y, c.x])}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    border: "1.5px solid #888",
                    background: "#fff",
                    color: "#222",
                    fontWeight: 400,
                    fontSize: 14,
                    marginRight: 10,
                    textAlign: "center",
                    lineHeight: "24px"
                  }}
                >
                  {idx + 1}
                </span>
                {c.nombre}
              </li>
            ))}
          </ul>
        </div>
        {/* Mapa */}
        <div className="col-md-9" style={{ height: "100%" }}>
          <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
            <FlyTo position={selectedPosition} />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {clientesConUbicacion.map((c, idx) => (
              <Marker
                key={c.id || idx}
                position={[c.y, c.x]}
                icon={getNumeroIcon(idx + 1)}
              >
                <Popup>
                  <strong>{idx + 1}. {c.nombre}</strong>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default MapaClientes;