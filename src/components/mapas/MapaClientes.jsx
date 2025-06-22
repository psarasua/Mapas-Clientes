import React, { useState, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Definir la función fuera del componente, sin hooks
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
    popupAnchor: [0, -24],
  });
}

// Componente auxiliar para centrar el mapa en un cliente seleccionado
const FlyTo = React.memo(function FlyTo({ position }) {
  const map = useMap();
  if (position) map.flyTo(position, 16);
  return null;
});

const MapaClientes = React.memo(function MapaClientes({ clientes }) {
  const [fullscreen, setFullscreen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);

  // Memoiza la lista de clientes con ubicación válida
  const clientesConUbicacion = useMemo(
    () => clientes.filter(
      c => !isNaN(Number(c.x)) && !isNaN(Number(c.y))
    ),
    [clientes]
  );

  // Memoiza el centro inicial del mapa
  const center = useMemo(
    () => [clientesConUbicacion[0]?.y, clientesConUbicacion[0]?.x],
    [clientesConUbicacion]
  );

  // Memoiza el handler para centrar el mapa en el cliente seleccionado
  const handleClienteClick = useCallback(
    (c) => setSelectedPosition([c.y, c.x]),
    []
  );

  // Memoiza la lista de clientes para la barra lateral
  const clientesList = useMemo(() => (
    <ul
      className="list-group"
      role="list"
      aria-label="Lista de clientes con ubicación"
      tabIndex={0}
    >
      {clientesConUbicacion.map((c, idx) => (
        <li
          key={c.id || idx}
          className="list-group-item d-flex align-items-center"
          style={{ cursor: "pointer" }}
          onClick={() => handleClienteClick(c)}
          tabIndex={0}
          role="listitem"
          aria-label={`Cliente ${c.nombre}, marcador ${idx + 1}`}
          onKeyDown={e => {
            if (e.key === "Enter" || e.key === " ") handleClienteClick(c);
          }}
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
            aria-hidden="true"
          >
            {idx + 1}
          </span>
          <span>{c.nombre}</span>
        </li>
      ))}
    </ul>
  ), [clientesConUbicacion, handleClienteClick]);

  // Memoiza los marcadores del mapa
  const markers = useMemo(() =>
    clientesConUbicacion.map((c, idx) => (
      <Marker
        key={c.id || idx}
        position={[c.y, c.x]}
        icon={getNumeroIcon(idx + 1)}
        aria-label={`Marcador ${idx + 1} para cliente ${c.nombre}`}
      >
        <Popup>
          <strong>{idx + 1}. {c.nombre}</strong>
        </Popup>
      </Marker>
    )),
    [clientesConUbicacion]
  );

  if (!clientesConUbicacion.length)
    return <div className="alert alert-warning" role="status" aria-live="polite">No hay clientes con ubicación.</div>;

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
          aria-label="Salir de pantalla completa"
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
          aria-label="Ver mapa en pantalla completa"
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
        role="region"
        aria-label="Mapa de clientes y lista"
      >
        {/* Lista de clientes a la izquierda */}
        <div className="col-md-3" style={{ overflowY: "auto", maxHeight: "100%" }}>
          <h6 className="mt-3 mb-2" id="clientes-lista-titulo" tabIndex={0}>
            Clientes con ubicación
          </h6>
          {clientesList}
        </div>
        {/* Mapa con los clientes */}
        <div className="col-md-9" style={{ height: "100%" }}>
          <MapContainer
            center={center}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            aria-label="Mapa de clientes"
            role="application"
            aria-describedby="clientes-lista-titulo"
          >
            <FlyTo position={selectedPosition} />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {markers}
          </MapContainer>
        </div>
      </div>
    </div>
  );
});

export default MapaClientes;