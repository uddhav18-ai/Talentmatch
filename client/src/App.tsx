import { useState, useEffect } from 'react';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import CandidatesPage from './pages/CandidatesPage';
import CompaniesPage from './pages/CompaniesPage';
import ChallengesPage from './pages/ChallengesPage';
import InsightsPage from './pages/InsightsPage';
import NotFound from './pages/not-found';
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useLocation } from 'wouter';
import './lib/animations.css';

function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [location] = useLocation();

  useEffect(() => {
    // Extract tab from URL path if it exists
    const path = location.slice(1) || 'home';
    setActiveTab(path);
  }, [location]);

  const getContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'candidates':
        return <CandidatesPage />;
      case 'companies':
        return <CompaniesPage />;
      case 'challenges':
        return <ChallengesPage />;
      case 'insights':
        return <InsightsPage />;
      default:
        return <NotFound />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        {getContent()}
      </MainLayout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
