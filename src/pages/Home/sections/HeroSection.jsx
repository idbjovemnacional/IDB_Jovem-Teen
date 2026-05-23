import { Link } from "react-router-dom";

const CountdownBox = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="bg-white text-black font-black text-2xl md:text-3xl w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-sm shadow-lg tabular-nums">
      {String(value).padStart(2, "0")}
    </div>
    <span className="text-white text-[10px] font-semibold mt-1 uppercase tracking-widest">
      {label}
    </span>
  </div>
);

const Separator = () => (
  <span className="text-white font-black text-2xl mb-6 select-none">:</span>
);

export default function HeroSection({ countdown, nextEvent }) {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-black">
      {/* Background GIF / Video - substitua pelo seu gif real */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-bg.gif"
          alt=""
          className="w-full h-full object-cover opacity-60"
          aria-hidden="true"
        />
        {/* Overlay gradiente para legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-5xl mx-auto">
        {/* Título principal */}
        <h1
          className="text-white font-black uppercase leading-none tracking-tight"
          style={{
            fontSize: "clamp(3rem, 12vw, 9rem)",
            textShadow: "0 4px 32px rgba(0,0,0,0.5)",
          }}
        >
          IDB JOVEM TEEN
        </h1>

        {/* Countdown */}
        <div className="mt-8 w-full max-w-lg">
          <div className="flex items-center gap-2 md:gap-3 justify-center">
            <span className="text-white font-bold uppercase tracking-widest text-sm md:text-base whitespace-nowrap mr-2">
              Próximo evento:
            </span>
            <CountdownBox value={countdown.days} label="dias" />
            <Separator />
            <CountdownBox value={countdown.hours} label="horas" />
            <Separator />
            <CountdownBox value={countdown.minutes} label="min" />
            <Separator />
            <CountdownBox value={countdown.seconds} label="seg" />
          </div>
        </div>

        {/* CTA */}
        {nextEvent && (
          <Link
            to={`/eventos/${nextEvent.slug}`}
            className="mt-8 inline-block bg-orange-500 hover:bg-orange-600 transition-colors text-white font-bold px-8 py-3 rounded-sm uppercase tracking-wider text-sm shadow-xl"
          >
            Ver evento
          </Link>
        )}
      </div>
    </section>
  );
}
