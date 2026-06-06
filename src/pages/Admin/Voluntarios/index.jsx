import { useState, useEffect } from "react";
import { fetchAllEvents } from "../../../services/eventService";
import SectionTitle from "../../../components/ui/SectionTitle";
import EmptyState from "../../../components/ui/EmptyState";
import Loading from "../../../components/ui/Loading";
import { VolunteerEventCard } from "../../../components/card/VolunteerCard";

/* Página: Listagem de Eventos com Voluntários */
export default function AdminVoluntarios() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const all = await fetchAllEvents();
        if (active) setEvents(all);
      } catch {
        if (active) setError("Não foi possível carregar os eventos.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <SectionTitle title="Voluntários" />

      {/* Grid de eventos */}
      {loading ? (
        <Loading />
      ) : error ? (
        <EmptyState message={error} />
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {events.map((event) => (
            <VolunteerEventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <EmptyState message="Nenhum evento cadastrado." />
      )}
    </div>
  );
}
