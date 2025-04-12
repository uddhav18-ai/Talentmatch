import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import FeatureCard from '../components/home/FeatureCard';
import Testimonial from '../components/home/Testimonial';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Challenge } from '@shared/schema';
import { 
  Loader2, 
  Zap, 
  Code, 
  Briefcase, 
  CheckCircle, 
  ArrowRight, 
  TrendingUp,
  PieChart,
  Clock,
  Users
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [showAnimation, setShowAnimation] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Fetch top challenges
  const { data: challengesData, isLoading: isLoadingChallenges, error: challengesError } = useQuery({
    queryKey: ['/api/challenges'],
    queryFn: async () => {
      const response = await fetch('/api/challenges');
      if (!response.ok) {
        throw new Error('Failed to fetch challenges');
      }
      return response.json();
    }
  });
  
  // Make sure challenges is always an array
  const challenges = Array.isArray(challengesData) ? challengesData : [];

  // Trigger animations on page load
  useEffect(() => {
    setShowAnimation(true);
  }, []);

  // Cycle through testimonials automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  const navigateToAuth = () => {
    setLocation('/auth');
  };

  const navigateToChallenges = () => {
    setLocation('/challenges');
  };

  const features = [
    {
      icon: <Code className="h-6 w-6 text-primary" />,
      iconBgColor: 'bg-blue-100',
      title: 'Skills-Based Challenges',
      description: 'Complete real-world tasks that showcase your abilities instead of submitting another resume.',
      buttonText: 'Try a challenge',
      route: '/challenges'
    },
    {
      icon: <PieChart className="h-6 w-6 text-secondary" />,
      iconBgColor: 'bg-green-100',
      title: 'AI-Powered Matching',
      description: 'Our intelligent system matches you with roles based on your demonstrated abilities, not just keywords.',
      buttonText: 'How it works',
      route: '/insights'
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-accent" />,
      iconBgColor: 'bg-indigo-100',
      title: 'Blind Matching Process',
      description: 'Eliminates unconscious bias by focusing on skills first, revealing personal details only when necessary.',
      buttonText: 'Learn more',
      route: '/candidates'
    },
    {
      icon: <Briefcase className="h-6 w-6 text-yellow-500" />,
      iconBgColor: 'bg-yellow-100',
      title: 'Real Work Samples',
      description: 'Companies provide actual work examples rather than generic requirements so you know what to expect.',
      buttonText: 'View examples',
      route: '/companies'
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-status-error" />,
      iconBgColor: 'bg-red-100',
      title: 'Transparent Metrics',
      description: 'Access real salary data and company culture scores to make informed decisions about your career.',
      buttonText: 'Explore data',
      route: '/insights'
    },
    {
      icon: <Zap className="h-6 w-6 text-purple-500" />,
      iconBgColor: 'bg-purple-100',
      title: 'Feedback Loop',
      description: 'Post-hire feedback improves our matching algorithm and helps you grow professionally.',
      buttonText: 'How feedback works',
      route: '/candidates'
    }
  ];
  
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer at TechCorp',
      quote: 'I was overlooked for years because I didn\'t have a CS degree, despite my coding skills. Through TalentMatch\'s challenges, I proved my abilities and landed my dream job in two weeks.',
      rating: 5,
      additionalInfo: 'Completed 7 challenges in Web Development'
    },
    {
      name: 'Marcus Chen',
      role: 'HR Director at InnovateCo',
      quote: 'We\'ve reduced our hiring time by 60% and improved retention by focusing on skills rather than resumes. The quality of candidates we\'re getting through TalentMatch is outstanding.',
      rating: 5,
      additionalInfo: 'Hired 12 candidates through TalentMatch in the last quarter'
    },
    {
      name: 'Priya Sharma',
      role: 'Data Scientist at AnalyticsPro',
      quote: 'As a career changer without a traditional background, I struggled to get interviews. TalentMatch allowed me to showcase my machine learning skills and land my first data science job.',
      rating: 5,
      additionalInfo: 'Transitioned from marketing to data science through skill challenges'
    },
    {
      name: 'James Wilson',
      role: 'CTO at FutureTech',
      quote: 'The quality of talent we\'ve discovered through TalentMatch has been exceptional. Their skill-based approach helps us find qualified candidates we would have otherwise missed.',
      rating: 5,
      additionalInfo: 'Filled 4 senior developer positions through skill challenges'
    }
  ];

  // Animation classes for staggered effect
  const getAnimationClass = (index: number) => {
    if (!showAnimation) return '';
    const delayMs = 150 * index;
    return `animate-slide-up opacity-0 animation-delay-${delayMs}`;
  };

  // Get category color for challenge badge
  const getCategoryColor = (category: string) => {
    if (category.toLowerCase().includes('web')) return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
    if (category.toLowerCase().includes('data')) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100';
    if (category.toLowerCase().includes('mobile')) return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100';
    if (category.toLowerCase().includes('backend')) return 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100';
    if (category.toLowerCase().includes('database')) return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100';
    if (category.toLowerCase().includes('ai')) return 'bg-rose-100 text-rose-800 dark:bg-rose-800 dark:text-rose-100';
    if (category.toLowerCase().includes('cloud')) return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-800 dark:text-cyan-100';
    if (category.toLowerCase().includes('security')) return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
    return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
  };

  return (
    <div className="mb-12 animate-fade-in">
      {/* Hero Section with Dynamic User State */}
      <section className="relative bg-white rounded-xl shadow-md overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 opacity-90"></div>
        <div className="relative px-6 py-12 md:py-20 md:px-12 lg:px-20 text-white max-w-4xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            {user 
              ? `Welcome Back, ${user.firstName || user.username}!` 
              : "Reimagining Hiring Through Skills, Not Resumes"}
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            {user 
              ? "Continue your journey to showcase your skills and connect with opportunities that value your true abilities." 
              : "Join the platform that matches talented people with opportunities based on what they can do, not who they know or where they've been."}
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {user ? (
              <>
                <Button 
                  onClick={navigateToChallenges} 
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 hover:shadow-lg transition transform hover:-translate-y-0.5"
                >
                  Explore Challenges <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Link href="/profile">
                  <Button 
                    variant="outline" 
                    className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-md hover:bg-white hover:bg-opacity-10 transition"
                  >
                    My Profile
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/candidates">
                  <Button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 hover:shadow-lg transition transform hover:-translate-y-0.5">
                    Find Work
                  </Button>
                </Link>
                <Link href="/companies">
                  <Button variant="outline" className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-md hover:bg-white hover:bg-opacity-10 transition">
                    Hire Talent
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hidden lg:block absolute right-0 bottom-0 w-1/3 h-full">
          <div className="h-full w-full bg-gradient-to-l from-gray-900 to-transparent"></div>
        </div>
      </section>

      {/* Featured Challenges Section */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Challenges</h2>
          <Link href="/challenges">
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="text-center mb-6">
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Our challenges are designed by industry experts to assess real-world skills. 
            Complete them to showcase your abilities and get matched with relevant opportunities.
          </p>
        </div>

        {isLoadingChallenges ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : challengesError ? (
          <Card className="border-red-300 bg-red-50 dark:bg-red-900/20">
            <CardContent className="p-6 text-center">
              <p className="text-red-600 dark:text-red-400">Error loading challenges. Please try again later.</p>
            </CardContent>
          </Card>
        ) : challenges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.slice(0, 6).map((challenge, index) => (
              <Link key={challenge.id} href={`/challenge/${challenge.id}`}>
                <Card className="h-full hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-blue-500">
                  <CardContent className="p-6">
                    <div className="flex justify-between mb-4">
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                        {challenge.category}
                      </Badge>
                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                        {challenge.difficulty || 'Medium'}
                      </Badge>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">{challenge.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{challenge.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(challenge.skills || []).slice(0, 3).map((skill: string, i: number) => (
                        <span key={i} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-1" />
                        {challenge.timeEstimate}
                      </div>
                      <Button className="bg-blue-600 text-white hover:bg-blue-700">
                        Start Challenge
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">No challenges available right now. Check back soon!</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Features Section with Staggered Animation */}
      <section className="mb-10">
        <div className="flex flex-col items-center text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">How We're Different</h2>
          <p className="text-gray-600 max-w-2xl mb-3">Traditional hiring is broken. We've built a new approach that focuses on skills and potential, not keywords and credentials.</p>
          <div className="max-w-3xl mx-auto bg-blue-50 dark:bg-blue-900 p-5 rounded-lg border-l-4 border-blue-500 mb-4">
            <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-2">Our Unique Approach</h3>
            <p className="text-gray-700 dark:text-gray-300">
              We've reimagined the hiring process from the ground up. Our platform uses blind skill assessments to eliminate bias,
              AI-powered matching to connect talent with opportunities, and real-world challenges to showcase what truly matters - your abilities.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              <div className="static-white-bg bg-white dark:bg-blue-800 p-3 rounded shadow-sm">
                <p className="text-constant font-medium">75% faster hiring</p>
              </div>
              <div className="static-white-bg bg-white dark:bg-blue-800 p-3 rounded shadow-sm">
                <p className="text-constant font-medium">90% retention rate</p>
              </div>
              <div className="static-white-bg bg-white dark:bg-blue-800 p-3 rounded shadow-sm">
                <p className="text-constant font-medium">100% skill-focused</p>
              </div>
            </div>
          </div>
          
          {/* Process Steps - fills the gap below Our Unique Approach */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="relative">
                <div className="static-dark-bg bg-blue-600 dark:bg-blue-700 w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold mb-3">1</div>
                <h4 className="font-medium mb-2">Create Profile</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Build your skill-based profile that highlights your true capabilities</p>
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-blue-300 dark:bg-blue-600 -z-10"></div>
              </div>
              <div className="relative">
                <div className="static-dark-bg bg-blue-600 dark:bg-blue-700 w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold mb-3">2</div>
                <h4 className="font-medium mb-2">Take Challenges</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Demonstrate your skills through real-world coding challenges</p>
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-blue-300 dark:bg-blue-600 -z-10"></div>
              </div>
              <div className="relative">
                <div className="static-dark-bg bg-blue-600 dark:bg-blue-700 w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold mb-3">3</div>
                <h4 className="font-medium mb-2">Match with Jobs</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get matched with companies based on skill alignment, not just keywords</p>
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-blue-300 dark:bg-blue-600 -z-10"></div>
              </div>
              <div>
                <div className="static-dark-bg bg-blue-600 dark:bg-blue-700 w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold mb-3">4</div>
                <h4 className="font-medium mb-2">Get Hired</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Skip traditional interviews and get hired based on proven abilities</p>
              </div>
            </div>
          </div>
          
          {/* Advanced User Flow Diagram */}
          <div className="max-w-6xl mx-auto mb-12 mt-10">
            <h3 className="text-xl font-bold text-center mb-8">Advanced User Flow Diagram</h3>
            
            <div className="relative bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-6 rounded-xl border border-blue-200 dark:border-blue-700 overflow-hidden">
              {/* Background Grid Pattern */}
              <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-10 dark:opacity-15 pointer-events-none">
                {Array(144).fill(0).map((_, i) => (
                  <div key={i} className="border border-blue-200 dark:border-blue-700"></div>
                ))}
              </div>
              
              {/* Main Interactive Flow Diagram */}
              <div className="relative z-10">
                {/* Candidate Path - Left Side */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-16 relative">
                  <div className="absolute h-16 left-1/4 right-1/4 top-1/2 border-t-2 border-dashed border-blue-400 dark:border-blue-600 transform -translate-y-8 hidden md:block"></div>
                  
                  {/* User Flow Nodes */}
                  <div className="flex-1 md:max-w-xs">
                    <div className="bg-white dark:bg-blue-900 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-blue-100 dark:border-blue-800 relative mb-20 group">
                      <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">C1</div>
                      <h4 className="font-medium text-lg mb-2">Candidate Sign-Up</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Create account & complete profile</p>
                      <ul className="text-xs mt-3 space-y-1 text-gray-500 dark:text-gray-400">
                        <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>Skills Assessment</li>
                        <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>Upload Portfolio</li>
                        <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>Set Preferences</li>
                      </ul>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 h-12 bg-blue-300 dark:bg-blue-700 group-hover:bg-blue-500 transition-colors duration-300"></div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-12 w-3 h-3 bg-blue-400 dark:bg-blue-600 rounded-full group-hover:bg-blue-500 transition-colors duration-300"></div>
                    </div>
                    
                    <div className="bg-white dark:bg-blue-900 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-blue-100 dark:border-blue-800 relative group">
                      <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">C2</div>
                      <h4 className="font-medium text-lg mb-2">Challenge Selection</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Find challenges that match your skills</p>
                      <div className="flex justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>Easy</span>
                        <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-orange-500 mr-1"></span>Medium</span>
                        <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>Hard</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="static-dark-bg bg-blue-600 dark:bg-blue-700 w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-lg my-10 md:my-0 relative z-10 transform hover:scale-110 transition-transform duration-300">
                    <div className="text-center">
                      <div className="text-constant">Match</div>
                      <div className="text-constant">Engine</div>
                    </div>
                    <div className="absolute w-full h-full rounded-full border-4 border-blue-400 dark:border-blue-500 animate-ping opacity-70"></div>
                  </div>
                  
                  {/* Company Flow Nodes */}
                  <div className="flex-1 md:max-w-xs">
                    <div className="bg-white dark:bg-blue-900 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-blue-100 dark:border-blue-800 relative mb-20 group">
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">E1</div>
                      <h4 className="font-medium text-lg mb-2">Employer Registration</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Create company profile & define needs</p>
                      <ul className="text-xs mt-3 space-y-1 text-gray-500 dark:text-gray-400">
                        <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>Company Details</li>
                        <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>Skill Requirements</li>
                        <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>Work Culture</li>
                      </ul>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 h-12 bg-indigo-300 dark:bg-indigo-700 group-hover:bg-indigo-500 transition-colors duration-300"></div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-12 w-3 h-3 bg-indigo-400 dark:bg-indigo-600 rounded-full group-hover:bg-indigo-500 transition-colors duration-300"></div>
                    </div>
                    
                    <div className="bg-white dark:bg-blue-900 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-blue-100 dark:border-blue-800 relative group">
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">E2</div>
                      <h4 className="font-medium text-lg mb-2">Work Sample Creation</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Design real-world challenges for candidates</p>
                      <div className="mt-3 text-xs">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-1">
                          <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '70%' }}></div>
                        </div>
                        <div className="flex justify-between text-gray-500 dark:text-gray-400">
                          <span>Design</span>
                          <span>Review</span>
                          <span>Publish</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Results Path - Bottom */}
                <div className="flex flex-col md:flex-row justify-between gap-4 mt-10">
                  <div className="bg-white dark:bg-blue-900 p-4 rounded-lg shadow-md flex-1 border border-blue-100 dark:border-blue-800 hover:shadow-lg transition-shadow duration-300">
                    <h4 className="font-medium text-base mb-1 flex items-center">
                      <span className="w-4 h-4 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                      Challenge Completion
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Candidates solve real company problems</p>
                    <div className="mt-2 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                      <span>Code</span>
                      <span className="h-0.5 flex-grow mx-2 bg-gray-200 dark:bg-gray-700"></span>
                      <span>Test</span>
                      <span className="h-0.5 flex-grow mx-2 bg-gray-200 dark:bg-gray-700"></span>
                      <span>Submit</span>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-blue-900 p-4 rounded-lg shadow-md flex-1 border border-blue-100 dark:border-blue-800 hover:shadow-lg transition-shadow duration-300">
                    <h4 className="font-medium text-base mb-1 flex items-center">
                      <span className="w-4 h-4 bg-blue-500 rounded-full mr-2 flex-shrink-0"></span>
                      AI Assessment
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Automated scoring of challenge solutions</p>
                    <div className="mt-2 grid grid-cols-5 gap-1">
                      {[1, 2, 3, 4, 5].map(num => (
                        <div key={num} className={`h-1 rounded-full ${num <= 4 ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-blue-900 p-4 rounded-lg shadow-md flex-1 border border-blue-100 dark:border-blue-800 hover:shadow-lg transition-shadow duration-300">
                    <h4 className="font-medium text-base mb-1 flex items-center">
                      <span className="w-4 h-4 bg-purple-500 rounded-full mr-2 flex-shrink-0"></span>
                      Match Results
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Candidates matched with ideal companies</p>
                    <div className="mt-2 text-xs text-center">
                      <span className="inline-block px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">87% Match Rate</span>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-blue-900 p-4 rounded-lg shadow-md flex-1 border border-blue-100 dark:border-blue-800 hover:shadow-lg transition-shadow duration-300">
                    <h4 className="font-medium text-base mb-1 flex items-center">
                      <span className="w-4 h-4 bg-indigo-500 rounded-full mr-2 flex-shrink-0"></span>
                      Hiring Process
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Streamlined interviews & offers based on data</p>
                    <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <span className="px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 mr-1">2x</span>
                      <span>Faster than traditional hiring</span>
                    </div>
                  </div>
                </div>
                
                {/* Legend */}
                <div className="mt-8 text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-3 justify-center">
                  <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-blue-500 mr-1"></span>Candidate Flow</span>
                  <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-indigo-500 mr-1"></span>Employer Flow</span>
                  <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span>Challenge Process</span>
                  <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-purple-500 mr-1"></span>Matching Algorithm</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className={getAnimationClass(index)}>
              <FeatureCard
                icon={feature.icon}
                iconBgColor={feature.iconBgColor}
                title={feature.title}
                description={feature.description}
                buttonText={feature.buttonText}
                route={feature.route}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic CTA Section Based on Auth State */}
      <section className="mb-10">
        <div className="bg-white dark:bg-blue-950/30 shadow-md rounded-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-6 md:p-8 lg:p-12 flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                {user 
                  ? "Ready to Showcase Your Skills?" 
                  : "Ready to Transform Your Career Journey?"}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {user 
                  ? "Take on challenges that align with your skills and career goals." 
                  : "Join thousands of professionals who have found meaningful work through skill-based matching."}
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                {user ? (
                  <>
                    <Link href="/challenges">
                      <Button className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-md shadow hover:bg-blue-800 transition transform hover:-translate-y-1">
                        Browse Challenges
                      </Button>
                    </Link>
                    <Link href="/insights">
                      <Button variant="outline" className="px-6 py-3 border border-blue-300 text-blue-700 dark:text-blue-400 font-semibold rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/40 transition transform hover:-translate-y-1">
                        View Insights
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Button 
                      className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-md shadow hover:bg-blue-800 transition transform hover:-translate-y-1"
                      onClick={navigateToAuth}
                    >
                      Create Profile
                    </Button>
                    <Link href="/insights">
                      <Button variant="outline" className="px-6 py-3 border border-blue-300 text-blue-700 dark:text-blue-400 font-semibold rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/40 transition transform hover:-translate-y-1">
                        Learn More
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="static-dark-bg md:w-1/2 bg-gradient-to-br from-blue-700 to-blue-900 dark:from-blue-800 dark:to-blue-950 flex items-center justify-center p-8">
              <div className="text-center">
                <i className="fas fa-users-cog text-6xl mb-4 text-constant text-blue-200"></i>
                <h3 className="text-xl font-semibold text-constant text-white">Join Our Community</h3>
                <p className="mt-2 opacity-90 text-constant text-white">Connect with professionals and companies focused on skills</p>
                <div className="mt-6 flex justify-center space-x-2">
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm shadow-sm border border-blue-400/30 hover:bg-opacity-30 transition-all cursor-pointer text-constant text-white">4,500+ Candidates</span>
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm shadow-sm border border-blue-400/30 hover:bg-opacity-30 transition-all cursor-pointer text-constant text-white">850+ Companies</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Improved Testimonials Section with Auto-rotation */}
      <section className="mb-10">
        <div className="flex flex-col items-center text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Success Stories</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl">Here's how TalentMatch has transformed hiring for both candidates and companies.</p>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex transition-transform duration-1000 ease-in-out" 
            style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="w-full flex-shrink-0 px-4">
                <Testimonial
                  name={testimonial.name}
                  role={testimonial.role}
                  quote={testimonial.quote}
                  rating={testimonial.rating}
                  additionalInfo={testimonial.additionalInfo}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  activeTestimonial === index ? 'bg-blue-600 dark:bg-blue-400' : 'bg-blue-200 dark:bg-blue-800'
                }`}
                onClick={() => setActiveTestimonial(index)}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-10">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-xl p-6 shadow-inner border border-blue-200 dark:border-blue-800">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-blue-800 dark:text-blue-200">TalentMatch by the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center p-4 bg-white/50 dark:bg-blue-900/50 rounded-lg border border-blue-100 dark:border-blue-800 hover:shadow-md transition-all transform hover:-translate-y-1">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-300 mb-2">7,500+</div>
              <div className="text-blue-800 dark:text-blue-400">Skill Challenges</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/50 dark:bg-blue-900/50 rounded-lg border border-blue-100 dark:border-blue-800 hover:shadow-md transition-all transform hover:-translate-y-1">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-300 mb-2">82%</div>
              <div className="text-blue-800 dark:text-blue-400">Hiring Success Rate</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/50 dark:bg-blue-900/50 rounded-lg border border-blue-100 dark:border-blue-800 hover:shadow-md transition-all transform hover:-translate-y-1">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-300 mb-2">21 Days</div>
              <div className="text-blue-800 dark:text-blue-400">Average Time-to-Hire</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/50 dark:bg-blue-900/50 rounded-lg border border-blue-100 dark:border-blue-800 hover:shadow-md transition-all transform hover:-translate-y-1">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-300 mb-2">96%</div>
              <div className="text-blue-800 dark:text-blue-400">Employer Satisfaction</div>
            </div>
          </div>
          <div className="text-center mt-6">
            <Link href="/insights">
              <Button variant="outline" className="border-blue-300 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition">
                View Detailed Insights <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
