import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.fullscreen/Control.FullScreen.js";
import "leaflet.fullscreen/Control.FullScreen.css";
import L from "leaflet";

// Colores para los pines
const colores = [
  "red", "blue", "green", "orange", "purple", "darkred", "cadetblue"
];

// Devuelve un icono de color distinto para cada cliente
function getColorIcon(idx) {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${colores[idx % colores.length]}.png`,
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
}

// Componente auxiliar para centrar el mapa en un cliente seleccionado
function FlyTo({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 16);
  }, [position, map]);
  return null;
}

// Agrega el control de fullscreen al mapa
function FullscreenManual() {
  const map = useMap();
  useEffect(() => {
    if (!map.fullscreenControlAdded) {
      map.addControl(new L.Control.Fullscreen());
      map.fullscreenControlAdded = true;
    }
  }, [map]);
  return null;
}

function MapaClientes({ clientes }) {
  const [selectedPosition, setSelectedPosition] = useState(null);

  // Solo clientes con coordenadas válidas
  const clientesConUbicacion = clientes.filter(
    c => !isNaN(Number(c.x)) && !isNaN(Number(c.y))
  );

  if (!clientesConUbicacion.length) return <div>No hay clientes con ubicación.</div>;

  // Centra el mapa en el primer cliente con ubicación
  const center = [clientesConUbicacion[0].y, clientesConUbicacion[0].x];

  return (
    <div className="row">
      <div className="col-md-4">
        <ul className="list-group" style={{ maxHeight: 350, overflowY: "auto" }}>
          {clientesConUbicacion.map((c, idx) => (
            <li
              key={c.id}
              className="list-group-item"
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedPosition([c.y, c.x])}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 12,
                  height: 12,
                  background: colores[idx % colores.length],
                  borderRadius: "50%",
                  marginRight: 8
                }}
              ></span>
              {c.nombre}
            </li>
          ))}
        </ul>
      </div>
      <div className="col-md-8">
        <MapContainer center={center} zoom={13} style={{ height: 350, width: "100%" }}>
          <FullscreenManual />
          <FlyTo position={selectedPosition} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {clientesConUbicacion.map((c, idx) => (
            <Marker
              key={c.id}
              position={[c.y, c.x]}
              icon={getColorIcon(idx)}
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