import React, { useState, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const ClientesMapa = () => {
  // ...existing code...

  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {clientes.map((cliente) => (
        <Marker
          key={cliente.id}
          position={[cliente.ubicacion.lat, cliente.ubicacion.lng]}
          icon={customIcon}
        >
          <Popup>
            {cliente.nombre} <br /> {cliente.direccion}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default ClientesMapa;
