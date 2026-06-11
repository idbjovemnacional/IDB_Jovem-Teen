import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Building2, Clock } from "lucide-react";
import EventFilters from "./components/EventFilters";
import EventSearch from "./components/EventSearch";
import EventList from "./components/EventList";
import EmptyEvents from "./components/EmptyEvents";
import {
  fetchAllEvents,
  searchEvents,
  isOngoingOrFuture,
  splitDateTime,
} from "../../services/eventService";

/* Card do carrossel */
function CarouselCard({ event }) {
  return (
    <div className="min-w-[260px] sm:min-w-[280px] flex-shrink-0 bg-white rounded-2xl overflow-hidden shadow-sm group">
      <div className="relative overflow-hidden h-44">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4 flex flex-col items-center">
        <h3 className="font-bold text-[#FFCB9A] text-xl mb-3 text-center">
          {event.title}
        </h3>
        <div className="flex items-center gap-4 mb-4">
          <span className="flex items-center gap-1.5 text-sm font-medium text-[#1E1E1E]">
            <Building2 size={16} />
            {event.location}
          </span>
          <span className="flex items-center gap-1.5 text-sm font-medium text-[#1E1E1E]">
            <Clock size={16} />
            {event.time}
          </span>
        </div>
        <div className="flex gap-3 w-full">
          <Link
            to={`/eventos/${event.slug}`}
            className="flex-1 flex items-center justify-center gap-2 text-xs font-bold text-black bg-[#E0E0E0] rounded-lg px-3 py-2 hover:bg-[#d1d1d1] transition-colors"
          >
            Veja mais <span className="text-black">→</span>
          </Link>
          <button className="flex-1 text-xs font-bold bg-[#FF6D2C] hover:bg-[#e65c18] text-white rounded-lg px-3 py-2 transition-colors">
            Inscreva-se
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Eventos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearchState] = useState(searchParams.get("q") || "");

  const setSearch = (val) => {
    setSearchState(val);
    if (val) {
      setSearchParams({ q: val });
    } else {
      setSearchParams({});
    }
  };
  const [filters, setFilters] = useState({
    tipo: "Tipo de evento",
    regiao: "Região",
    data: "Data",
  });

  const [allEvents, setAllEvents] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carouselRef = useRef(null);

  /* Carrega todos os eventos uma vez */
  useEffect(() => {
    let active = true;
    fetchAllEvents()
      .then((all) => {
        if (!active) return;
        setAllEvents(all);
        setResults(all);
      })
      .catch(() => active && setError("Não foi possível carregar os eventos."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  /* Busca server-side quando há termo (>= 2 caracteres) */
  useEffect(() => {
    const termo = search.trim();
    if (termo.length < 2) {
      setResults(allEvents);
      return;
    }
    let active = true;
    searchEvents(termo)
      .then((found) => active && setResults(found))
      .catch(() => active && setResults([]));
    return () => {
      active = false;
    };
  }, [search, allEvents]);

  /* Apenas eventos que ainda não terminaram (vão acontecer ou estão acontecendo) */
  const upcoming = allEvents
    .filter(isOngoingOrFuture)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const featured = upcoming[0] || null;

  /* "Próximos eventos": somente os eventos do mês atual */
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const upcomingThisMonth = upcoming.filter((e) =>
    splitDateTime(e.date).day.startsWith(currentMonth)
  );

  /* Grid "Todos os eventos" também esconde os já encerrados */
  const visibleResults = results.filter(isOngoingOrFuture);

  const scrollCarousel = (dir) => {
    carouselRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#FDF3EA] pt-[70px] md:pt-[82px]">
      {/* Topo: título + filtros */}
      <section className="w-full bg-[#FDF3EA] pt-10 pb-6">
        <div className="w-full max-w-6xl mx-auto px-4">
          <h1
            className="font-black text-[#1E1E1E] mb-6"
            style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)" }}
          >
            Eventos
          </h1>

          {/* Filtros + busca */}
          <div className="flex flex-wrap gap-3 items-center">
            <EventFilters filters={filters} onChange={setFilters} />
            <EventSearch
              value={search}
              onChange={setSearch}
              onClear={() => setSearch("")}
            />
          </div>
        </div>
      </section>

      {/* Em breve (evento destaque) */}
      {featured && (
        <section className="w-full bg-[#FDF3EA] py-10">
          <div className="w-full max-w-6xl mx-auto px-4">
            <h2 className="font-handwriting text-[#1E1E1E] mb-6" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>
              Em breve
            </h2>

            <div className="rounded-[32px] overflow-hidden max-w-3xl border-[6px] border-black bg-black mx-auto">
              <div className="relative">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-[300px] object-cover rounded-t-[26px]"
                />
              </div>
              {/* Info sobre a imagem */}
              <div className="p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
                <div>
                  <h3 className="font-bold text-[#FF6D2C] text-2xl leading-tight">
                    {featured.title}
                  </h3>
                  <div className="flex flex-col gap-1 mt-2">
                    <span className="flex items-center gap-1.5 text-white/90 text-sm">
                      <Building2 size={16} />
                      {featured.location}
                    </span>
                    <span className="flex items-center gap-1.5 text-white/90 text-sm">
                      <Clock size={16} />
                      {featured.time}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 items-end shrink-0">
                  <Link
                    to={`/eventos/${featured.slug}`}
                    className="flex items-center justify-between gap-2 bg-[#E0E0E0] text-black text-sm font-bold px-4 py-2 rounded-lg hover:bg-[#d1d1d1] transition-colors w-[130px]"
                  >
                    Veja mais <span className="text-black text-lg leading-none">→</span>
                  </Link>
                  <button className="bg-[#FF6D2C] hover:bg-[#e65c18] text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors w-[130px]">
                    Inscreva-se
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Próximos eventos (carrossel) — somente do mês atual */}
      {upcomingThisMonth.length > 0 && (
        <section className="w-full bg-[#FDF3EA] py-10">
          <div className="w-full max-w-6xl mx-auto px-4">
            <h2
              className="font-bold text-[#1E1E1E] text-center mb-8"
              style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)" }}
            >
              Próximos eventos
            </h2>

            {/* Carrossel com setas */}
            <div className="relative">
              {/* Seta esquerda */}
              <button
                onClick={() => scrollCarousel(-1)}
                className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 hover:scale-110 transition-transform"
                aria-label="Anterior"
              >
                <div className="w-0 h-0 border-y-[20px] border-y-transparent border-r-[30px] border-r-black"></div>
              </button>

              {/* Track */}
              <div
                ref={carouselRef}
                className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth px-1 pb-2"
              >
                {upcomingThisMonth.map((event) => (
                  <CarouselCard key={event.id} event={event} />
                ))}
              </div>

              {/* Seta direita */}
              <button
                onClick={() => scrollCarousel(1)}
                className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 hover:scale-110 transition-transform"
                aria-label="Próximo"
              >
                <div className="w-0 h-0 border-y-[20px] border-y-transparent border-l-[30px] border-l-black"></div>
              </button>
            </div>

          </div>
        </section>
      )}

      {/* Todos os eventos (grid com filtro) */}
      <section className="w-full bg-[#FDF3EA] py-10 pb-20">
        <div className="w-full max-w-6xl mx-auto px-4">
          {loading ? (
            <p className="text-center text-[#1E1E1E]/50 font-semibold py-10">
              Carregando eventos...
            </p>
          ) : error ? (
            <p className="text-center text-red-500 font-semibold py-10">{error}</p>
          ) : visibleResults.length > 0 ? (
            <EventList events={visibleResults} />
          ) : (
            <EmptyEvents />
          )}
        </div>
      </section>
    </main>
  );
}
