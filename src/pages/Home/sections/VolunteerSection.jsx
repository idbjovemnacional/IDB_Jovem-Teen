import { Link } from "react-router-dom";
import idbJovemOneImg from "../../../assets/images/idbJovemOne.png";
import teencampImg from "../../../assets/images/teencamp.png";
import eismeaquiImg from "../../../assets/images/eismeaqui.png";
import { BlurFade } from "../../../components/ui/blur-fade";

const reasons = [
  {
    id: 1,
    title: "Experiência real",
    subtitle: "com propósito",
    description:
      "Viva algo além do comum. Servir é crescer espiritualmente e impactar vidas.",
    quoteText:
      "Ninguém despreze a tua mocidade; mas sê o exemplo dos fiéis, na palavra, no trato, no amor, no espírito, na fé, na pureza. Persiste em ler, exortar e ensinar, até que eu vá. Não desprezes o dom que há em ti, o qual te foi dado por profecia, com a imposição das mãos do presbitério.",
    quoteAuthor: "1 Timóteo 4:12-14 ARC",
    image: idbJovemOneImg,
    imageCaption: "IDB JOVEM & TEEN ONE",
    imageRight: true,
  },
  {
    id: 2,
    title: "Conexões",
    subtitle: "que transformam",
    description:
      "Faça parte de uma comunidade que caminha junto, compartilha e cresce na fé.",
    quoteText:
      "Não foi só um culto... foi encontro, foi renovo, foi resposta para uma geração que escolheu dizer sim à visão de Deus.",
    quoteAuthor: "Rm 12:2",
    image: teencampImg,
    imageCaption: "IDB TEEN CAMP",
    imageRight: false,
  },
  {
    id: 3,
    title: "Desenvolvimento",
    subtitle: "e Liderança!",
    description:
      "Descubra seus dons, desenvolva habilidades e sirva com excelência.",
    quoteText:
      "O Espírito do Senhor Deus está sobre mim porque o Senhor ungiu-me para levar boas novas aos pobres...",
    quoteAuthor: "Isaías 61",
    image: eismeaquiImg,
    imageCaption: '"EIS ME AQUI"',
    imageRight: true,
  },
];

export default function VolunteerSection() {
  return (
    <section className="w-full bg-[#FCF8F3] py-16 md:py-24">
      <div className="w-full max-w-5xl mx-auto px-4">
        {/* Título */}
        <BlurFade delay={0.1} inView>
          <h2
            className="text-center font-bold text-neutral-900 mb-20"
            style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)" }}
          >
            Por que você{" "}
            <em
              className="not-italic font-handwriting text-orange-500"
              style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)" }}
            >
              deveria
            </em>{" "}
            ser
            <br className="hidden md:block" /> voluntário?
          </h2>
        </BlurFade>

        {/* Motivos */}
        <div className="flex flex-col gap-24">
          {reasons.map((reason, index) => (
            <BlurFade key={reason.id} delay={0.2 + index * 0.15} inView>
              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${reason.imageRight ? "" : "md:[direction:rtl]"
                  }`}
              >
                {/* Texto */}
                <div
                  className={`flex flex-col ${reason.imageRight ? "" : "md:[direction:ltr]"
                    }`}
                >
                  <h3
                    className="font-handwriting leading-none text-orange-500"
                    style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)" }}
                  >
                    {reason.title}
                  </h3>
                  <h4
                    className="font-black leading-none text-neutral-800 mb-6 tracking-tight"
                    style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)" }}
                  >
                    {reason.subtitle}
                  </h4>
                  <p className="text-neutral-700 text-base leading-relaxed mb-6 md:mb-0">
                    {reason.description}
                  </p>

                  {/* Imagem mobile*/}
                  <div
                    className={`flex md:hidden flex-col items-center my-6 ${reason.imageRight ? "" : "md:[direction:ltr]"
                      }`}
                  >
                    <img
                      src={reason.image}
                      alt={reason.title}
                      className="w-full h-auto object-cover rounded-3xl"
                    />
                    <span className="mt-4 text-black text-sm md:text-base font-black italic text-center">
                      {reason.imageCaption}
                    </span>
                  </div>

                  {reason.quoteText && (
                    <div className="mt-4 border border-neutral-300 rounded-xl p-6 relative">
                      <span className="absolute -top-5 left-6 bg-[#FCF8F3] px-2 text-orange-500 font-serif leading-none" style={{ fontSize: "3rem" }}>
                        “
                      </span>
                      <p className="text-neutral-600 italic text-sm mb-4 mt-2">
                        {reason.quoteText}
                      </p>
                      <p className="text-neutral-400 text-xs italic">
                        {reason.quoteAuthor}
                      </p>
                    </div>
                  )}


                </div>

                {/* Imagem Desktop */}
                <div
                  className={`hidden md:flex flex-col items-center ${reason.imageRight ? "" : "md:[direction:ltr]"
                    }`}
                >
                  <img
                    src={reason.image}
                    alt={reason.title}
                    className="w-full h-auto object-cover rounded-3xl"
                  />
                  <span className="mt-4 text-black text-sm md:text-base font-black italic text-center">
                    {reason.imageCaption}
                  </span>
                </div>
              </div>
            </BlurFade>
          ))}
        </div>

        {/* Botão no final da seção */}
        <div className="mt-16 flex justify-center">
          <Link
            to="/eventos"
            className="inline-block bg-orange-500 hover:bg-orange-600 transition-colors text-white font-bold px-10 py-4 rounded-lg uppercase tracking-wider text-sm shadow-xl hover:shadow-2xl hover:scale-105 transform duration-300"
          >
            Seja voluntário
          </Link>
        </div>
      </div>
    </section>
  );
}
