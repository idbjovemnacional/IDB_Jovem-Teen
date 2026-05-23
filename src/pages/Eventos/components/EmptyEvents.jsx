import { Calendar } from "lucide-react";

export default function EmptyEvents() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="w-16 h-16 bg-[#FF6D2C]/10 rounded-full flex items-center justify-center">
        <Calendar size={28} className="text-[#FF6D2C]" />
      </div>
      <h3 className="font-bold text-[#1E1E1E] text-lg">
        Nenhum evento encontrado
      </h3>
      <p className="text-[#1E1E1E]/50 text-sm max-w-xs">
        Tente ajustar os filtros ou a pesquisa para encontrar o que você procura.
      </p>
    </div>
  );
}
