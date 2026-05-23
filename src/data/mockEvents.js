export const mockEvents = [
  {
    id: 1,
    title: "Imersão 2025",
    slug: "imersao-2025",
    date: "2025-08-15T08:00:00",
    endDate: "2025-08-17T22:00:00",
    location: "São Paulo, SP",
    image: "/images/eventos/imersao-2025.jpg",
    description:
      "Prepare-se para dias únicos na Imersão 2025! Um evento incrível, crescimento espiritual e experiências que vão marcar sua vida para sempre.",
    category: "Imersão",
    featured: true,
    speakers: [
      { id: 1, name: "Paulo Borges", role: "Pastor", image: "/images/speakers/paulo.jpg" },
    ],
    schedule: [],
  },
  {
    id: 2,
    title: "IDB Jovem One",
    slug: "idb-jovem-one",
    date: "2025-09-20T09:00:00",
    endDate: "2025-09-20T18:00:00",
    location: "Rio de Janeiro, RJ",
    image: "/images/eventos/idb-jovem-one.jpg",
    description:
      "Um encontro único para jovens que buscam crescimento espiritual e conexões que transformam.",
    category: "Conferência",
    featured: false,
    speakers: [],
    schedule: [],
  },
  {
    id: 3,
    title: "IDB Teen Camp",
    slug: "idb-teen-camp",
    date: "2025-10-10T07:00:00",
    endDate: "2025-10-12T20:00:00",
    location: "Campinas, SP",
    image: "/images/eventos/teen-camp.jpg",
    description:
      "O melhor acampamento teen do ano. Diversão, fé e amizades que duram para sempre.",
    category: "Camp",
    featured: false,
    speakers: [],
    schedule: [],
  },
];

export const nextEvent = mockEvents[0];
