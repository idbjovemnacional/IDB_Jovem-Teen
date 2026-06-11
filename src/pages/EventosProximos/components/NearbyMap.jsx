import { useEffect } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatDistance } from "../../../lib/geo";

/* Cria um marcador de "ponto" colorido (não depende das imagens do Leaflet) */
function dotIcon(color) {
  return L.divIcon({
    className: "",
    html: `<div style="width:18px;height:18px;border-radius:9999px;background:${color};border:3px solid #fff;box-shadow:0 0 0 3px ${color}59"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

/* Marcador "você está aqui" (ponto azul) e marcador de evento (ponto laranja) */
const userIcon = dotIcon("#2563eb");
const eventIcon = dotIcon("#FF6D2C");

/* Centro padrão (Brasília) quando ainda não há localização */
const DEFAULT_CENTER = [-15.7934, -47.8822];

/* Reposiciona o mapa quando a localização do usuário muda */
function Recenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, zoom ?? map.getZoom());
  }, [center, zoom, map]);
  return null;
}

export default function NearbyMap({ userPosition, events }) {
  const center = userPosition
    ? [userPosition.lat, userPosition.lng]
    : DEFAULT_CENTER;
  const zoom = userPosition ? 12 : 4;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Recenter center={center} zoom={zoom} />

      {userPosition && (
        <Marker position={center} icon={userIcon}>
          <Popup>Você está aqui</Popup>
        </Marker>
      )}

      {events.map((ev) => (
        <Marker
          key={ev.id}
          position={[Number(ev.latitude), Number(ev.longitude)]}
          icon={eventIcon}
        >
          <Popup>
            <strong>{ev.title}</strong>
            {ev.location && (
              <>
                <br />
                {ev.location}
              </>
            )}
            {ev.distanceKm != null && (
              <>
                <br />
                {formatDistance(ev.distanceKm)} de distância
              </>
            )}
            <br />
            <Link to={`/eventos/${ev.slug}`}>Ver evento →</Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
