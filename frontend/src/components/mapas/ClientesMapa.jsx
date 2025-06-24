import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const ClientesMapa = ({ clientes = [] }) => {
  // Centrar el mapa en el primer cliente o en una posición por defecto
  const position = useMemo(() => {
    if (clientes.length > 0) {
      const c = clientes[0];
      return [c.ubicacion?.lat || 19.4326, c.ubicacion?.lng || -99.1332];
    }
    return [19.4326, -99.1332]; // CDMX por defecto
  }, [clientes]);

  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: 400, width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {clientes.map((cliente) =>
        cliente.ubicacion ? (
          <Marker
            key={cliente.id}
            position={[cliente.ubicacion.lat, cliente.ubicacion.lng]}
            icon={customIcon}
          >
            <Popup>
              <strong>{cliente.nombre}</strong>
              <br />
              {cliente.direccion}
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
};

export default ClientesMapa;
