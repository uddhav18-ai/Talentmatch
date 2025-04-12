import { useState, useEffect } from 'react';
import { Switch, Route, useLocation } from 'wouter';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import CandidatesPage from './pages/CandidatesPage';
import CompaniesPage from './pages/CompaniesPage';
import ChallengesPage from './pages/ChallengesPage';
import InsightsPage from './pages/InsightsPage';
import ChallengeDetail from './pages/challenge-detail';
import AuthPage from './pages/auth-page';
import NotFound from './pages/not-found';
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from './hooks/use-auth';
import { ProtectedRoute } from './lib/protected-route';
import './lib/animations.css';

function AppContent() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [location] = useLocation();

  useEffect(() => {
    // Extract tab from URL path if it exists
    let path = location.slice(1).split('/')[0] || 'home';
    
    // Special cases where we don't want to update the active tab
    if (path === 'challenge' || path === 'auth') return;
    
    setActiveTab(path);
  }, [location]);

  return (
    <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/candidates" component={CandidatesPage} />
        <Route path="/companies" component={CompaniesPage} />
        <Route path="/challenges" component={ChallengesPage} />
        <Route path="/insights" component={InsightsPage} />
        <Route path="/auth">
          <AuthPage />
        </Route>
        <Route path="/challenge/:id">
          {(params) => (
            <ProtectedRoute>
              <ChallengeDetail />
            </ProtectedRoute>
          )}
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
