import { Clock } from "lucide-react";

/*
 * Campo de horário com ícone de relógio sempre visível (cinza, como o ícone
 * de calendário dos campos de data).
 *
 * Técnica: o indicador nativo do <input type="time"> é esticado e deixado
 * transparente sobre o ícone (classe `.time-picker` no global.css). Assim o
 * clique no relógio abre o seletor nativo de forma confiável em Chrome/Edge,
 * sem depender de showPicker(). Também é possível digitar a hora direto.
 */
export default function TimeInput({ wrapperClassName = "", className = "", ...props }) {
  return (
    <div className={`relative ${wrapperClassName}`}>
      <input
        type="time"
        {...props}
        className={`time-picker w-full pr-9 ${className}`}
      />
      <Clock
        size={16}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#1E1E1E]/55"
      />
    </div>
  );
}
