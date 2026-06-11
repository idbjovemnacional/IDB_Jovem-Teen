import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, CalendarDays, Users, Music, CalendarCog, ImagePlus } from "lucide-react";
import LocationPicker from "./LocationPicker";
import TimeInput from "../../ui/TimeInput";
import { splitDateTime } from "../../../services/eventService";

const inputClass =
  "w-full border border-gray-300 rounded-lg px-4 py-3 bg-[#FFF8F3] text-sm text-[#1E1E1E] placeholder-[#1E1E1E]/40 focus:border-[#FF6D2C] focus:ring-2 focus:ring-[#FF6D2C]/20 transition-all";

/* Base sem w-full para os campos de data/hora (largura controlada via flex) */
const dateTimeBase =
  "border border-gray-300 rounded-lg px-3 py-3 bg-[#FFF8F3] text-sm text-[#1E1E1E] focus:border-[#FF6D2C] focus:ring-2 focus:ring-[#FF6D2C]/20 transition-all";

export default function EventForm({ initialData = {}, onSubmit, eventId }) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const start = splitDateTime(initialData.date);
  const end = splitDateTime(initialData.endDate);

  const [form, setForm] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    latitude: initialData.latitude ?? "",
    longitude: initialData.longitude ?? "",
    startDay: start.day,
    startTime: start.time,
    endDay: end.day,
    endTime: end.time,
    palestrantes: initialData.palestrantes || "",
    bandas: initialData.bandas || "",
    linkGaleria: initialData.linkGaleria || "",
    linkFormularioVoluntarios: initialData.linkFormularioVoluntarios || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (lat, lng) => {
    setForm((prev) => ({
      ...prev,
      latitude: Number(lat.toFixed(6)),
      longitude: Number(lng.toFixed(6)),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const date =
        form.startDay && form.startTime ? `${form.startDay}T${form.startTime}` : "";
      const endDate =
        form.endDay && form.endTime ? `${form.endDay}T${form.endTime}` : "";
      await onSubmit({ ...form, date, endDate });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/eventos");
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        {/* Nome */}
        <div className="mb-1">
          <label className="block text-sm font-bold text-[#1E1E1E] mb-2">Nome</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Nome do Evento"
            className={inputClass}
            required
          />
        </div>

        <hr className="my-5 border-gray-100" />

        {/* Descrição */}
        <div className="mb-1">
          <label className="block text-sm font-bold text-[#1E1E1E] mb-2">Descrição</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Descrição do Evento"
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>

        <hr className="my-5 border-gray-100" />

        {/* Local — selecionado direto no mapa */}
        <div className="mb-1">
          <label className="flex items-center gap-2 text-sm font-bold text-[#1E1E1E] mb-2">
            <MapPin size={16} className="text-[#FF6D2C]" />
            Local do evento
          </label>
          <LocationPicker
            latitude={form.latitude}
            longitude={form.longitude}
            initialAddress={initialData.location || ""}
            onChange={handleLocationChange}
          />
        </div>

        <hr className="my-5 border-gray-100" />

        {/* Início + Término (data e hora separadas) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-1">
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-[#1E1E1E] mb-2">
              <CalendarDays size={16} className="text-[#FF6D2C]" />
              Início
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                name="startDay"
                value={form.startDay}
                onChange={handleChange}
                className={`${dateTimeBase} flex-1 min-w-0`}
                required
              />
              <TimeInput
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                className={dateTimeBase}
                wrapperClassName="w-[150px]"
                required
              />
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-[#1E1E1E] mb-2">
              <CalendarDays size={16} className="text-[#FF6D2C]" />
              Término
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                name="endDay"
                value={form.endDay}
                onChange={handleChange}
                className={`${dateTimeBase} flex-1 min-w-0`}
                required
              />
              <TimeInput
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                className={dateTimeBase}
                wrapperClassName="w-[150px]"
                required
              />
            </div>
          </div>
        </div>

        <hr className="my-5 border-gray-100" />

        {/* Palestrantes + Bandas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-1">
          <div>
            <label className="block text-sm font-bold text-[#1E1E1E] mb-2">Palestrantes</label>
            <div className="relative">
              <input
                type="text"
                name="palestrantes"
                value={form.palestrantes}
                onChange={handleChange}
                placeholder="Palestrantes"
                className={`${inputClass} pr-10`}
              />
              <Users size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1E1E1E]/30" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1E1E1E] mb-2">Bandas</label>
            <div className="relative">
              <input
                type="text"
                name="bandas"
                value={form.bandas}
                onChange={handleChange}
                placeholder="Bandas"
                className={`${inputClass} pr-10`}
              />
              <Music size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1E1E1E]/30" />
            </div>
          </div>
        </div>

        <hr className="my-5 border-gray-100" />

        {/* Link Formulário Voluntários */}
        <div className="mb-1">
          <label className="block text-sm font-bold text-[#1E1E1E] mb-2">Link Formulário Voluntários</label>
          <input
            type="url"
            name="linkFormularioVoluntarios"
            value={form.linkFormularioVoluntarios}
            onChange={handleChange}
            placeholder="https://forms.gle/..."
            className={`${inputClass} sm:max-w-md`}
          />
        </div>

        <hr className="my-5 border-gray-100" />

        <div className="mb-1">
          <label className="block text-sm font-bold text-[#1E1E1E] mb-2">Galeria de Fotos</label>
          <div className="relative">
            <input
              type="text"
              name="linkGaleria"
              value={form.linkGaleria}
              onChange={handleChange}
              placeholder="Nome ou link da pasta de fotos"
              className={`${inputClass} pr-10`}
            />
            <ImagePlus size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1E1E1E]/30" />
          </div>
          <p className="mt-1.5 text-xs text-[#1E1E1E]/50">
            Informe o nome (ou link) da pasta onde estão as fotos do evento.
          </p>
        </div>

        <hr className="my-5 border-gray-100" />

        {/* Programação do evento (atividades/horários) — exige um evento já salvo */}
        <div className="flex flex-col gap-2 mb-1">
          <label className="block text-sm font-bold text-[#1E1E1E]">Programação do evento</label>
          <button
            type="button"
            disabled={!eventId}
            onClick={() => eventId && navigate(`/admin/eventos/${eventId}/programacao`)}
            className="flex items-center gap-2 self-start border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-semibold text-[#1E1E1E] hover:border-[#FF6D2C] hover:text-[#FF6D2C] transition-colors bg-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-[#1E1E1E]"
          >
            Editar Programação do Evento
            <CalendarCog size={16} />
          </button>
          {!eventId && (
            <p className="text-xs text-[#1E1E1E]/50">
              Salve o evento primeiro para adicionar a programação (atividades e horários).
            </p>
          )}
        </div>

        <hr className="my-5 border-gray-100" />

        {/* Botões */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-green-600 hover:bg-green-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </form>
  );
}
