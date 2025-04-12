import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

export const useActiveTab = (defaultTab: string = 'home') => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [location, setLocation] = useLocation();

  // Update the active tab when the URL changes
  useEffect(() => {
    const currentPath = location.substring(1);
    
    if (currentPath === '') {
      setActiveTab('home');
    } else if (['candidates', 'companies', 'challenges', 'insights'].includes(currentPath)) {
      setActiveTab(currentPath);
    }
  }, [location]);

  // Update the URL when the active tab changes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setLocation(tabId === 'home' ? '/' : `/${tabId}`);
  };

  return { activeTab, setActiveTab: handleTabChange };
};

export default useActiveTab;
