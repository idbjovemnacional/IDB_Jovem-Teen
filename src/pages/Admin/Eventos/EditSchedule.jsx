import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { fetchEventById, handleUpdateSchedule } from "../../../controllers/eventController";
import useModal from "../../../hooks/useModal";
import SectionTitle from "../../../components/ui/SectionTitle";
import EmptyState from "../../../components/ui/EmptyState";
import DeleteActivityModal from "./components/DeleteActivityModal";
import ActivityRow from "./components/ActivityRow";
import ActivityInlineForm from "./components/ActivityInlineForm";

/* Página: Programação do Evento */
export default function AdminEventoEditSchedule() {
  const navigate = useNavigate();
  const { id } = useParams();
  const deleteModal = useModal();

  const event = fetchEventById(id);

  const [schedule, setSchedule] = useState(event?.schedule || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <p className="text-lg font-semibold text-[#1E1E1E]/60 mb-4">Evento não encontrado.</p>
        <button
          onClick={() => navigate("/admin/eventos")}
          className="text-sm font-bold text-[#FF6D2C] hover:underline"
        >
          Voltar para Eventos
        </button>
      </div>
    );
  }

  const handleBack = () => {
    navigate(`/admin/eventos/${id}/editar`);
  };

  /* Adicionar nova atividade */
  const handleAddActivity = (data) => {
    const newItem = {
      id: Date.now(),
      ...data,
    };
    setSchedule((prev) => [...prev, newItem]);
    setShowAddForm(false);
  };

  /* Editar atividade */
  const handleEditActivity = (data) => {
    setSchedule((prev) =>
      prev.map((item) =>
        item.id === editingItem.id ? { ...item, ...data } : item
      )
    );
    setEditingItem(null);
  };

  /* Excluir atividade */
  const handleConfirmDelete = () => {
    if (deleteModal.data) {
      setSchedule((prev) => prev.filter((item) => item.id !== deleteModal.data.id));
      deleteModal.close();
    }
  };

  /* Salvar programação inteira */
  const handleSaveSchedule = () => {
    handleUpdateSchedule(id, schedule);
    navigate(`/admin/eventos/${id}/editar`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <SectionTitle
        title="Programação do Evento"
        onBack={handleBack}
      />

      {/* Card da Programação */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
        {/* Lista de atividades */}
        {schedule.length > 0 ? (
          <div>
            {schedule.map((item) => (
              <div key={item.id}>
                {editingItem?.id === item.id ? (
                  <ActivityInlineForm
                    initialData={item}
                    onSave={handleEditActivity}
                    onCancel={() => setEditingItem(null)}
                  />
                ) : (
                  <ActivityRow
                    item={item}
                    onEdit={(it) => setEditingItem(it)}
                    onDelete={(it) => deleteModal.open(it)}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          !showAddForm && (
            <EmptyState message="Nenhuma atividade cadastrada." className="border-none shadow-none p-6" />
          )
        )}

        {/* Botão Adicionar */}
        {!showAddForm && !editingItem && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setShowAddForm(true)}
              className="text-[#FF6D2C] hover:text-[#e65c18] transition-colors"
              title="Adicionar atividade"
            >
              <PlusCircle size={32} />
            </button>
          </div>
        )}

        {/* Formulário de adicionar */}
        {showAddForm && (
          <ActivityInlineForm
            onSave={handleAddActivity}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {/* Botão Salvar */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSaveSchedule}
            className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-green-600 hover:bg-green-700 transition-colors shadow-sm"
          >
            Salvar
          </button>
        </div>
      </div>

      {/* Modal de exclusão de atividade */}
      <DeleteActivityModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
