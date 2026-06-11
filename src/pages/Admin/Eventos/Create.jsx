import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { handleCreateEvent } from "../../../services/eventService";
import EventForm from "../../../components/forms/EventForm";

export default function AdminEventoCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    const result = await handleCreateEvent(formData);

    if (result.success) {
      /* Vai direto para a programação do evento recém-criado */
      navigate(`/admin/eventos/${result.event.id}/programacao`);
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1
          className="font-black text-[#1E1E1E]"
          style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)" }}
        >
          Criação de Evento
        </h1>
        <button
          onClick={() => navigate("/admin/eventos")}
          className="w-10 h-10 rounded-full bg-[#FF6D2C] hover:bg-[#e65c18] flex items-center justify-center transition-colors shadow-md"
          title="Voltar"
        >
          <ChevronLeft size={22} className="text-white" />
        </button>
      </div>

      {/* Formulário */}
      <EventForm onSubmit={handleSubmit} />
    </div>
  );
}
