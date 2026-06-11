import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
import { fetchEndereco } from "../../../services/mapaService";

/* Marcador laranja (ponto) — não depende das imagens do Leaflet */
const eventIcon = L.divIcon({
  className: "",
  html: `<div style="width:20px;height:20px;border-radius:9999px;background:#FF6D2C;border:3px solid #fff;box-shadow:0 0 0 3px rgba(255,109,44,0.4)"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

/* Centro padrão (Brasília) quando ainda não há ponto escolhido */
const DEFAULT_CENTER = [-15.7934, -47.8822];

/* Captura cliques no mapa */
function ClickCapture({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPicker({
  latitude,
  longitude,
  initialAddress = "",
  onChange,
}) {
  const hasPos =
    latitude !== "" && latitude != null && longitude !== "" && longitude != null;
  const pos = hasPos ? [Number(latitude), Number(longitude)] : null;

  const [address, setAddress] = useState(initialAddress);
  const [loadingAddr, setLoadingAddr] = useState(false);

  const handlePick = async (lat, lng) => {
    onChange(lat, lng);
    setAddress("");
    setLoadingAddr(true);
    const nome = await fetchEndereco(lat, lng);
    setAddress(nome || "");
    setLoadingAddr(false);
  };

  return (
    <div>
      <div className="h-[320px] w-full rounded-xl overflow-hidden border border-gray-300">
        <MapContainer
          center={pos || DEFAULT_CENTER}
          zoom={pos ? 14 : 4}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickCapture onPick={handlePick} />
          {pos && <Marker position={pos} icon={eventIcon} />}
        </MapContainer>
      </div>

      <div className="mt-2 flex items-start gap-2 text-sm">
        <MapPin size={16} className="text-[#FF6D2C] shrink-0 mt-0.5" />
        {pos ? (
          <div className="text-[#1E1E1E]/70">
            {loadingAddr
              ? "Buscando endereço..."
              : address || "Endereço não identificado"}
            <span className="block text-xs text-[#1E1E1E]/40">
              {pos[0].toFixed(6)}, {pos[1].toFixed(6)}
            </span>
          </div>
        ) : (
          <span className="text-[#1E1E1E]/50">
            Clique no mapa para marcar o local do evento.
          </span>
        )}
      </div>
    </div>
  );
}
