export default function SpeakerList({ speakers = [] }) {
  if (speakers.length === 0) return null;

  return (
    <section className="w-full bg-[#FF6D2C] py-12 md:py-16">
      <div className="w-full max-w-6xl mx-auto px-6">
        {/* Título */}
        <h2
          className="font-handwriting text-white mb-10"
          style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
        >
          Palestrantes
        </h2>

        {/* Grid de palestrantes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 md:gap-10">
          {speakers.map((speaker) => (
            <div key={speaker.id} className="flex flex-col items-center text-center gap-3">
              {/* Foto circular com borda */}
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-3 border-white/30 shadow-lg">
                <img
                  src={speaker.image}
                  alt={speaker.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Nome */}
              <h3 className="text-white font-bold text-sm md:text-base leading-tight">
                {speaker.name}
              </h3>

              {/* Profissão */}
              <p className="text-white/80 text-xs md:text-sm -mt-1">
                {speaker.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
