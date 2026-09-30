import SEO from '../components/SEO/SEO'
import Button from '../components/Button/Button'

export default function NotFound() {
  return (
    <>
      <SEO title="Page Not Found | Triquetra Events" description="The page you're looking for doesn't exist." noindex />
      <section className="flex min-h-screen flex-col items-center justify-center gap-6 bg-cream px-6 text-center">
        <span className="font-display text-7xl font-semibold text-gold">404</span>
        <h1 className="text-2xl font-semibold text-ink sm:text-3xl">Page not found.</h1>
        <p className="max-w-md text-stone-dark">
          The page you're looking for may have been moved or never existed. Let's get you back on track.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button to="/">Home</Button>
          <Button to="/services" variant="dark">
            Services
          </Button>
          <Button to="/contact" variant="outline">
            Contact
          </Button>
        </div>
      </section>
    </>
  )
}
