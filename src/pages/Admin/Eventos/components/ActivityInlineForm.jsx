import { useState } from "react";
import TimeInput from "../../../../components/ui/TimeInput";

export default function ActivityInlineForm({ initialData, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: initialData?.name || "",
    start: initialData?.startTime || initialData?.start || "",
    end: initialData?.endTime || initialData?.end || "",
    description: initialData?.description || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("Nome da atividade é obrigatório.");
      return;
    }
    if (!form.start || !form.end) {
      alert("Informe os horários de início e término.");
      return;
    }
    if (form.start >= form.end) {
      alert("O horário de término deve ser maior que o de início.");
      return;
    }
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-4 mt-3 border border-gray-200 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-3">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nome da atividade"
          className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm text-[#1E1E1E] placeholder-[#1E1E1E]/40 focus:border-[#FF6D2C] focus:ring-2 focus:ring-[#FF6D2C]/20 transition-all"
          required
        />
        <input
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Descrição da atividade"
          className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm text-[#1E1E1E] placeholder-[#1E1E1E]/40 focus:border-[#FF6D2C] focus:ring-2 focus:ring-[#FF6D2C]/20 transition-all"
        />
        <TimeInput
          name="start"
          value={form.start}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm text-[#1E1E1E] focus:border-[#FF6D2C] focus:ring-2 focus:ring-[#FF6D2C]/20 transition-all"
          required
        />
        <TimeInput
          name="end"
          value={form.end}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm text-[#1E1E1E] focus:border-[#FF6D2C] focus:ring-2 focus:ring-[#FF6D2C]/20 transition-all"
          required
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-red-500 hover:bg-red-600 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-green-600 hover:bg-green-700 transition-colors"
        >
          Confirmar
        </button>
      </div>
    </form>
  );
}
