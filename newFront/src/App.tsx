import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LandingPage } from './pages/LandingPage';
import { OnboardingFlow } from './pages/Onboarding';
import { LearnerDashboard } from './pages/Dashboard';
import { Marketplace } from './pages/Marketplace';
import { ProfilePage } from './pages/Profile';
import { VerificationPage } from './pages/Verification';
import { InstructorDashboard } from './pages/InstructorDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<OnboardingFlow />} />
        <Route path="/dashboard" element={<LearnerDashboard />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/certificates" element={<ProfilePage />} /> {/* Using profile tabs for now */}
        <Route path="/verification" element={<VerificationPage />} />
        <Route path="/instructor" element={<InstructorDashboard />} />
        <Route path="/settings" element={<ProfilePage />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-center" theme="dark" />
    </Router>
  );
}

export default App;