import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus } from "lucide-react";

export default function ProductForm({ initialData = {}, onSubmit }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: initialData.name || "",
    description: initialData.description || "",
    link: initialData.link || "",
    imageName: initialData.imageName || "",
  });

  // URL já resolvida pelo backend (só existe na edição) — usada só p/ preview.
  const savedImageUrl = initialData.image || "";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const handleCancel = () => {
    navigate("/admin/produtos");
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        {/* Nome */}
        <div className="mb-1">
          <label className="block text-sm font-bold text-[#1E1E1E] mb-2">Nome</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nome do produto"
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
            placeholder="Descrição do produto"
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-[#FFF8F3] text-sm text-[#1E1E1E] placeholder-[#1E1E1E]/40 focus:border-[#FF6D2C] focus:ring-2 focus:ring-[#FF6D2C]/20 transition-all resize-none"
          />
        </div>

        <hr className="my-5 border-gray-100" />

        {/* Link do produto */}
        <div className="mb-1">
          <label className="block text-sm font-bold text-[#1E1E1E] mb-2">Link do Produto</label>
          <input
            type="url"
            name="link"
            value={form.link}
            onChange={handleChange}
            placeholder="http://produto.com"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-[#FFF8F3] text-sm text-[#1E1E1E] placeholder-[#1E1E1E]/40 focus:border-[#FF6D2C] focus:ring-2 focus:ring-[#FF6D2C]/20 transition-all"
          />
        </div>

        <hr className="my-5 border-gray-100" />

        {/* Foto do produto (nome do arquivo na pasta idbj/produtos do Drive) */}
        <div className="mb-1">
          <label className="block text-sm font-bold text-[#1E1E1E] mb-2">Foto do Produto</label>
          <div className="relative">
            <input
              type="text"
              name="imageName"
              value={form.imageName}
              onChange={handleChange}
              placeholder="Nome do arquivo (ex.: camiseta.jpg)"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 bg-[#FFF8F3] text-sm text-[#1E1E1E] placeholder-[#1E1E1E]/40 focus:border-[#FF6D2C] focus:ring-2 focus:ring-[#FF6D2C]/20 transition-all"
            />
            <ImagePlus size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1E1E1E]/30" />
          </div>
          <p className="mt-1.5 text-xs text-[#1E1E1E]/50">
            Informe apenas o nome do arquivo. A imagem deve estar na pasta
            <span className="font-semibold"> idbj/produtos</span> do Google Drive.
          </p>
        </div>

        {/* Preview da imagem atual (só na edição, após o backend resolver) */}
        {savedImageUrl && (
          <>
            <hr className="my-5 border-gray-100" />
            <div className="mb-1">
              <label className="block text-sm font-bold text-[#1E1E1E] mb-2">Imagem atual</label>
              <div className="w-32 h-32 rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                <img
                  src={savedImageUrl}
                  alt="Imagem atual do produto"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              </div>
            </div>
          </>
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
            className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-green-600 hover:bg-green-700 transition-colors shadow-sm"
          >
            Salvar
          </button>
        </div>
      </div>
    </form>
  );
}
