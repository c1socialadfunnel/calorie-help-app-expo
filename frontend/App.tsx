import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { UserProvider, useUser } from './context/UserContext';
import { OnboardingProvider } from './context/OnboardingContext';
import AuthScreen from './screens/AuthScreen';
import OnboardingFlow from './screens/OnboardingFlow';
import Dashboard from './screens/Dashboard';
import AIFoodLogger from './screens/AIFoodLogger';
import AICoach from './screens/AICoach';
import Profile from './screens/Profile';
import LoadingScreen from './components/common/LoadingScreen';

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, isLoading, isAuthenticated } = useUser();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {!isAuthenticated ? (
        <Route path="*" element={<AuthScreen />} />
      ) : !user ? (
        <Route path="*" element={<OnboardingFlow />} />
      ) : (
        <>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ai-food-logger" element={<AIFoodLogger />} />
          <Route path="/ai-coach" element={<AICoach />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
}

function AppInner() {
  return (
    <Router>
      <UserProvider>
        <OnboardingProvider>
          <AppRoutes />
          <Toaster />
        </OnboardingProvider>
      </UserProvider>
    </Router>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}
