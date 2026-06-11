import { useState } from "react";
import { Link } from "react-router-dom";
import processoImg from "../../../assets/images/processo.png";

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
      "Preencha os dados no formulário de inscrição e envie.",
  },
  {
    number: "03",
    title: "Aceitação via email",
    description:
      "Nossa equipe irá analisar os dados de inscrição e, caso esteja tudo certo, retornaremos um email de confirmação!",
  },
  {
    number: "04",
    title: "Treinamento",
    description:
      "Pronto! Faça parte do nosso treinamento para se tornar um voluntário em nossos eventos!",
  },
];

export default function ProcessoVoluntario() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="w-full bg-[#FF6D2C] py-16 md:py-24">
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8">
        {/* Título */}
        <div className="text-center mb-16">
          <h2
            className="font-black text-[#2B2B2B] leading-none"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            Processo para virar
          </h2>
          <p
            className="font-handwriting text-[#FDF3EA] mt-2"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)" }}
          >
            voluntário
          </p>
        </div>

        {/* Steps */}
        <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-center justify-between">
          {/* Lista de steps */}
          <div className="flex-1 flex flex-col w-full">
            {steps.map((step, index) => {
              const isActive = index === activeStep;
              return (
                <div
                  key={step.number}
                  onMouseEnter={() => setActiveStep(index)}
                  onFocus={() => setActiveStep(index)}
                  tabIndex={0}
                  className="w-full flex items-start gap-5 cursor-pointer outline-none mb-6 group"
                >
                  {/* Indicador numérico */}
                  <div className="flex flex-col items-center min-w-[2rem] pt-1">
                    <span
                      className={`font-handwriting text-xl transition-colors duration-300 ${isActive ? "text-[#FFD2A6]" : "text-[#FFD2A6]/50"
                        }`}
                    >
                      {step.number}
                    </span>
                    {/* Linha vertical */}
                    <div
                      className={`w-[1.5px] transition-all duration-500 bg-[#E4E4E4] mt-3 rounded-full ${isActive ? "h-16 opacity-100" : "h-0 opacity-0"
                        }`}
                    />
                  </div>

                  {/* Conteúdo */}
                  <div className="flex flex-col flex-1 pt-1 pb-2">
                    <span
                      className={`font-bold text-xl md:text-2xl transition-colors duration-300 ${isActive ? "text-[#FFFFFF]" : "text-[#2E2F35]/40 group-hover:text-[#2E2F35]/60"
                        }`}
                    >
                      {step.title}
                    </span>

                    {/* Descrição */}
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${isActive
                        ? "max-h-40 opacity-100 mt-3"
                        : "max-h-0 opacity-0"
                        }`}
                    >
                      <p className="text-[15px] md:text-base text-[#E4E4E4] font-medium leading-relaxed pr-4 md:pr-12">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="mt-8 ml-12">
              <Link
                to="/voluntarios"
                className="inline-block bg-[#2B2B2B] hover:bg-black transition-all text-white font-bold px-8 py-3 rounded-2xl uppercase tracking-wider text-xs border-[2.5px] border-[#2B2B2B] shadow-[4px_4px_0_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none"
              >
                QUERO SER UM VOLUNTÁRIO
              </Link>
            </div>
          </div>

          {/* Imagem */}
          <div className="w-full md:w-[400px] lg:w-[450px] shrink-0">
            <div className="rounded-[2rem] overflow-hidden shadow-xl border-4 border-transparent">
              <img
                src={processoImg}
                alt="Voluntários IDB Jovem & Teen"
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
