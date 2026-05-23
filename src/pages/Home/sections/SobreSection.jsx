import { Link } from "react-router-dom";

export default function SobreSection() {
  return (
    <section className="w-full bg-[#7C3A1E] py-16 md:py-24">
      <div className="w-full max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Imagem */}
        <div className="relative">
          <img
            src="/images/sobre-idb.jpg"
            alt="Sobre o IDB Jovem"
            className="w-full h-80 md:h-[420px] object-cover rounded-sm shadow-2xl"
          />
        </div>

        {/* Texto */}
        <div className="text-white">
          <h2
            className="font-black uppercase leading-none mb-6"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            Conheça o{" "}
            <span className="text-orange-400 font-handwriting">IDB</span>{" "}
            <span className="text-orange-400 font-handwriting">Jovem</span>
          </h2>
          <p className="text-white/80 text-base md:text-lg leading-relaxed mb-4">
            A IDB Jovem é um movimento feito para quem busca viver a fé de forma viva e com propósito.
          </p>
          <p className="text-white/80 text-base md:text-lg leading-relaxed mb-8">
            Com encontros, eventos e uma comunidade acolhedora, é o lugar ideal para crescer, fazer amizades e se conectar com Deus.
          </p>
          <Link
            to="/sobre"
            className="inline-block border-2 border-white text-white hover:bg-white hover:text-[#7C3A1E] transition-colors font-bold px-7 py-3 rounded-sm uppercase tracking-wider text-sm"
          >
            Saiba mais
          </Link>
        </div>
      </div>
    </section>
  );
}
