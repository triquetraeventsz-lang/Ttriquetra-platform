import ServiceDetail from '../components/ServiceDetail/ServiceDetail'
import { getServiceBySlug } from '../data/services'

export default function Events() {
  return <ServiceDetail service={getServiceBySlug('events')} />
}
