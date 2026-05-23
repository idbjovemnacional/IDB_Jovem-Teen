import { useEventDetails } from "./hooks/useEventDetails";
import EventHero from "./components/EventHero";
import SpeakerList from "./components/SpeakerList";
import EventSchedule from "./components/EventSchedule";
import EventGallery from "./components/EventGallery";
import { Link } from "react-router-dom";

export default function EventoDetalhe() {
  const { event, loading, error } = useEventDetails();

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FDF3EA] flex items-center justify-center">
        <div className="animate-pulse text-[#FF6D2C] font-bold text-lg">
          Carregando evento...
        </div>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="min-h-screen bg-[#FDF3EA] flex flex-col items-center justify-center gap-4">
        <h2 className="text-[#1E1E1E] font-bold text-xl">Evento não encontrado</h2>
        <p className="text-[#1E1E1E]/50 text-sm">O evento que você procura não existe ou foi removido.</p>
        <Link
          to="/eventos"
          className="mt-2 inline-block bg-[#FF6D2C] hover:bg-[#e65c18] text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors"
        >
          Ver todos os eventos
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDF3EA]">
      <EventHero event={event} />
      <SpeakerList speakers={event.speakers} />
      <EventSchedule schedule={event.schedule} />
      <EventGallery gallery={event.gallery} />
    </main>
  );
}
