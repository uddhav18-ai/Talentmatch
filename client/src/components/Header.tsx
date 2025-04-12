import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { LogOut, User, Menu, Info, Mail, LockIcon } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { user, logoutMutation } = useAuth();

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setLocation(`/${tab === 'home' ? '' : tab}`);
    setMobileMenuOpen(false);
  };

  const handleSignIn = () => {
    setLocation('/auth');
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    setMobileMenuOpen(false);
  };

  // Main navigation items
  const mainNavItems = [
    { id: 'home', label: 'Home' },
    { id: 'candidates', label: 'For Candidates' },
    { id: 'companies', label: 'For Companies' },
  ];
  
  // Conditional Challenges tab (only for authenticated users)
  const challengesNavItem = { id: 'challenges', label: 'Challenges', icon: <LockIcon className="h-3 w-3 ml-1" /> };
  
  // Secondary navigation items
  const secondaryNavItems = [
    { id: 'about', label: 'About Us', icon: <Info className="h-4 w-4 mr-1" /> },
    { id: 'contact', label: 'Contact', icon: <Mail className="h-4 w-4 mr-1" /> },
    { id: 'insights', label: 'Insights' }
  ];

  // All navigation items for mobile
  const allNavItems = [
    ...mainNavItems,
    ...(user ? [challengesNavItem] : []), // Only show Challenges if logged in
    ...secondaryNavItems
  ];

  return (
    <header className="sticky top-0 bg-white dark:bg-gray-800 shadow-sm z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center space-x-2 cursor-pointer" onClick={() => handleTabClick('home')}>
              <div className="bg-primary text-white p-1.5 rounded">
                <i className="fas fa-bolt text-xl"></i>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">TalentMatch</span>
            </a>
          </Link>

          {/* Desktop Navigation - Primary Items */}
          <nav className="hidden md:flex space-x-1">
            {mainNavItems.map(item => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "ghost" : "ghost"}
                className={`px-4 py-2 font-medium rounded-md transition-colors ${
                  activeTab === item.id 
                    ? 'bg-blue-50 text-primary dark:bg-blue-900/20 dark:text-blue-400' 
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/30'
                }`}
                onClick={() => handleTabClick(item.id)}
              >
                {item.label}
              </Button>
            ))}
            
            {/* Challenges Tab - Only for logged-in users */}
            {user && (
              <Button
                variant={activeTab === 'challenges' ? "ghost" : "ghost"}
                className={`px-4 py-2 font-medium rounded-md transition-colors ${
                  activeTab === 'challenges' 
                    ? 'bg-blue-50 text-primary dark:bg-blue-900/20 dark:text-blue-400' 
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/30'
                }`}
                onClick={() => handleTabClick('challenges')}
              >
                Challenges
              </Button>
            )}
            
            {/* Divider */}
            <span className="border-l border-gray-200 dark:border-gray-700 mx-1 self-stretch"></span>
            
            {/* Secondary Items */}
            {secondaryNavItems.map(item => (
              <Button
                key={item.id}
                variant="ghost"
                className={`px-4 py-2 font-medium rounded-md transition-colors ${
                  activeTab === item.id 
                    ? 'bg-blue-50 text-primary dark:bg-blue-900/20 dark:text-blue-400' 
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/30'
                }`}
                onClick={() => handleTabClick(item.id)}
              >
                {item.icon} {item.label}
              </Button>
            ))}
          </nav>

          {/* Auth Buttons + Theme Toggle */}
          <div className="flex items-center space-x-2">
            <ThemeToggle className="mr-1" />
            
            {user ? (
              // Logged in state
              <div className="hidden md:flex items-center">
                <span className="mr-2 text-gray-700 dark:text-gray-300">
                  <span className="font-medium">{user.username}</span>
                </span>
                <Button
                  variant="ghost"
                  className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-md transition-colors dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-1" /> 
                  Log Out
                </Button>
              </div>
            ) : (
              // Logged out state
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  className="px-4 py-2 text-primary font-medium hover:bg-blue-50 rounded-md transition-colors dark:text-blue-400 dark:hover:bg-blue-900/20"
                  onClick={handleSignIn}
                >
                  Sign In
                </Button>
                <Link href="/auth?tab=register">
                  <Button
                    variant="default"
                    className="px-4 py-2 bg-primary text-white font-medium hover:bg-blue-600 rounded-md transition-colors shadow-sm"
                  >
                    Join Now
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              className="md:hidden p-2 rounded-md"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-white dark:bg-gray-800 shadow-lg absolute w-full animate-fade-in ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-4 py-2 space-y-1">
          {allNavItems.map(item => (
            <Button
              key={item.id}
              variant="ghost"
              className={`block w-full text-left px-4 py-2 font-medium rounded-md hover:bg-blue-50 transition-colors dark:hover:bg-gray-700 ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-primary dark:bg-blue-900/20 dark:text-blue-400' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => handleTabClick(item.id)}
            >
              <div className="flex items-center">
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </div>
            </Button>
          ))}
          
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
            {user ? (
              // Mobile logged in state
              <>
                <div className="px-4 py-2 flex items-center">
                  <User className="h-4 w-4 mr-2 text-primary dark:text-blue-400" />
                  <span className="font-medium dark:text-white">{user.username}</span>
                </div>
                <Button
                  variant="ghost"
                  className="block w-full text-left px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-md transition-colors dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2 inline" /> 
                  Log Out
                </Button>
              </>
            ) : (
              // Mobile logged out state
              <>
                <Button
                  variant="ghost"
                  className="block w-full text-left px-4 py-2 text-primary font-medium hover:bg-blue-50 rounded-md transition-colors dark:text-blue-400 dark:hover:bg-blue-900/20"
                  onClick={handleSignIn}
                >
                  Sign In
                </Button>
                <Link href="/auth?tab=register">
                  <Button
                    variant="default"
                    className="block w-full mt-1 px-4 py-2 bg-primary text-white font-medium hover:bg-blue-600 rounded-md transition-colors"
                  >
                    Join Now
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
