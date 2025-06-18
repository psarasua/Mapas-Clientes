import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Genera un color HSL único para cada cliente
function generarColores(n) {
  return Array.from({ length: n }, (_, i) => `hsl(${(i * 360) / n}, 90%, 45%)`);
}

// Crea un icono de color personalizado usando divIcon
function getColorIcon(color) {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background:${color};width:22px;height:22px;border-radius:50%;border:2px solid #333"></div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 26],
    popupAnchor: [0, -26]
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
  const colores = generarColores(clientesConUbicacion.length);

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
                    width: 18,
                    height: 18,
                    background: colores[idx],
                    borderRadius: "50%",
                    border: "2px solid #333",
                    marginRight: 10
                  }}
                ></span>
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
                icon={getColorIcon(colores[idx])}
              >
                <Popup>{c.nombre}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default MapaClientes;