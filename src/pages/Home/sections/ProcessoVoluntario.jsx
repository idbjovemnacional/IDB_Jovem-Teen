import { useState } from "react";
import { Link } from "react-router-dom";

const steps = [
  {
    number: "01",
    title: "Escolha do evento",
    description:
      "Entre em nosso site e escolha o evento que deseja se voluntariar.",
  },
  {
    number: "02",
    title: "Inscrição",
    description:
      "Preencha o formulário de voluntário com suas informações e disponibilidade.",
  },
  {
    number: "03",
    title: "Aceitação via email",
    description:
      "Nossa equipe entrará em contato pelo seu email para confirmar sua participação.",
  },
  {
    number: "04",
    title: "Treinamento",
    description:
      "Participe da capacitação e chegue preparado para fazer a diferença.",
  },
];

export default function ProcessoVoluntario() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="w-full bg-[#FDF3EA] py-16 md:py-24">
      <div className="w-full max-w-6xl mx-auto px-4">
        {/* Título */}
        <div className="text-center mb-12">
          <p className="text-[#1E1E1E] font-bold text-lg md:text-xl mb-1">
            Processo para virar
          </p>
          <h2
            className="font-handwriting text-[#FF6D2C] leading-none"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)" }}
          >
            voluntário
          </h2>
        </div>

        {/* Layout: steps + imagem */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center">
          {/* Lista de steps */}
          <div className="flex-1 flex flex-col gap-0">
            {steps.map((step, index) => {
              const isActive = index === activeStep;
              return (
                <button
                  key={step.number}
                  onClick={() => setActiveStep(index)}
                  className="w-full text-left py-5 border-b border-[#1E1E1E]/10 last:border-b-0 group transition-all duration-300 focus:outline-none"
                >
                  <div className="flex items-baseline gap-4">
                    {/* Número */}
                    <span
                      className={`text-sm font-bold transition-colors duration-300 shrink-0 ${
                        isActive ? "text-[#FF6D2C]" : "text-[#1E1E1E]/30"
                      }`}
                    >
                      {step.number}
                    </span>

                    {/* Conteúdo */}
                    <div className="flex flex-col gap-1">
                      <span
                        className={`font-semibold text-base md:text-lg transition-colors duration-300 ${
                          isActive ? "text-[#1E1E1E]" : "text-[#1E1E1E]/40"
                        }`}
                      >
                        {step.title}
                      </span>

                      {/* Descrição — só visível no step ativo */}
                      <div
                        className={`overflow-hidden transition-all duration-500 ${
                          isActive
                            ? "max-h-24 opacity-100 mt-1"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <p className="text-sm text-[#1E1E1E]/60 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}

            {/* CTA */}
            <div className="mt-8">
              <Link
                to="/voluntarios"
                className="inline-block bg-[#FF6D2C] hover:bg-[#e65c18] transition-colors text-white font-bold px-7 py-3 rounded-sm uppercase tracking-wider text-sm shadow-md"
              >
                Quero ser um voluntário
              </Link>
            </div>
          </div>

          {/* Imagem */}
          <div className="w-full md:w-[340px] lg:w-[380px] shrink-0">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/images/voluntario-processo.jpg"
                alt="Voluntários IDB Jovem"
                className="w-full h-[340px] md:h-[420px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
