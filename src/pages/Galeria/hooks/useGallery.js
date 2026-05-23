/* ── Mock data para a galeria — substituir por chamada real à API ── */
const GALLERY_DATA = [
  {
    id: 1,
    image: "/images/galeria/idb-jovem-one.jpg",
    event: "IDB Jovem One",
    location: "São Paulo, SP",
  },
  {
    id: 2,
    image: "/images/galeria/idb-teen-camp.jpg",
    event: "Teen Camp",
    location: "Brasília, DF",
  },
  {
    id: 3,
    image: "/images/galeria/es-ne-ajo.jpg",
    event: "ES NE AJO",
    location: "Moçoro, RN",
  },
  {
    id: 4,
    image: "/images/galeria/idb-jovem-one.jpg",
    event: "IDB Jovem One",
    location: "Manaus, AM",
  },
  {
    id: 5,
    image: "/images/galeria/idb-teen-camp.jpg",
    event: "Imersão 2025",
    location: "São Paulo, SP",
  },
  {
    id: 6,
    image: "/images/galeria/es-ne-ajo.jpg",
    event: "Conferência SP",
    location: "São Paulo, SP",
  },
  {
    id: 7,
    image: "/images/galeria/idb-jovem-one.jpg",
    event: "Encontro Manaus",
    location: "Manaus, AM",
  },
  {
    id: 8,
    image: "/images/galeria/idb-teen-camp.jpg",
    event: "Culto Jovem",
    location: "Fortaleza, CE",
  },
  {
    id: 9,
    image: "/images/galeria/es-ne-ajo.jpg",
    event: "Retiro Norte",
    location: "Belém, PA",
  },
];

export function useGallery() {
  const photos = GALLERY_DATA;
  const loading = false;

  return { photos, loading };
}
