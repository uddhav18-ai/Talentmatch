import React, { ReactNode } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface MainLayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children,
  activeTab,
  setActiveTab 
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-light">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;
