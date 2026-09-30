import { services } from '../../data/services'
import ServiceCard from '../ServiceCard/ServiceCard'

export default function ServiceGrid({ items = services }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((service, i) => (
        <ServiceCard key={service.slug} service={service} index={i} />
      ))}
    </div>
  )
}
