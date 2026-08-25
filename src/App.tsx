import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { SignupForm } from '@/features/auth/components/SignupForm'
import { HomePage } from '@/features/home/components/HomePage'
import { LandingPage } from '@/features/landing/components/LandingPage'
import { OnboardingPage } from '@/features/onboarding/components/OnboardingPage'
import { ProfilePage } from '@/features/profile/components/ProfilePage'
import { TeamDashboardPage } from '@/features/team-dashboard/shared/components/TeamDashboardPage'
import { TodoListPage } from '@/features/todo/components/TodoListPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/home" element={<AppShell><HomePage /></AppShell>} />
        <Route path="/todo" element={<AppShell><TodoListPage /></AppShell>} />
        <Route path="/profile" element={<AppShell><ProfilePage /></AppShell>} />
        <Route path="/team/:teamId" element={<AppShell><TeamDashboardPage /></AppShell>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
