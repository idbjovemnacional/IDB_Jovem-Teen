import { useState, useEffect } from "react";
import { FocusCards } from "../../../components/ui/focus-cards";
import EmptyState from "../../../components/ui/EmptyState";
import { getAllProducts } from "../../../services/productService";

export default function ProdutosSection() {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    let active = true;
    getAllProducts()
      .then((data) => active && setProducts(data))
      .catch(() => active && setProducts([]));
    return () => {
      active = false;
    };
  }, []);

  if (products === null) return null;

  const hasProducts = products.length > 0;

  return (
    <section id="produtos" className="w-full bg-[#FFFFFF] py-16 md:py-24">
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8">
        {/* Cabeçalho */}
        <div className="text-center mb-14">
          <h2
            className="font-black text-[#2B2B2B] leading-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            Conheça nossos produtos
          </h2>
          <p className="text-[#FF6D2C] font-handwriting mt-1" style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)" }}>
            À venda em nossos eventos ou online!
          </p>
        </div>

        {/* Grid de produtos */}
        {hasProducts ? (
          <FocusCards 
            cards={products.map(p => ({
              id: p.id,
              title: p.name,
              description: p.description,
              src: p.image,
              link: p.link
            }))}
          />
        ) : (
          <EmptyState message="Nenhum produto cadastrado." />
        )}

      </div>
    </section>
  );
}
