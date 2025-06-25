// SelectorCoordenadasMapa.jsx
// Componente para seleccionar coordenadas geográficas en un mapa interactivo.
// Permite al usuario elegir una ubicación y la comunica al formulario padre.

import React, { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const SelectorCoordenadasMapa = React.memo(function SelectorCoordenadasMapa({ value, onChange, id = "selector-coordenadas" }) {
  const [marker, setMarker] = useState(
    value && value.x && value.y ? { lat: Number(value.y), lng: Number(value.x) } : null
  );

  useEffect(() => {
    if (value && value.x && value.y) {
      setMarker({ lat: Number(value.y), lng: Number(value.x) });
    }
  }, [value]);

  const handleMapClick = useCallback(
    (e) => {
      setMarker(e.latlng);
      onChange({ x: e.latlng.lng, y: e.latlng.lat });
    },
    [onChange]
  );

  function MapClicker() {
    useMapEvents({
      click: handleMapClick,
    });
    return null;
  }

  return (
    <div
      style={{ height: 300, width: "100%" }}
      id={id}
      role="region"
      aria-label="Selector de coordenadas en el mapa"
      tabIndex={0}
    >
      {marker === null && (
        <div className="alert alert-info text-center my-2" role="status" aria-live="polite">
          No hay coordenadas seleccionadas en el mapa.
        </div>
      )}
      <MapContainer
        center={
          marker
            ? [marker.lat, marker.lng]
            : [-34.9, -56.2]
        }
        zoom={marker ? 16 : 12}
        style={{ height: "100%", width: "100%" }}
        aria-label="Mapa para seleccionar coordenadas"
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClicker />
        {marker && (
          <Marker position={[marker.lat, marker.lng]}>
            <Popup>
              Coordenadas seleccionadas:<br />
              Lat: {marker.lat.toFixed(6)}<br />
              Lng: {marker.lng.toFixed(6)}
            </Popup>
          </Marker>
        )}
      </MapContainer>
      <div className="form-text" id={`${id}-ayuda`}>
        Haga clic en el mapa para seleccionar la ubicación del cliente.
      </div>
    </div>
  );
});

export default SelectorCoordenadasMapa;
