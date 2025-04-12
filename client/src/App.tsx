import { useState, useEffect } from 'react';
import { Switch, Route, useLocation } from 'wouter';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import CandidatesPage from './pages/CandidatesPage';
import CompaniesPage from './pages/CompaniesPage';
import ChallengesPage from './pages/ChallengesPage';
import InsightsPage from './pages/InsightsPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import SubmissionsPage from './pages/SubmissionsPage';
import AboutPage from './pages/about-page';
import ContactPage from './pages/contact-page';
import ChallengeDetail from './pages/challenge-detail';
import AuthPage from './pages/auth-page';
import PostWorkSamplePage from './pages/PostWorkSamplePage';
import NotFound from './pages/not-found';
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from './hooks/use-auth';
import { ThemeProvider } from './hooks/use-theme';
import { ProtectedRoute } from './lib/protected-route';
import Chatbot from './components/chat/Chatbot';
import './lib/animations.css';

function AppContent() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [location] = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Extract tab from URL path if it exists
    let path = location.slice(1).split('/')[0] || 'home';
    
    // Special cases where we don't want to update the active tab
    if (path === 'challenge' || path === 'auth') return;
    
    setActiveTab(path);
  }, [location]);

  // Mark app as loaded after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-solid rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/candidates" component={CandidatesPage} />
        <Route path="/companies" component={CompaniesPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/insights" component={InsightsPage} />
        <Route path="/auth">
          <AuthPage />
        </Route>
        {/* Protected routes that require authentication */}
        <Route path="/challenges">
          <ProtectedRoute>
            <ChallengesPage />
          </ProtectedRoute>
        </Route>
        <Route path="/challenge/:id">
          <ProtectedRoute>
            <ChallengeDetail />
          </ProtectedRoute>
        </Route>
        <Route path="/post-work-sample">
          <ProtectedRoute>
            <PostWorkSamplePage />
          </ProtectedRoute>
        </Route>
        <Route path="/profile">
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard">
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        </Route>
        <Route path="/submissions">
          <ProtectedRoute>
            <SubmissionsPage />
          </ProtectedRoute>
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
      
      {/* Chatbot - accessible on all pages */}
      <Chatbot />
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
