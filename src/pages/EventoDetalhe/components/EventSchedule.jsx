import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";

function ScheduleItem({ item }) {
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const descRef = useRef(null);

  useEffect(() => {
    const el = descRef.current;
    if (!el) return;
    // Detecta se o texto excede a altura de 3 linhas (quando recolhido)
    setIsClamped(el.scrollHeight > el.clientHeight + 1);
  }, [item.description]);

  return (
    <div className="flex items-start gap-4 bg-[#FDF3EA] rounded-xl px-4 py-3.5 border border-[#FF6D2C]/15">
      {/* Bloco de data */}
      <div className="flex flex-col items-center justify-center bg-white rounded-lg px-3 py-2 min-w-[52px] border border-[#FF6D2C]/20">
        <span className="text-[#FF6D2C] font-bold text-lg leading-none">
          {item.day}
        </span>
        <span className="text-[#FF6D2C] font-semibold text-xs uppercase">
          {item.month}
        </span>
      </div>

      {/* Info da atividade */}
      <div className="flex flex-col gap-1 min-w-0">
        <h4 className="font-semibold text-[#1E1E1E] text-sm">
          {item.activity}
        </h4>
        {item.description && (
          <div>
            <p
              ref={descRef}
              className="text-[#1E1E1E]/60 text-xs whitespace-pre-line"
              style={
                expanded
                  ? undefined
                  : {
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }
              }
            >
              {item.description}
            </p>
            {(isClamped || expanded) && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="mt-0.5 text-[#FF6D2C] font-semibold text-xs hover:underline"
              >
                {expanded ? "Ver menos" : "Ver mais"}
              </button>
            )}
          </div>
        )}
        <span className="flex items-center gap-1.5 text-[#1E1E1E]/50 text-xs">
          <Clock size={12} />
          {item.startTime} - {item.endTime}
        </span>
      </div>
    </div>
  );
}

export default function EventSchedule({ schedule = [] }) {
  if (schedule.length === 0) return null;

  return (
    <section className="w-full bg-[#FDF3EA] py-14 md:py-20">
      <div className="w-full max-w-4xl mx-auto px-6">
        {/* Título */}
        <h2
          className="font-bold text-[#1E1E1E] text-center mb-10"
          style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)" }}
        >
          Programação do evento
        </h2>

        {/* Container arredondado */}
        <div className="bg-white rounded-2xl border border-[#1E1E1E]/8 shadow-sm p-5 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {schedule.map((item) => (
              <ScheduleItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
