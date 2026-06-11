import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ChevronLeft,
  MapPin,
  Building2,
  Clock,
  Navigation,
  LocateFixed,
} from "lucide-react";
import useGeolocation from "../../hooks/useGeolocation";
import { fetchAllEvents, formatDate } from "../../services/eventService";
import { distanceKm, formatDistance, hasCoords } from "../../lib/geo";
import NearbyMap from "./components/NearbyMap";
import Loading from "../../components/ui/Loading";

export default function EventosProximos() {
  const navigate = useNavigate();

  /* Solicita a localização assim que a página é aberta (prompt nativo do navegador) */
  const { position, status, error: geoError, request } = useGeolocation();

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState(null);

  useEffect(() => {
    let active = true;
    fetchAllEvents()
      .then((all) => active && setEvents(all.filter(hasCoords)))
      .catch(() => active && setEventsError("Não foi possível carregar os eventos."))
      .finally(() => active && setLoadingEvents(false));
    return () => {
      active = false;
    };
  }, []);

  /* Com localização: ordena por distância. Sem: ordena por data. */
  const sortedEvents = useMemo(() => {
    const withDist = events.map((e) => ({
      ...e,
      distanceKm: position
        ? distanceKm(position.lat, position.lng, Number(e.latitude), Number(e.longitude))
        : null,
    }));
    if (position) {
      return withDist.sort((a, b) => a.distanceKm - b.distanceKm);
    }
    return withDist.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [events, position]);

  const locating = status === "requesting" || status === "idle";

  return (
    <main className="min-h-screen bg-[#FDF3EA] pt-[82px] flex flex-col">
      {/* Cabeçalho */}
      <div className="w-full bg-[#D5650D] py-8 px-4 md:px-12 flex items-center relative overflow-hidden">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shrink-0 hover:scale-105 transition-transform shadow-md z-10 absolute left-4 md:left-12"
          aria-label="Voltar"
        >
          <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-[#D5650D]" />
        </button>
        <div className="flex-1 text-center px-12 md:px-16">
          <h1
            className="font-handwriting text-white pt-2"
            style={{ fontSize: "clamp(2.2rem, 6vw, 4.5rem)", lineHeight: 1.1 }}
          >
            Eventos mais Próximos de Você
          </h1>
        </div>
      </div>

      <div className="flex-1 w-full max-w-[1200px] mx-auto p-4 md:p-8 flex flex-col gap-6">
        {!position && !locating && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white rounded-2xl border border-[#FF6D2C]/30 shadow-sm p-4">
            <MapPin className="w-6 h-6 text-[#FF6D2C] shrink-0" />
            <p className="flex-1 text-sm text-[#1E1E1E]/70">
              {status === "denied"
                ? "Permissão de localização negada. Libere o acesso nas configurações do navegador para ver os eventos mais próximos de você."
                : geoError ||
                  "Não foi possível obter sua localização. Mostrando todos os eventos por data."}
            </p>
            <button
              onClick={request}
              className="flex items-center justify-center gap-2 text-sm font-bold text-white bg-[#FF6D2C] hover:bg-[#e65c18] rounded-lg px-4 py-2 transition-colors shrink-0"
            >
              <LocateFixed size={16} />
              Tentar novamente
            </button>
          </div>
        )}

        <div className="w-full bg-white rounded-3xl border-4 border-white shadow-xl overflow-hidden relative h-[420px] md:h-[500px]">
          {locating ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loading size="lg" message="Obtendo sua localização..." />
            </div>
          ) : (
            <div className="absolute inset-0">
              <NearbyMap userPosition={position} events={sortedEvents} />
            </div>
          )}
        </div>

        <section>
          <h2 className="font-bold text-[#1E1E1E] text-xl md:text-2xl mb-4 flex items-center gap-2">
            <Navigation size={22} className="text-[#FF6D2C]" />
            {position ? "Eventos perto de você" : "Eventos"}
          </h2>

          {loadingEvents ? (
            <Loading message="Carregando eventos..." />
          ) : eventsError ? (
            <p className="text-center text-red-500 font-semibold py-10">
              {eventsError}
            </p>
          ) : sortedEvents.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center">
              <p className="text-sm text-[#1E1E1E]/40">
                Nenhum evento com localização cadastrada por enquanto.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedEvents.map((event) => (
                <Link
                  key={event.id}
                  to={`/eventos/${event.slug}`}
                  className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-[#FF6D2C] text-base">
                      {event.title}
                    </h3>
                    {event.distanceKm != null && (
                      <span className="flex items-center gap-1 text-xs font-bold text-[#FF6D2C] bg-[#FF6D2C]/10 rounded-full px-2.5 py-1 shrink-0">
                        <MapPin size={12} />
                        {formatDistance(event.distanceKm)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="flex items-center gap-2 text-sm text-[#1E1E1E]/60">
                      <Building2 size={14} className="shrink-0" />
                      {event.location || "Local a definir"}
                    </span>
                    <span className="flex items-center gap-2 text-sm text-[#1E1E1E]/60">
                      <Clock size={14} className="shrink-0" />
                      {formatDate(event.date)}
                      {event.time ? ` - ${event.time}` : ""}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
