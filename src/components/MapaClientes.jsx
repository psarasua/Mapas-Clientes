import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function MapaClientes({ clientes }) {
  // Filtra solo los clientes que tienen coordenadas válidas
  const clientesConUbicacion = clientes.filter(
    c => !isNaN(Number(c.x)) && !isNaN(Number(c.y))
  );

  if (!clientesConUbicacion.length) return <div>No hay clientes con ubicación.</div>;

  // Centra el mapa en el primer cliente con ubicación
  const center = [clientesConUbicacion[0].y, clientesConUbicacion[0].x];

  return (
    <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {clientesConUbicacion.map((c) => (
        <Marker key={`${c.id}-${c.x}-${c.y}`}  position={[c.y, c.x]}>
          <Popup>{c.nombre}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapaClientes;