export default function EventGallery({ gallery = [] }) {
  if (gallery.length === 0) return null;

  return (
    <section className="w-full bg-white py-14 md:py-20">
      <div className="w-full max-w-6xl mx-auto px-6">
        <h2
          className="font-bold text-[#1E1E1E] text-center mb-10"
          style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)" }}
        >
          Galeria do evento
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {gallery.map((item, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg aspect-square"
            >
              <img
                src={item}
                alt={`Foto ${index + 1} do evento`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
