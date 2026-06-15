import { useHomeData } from "./hooks/useHomeData";
import HeroSection from "./sections/HeroSection";
import SobreSection from "./sections/SobreSection";
import EventosSection from "./sections/EventosSection";
import VolunteerSection from "./sections/VolunteerSection";
import ProcessoVoluntario from "./sections/ProcessoVoluntario";
import ProdutosSection from "./sections/ProdutosSection";
import GaleriaSection from "./sections/GaleriaSection";
import LideresSection from "./sections/LideresSection";
import CalendarioSection from "./sections/CalendarioSection";

export default function Home() {
  const { countdown, events, gallery, nextEvent } = useHomeData();

  return (
    <main className="bg-black">
      <HeroSection countdown={countdown} nextEvent={nextEvent} />
      <SobreSection />
      <LideresSection />
      <EventosSection events={events} />
      <CalendarioSection events={events} />
      <VolunteerSection />
      <ProcessoVoluntario />
      <ProdutosSection />
      <GaleriaSection gallery={gallery} />
    </main>
  );
}
