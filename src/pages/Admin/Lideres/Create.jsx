import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import LiderService from "../../../services/liderService";
import LiderForm from "./components/LiderForm";

export default function AdminLiderCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await LiderService.createLider(formData);
      navigate("/admin/lideres");
    } catch (error) {
      alert("Erro ao criar líder: " + error.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1
          className="font-black text-[#1E1E1E]"
          style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)" }}
        >
          Cadastro de Líder
        </h1>
        <button
          onClick={() => navigate("/admin/lideres")}
          className="w-10 h-10 rounded-full bg-[#FF6D2C] hover:bg-[#e65c18] flex items-center justify-center transition-colors shadow-md"
          title="Voltar"
        >
          <ChevronLeft size={22} className="text-white" />
        </button>
      </div>

      <LiderForm onSubmit={handleSubmit} />
    </div>
  );
}
