import ServiceDetail from '../components/ServiceDetail/ServiceDetail'
import { getServiceBySlug } from '../data/services'

export default function MICE() {
  return <ServiceDetail service={getServiceBySlug('mice')} />
}
