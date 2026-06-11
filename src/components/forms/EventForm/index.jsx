import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, CalendarDays, Users, Music, Link as LinkIcon, CalendarCog, ImagePlus } from "lucide-react";
import { toInputDateTime } from "../../../services/eventService";
import { toDriveImageUrl } from "../../../utils/driveImage";
import MapPickerModal from "./MapPickerModal";

export default function EventForm({ initialData = {}, onSubmit, eventId }) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);

  const [form, setForm] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    latitude: initialData.latitude ?? "",
    longitude: initialData.longitude ?? "",
    date: toInputDateTime(initialData.date),
    endDate: toInputDateTime(initialData.endDate),
    palestrantes: initialData.palestrantes || "",
    bandas: initialData.bandas || "",
    linkGaleria: initialData.linkGaleria || "",
    linkFormularioVoluntarios: initialData.linkFormularioVoluntarios || "",
    image: initialData.linkImagem || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/eventos");
  };

  const handlePickLocation = (lat, lng) => {
    setForm((prev) => ({
      ...prev,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
    }));
    setMapOpen(false);
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
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-[#FFF8F3] text-sm text-[#1E1E1E] placeholder-[#1E1E1E]/40 focus:border-[#FF6D2C] focus:ring-2 focus:ring-[#FF6D2C]/20 transition-all"
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
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-[#FFF8F3] text-sm text-[#1E1E1E] placeholder-[#1E1E1E]/40 focus:border-[#FF6D2C] focus:ring-2 focus:ring-[#FF6D2C]/20 transition-all resize-none"
          />
        </div>

        <hr className="my-5 border-gray-100" />

        {/* Local (coordenadas) — o nome do local é derivado pela API */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-1">
          <div>
            <label className="block text-sm font-bold text-[#1E1E1E] mb-2">Latitude</label>
            <div className="relative">
              <input
                type="number"
                step="any"
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
                placeholder="-15.7934"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 bg-[#FFF8F3] text-sm text-[#1E1E1E] placeholder-[#1E1E1E]/40 focus:border-[#FF6D2C] focus:ring-2 focus:ring-[#FF6D2C]/20 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setMapOpen(true)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-[#1E1E1E]/40 hover:text-[#FF6D2C] hover:bg-[#FF6D2C]/10 transition-colors"
                aria-label="Selecionar local no mapa"
                title="Selecionar no mapa"
              >
                <MapPin size={16} />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1E1E1E] mb-2">Longitude</label>
            <div className="relative">
              <input
                type="number"
                step="any"
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
                placeholder="-47.8822"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 bg-[#FFF8F3] text-sm text-[#1E1E1E] placeholder-[#1E1E1E]/40 focus:border-[#FF6D2C] focus:ring-2 focus:ring-[#FF6D2C]/20 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setMapOpen(true)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-[#1E1E1E]/40 hover:text-[#FF6D2C] hover:bg-[#FF6D2C]/10 transition-colors"
                aria-label="Selecionar local no mapa"
                title="Selecionar no mapa"
              >
                <MapPin size={16} />
              </button>
            </div>
          </div>
        </div>

        <hr className="my-5 border-gray-100" />

        {/* Início + Término */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-1">
          <div>
            <label className="block text-sm font-bold text-[#1E1E1E] mb-2">Início</label>
            <input
              type="datetime-local"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-[#FFF8F3] text-sm text-[#1E1E1E] focus:border-[#FF6D2C] focus:ring-2 focus:ring-[#FF6D2C]/20 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1E1E1E] mb-2">Término</label>
            <input
              type="datetime-local"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-[#FFF8F3] text-sm text-[#1E1E1E] focus:border-[#FF6D2C] focus:ring-2 focus:ring-[#FF6D2C]/20 transition-all"
              required
            />
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
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 bg-[#FFF8F3] text-sm text-[#1E1E1E] placeholder-[#1E1E1E]/40 focus:border-[#FF6D2C] focus:ring-2 focus:ring-[#FF6D2C]/20 transition-all"
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
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 bg-[#FFF8F3] text-sm text-[#1E1E1E] placeholder-[#1E1E1E]/40 focus:border-[#FF6D2C] focus:ring-2 focus:ring-[#FF6D2C]/20 transition-all"
              />
              <Music size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1E1E1E]/30" />
            </div>
          </div>
        </div>

        <hr className="my-5 border-gray-100" />

        {/* Link Formulário Voluntários */}
        <div className="mb-1">
          <label className="block text-sm font-bold text-[#1E1E1E] mb-2">Link Formulário Voluntários</label>
          <div className="relative">
            <input
              type="url"
              name="linkFormularioVoluntarios"
              value={form.linkFormularioVoluntarios}
              onChange={handleChange}
              placeholder="https://forms.gle/..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 bg-[#FFF8F3] text-sm text-[#1E1E1E] placeholder-[#1E1E1E]/40 focus:border-[#FF6D2C] focus:ring-2 focus:ring-[#FF6D2C]/20 transition-all uppercase tracking-wide sm:max-w-md"
            />
          </div>
        </div>

        <hr className="my-5 border-gray-100" />

        {/* Imagem de capa (URL do Drive) */}
        <div className="mb-1">
          <label className="block text-sm font-bold text-[#1E1E1E] mb-2">Imagem de Capa</label>
          <div className="relative">
            <input
              type="url"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="Cole o link da imagem (Google Drive)"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 bg-[#FFF8F3] text-sm text-[#1E1E1E] placeholder-[#1E1E1E]/40 focus:border-[#FF6D2C] focus:ring-2 focus:ring-[#FF6D2C]/20 transition-all"
            />
            <ImagePlus size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1E1E1E]/30" />
          </div>
          {form.image?.trim() ? (
            <div className="mt-3 w-40 h-24 rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
              <img
                src={toDriveImageUrl(form.image)}
                alt="Pré-visualização da capa"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            </div>
          ) : (
            <p className="mt-1.5 text-xs text-[#1E1E1E]/50">
              Sem imagem, o evento usa a capa padrão do IDB Jovem.
            </p>
          )}
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
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 bg-[#FFF8F3] text-sm text-[#1E1E1E] placeholder-[#1E1E1E]/40 focus:border-[#FF6D2C] focus:ring-2 focus:ring-[#FF6D2C]/20 transition-all"
            />
            <ImagePlus size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1E1E1E]/30" />
          </div>
          <p className="mt-1.5 text-xs text-[#1E1E1E]/50">
            Informe o nome (ou link) da pasta onde estão as fotos do evento.
          </p>
        </div>

        {eventId && (
          <div className="flex flex-wrap gap-3 mt-4 mb-1">
            <button
              type="button"
              onClick={() => navigate(`/admin/eventos/${eventId}/programacao`)}
              className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-semibold text-[#1E1E1E] hover:border-[#FF6D2C] hover:text-[#FF6D2C] transition-colors bg-white"
            >
              Editar Programação do Evento
              <CalendarCog size={16} />
            </button>
          </div>
        )}

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

      <MapPickerModal
        open={mapOpen}
        initialLat={form.latitude}
        initialLng={form.longitude}
        onConfirm={handlePickLocation}
        onClose={() => setMapOpen(false)}
      />
    </form>
  );
}
