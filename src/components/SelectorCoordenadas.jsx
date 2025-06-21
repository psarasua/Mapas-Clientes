import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Icono personalizado para el marcador
function getNumeroIcon(numero) {
  return L.divIcon({
    className: "numero-marker",
    html: `<div style="background:#fff;border:2px solid #333;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:16px;">${numero}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

function SelectorCoordenadas({ value, onChange }) {
  const [marker, setMarker] = useState(
    value && value.x && value.y ? { lat: Number(value.y), lng: Number(value.x) } : null
  );

  useEffect(() => {
    if (value && value.x && value.y) {
      setMarker({ lat: Number(value.y), lng: Number(value.x) });
    }
  }, [value.x, value.y]);

  function MapClicker() {
    useMapEvents({
      click(e) {
        setMarker(e.latlng);
        onChange({ x: e.latlng.lng, y: e.latlng.lat });
      },
    });
    return null;
  }

  return (
    <div style={{ height: 300, width: "100%" }}>
      <MapContainer
        center={
          marker
            ? [marker.lat, marker.lng]
            : [-34.9, -56.2]
        }
        zoom={marker ? 16 : 12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClicker />
        {marker && (
          <Marker position={[marker.lat, marker.lng]} icon={getNumeroIcon(1)}>
            <Popup>
              Coordenadas seleccionadas:<br />
              Lat: {marker.lat.toFixed(6)}<br />
              Lng: {marker.lng.toFixed(6)}
            </Popup>
          </Marker>
        )}
      </MapContainer>
      <div className="form-text">
        Haga clic en el mapa para seleccionar la ubicación del cliente.
      </div>
    </div>
  );
}

export default SelectorCoordenadas;