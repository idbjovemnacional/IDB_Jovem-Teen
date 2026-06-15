import { useState, useEffect } from "react";
import produto1Img from "../../../assets/images/produto1.png";
import produto2Img from "../../../assets/images/produto2.png";
import produto3Img from "../../../assets/images/produto3.png";
import { FocusCards } from "../../../components/ui/focus-cards";
import { getAllProducts } from "../../../services/productService";

// Fallback do design: usado quando a API ainda nao tem produtos cadastrados.
const fallbackProducts = [
  { id: 1, name: "Camiseta igreja", description: "Descrição do produto", image: produto1Img },
  { id: 2, name: "Caneca", description: "Descrição do produto", image: produto2Img },
  { id: 3, name: "Brinco cruz", description: "Descrição do produto", image: produto3Img },
  { id: 4, name: "Caneca", description: "Descrição do produto", image: produto2Img },
  { id: 5, name: "Brinco cruz", description: "Descrição do produto", image: produto3Img },
  { id: 6, name: "Camiseta igreja", description: "Descrição do produto", image: produto1Img },
];

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

  // Enquanto carrega (null) ou sem produtos na API, mostra o mock do design.
  const displayProducts = products && products.length > 0 ? products : fallbackProducts;

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
        <FocusCards 
          cards={displayProducts.map(p => ({
            id: p.id,
            title: p.name,
            description: p.description,
            src: p.image,
            link: p.link
          }))}
        />

      </div>
    </section>
  );
}
