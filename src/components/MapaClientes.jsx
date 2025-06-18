import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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

// Genera un color HSL único para cada cliente
function generarColores(n) {
  return Array.from({ length: n }, (_, i) => `hsl(${(i * 360) / n}, 90%, 45%)`);
}

function MapaClientes({ clientes }) {
  const [fullscreen, setFullscreen] = useState(false);

  const clientesConUbicacion = clientes.filter(
    c => !isNaN(Number(c.x)) && !isNaN(Number(c.y))
  );
  if (!clientesConUbicacion.length) return <div>No hay clientes con ubicación.</div>;
  const center = [clientesConUbicacion[0].y, clientesConUbicacion[0].x];

  // Genera una lista de colores según la cantidad de clientes
  const colores = generarColores(clientesConUbicacion.length);

  return (
    <div>
      {/* Botón siempre visible en fullscreen */}
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
      {/* Botón para entrar a fullscreen */}
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
        <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
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
  );
}

export default MapaClientes;