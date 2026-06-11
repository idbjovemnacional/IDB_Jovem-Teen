import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import LiderService from "../../../services/liderService";
import LiderForm from "./components/LiderForm";
import Loading from "../../../components/ui/Loading";

export default function AdminLiderEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lider, setLider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    LiderService.getLiderById(id)
      .then(setLider)
      .catch((error) => {
        alert("Erro ao buscar líder: " + error.message);
        navigate("/admin/lideres");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    try {
      await LiderService.updateLider(id, formData);
      navigate("/admin/lideres");
    } catch (error) {
      alert("Erro ao editar líder: " + error.message);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1
          className="font-black text-[#1E1E1E]"
          style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)" }}
        >
          Editar Líder
        </h1>
        <button
          onClick={() => navigate("/admin/lideres")}
          className="w-10 h-10 rounded-full bg-[#FF6D2C] hover:bg-[#e65c18] flex items-center justify-center transition-colors shadow-md"
          title="Voltar"
        >
          <ChevronLeft size={22} className="text-white" />
        </button>
      </div>

      <LiderForm initialData={lider} onSubmit={handleSubmit} />
    </div>
  );
}
