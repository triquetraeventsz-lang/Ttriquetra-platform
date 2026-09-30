import ServiceDetail from '../components/ServiceDetail/ServiceDetail'
import { getServiceBySlug } from '../data/services'

export default function OnlineMarketing() {
  return <ServiceDetail service={getServiceBySlug('online-marketing')} />
}
