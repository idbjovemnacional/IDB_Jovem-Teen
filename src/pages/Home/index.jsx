import { useHomeData } from "./hooks/useHomeData";
import HeroSection from "./sections/HeroSection";
import SobreSection from "./sections/SobreSection";
import EventosSection from "./sections/EventosSection";
import VolunteerSection from "./sections/VolunteerSection";
import ProcessoVoluntario from "./sections/ProcessoVoluntario";
import ProdutosSection from "./sections/ProdutosSection";
import GaleriaSection from "./sections/GaleriaSection";

export default function Home() {
  const { countdown, events, products, gallery, nextEvent } = useHomeData();

  return (
    <main>
      <HeroSection countdown={countdown} nextEvent={nextEvent} />
      <SobreSection />
      <EventosSection events={events} />
      <VolunteerSection />
      <ProcessoVoluntario />
      <ProdutosSection products={products} />
      <GaleriaSection gallery={gallery} />
    </main>
  );
}
