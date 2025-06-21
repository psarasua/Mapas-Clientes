import { useState, useMemo, useCallback } from "react"; // Importa hooks necesarios
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"; // Importa componentes de Leaflet
import "leaflet/dist/leaflet.css"; // Importa estilos de Leaflet
import L from "leaflet"; // Importa Leaflet para iconos personalizados

// Crea un icono con número usando divIcon (memorizado para evitar recreación)
const getNumeroIcon = (numero) =>
  L.divIcon({
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
    popupAnchor: [0, -24],
  });

// Componente auxiliar para centrar el mapa en un cliente seleccionado
function FlyTo({ position }) {
  const map = useMap(); // Obtiene instancia del mapa
  if (position) map.flyTo(position, 16); // Centra el mapa si hay posición seleccionada
  return null;
}

function MapaClientes({ clientes }) {
  // Estado para controlar si el mapa está en fullscreen
  const [fullscreen, setFullscreen] = useState(false);
  // Estado para la posición seleccionada (para centrar el mapa)
  const [selectedPosition, setSelectedPosition] = useState(null);

  // Filtra solo clientes con coordenadas válidas (memorizado para eficiencia)
  const clientesConUbicacion = useMemo(
    () => clientes.filter(
      c => !isNaN(Number(c.x)) && !isNaN(Number(c.y))
    ),
    [clientes]
  );

  // Si no hay clientes con ubicación, muestra mensaje
  if (!clientesConUbicacion.length) return <div>No hay clientes con ubicación.</div>;

  // Calcula el centro inicial del mapa (primer cliente con ubicación)
  const center = useMemo(
    () => [clientesConUbicacion[0].y, clientesConUbicacion[0].x],
    [clientesConUbicacion]
  );

  // Maneja el click en un cliente de la lista para centrar el mapa (memorizado)
  const handleClienteClick = useCallback(
    (c) => setSelectedPosition([c.y, c.x]),
    []
  );

  // Render principal del componente
  return (
    <div>
      {/* Botón para salir de fullscreen */}
      {fullscreen && (
        <button
          className="btn btn-danger"
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 3000,
          }}
          onClick={() => setFullscreen(false)}
        >
          Salir de Fullscreen
        </button>
      )}
      {/* Botón para entrar en fullscreen */}
      {!fullscreen && (
        <button
          className="btn btn-secondary"
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 1000,
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
          background: "#fff",
        }}
      >
        {/* Lista de clientes a la izquierda */}
        <div className="col-md-3" style={{ overflowY: "auto", maxHeight: "100%" }}>
          <ul className="list-group">
            {clientesConUbicacion.map((c, idx) => (
              <li
                key={c.id || idx}
                className="list-group-item d-flex align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => handleClienteClick(c)}
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
                    lineHeight: "24px",
                  }}
                >
                  {idx + 1}
                </span>
                {c.nombre}
              </li>
            ))}
          </ul>
        </div>
        {/* Mapa con los clientes */}
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