import { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Calendar as CalendarIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { isFutureEvent } from "../../../services/eventService";

export default function CalendarioSection({ events = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const currentMonthName = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  // Filtra eventos do mês/ano selecionado, mantendo apenas os que ainda vão acontecer
  const monthEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getMonth() === currentDate.getMonth() &&
      eventDate.getFullYear() === currentYear &&
      isFutureEvent(event.date)
    );
  }).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <section className="w-full py-16 md:py-24 px-4 bg-[#DC6803]">
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-white font-black text-4xl md:text-5xl uppercase tracking-wide">
            Calendário de Eventos
          </h2>
          <p className="text-white/80 mt-2 font-medium">Acompanhe nossa agenda para o ano todo</p>
        </div>

        {/* Calendar Header */}
        <div className="flex items-center justify-between bg-[#F9FAFB] border border-neutral-200 rounded-2xl p-4 md:p-6 mb-8 shadow-sm">
          <button 
            onClick={prevMonth}
            className="p-2 hover:bg-neutral-200 rounded-full transition-colors"
          >
            <ChevronLeft size={24} className="text-[#D5650D]" />
          </button>
          
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-black text-neutral-800 capitalize">
              {currentMonthName}
            </h3>
            <span className="text-neutral-500 font-bold">{currentYear}</span>
          </div>

          <button 
            onClick={nextMonth}
            className="p-2 hover:bg-neutral-200 rounded-full transition-colors"
          >
            <ChevronRight size={24} className="text-[#D5650D]" />
          </button>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {monthEvents.length === 0 ? (
            <div className="text-center py-12 bg-neutral-50 rounded-2xl border border-neutral-100">
              <CalendarIcon size={48} className="mx-auto text-neutral-300 mb-4" />
              <p className="text-neutral-500 font-medium">Nenhum evento agendado para este mês.</p>
            </div>
          ) : (
            monthEvents.map(event => {
              const eventDate = new Date(event.date);
              return (
                <div key={event.id} className="flex flex-col md:flex-row gap-6 bg-white border border-neutral-200 rounded-2xl p-4 md:p-6 hover:shadow-md transition-shadow group">
                  
                  {/* Date Box */}
                  <div className="flex flex-col items-center justify-center bg-[#FFF5EB] border border-[#FFD0B0] text-[#D5650D] rounded-xl p-4 min-w-[100px] shrink-0">
                    <span className="text-xs font-bold uppercase">{monthNames[eventDate.getMonth()].slice(0, 3)}</span>
                    <span className="text-4xl font-black leading-none my-1">{eventDate.getDate().toString().padStart(2, '0')}</span>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col justify-center flex-1">
                    <h4 className="text-xl md:text-2xl font-bold text-neutral-800 mb-2 group-hover:text-[#D5650D] transition-colors">
                      {event.title}
                    </h4>
                    <div className="flex items-center gap-2 text-neutral-500 text-sm font-medium mb-1">
                      <MapPin size={16} />
                      <span>{event.location}</span>
                    </div>
                    <p className="text-neutral-600 text-sm line-clamp-2 mt-2">{event.description}</p>
                  </div>

                  {/* Action */}
                  <div className="flex items-center md:justify-end shrink-0">
                    <Link
                      to={`/eventos/${event.slug}`}
                      className="px-6 py-2.5 bg-[#D5650D] text-white font-bold rounded-full hover:bg-[#C2580B] transition-colors w-full text-center md:w-auto"
                    >
                      Detalhes
                    </Link>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
}
