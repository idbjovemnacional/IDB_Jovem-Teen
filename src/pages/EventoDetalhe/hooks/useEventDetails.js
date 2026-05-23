import { useParams } from "react-router-dom";

/* ── Dados mock — substituir por chamada real à API ── */
const EVENTS_DB = {
  "evento-em-destaque": {
    slug: "evento-em-destaque",
    title: "IMERSÃO 2025",
    description:
      "Prepare-se para dias únicos na Imersão 2025! Um tempo de conexão, crescimento espiritual e experiências que vão marcar sua vida para sempre.",
    location: "São Paulo, SP",
    time: "19:00 - 22:00",
    image: "/images/galeria/idb-jovem-one.jpg",
    speakers: [
      { id: 1, name: "Nome", role: "Profissão", image: "/images/galeria/idb-teen-camp.jpg" },
      { id: 2, name: "Nome", role: "Profissão", image: "/images/galeria/es-ne-ajo.jpg" },
      { id: 3, name: "Nome", role: "Profissão", image: "/images/galeria/idb-jovem-one.jpg" },
      { id: 4, name: "Nome", role: "Profissão", image: "/images/galeria/idb-teen-camp.jpg" },
    ],
    schedule: [
      { id: 1, day: "10", month: "Jul", activity: "Atividade", startTime: "12:00", endTime: "14:00" },
      { id: 2, day: "10", month: "Jul", activity: "Atividade 2", startTime: "12:00", endTime: "14:00" },
      { id: 3, day: "10", month: "Jul", activity: "Atividade 3", startTime: "12:00", endTime: "14:00" },
      { id: 4, day: "10", month: "Jul", activity: "Atividade 4", startTime: "12:00", endTime: "14:00" },
      { id: 5, day: "10", month: "Jul", activity: "Atividade 5", startTime: "12:00", endTime: "14:00" },
      { id: 6, day: "10", month: "Jul", activity: "Atividade 6", startTime: "12:00", endTime: "14:00" },
      { id: 7, day: "10", month: "Jul", activity: "Atividade 7", startTime: "12:00", endTime: "14:00" },
      { id: 8, day: "10", month: "Jul", activity: "Atividade 8", startTime: "12:00", endTime: "14:00" },
    ],
    gallery: [],
  },
  "evento-1": {
    slug: "evento-1",
    title: "IDB TEEN CAMP",
    description:
      "Um acampamento incrível para jovens viverem experiências inesquecíveis com Deus e com a comunidade.",
    location: "Brasília, DF",
    time: "17:00 - 21:00",
    image: "/images/galeria/idb-teen-camp.jpg",
    speakers: [
      { id: 1, name: "Nome", role: "Profissão", image: "/images/galeria/idb-jovem-one.jpg" },
      { id: 2, name: "Nome", role: "Profissão", image: "/images/galeria/es-ne-ajo.jpg" },
      { id: 3, name: "Nome", role: "Profissão", image: "/images/galeria/idb-teen-camp.jpg" },
      { id: 4, name: "Nome", role: "Profissão", image: "/images/galeria/idb-jovem-one.jpg" },
    ],
    schedule: [
      { id: 1, day: "25", month: "Abr", activity: "Abertura", startTime: "17:00", endTime: "18:00" },
      { id: 2, day: "25", month: "Abr", activity: "Louvor", startTime: "18:00", endTime: "19:00" },
      { id: 3, day: "25", month: "Abr", activity: "Ministração", startTime: "19:00", endTime: "20:30" },
      { id: 4, day: "25", month: "Abr", activity: "Encerramento", startTime: "20:30", endTime: "21:00" },
    ],
    gallery: [],
  },
  "evento-2": {
    slug: "evento-2",
    title: "ES NE AJO",
    description:
      "Uma conferência que reúne jovens de toda a região Nordeste para um tempo de avivamento.",
    location: "Moçoro, RN",
    time: "15:00 - 20:00",
    image: "/images/galeria/es-ne-ajo.jpg",
    speakers: [
      { id: 1, name: "Nome", role: "Profissão", image: "/images/galeria/idb-teen-camp.jpg" },
      { id: 2, name: "Nome", role: "Profissão", image: "/images/galeria/idb-jovem-one.jpg" },
      { id: 3, name: "Nome", role: "Profissão", image: "/images/galeria/es-ne-ajo.jpg" },
      { id: 4, name: "Nome", role: "Profissão", image: "/images/galeria/idb-teen-camp.jpg" },
    ],
    schedule: [
      { id: 1, day: "10", month: "Mai", activity: "Recepção", startTime: "15:00", endTime: "15:30" },
      { id: 2, day: "10", month: "Mai", activity: "Worship", startTime: "15:30", endTime: "17:00" },
      { id: 3, day: "10", month: "Mai", activity: "Palavra", startTime: "17:00", endTime: "18:30" },
      { id: 4, day: "10", month: "Mai", activity: "Oração", startTime: "18:30", endTime: "20:00" },
    ],
    gallery: [],
  },
  "evento-3": {
    slug: "evento-3",
    title: "ENCONTRO MANAUS",
    description:
      "Um encontro regional para jovens no coração da Amazônia.",
    location: "Manaus, AM",
    time: "18:00 - 22:00",
    image: "/images/galeria/idb-jovem-one.jpg",
    speakers: [
      { id: 1, name: "Nome", role: "Profissão", image: "/images/galeria/es-ne-ajo.jpg" },
      { id: 2, name: "Nome", role: "Profissão", image: "/images/galeria/idb-teen-camp.jpg" },
    ],
    schedule: [
      { id: 1, day: "10", month: "Mai", activity: "Louvor", startTime: "18:00", endTime: "19:00" },
      { id: 2, day: "10", month: "Mai", activity: "Ministração", startTime: "19:00", endTime: "21:00" },
      { id: 3, day: "10", month: "Mai", activity: "Comunhão", startTime: "21:00", endTime: "22:00" },
    ],
    gallery: [],
  },
  "evento-4": {
    slug: "evento-4",
    title: "CULTO JOVEM FORTALEZA",
    description:
      "Um culto vibrante com louvor, pregação e comunhão para a juventude de Fortaleza.",
    location: "Fortaleza, CE",
    time: "19:00 - 21:00",
    image: "/images/galeria/idb-teen-camp.jpg",
    speakers: [
      { id: 1, name: "Nome", role: "Profissão", image: "/images/galeria/idb-jovem-one.jpg" },
      { id: 2, name: "Nome", role: "Profissão", image: "/images/galeria/es-ne-ajo.jpg" },
    ],
    schedule: [
      { id: 1, day: "20", month: "Mai", activity: "Louvor", startTime: "19:00", endTime: "20:00" },
      { id: 2, day: "20", month: "Mai", activity: "Pregação", startTime: "20:00", endTime: "21:00" },
    ],
    gallery: [],
  },
  "evento-5": {
    slug: "evento-5",
    title: "CONFERÊNCIA SP",
    description:
      "Uma conferência impactante para a juventude paulistana.",
    location: "São Paulo, SP",
    time: "16:00 - 21:00",
    image: "/images/galeria/es-ne-ajo.jpg",
    speakers: [
      { id: 1, name: "Nome", role: "Profissão", image: "/images/galeria/idb-teen-camp.jpg" },
      { id: 2, name: "Nome", role: "Profissão", image: "/images/galeria/idb-jovem-one.jpg" },
      { id: 3, name: "Nome", role: "Profissão", image: "/images/galeria/es-ne-ajo.jpg" },
    ],
    schedule: [
      { id: 1, day: "01", month: "Jun", activity: "Recepção", startTime: "16:00", endTime: "16:30" },
      { id: 2, day: "01", month: "Jun", activity: "Louvor", startTime: "16:30", endTime: "18:00" },
      { id: 3, day: "01", month: "Jun", activity: "Ministração", startTime: "18:00", endTime: "19:30" },
      { id: 4, day: "01", month: "Jun", activity: "Oração", startTime: "19:30", endTime: "21:00" },
    ],
    gallery: [],
  },
};

export function useEventDetails() {
  const { slug } = useParams();

  const event = EVENTS_DB[slug] || null;
  const loading = false;
  const error = event ? null : "Evento não encontrado";

  return { event, loading, error };
}
