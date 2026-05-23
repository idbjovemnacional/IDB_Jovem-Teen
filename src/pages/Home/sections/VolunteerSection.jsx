import { Link } from "react-router-dom";

const reasons = [
  {
    id: 1,
    title: "Experiência real",
    subtitle: "com propósito",
    description:
      "Viva algo que vai muito além de um projeto. Aqui, cada ação tem impacto real: você cresce espiritualmente e inspira vidas.",
    image: "/images/galeria/idb-jovem-one.jpg",
    imageCaption: "IDB JOVEM ONE",
    imageRight: true,
  },
  {
    id: 2,
    title: "Conexões",
    subtitle: "que transformam",
    description:
      "Faça parte de uma comunidade que caminha junto, compartilha a crença na fé.",
    image: "/images/galeria/idb-teen-camp.jpg",
    imageCaption: "IDB TEEN CAMP",
    imageRight: false,
  },
  {
    id: 3,
    title: "Desenvolvimento",
    subtitle: "e Liderança!",
    description:
      "Descubra seus dons, desenvolva habilidades e brilhe com excelência.",
    image: "/images/galeria/es-ne-ajo.jpg",
    imageCaption: '"ES NE AJO" com o Bp. Paulo Borges',
    imageRight: true,
  },
];

export default function VolunteerSection() {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="w-full max-w-6xl mx-auto px-4">
        {/* Título */}
        <h2
          className="text-center font-bold text-neutral-900 mb-14"
          style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)" }}
        >
          Por que você{" "}
          <em className="not-italic font-handwriting text-orange-500 underline underline-offset-4 decoration-wavy" style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)" }}>
            deveria
          </em>{" "}
          ser voluntário?
        </h2>

        {/* Motivos */}
        <div className="flex flex-col gap-16">
          {reasons.map((reason) => (
            <div
              key={reason.id}
              className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${
                reason.imageRight ? "" : "md:[direction:rtl]"
              }`}
            >
              {/* Texto */}
              <div className={`${reason.imageRight ? "" : "md:[direction:ltr]"}`}>
                <h3
                  className="font-handwriting uppercase leading-none text-orange-500"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
                >
                  {reason.title}
                </h3>
                <h4
                  className="font-black uppercase leading-none text-neutral-800 mb-4"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
                >
                  {reason.subtitle}
                </h4>
                <p className="text-neutral-600 text-base leading-relaxed">
                  {reason.description}
                </p>
              </div>

              {/* Imagem */}
              <div className={`relative ${reason.imageRight ? "" : "md:[direction:ltr]"}`}>
                <img
                  src={reason.image}
                  alt={reason.title}
                  className="w-full h-64 md:h-72 object-cover rounded-sm shadow-lg"
                />
                <span className="absolute bottom-2 right-3 text-white text-xs font-semibold bg-black/50 px-2 py-1 rounded-sm">
                  {reason.imageCaption}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <Link
            to="/voluntarios"
            className="inline-block bg-orange-500 hover:bg-orange-600 transition-colors text-white font-bold px-10 py-4 rounded-sm uppercase tracking-wider text-sm shadow-lg"
          >
            Quero ser voluntário
          </Link>
        </div>
      </div>
    </section>
  );
}
