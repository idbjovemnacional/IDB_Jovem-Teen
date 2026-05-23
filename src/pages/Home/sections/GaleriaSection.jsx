import { Link } from "react-router-dom";

export default function GaleriaSection({ gallery = [] }) {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="w-full max-w-6xl mx-auto px-4">
        {/* Cabeçalho */}
        <div className="text-center mb-10">
          <h2
            className="font-bold text-neutral-900"
            style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}
          >
            Galeria de fotos{" "}
            <em className="not-italic text-orange-500 font-handwriting" style={{ fontSize: "clamp(1.8rem, 4.5vw, 2.8rem)" }}>
              dos eventos
            </em>
          </h2>
        </div>

        {/* Grid de fotos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
          {gallery.slice(0, 6).map((item, index) => (
            <div
              key={item.id}
              className={`overflow-hidden rounded-sm ${
                index === 0 ? "col-span-2 sm:col-span-1" : ""
              }`}
            >
              <img
                src={item.image}
                alt={`${item.event} ${item.year}`}
                className="w-full h-44 md:h-52 object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            to="/galeria"
            className="inline-block bg-orange-500 hover:bg-orange-600 transition-colors text-white font-bold px-8 py-3 rounded-sm uppercase tracking-wider text-sm shadow-lg"
          >
            Ver mais →
          </Link>
        </div>
      </div>
    </section>
  );
}
