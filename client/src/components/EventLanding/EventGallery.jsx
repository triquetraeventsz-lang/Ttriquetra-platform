import Reveal from '../Reveal/Reveal'

export default function EventGallery({ images }) {
  if (!images || images.length === 0) return null

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-page">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {images.map((src, i) => (
            <Reveal key={src} delay={i * 0.05} className="aspect-square overflow-hidden rounded-2xl">
              <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
