import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Clock,
  ChevronLeft,
  ChevronRight,
  CalendarPlus,
} from "lucide-react";
import EventFilters from "./components/EventFilters";
import EventSearch from "./components/EventSearch";
import EventList from "./components/EventList";
import EmptyEvents from "./components/EmptyEvents";

/* ── Dados mock ── */
const FEATURED_EVENT = {
  id: 0,
  title: "Nome do evento",
  location: "Local",
  time: "Horário",
  image: "/images/galeria/idb-jovem-one.jpg",
  slug: "evento-em-destaque",
};

const UPCOMING_EVENTS = [
  {
    id: 1,
    title: "Nome do evento",
    location: "Brasília",
    date: "25/04",
    time: "17:00",
    image: "/images/galeria/idb-teen-camp.jpg",
    slug: "evento-1",
    tipo: "Retiro",
    regiao: "Brasília",
  },
  {
    id: 2,
    title: "Nome do evento",
    location: "Moçoro",
    date: "10/05",
    time: "15:00",
    image: "/images/galeria/es-ne-ajo.jpg",
    slug: "evento-2",
    tipo: "Conferência",
    regiao: "Moçoro",
  },
  {
    id: 3,
    title: "Nome do evento",
    location: "Manaus",
    date: "10/05",
    time: "18:00",
    image: "/images/galeria/idb-jovem-one.jpg",
    slug: "evento-3",
    tipo: "Encontro",
    regiao: "Manaus",
  },
  {
    id: 4,
    title: "Nome do evento",
    location: "Fortaleza",
    date: "20/05",
    time: "19:00",
    image: "/images/galeria/idb-teen-camp.jpg",
    slug: "evento-4",
    tipo: "Culto",
    regiao: "Fortaleza",
  },
  {
    id: 5,
    title: "Nome do evento",
    location: "São Paulo",
    date: "01/06",
    time: "16:00",
    image: "/images/galeria/es-ne-ajo.jpg",
    slug: "evento-5",
    tipo: "Conferência",
    regiao: "São Paulo",
  },
];

/* ── Card do carrossel ── */
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
      <div className="p-4">
        <h3 className="font-semibold text-[#FF6D2C] text-sm mb-2">
          {event.title}
        </h3>
        <div className="flex items-center gap-3 mb-3">
          <span className="flex items-center gap-1 text-xs text-[#1E1E1E]/60">
            <Building2 size={12} />
            {event.location}
          </span>
          <span className="flex items-center gap-1 text-xs text-[#1E1E1E]/60">
            <Clock size={12} />
            {event.date} - {event.time}
          </span>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/eventos/${event.slug}`}
            className="text-xs font-semibold text-[#1E1E1E] border border-[#1E1E1E]/15 rounded-lg px-3 py-1.5 hover:border-[#FF6D2C] hover:text-[#FF6D2C] transition-colors"
          >
            Veja mais →
          </Link>
          <button className="flex-1 text-xs font-semibold bg-[#FF6D2C] hover:bg-[#e65c18] text-white rounded-lg px-3 py-1.5 transition-colors">
            Inscreva-se
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Página principal ── */
export default function Eventos() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    tipo: "Todos",
    regiao: "Todas",
    data: "Qualquer data",
  });

  const carouselRef = useRef(null);

  /* Filtrar eventos da grade (abaixo do carrossel) */
  const filtered = UPCOMING_EVENTS.filter((e) => {
    const matchSearch =
      search === "" ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase());
    const matchTipo = filters.tipo === "Todos" || e.tipo === filters.tipo;
    const matchRegiao =
      filters.regiao === "Todas" || e.regiao === filters.regiao;
    return matchSearch && matchTipo && matchRegiao;
  });

  const scrollCarousel = (dir) => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#FDF3EA]">
      {/* ── Topo: título + filtros ── */}
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

      {/* ── Em breve (evento destaque) ── */}
      <section className="w-full bg-[#FDF3EA] py-10">
        <div className="w-full max-w-6xl mx-auto px-4">
          <h2 className="font-handwriting text-[#1E1E1E] mb-6" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>
            Em breve
          </h2>

          <div className="rounded-2xl overflow-hidden shadow-md max-w-xl">
            <div className="relative">
              <img
                src={FEATURED_EVENT.image}
                alt={FEATURED_EVENT.title}
                className="w-full h-64 object-cover"
              />
              {/* overlay escuro no rodapé da imagem */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Info sobre a imagem */}
              <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between gap-3">
                <div>
                  <h3 className="font-bold text-[#FF6D2C] text-lg leading-tight">
                    {FEATURED_EVENT.title}
                  </h3>
                  <div className="flex flex-col gap-1 mt-1">
                    <span className="flex items-center gap-1.5 text-white/80 text-sm">
                      <Building2 size={13} />
                      {FEATURED_EVENT.location}
                    </span>
                    <span className="flex items-center gap-1.5 text-white/80 text-sm">
                      <Clock size={13} />
                      {FEATURED_EVENT.time}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 items-end shrink-0">
                  <Link
                    to={`/eventos/${FEATURED_EVENT.slug}`}
                    className="flex items-center gap-1.5 bg-white/15 border border-white/30 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-white/25 transition-colors"
                  >
                    Veja mais →
                  </Link>
                  <button className="bg-[#FF6D2C] hover:bg-[#e65c18] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                    Inscreva-se
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Próximos eventos (carrossel) ── */}
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
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-[#FF6D2C] hover:text-white transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Track */}
            <div
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth px-1 pb-2"
            >
              {UPCOMING_EVENTS.map((event) => (
                <CarouselCard key={event.id} event={event} />
              ))}
            </div>

            {/* Seta direita */}
            <button
              onClick={() => scrollCarousel(1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-[#FF6D2C] hover:text-white transition-colors"
              aria-label="Próximo"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Google Calendar CTA */}
          <div className="flex justify-center mt-8">
            <a
              href="https://calendar.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold text-[#1E1E1E]/70 hover:text-[#FF6D2C] transition-colors"
            >
              <CalendarPlus size={18} className="text-[#FF6D2C]" />
              Adicionar ao Google Calendar
            </a>
          </div>
        </div>
      </section>

      {/* ── Todos os eventos (grid com filtro) ── */}
      <section className="w-full bg-[#FDF3EA] py-10 pb-20">
        <div className="w-full max-w-6xl mx-auto px-4">
          {filtered.length > 0 ? (
            <EventList events={filtered} />
          ) : (
            <EmptyEvents />
          )}
        </div>
      </section>
    </main>
  );
}
