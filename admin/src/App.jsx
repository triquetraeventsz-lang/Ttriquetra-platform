import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { ProtectedRoute, RequireRole } from './components/ProtectedRoute.jsx'
import { AdminLayout } from './layouts/AdminLayout.jsx'
import { Login } from './pages/Login.jsx'
import { Dashboard } from './pages/Dashboard.jsx'
import { Pages } from './pages/Pages.jsx'
import { Navigation } from './pages/Navigation.jsx'
import { Services } from './pages/Services.jsx'
import { ServiceEditor } from './pages/ServiceEditor.jsx'
import { Blogs } from './pages/Blogs.jsx'
import { BlogEditor } from './pages/BlogEditor.jsx'
import { CaseStudies } from './pages/CaseStudies.jsx'
import { CaseStudyEditor } from './pages/CaseStudyEditor.jsx'
import { FAQs } from './pages/FAQs.jsx'
import { Media } from './pages/Media.jsx'
import { Events } from './pages/Events.jsx'
import { EventEditor } from './pages/EventEditor.jsx'
import { Announcement } from './pages/Announcement.jsx'
import { SiteSettings } from './pages/settings/SiteSettings.jsx'
import { Users } from './pages/settings/Users.jsx'
import { ActivityLog } from './pages/settings/ActivityLog.jsx'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pages" element={<Pages />} />
              <Route path="/navigation" element={<Navigation />} />

              <Route path="/services" element={<Services />} />
              <Route path="/services/:id" element={<ServiceEditor />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:id" element={<BlogEditor />} />
              <Route path="/case-studies" element={<CaseStudies />} />
              <Route path="/case-studies/:id" element={<CaseStudyEditor />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/media" element={<Media />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventEditor />} />
              <Route path="/announcement" element={<Announcement />} />

              <Route path="/settings/activity-log" element={<ActivityLog />} />

              <Route element={<RequireRole role="ADMIN" />}>
                <Route path="/seo" element={<SiteSettings />} />
                <Route path="/settings/site" element={<SiteSettings />} />
                <Route path="/settings/users" element={<Users />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
