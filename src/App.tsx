import { useState } from 'react'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import LandingPage from '@/pages/LandingPage'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import ForgotPassword from '@/pages/ForgotPassword'
import Dashboard from '@/pages/Dashboard'
import ConfigureSite from '@/pages/ConfigureSite'
import NotFound from '@/pages/NotFound'
import Users from '@/pages/Users'
import Groups from '@/pages/Groups'
import Schedule from '@/pages/Schedule'
import Results from '@/pages/Results'
import Settings from '@/pages/Settings'
import { Intro } from '@/components/Intro'

const queryClient = new QueryClient()

const App = () => {
  const [showIntro, setShowIntro] = useState(true)

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            {/* Intro animation */}
            {showIntro && <Intro onFinish={() => setShowIntro(false)} />}

            {/* Main app content, rendered after intro */}
            {!showIntro && (
              <>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/configure-site" element={<ConfigureSite />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/groups" element={<Groups />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route path="/results" element={<Results />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </>
            )}
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
