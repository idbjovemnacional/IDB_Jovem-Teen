import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useGallery } from "./hooks/useGallery";

export default function Galeria() {
  const navigate = useNavigate();
  const { photos, loading } = useGallery();

  if (loading) {
    return (
      <main className="min-h-screen bg-[#DC6803] flex items-center justify-center pt-[82px]">
        <div className="animate-pulse text-white font-bold text-lg">
          Carregando galeria...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#DC6803] pt-[82px]">
      {/* ── Cabeçalho da página ── */}
      <section className="w-full max-w-6xl mx-auto px-6 pt-8 pb-4">
        {/* Botão voltar */}
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors mb-6"
          aria-label="Voltar"
        >
          <ArrowLeft size={22} className="text-white" />
        </button>

        {/* Título */}
        <h1
          className="text-center mb-2"
          style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)" }}
        >
          <span className="font-bold text-[#93370D]">Galeria de fotos </span>
          <em
            className="not-italic font-handwriting text-white"
            style={{ fontSize: "clamp(2.2rem, 5.5vw, 3.6rem)" }}
          >
            dos eventos
          </em>
        </h1>
      </section>

      {/* ── Grid de fotos ── */}
      <section className="w-full max-w-6xl mx-auto px-6 py-10 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group cursor-pointer"
            >
              {/* Card da foto */}
              <div className="overflow-hidden rounded-2xl aspect-[4/3] shadow-lg">
                <img
                  src={photo.image}
                  alt={`${photo.event} - ${photo.location}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Info do evento */}
              <div className="mt-3 text-center">
                <h3 className="font-bold text-white text-base">
                  {photo.event}
                </h3>
                <p className="text-white/70 text-sm mt-0.5">
                  {photo.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
