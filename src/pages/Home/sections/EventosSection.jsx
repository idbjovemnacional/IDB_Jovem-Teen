import { Link } from "react-router-dom";

export default function EventosSection({ events = [] }) {
  const featured = events.find((e) => e.featured) ?? events[0];

  return (
    <section className="w-full bg-neutral-900 py-16 md:py-24">
      {/* Cabeçalho */}
      <div className="w-full max-w-6xl mx-auto px-4 mb-10 text-center">
        <p className="text-orange-500 uppercase font-bold tracking-[0.3em] text-sm mb-1 font-handwriting" style={{ fontSize: "clamp(1.2rem, 3vw, 1.8rem)" }}>
          Programação
        </p>
        <h2
          className="text-white font-black uppercase italic leading-tight font-handwriting"
          style={{ fontSize: "clamp(2rem, 6vw, 4rem)" }}
        >
          conheça nossos eventos
        </h2>
      </div>

      {/* Evento em destaque */}
      {featured && (
        <div className="w-full max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 items-center">
          {/* Imagem */}
          <div className="relative overflow-hidden rounded-sm">
            <img
              src={featured.image}
              alt={featured.title}
              className="w-full h-72 md:h-[440px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
          </div>

          {/* Info */}
          <div className="text-white py-8 md:py-0 md:pl-4">
            <h3
              className="font-black uppercase leading-none mb-4 text-orange-500"
              style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}
            >
              {featured.title}
            </h3>
            <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8">
              {featured.description}
            </p>
            <Link
              to={`/eventos/${featured.slug}`}
              className="inline-block bg-orange-500 hover:bg-orange-600 transition-colors text-white font-bold px-7 py-3 rounded-sm uppercase tracking-wider text-sm shadow-lg"
            >
              Saiba mais
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
