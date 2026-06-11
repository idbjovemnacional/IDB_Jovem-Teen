import { useState, useEffect } from "react";

export default function LiderForm({ initialData = null, onSubmit }) {
  const [formData, setFormData] = useState({
    nome: "",
    cargo: "",
    imagem_url: "",
    is_antigo: false,
    ordem: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nome: initialData.nome || "",
        cargo: initialData.cargo || "",
        imagem_url: initialData.imagem_url || "",
        is_antigo: initialData.is_antigo || false,
        ordem: initialData.ordem || 0,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-8 shadow-sm space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Nome</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            className="w-full bg-[#f8f9fa] border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#FF6D2C]"
            placeholder="Nome do líder"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Cargo</label>
          <input
            type="text"
            name="cargo"
            value={formData.cargo}
            onChange={handleChange}
            required
            className="w-full bg-[#f8f9fa] border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#FF6D2C]"
            placeholder="Cargo (Ex: Diretor)"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-gray-700">URL da Imagem</label>
          <input
            type="text"
            name="imagem_url"
            value={formData.imagem_url}
            onChange={handleChange}
            className="w-full bg-[#f8f9fa] border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#FF6D2C]"
            placeholder="https://link-da-imagem.com/foto.png"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Ordem de Exibição</label>
          <input
            type="number"
            name="ordem"
            value={formData.ordem}
            onChange={handleChange}
            className="w-full bg-[#f8f9fa] border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#FF6D2C]"
            placeholder="0"
          />
          <p className="text-xs text-gray-500">Menores números aparecem primeiro.</p>
        </div>

        <div className="flex items-center gap-3 mt-8">
          <input
            type="checkbox"
            name="is_antigo"
            id="is_antigo"
            checked={formData.is_antigo}
            onChange={handleChange}
            className="w-5 h-5 text-[#FF6D2C] rounded focus:ring-[#FF6D2C]"
          />
          <label htmlFor="is_antigo" className="text-sm font-semibold text-gray-700 cursor-pointer">
            É um líder antigo? (Aparecerá na aba de Galeria de Diretores)
          </label>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-full transition-colors shadow-sm"
        >
          {initialData ? "Salvar Alterações" : "Cadastrar Líder"}
        </button>
      </div>
    </form>
  );
}
