import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { 
  LogOut, User, Menu, Info, Mail, LockIcon, 
  BriefcaseIcon, PenToolIcon, FileTextIcon, 
  BarChartIcon, UserIcon, Building2Icon, Package
} from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [userRole, setUserRole] = useState<'candidate' | 'employer' | null>(null);
  
  // Determine user role from profile type (if available)
  useEffect(() => {
    if (user?.profileType) {
      setUserRole(user.profileType as 'candidate' | 'employer');
    } else {
      setUserRole(null);
    }
  }, [user]);

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

  // Generate navigation items based on user role
  const getNavItems = () => {
    // Base navigation items
    const baseItems = [
      { id: 'home', label: 'Home', icon: <UserIcon className="h-4 w-4 mr-2" /> },
    ];
    
    // Role-specific items
    if (userRole === 'employer') {
      // For employers
      return [
        ...baseItems,
        { id: 'companies', label: 'For Companies', icon: <Building2Icon className="h-4 w-4 mr-2" /> },
      ];
    } else if (userRole === 'candidate') {
      // For candidates
      return [
        ...baseItems, 
        { id: 'candidates', label: 'For Candidates', icon: <UserIcon className="h-4 w-4 mr-2" /> },
      ];
    } else {
      // For logged out users or users without a role
      return [
        ...baseItems,
        { id: 'candidates', label: 'For Candidates', icon: <UserIcon className="h-4 w-4 mr-2" /> },
        { id: 'companies', label: 'For Companies', icon: <Building2Icon className="h-4 w-4 mr-2" /> },
      ];
    }
  };
  
  // Main navigation items
  const mainNavItems = getNavItems();
  
  // Conditional Challenges tab (only for authenticated users)
  const challengesNavItem = { id: 'challenges', label: 'Challenges', icon: <PenToolIcon className="h-4 w-4 mr-2" /> };
  
  // Employer-specific actions
  const employerActions = [
    { id: 'post-job', label: 'Post a Job', icon: <FileTextIcon className="h-4 w-4 mr-2" />, path: '/post-job' },
    { id: 'post-work-sample', label: 'Post Work Sample', icon: <Package className="h-4 w-4 mr-2" />, path: '/post-work-sample' },
  ];
  
  // Secondary navigation items
  const secondaryNavItems = [
    { id: 'about', label: 'About Us', icon: <Info className="h-4 w-4 mr-2" /> },
    { id: 'contact', label: 'Contact', icon: <Mail className="h-4 w-4 mr-2" /> },
    { id: 'insights', label: 'Insights', icon: <BarChartIcon className="h-4 w-4 mr-2" /> }
  ];

  // All navigation items for mobile
  const allNavItems = [
    ...mainNavItems,
    ...(user ? [challengesNavItem] : []), // Only show Challenges if logged in
    ...(userRole === 'employer' ? employerActions : []), // Only show employer actions for employers
    ...secondaryNavItems
  ];

  return (
    <header className="sticky top-0 bg-blue-600 dark:bg-blue-800 shadow-sm z-50 transition-all duration-300 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div 
            className="cursor-pointer transform transition-transform hover:scale-105" 
            onClick={() => handleTabClick('home')}
          >
            <div className="flex items-center space-x-2">
              <div className="bg-white dark:bg-blue-950 text-blue-600 dark:text-blue-300 p-1.5 rounded">
                <i className="fas fa-bolt text-xl"></i>
              </div>
              <span className="text-xl font-bold text-white dark:text-white">TalentMatch</span>
            </div>
          </div>

          {/* Desktop Navigation - Primary Items */}
          <nav className="hidden md:flex space-x-1">
            {mainNavItems.map(item => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "ghost" : "ghost"}
                className={`px-4 py-2 font-medium rounded-md transition-all duration-300 ${
                  activeTab === item.id 
                    ? 'bg-white text-blue-600 dark:bg-blue-950 dark:text-white scale-105' 
                    : 'text-white hover:bg-blue-500 dark:text-white dark:hover:bg-blue-700'
                }`}
                onClick={() => handleTabClick(item.id)}
              >
                <div className="flex items-center">
                  {item.icon && <span className="mr-1 md:hidden lg:inline-block">{item.icon}</span>}
                  {item.label}
                </div>
              </Button>
            ))}
            
            {/* Challenges Tab - Only for logged-in users */}
            {user && (
              <Button
                variant={activeTab === 'challenges' ? "ghost" : "ghost"}
                className={`px-4 py-2 font-medium rounded-md transition-all duration-300 ${
                  activeTab === 'challenges' 
                    ? 'bg-white text-blue-600 dark:bg-blue-950 dark:text-white scale-105' 
                    : 'text-white hover:bg-blue-500 dark:text-white dark:hover:bg-blue-700'
                }`}
                onClick={() => handleTabClick('challenges')}
              >
                <div className="flex items-center">
                  <PenToolIcon className="h-4 w-4 mr-1 md:hidden lg:inline-block" />
                  Challenges
                </div>
              </Button>
            )}
            
            {/* Employer Actions Dropdown - Only for employers */}
            {userRole === 'employer' && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost"
                    className="px-4 py-2 font-medium rounded-md transition-all duration-300 text-white hover:bg-blue-500 dark:text-white dark:hover:bg-blue-700"
                  >
                    <div className="flex items-center">
                      <BriefcaseIcon className="h-4 w-4 mr-1 md:hidden lg:inline-block" />
                      Actions <span className="ml-1">▼</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-[200px] animate-fade-in animate-slide-up">
                  <DropdownMenuLabel>Employer Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {employerActions.map(action => (
                    <DropdownMenuItem 
                      key={action.id}
                      className="cursor-pointer"
                      onClick={() => {
                        if (action.path) {
                          setLocation(action.path as string);
                          setMobileMenuOpen(false);
                        } else {
                          handleTabClick(action.id);
                        }
                      }}
                    >
                      <div className="flex items-center py-1">
                        {action.icon}
                        <span>{action.label}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {/* Divider */}
            <span className="border-l border-gray-200 dark:border-gray-700 mx-1 self-stretch"></span>
            
            {/* Secondary Items */}
            {secondaryNavItems.map(item => (
              <Button
                key={item.id}
                variant="ghost"
                className={`px-4 py-2 font-medium rounded-md transition-all duration-300 ${
                  activeTab === item.id 
                    ? 'bg-white text-blue-600 dark:bg-blue-950 dark:text-white scale-105' 
                    : 'text-white hover:bg-blue-500 dark:text-white dark:hover:bg-blue-700'
                }`}
                onClick={() => handleTabClick(item.id)}
              >
                <div className="flex items-center">
                  {item.icon} 
                  <span className="md:hidden lg:inline-block">{item.label}</span>
                </div>
              </Button>
            ))}
          </nav>

          {/* Auth Buttons + Theme Toggle */}
          <div className="flex items-center space-x-2">
            <ThemeToggle className="mr-1" />
            
            {user ? (
              // Logged in state
              <div className="hidden md:flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="px-3 py-2 text-white font-medium hover:bg-blue-500 rounded-md transition-all duration-300 dark:text-white dark:hover:bg-blue-700"
                    >
                      <User className="h-4 w-4 mr-2" />
                      <span className="font-medium">{user.username}</span>
                      <span className="ml-1">▼</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="min-w-[200px] animate-fade-in animate-slide-up">
                    <DropdownMenuLabel className="bg-blue-500 text-white dark:bg-blue-800">
                      {userRole ? `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} Account` : 'Your Account'}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900 dark:hover:text-blue-300"
                      onClick={() => setLocation(`/profile`)}
                    >
                      <User className="h-4 w-4 mr-2" /> My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="cursor-pointer hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900 dark:hover:text-blue-300"
                      onClick={() => setLocation(`/user/dashboard`)}
                    >
                      <BarChartIcon className="h-4 w-4 mr-2" /> My Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="cursor-pointer hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900 dark:hover:text-blue-300"
                      onClick={() => setLocation(`/user/submissions`)}
                    >
                      <PenToolIcon className="h-4 w-4 mr-2" /> My Submissions
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-blue-600 dark:text-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900 dark:hover:text-blue-300" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" /> Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              // Logged out state
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  className="px-4 py-2 text-white font-medium hover:bg-blue-500 rounded-md transition-all duration-300 dark:text-white dark:hover:bg-blue-700"
                  onClick={handleSignIn}
                >
                  Sign In
                </Button>
                <Link href="/auth?tab=register">
                  <Button
                    variant="default"
                    className="px-4 py-2 bg-blue-700 text-white font-medium hover:bg-blue-800 rounded-md transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105"
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
              <Menu className="h-5 w-5 text-white dark:text-white" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-blue-500 dark:bg-blue-800 shadow-lg absolute w-full animate-fade-in ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-4 py-2 space-y-1">
          {allNavItems.map(item => (
            <Button
              key={item.id}
              variant="ghost"
              className={`block w-full text-left px-4 py-2 font-medium rounded-md hover:bg-blue-400 transition-all duration-300 dark:hover:bg-blue-700 ${
                activeTab === item.id 
                  ? 'bg-white text-blue-600 dark:bg-blue-950 dark:text-white' 
                  : 'text-white dark:text-white'
              }`}
              onClick={() => {
                // Handle items with direct paths (employer actions)
                if ('path' in item && item.path) {
                  setLocation(item.path as string);
                  setMobileMenuOpen(false);
                } else {
                  handleTabClick(item.id);
                }
              }}
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
                  <User className="h-4 w-4 mr-2 text-white dark:text-white" />
                  <span className="font-medium text-white dark:text-white">
                    {user.username}
                    {userRole && <span className="ml-2 text-xs opacity-75">({userRole})</span>}
                  </span>
                </div>
                
                <Button
                  variant="ghost"
                  className="block w-full text-left px-4 py-2 text-white font-medium hover:bg-blue-400 rounded-md transition-all duration-300 dark:text-white dark:hover:bg-blue-700"
                  onClick={() => {
                    setLocation(`/profile`);
                    setMobileMenuOpen(false);
                  }}
                >
                  <User className="h-4 w-4 mr-2 inline" /> 
                  My Profile
                </Button>
                
                <Button
                  variant="ghost"
                  className="block w-full text-left px-4 py-2 text-white font-medium hover:bg-blue-400 rounded-md transition-all duration-300 dark:text-white dark:hover:bg-blue-700"
                  onClick={() => {
                    setLocation(`/user/dashboard`);
                    setMobileMenuOpen(false);
                  }}
                >
                  <BarChartIcon className="h-4 w-4 mr-2 inline" /> 
                  My Dashboard
                </Button>
                
                <Button
                  variant="ghost"
                  className="block w-full text-left px-4 py-2 text-white font-medium hover:bg-blue-400 rounded-md transition-all duration-300 dark:text-white dark:hover:bg-blue-700"
                  onClick={() => {
                    setLocation(`/user/submissions`);
                    setMobileMenuOpen(false);
                  }}
                >
                  <PenToolIcon className="h-4 w-4 mr-2 inline" /> 
                  My Submissions
                </Button>
                
                <Button
                  variant="ghost"
                  className="block w-full text-left px-4 py-2 text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-400 hover:text-white rounded-md transition-all duration-300 dark:hover:bg-blue-700 dark:hover:text-white"
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
                  className="block w-full text-left px-4 py-2 text-white font-medium hover:bg-blue-400 rounded-md transition-all duration-300 dark:text-white dark:hover:bg-blue-700"
                  onClick={handleSignIn}
                >
                  Sign In
                </Button>
                <Link href="/auth?tab=register">
                  <Button
                    variant="default"
                    className="block w-full mt-1 px-4 py-2 bg-blue-700 text-white font-medium hover:bg-blue-800 rounded-md transition-all duration-300"
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
