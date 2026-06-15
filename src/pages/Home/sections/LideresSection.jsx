import { useState, useEffect } from "react";
import LiderService from "../../../services/liderService";

const STATIC_CURRENT_LEADERS = [
  {
    lider_id: 'static_1',
    nome: 'Bp. Samuel Tavares',
    cargo: 'Diretor Nacional e regional de jovens',
    imagem_url: '/prSamuel.jpeg',
    is_antigo: false,
    ordem: 1,
  },
  {
    lider_id: 'static_2',
    nome: 'Raquel Gomes',
    cargo: 'Diretora Nacional e regional de adolescentes',
    imagem_url: '/praRaquel.jpeg',
    is_antigo: false,
    ordem: 2,
  },
  {
    lider_id: 'static_3',
    nome: 'Pra. Mariley Ribeiro',
    cargo: 'Diretora Regional de jovens e adolescentes Região centro oeste',
    imagem_url: '/praMariley.jpeg',
    is_antigo: false,
    ordem: 3,
  },
  {
    lider_id: 'static_4',
    nome: 'Pr. Silvio Modesto',
    cargo: 'Diretor regional de jovens e adolescentes - Região sul',
    imagem_url: '/prSilvio.jpeg',
    is_antigo: false,
    ordem: 4,
  },
  {
    lider_id: 'static_5',
    nome: 'Pr. Darlan Soares',
    cargo: 'Diretor regional de jovens e adolescentes - Região Nordeste',
    imagem_url: '/prDarlan.jpeg',
    is_antigo: false,
    ordem: 5,
  },
  {
    lider_id: 'static_6',
    nome: 'Pr. Bill Watson',
    cargo: 'Diretor regional de jovens e adolescentes - Região Norte',
    imagem_url: '/prBill.jpeg',
    is_antigo: false,
    ordem: 6,
  },
  {
    lider_id: 'static_7',
    nome: 'Pr. Áquila Olivera',
    cargo: 'Diretor regional de jovens e adolescentes - Região sudeste',
    imagem_url: '/prAquila.jpeg',
    is_antigo: false,
    ordem: 7,
  }
];

function LeaderCard({ leader, isPast }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`w-[120px] h-[120px] md:w-[150px] md:h-[150px] rounded-2xl mb-4 overflow-hidden ${isPast ? 'bg-[#D2691E]' : 'bg-[#E85A1B]'}`}>
        {leader.imagem_url ? (
          <img src={leader.imagem_url} alt={leader.nome} className="w-full h-full object-cover" />
        ) : null}
      </div>
      <h4 className={`font-handwriting text-2xl leading-none text-center ${isPast ? 'text-white' : 'text-black'}`}>
        {leader.nome}
      </h4>
      <p className={`text-xs md:text-sm text-center font-semibold mt-1 max-w-[140px] leading-tight ${isPast ? 'text-white/80' : 'text-[#D5650D]'}`}>
        {leader.cargo}
      </p>
    </div>
  );
}

export default function LideresSection() {
  const [showPast, setShowPast] = useState(false);
  const [lideres, setLideres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    LiderService.getAllLideres()
      .then((data) => {
        // Ensure they are ordered by "ordem"
        const sorted = data.sort((a, b) => a.ordem - b.ordem);
        setLideres(sorted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const currentLeaders = STATIC_CURRENT_LEADERS;
  const pastLeaders = lideres.filter(l => l.is_antigo);

  // Divide into directors (first 2) and others (the rest) based on sorted order
  const currentDirectors = currentLeaders.slice(0, 2);
  const currentOthers = currentLeaders.slice(2);

  const pastDirectors = pastLeaders.slice(0, 2);
  const pastOthers = pastLeaders.slice(2);

  if (loading) return null; // or a loading spinner

  return (
    <section className="w-full py-16 md:py-24 px-4 bg-[#D5650D]">
      <div className={`max-w-[1200px] mx-auto rounded-[3rem] p-8 md:p-16 transition-colors duration-500 relative ${showPast ? 'bg-[#7A3614]' : 'bg-[#FF7F11]'}`}>

        <div className="flex flex-col md:flex-row justify-between items-center mb-12 relative z-10">
          <h2 className="text-white font-black text-4xl md:text-5xl text-center md:text-left flex flex-col md:flex-row items-center gap-2">
            {showPast ? (
              "Galeria de Diretores"
            ) : (
              <>
                <span className="font-handwriting font-normal text-5xl md:text-6xl tracking-wide">Nosso Organograma</span>
              </>
            )}
          </h2>

          <button
            onClick={() => setShowPast(!showPast)}
            className="mt-6 md:mt-0 bg-white text-sm md:text-base text-black font-semibold px-6 py-2 rounded-full hover:scale-105 transition-transform"
          >
            {showPast ? "Líderes Atuais" : "Galeria de Diretores"}
          </button>
        </div>

        {showPast ? (
          <div className="flex flex-col items-center gap-12 relative z-10">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {pastDirectors.map(leader => <LeaderCard key={leader.lider_id} leader={leader} isPast />)}
            </div>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {pastOthers.map(leader => <LeaderCard key={leader.lider_id} leader={leader} isPast />)}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center relative z-10">
            {/* Container principal */}
            <div className="bg-[#FFFDF9] rounded-[2.5rem] p-8 md:p-12 shadow-sm flex flex-col items-center max-w-[800px] w-full">
              <div className="flex flex-wrap justify-center gap-8 md:gap-24 mb-12">
                {currentDirectors.map(leader => <LeaderCard key={leader.lider_id} leader={leader} />)}
              </div>
            </div>
            {/* Container secundário */}
            <div className="bg-[#FFFDF9] rounded-[2.5rem] p-8 md:p-12 shadow-sm flex flex-col items-center w-full max-w-full -mt-8 pt-16">
              <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                {currentOthers.map(leader => <LeaderCard key={leader.lider_id} leader={leader} />)}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
