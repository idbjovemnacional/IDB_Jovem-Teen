import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const isFeatured = product.featured;

  return (
    <div
      className={`flex flex-col items-center rounded-sm overflow-hidden shadow-md transition-transform hover:-translate-y-1 hover:shadow-xl ${
        isFeatured ? "bg-orange-500 text-white" : "bg-white text-neutral-800"
      }`}
    >
      <div className="w-full h-44 flex items-center justify-center p-4 bg-white/10">
        <img
          src={product.image}
          alt={product.name}
          className="h-36 w-auto object-contain drop-shadow-md"
        />
      </div>
      <div className="w-full px-4 py-3 text-center">
        <p className={`text-sm font-semibold ${isFeatured ? "text-white" : "text-neutral-700"}`}>
          {product.name}
        </p>
        <p className={`text-xs mt-0.5 ${isFeatured ? "text-white/80" : "text-neutral-400"}`}>
          {product.description}
        </p>
      </div>
    </div>
  );
}

export default function ProdutosSection({ products = [] }) {
  return (
    <section id="produtos" className="w-full bg-white py-16 md:py-24">
      <div className="w-full max-w-6xl mx-auto px-4">
        {/* Cabeçalho */}
        <div className="text-center mb-10">
          <h2
            className="font-bold text-neutral-900"
            style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}
          >
            Conheça nossos produtos
          </h2>
          <p className="text-orange-500 font-handwriting mt-1" style={{ fontSize: "clamp(1.2rem, 3vw, 1.6rem)" }}>
            à venda durante os eventos!
          </p>
        </div>

        {/* Grid de produtos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 md:gap-6">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            to="/produtos"
            className="inline-block border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors font-bold px-8 py-3 rounded-sm uppercase tracking-wider text-sm"
          >
            Ver todos os produtos
          </Link>
        </div>
      </div>
    </section>
  );
}
