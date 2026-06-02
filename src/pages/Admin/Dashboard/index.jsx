import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import SectionTitle from "../../../components/ui/SectionTitle";
import { MapPin } from "lucide-react";
import DashboardProductCard from "./components/DashboardProductCard";
import CalendarMini from "./components/CalendarMini";

/* Event Row para o Dashboard */
function DashboardEventRow({ event, isPast = false }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0 group hover:bg-gray-50/50 px-2 rounded-lg transition-colors">
      {/* Date badge */}
      <div className={`flex flex-col items-center justify-center w-12 h-14 rounded-xl text-white font-bold shrink-0 ${isPast ? "bg-[#FF6D2C]/70" : "bg-[#FF6D2C]"}`}>
        <span className="text-lg leading-tight">{event.day}</span>
        <span className="text-[10px] uppercase tracking-wider">{event.month}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-[#1E1E1E] truncate">{event.title}</p>
        <span className="flex items-center gap-1 text-xs text-[#1E1E1E]/50">
          <MapPin size={11} />
          {event.location}
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1.5 shrink-0">
        <Link
          to={`/admin/eventos`}
          className="text-[10px] font-bold bg-[#FF6D2C] text-white px-3 py-1 rounded-md hover:bg-[#e65c18] transition-colors text-center"
        >
          Detalhes
        </Link>
        <Link
          to={`/admin/voluntarios`}
          className="text-[10px] font-bold border border-[#1E1E1E]/20 text-[#1E1E1E]/70 px-3 py-1 rounded-md hover:border-[#FF6D2C] hover:text-[#FF6D2C] transition-colors text-center"
        >
          {isPast ? "Voluntários" : "Gerenciar Voluntários"}
        </Link>
      </div>
    </div>
  );
}

// mocks pra testar o layout
const PROXIMOS_EVENTOS = [
  { id: 1, title: "Nome do evento", location: "Local", day: "10", month: "Jul" },
  { id: 2, title: "Nome do evento", location: "Local", day: "10", month: "Jul" },
  { id: 3, title: "Nome do evento", location: "Local", day: "10", month: "Jul" },
  { id: 4, title: "Nome do evento", location: "Local", day: "10", month: "Jul" },
];

const EVENTOS_ANTERIORES = [
  { id: 5, title: "Nome do evento", location: "Local", day: "10", month: "Jul" },
  { id: 6, title: "Nome do evento", location: "Local", day: "10", month: "Jul" },
  { id: 7, title: "Nome do evento", location: "Local", day: "10", month: "Jul" },
  { id: 8, title: "Nome do evento", location: "Local", day: "10", month: "Jul" },
];

const PRODUTOS = [
  { id: 1, name: "Nome do Item", image: "/images/galeria/idb-jovem-one.jpg" },
  { id: 2, name: "Nome do Item", image: "/images/galeria/idb-teen-camp.jpg" },
  { id: 3, name: "Nome do Item", image: "/images/galeria/es-ne-ajo.jpg" },
  { id: 4, name: "Nome do Item", image: "/images/galeria/idb-jovem-one.jpg" },
  { id: 5, name: "Nome do Item", image: "/images/galeria/idb-teen-camp.jpg" },
  { id: 6, name: "Nome do Item", image: "/images/galeria/es-ne-ajo.jpg" },
  { id: 7, name: "Nome do Item", image: "/images/galeria/idb-jovem-one.jpg" },
  { id: 8, name: "Nome do Item", image: "/images/galeria/idb-teen-camp.jpg" },
];

// tela principal do admin
export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      <SectionTitle 
        title="Dashboard" 
        titleStyle={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 600 }} 
      />

      {/* linha de eventos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* próximos eventos */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#1E1E1E] text-lg">Próximos Eventos</h2>
            <Link
              to="/admin/eventos"
              className="text-xs font-semibold text-[#FF6D2C] hover:underline flex items-center gap-0.5"
            >
              Ver todos <ChevronRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {PROXIMOS_EVENTOS.map((event) => (
              <DashboardEventRow key={event.id} event={event} />
            ))}
          </div>
        </div>

        {/* eventos passados */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#1E1E1E] text-lg">Eventos Anteriores</h2>
            <Link
              to="/admin/eventos"
              className="text-xs font-semibold text-[#FF6D2C] hover:underline flex items-center gap-0.5"
            >
              Ver todos <ChevronRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {EVENTOS_ANTERIORES.map((event) => (
              <DashboardEventRow key={event.id} event={event} isPast />
            ))}
          </div>
        </div>
      </div>

      {/* linha do caledário e produtos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* calendário */}
        <CalendarMini />

        {/* lista de produtos */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#1E1E1E] text-lg">Produtos Cadastrados</h2>
            <Link
              to="/admin/produtos"
              className="text-xs font-semibold text-[#FF6D2C] hover:underline flex items-center gap-0.5"
            >
              Ver todos <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {PRODUTOS.map((product) => (
              <DashboardProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
