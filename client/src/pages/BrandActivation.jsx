import ServiceDetail from '../components/ServiceDetail/ServiceDetail'
import { getServiceBySlug } from '../data/services'

export default function BrandActivation() {
  return <ServiceDetail service={getServiceBySlug('brand-activation')} />
}
