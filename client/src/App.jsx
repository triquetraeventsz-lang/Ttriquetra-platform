import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import OnlineMarketing from './pages/OnlineMarketing'
import Events from './pages/Events'
import BrandActivation from './pages/BrandActivation'
import MICE from './pages/MICE'
import HowWeWork from './pages/HowWeWork'
import Contact from './pages/Contact'
import CaseStudies from './pages/CaseStudies'
import EventLanding from './pages/EventLanding'
import NotFound from './pages/NotFound'
import AnnouncementBar from './components/Announcement/AnnouncementBar'
import AnnouncementModal from './components/Announcement/AnnouncementModal'
import ConcertPromoModal from './components/ConcertPromo/ConcertPromoModal'
import { useAnnouncement } from './hooks/useAnnouncement'
import { useConcertPromo } from './hooks/useConcertPromo'
import { FooterVisibilityProvider, useFooterVisibility } from './context/FooterVisibilityContext'

function AppShell() {
  const { announcement, dismiss } = useAnnouncement()
  const { visible: footerVisible } = useFooterVisibility()
  const concertPromo = useConcertPromo()
  const showBar = announcement?.displayType === 'bar'

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      {showBar && <AnnouncementBar announcement={announcement} onDismiss={dismiss} />}
      {announcement?.displayType === 'modal' && <AnnouncementModal announcement={announcement} onDismiss={dismiss} />}
      <ConcertPromoModal open={concertPromo.open} onDismiss={concertPromo.dismiss} onConfirm={concertPromo.confirm} />
      <Navbar hasAnnouncement={showBar} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/online-marketing" element={<OnlineMarketing />} />
          <Route path="/services/events" element={<Events />} />
          <Route path="/services/brand-activation" element={<BrandActivation />} />
          <Route path="/services/mice" element={<MICE />} />
          <Route path="/how-we-work" element={<HowWeWork />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/events/:slug" element={<EventLanding />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {footerVisible && <Footer />}
    </div>
  )
}

function App() {
  return (
    <FooterVisibilityProvider>
      <AppShell />
    </FooterVisibilityProvider>
  )
}

export default App
