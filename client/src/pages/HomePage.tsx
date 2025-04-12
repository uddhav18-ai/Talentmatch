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
  const { data: challenges, isLoading: isLoadingChallenges } = useQuery({
    queryKey: ['/api/challenges'],
    queryFn: async () => {
      const response = await fetch('/api/challenges');
      if (!response.ok) {
        throw new Error('Failed to fetch challenges');
      }
      return response.json();
    }
  });

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
                  className="px-6 py-3 bg-white text-gray-800 font-semibold rounded-md shadow hover:shadow-lg transition transform hover:-translate-y-0.5"
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
                  <Button className="px-6 py-3 bg-white text-gray-800 font-semibold rounded-md shadow hover:shadow-lg transition transform hover:-translate-y-0.5">
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
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Challenges</h2>
          <Link href="/challenges">
            <Button variant="outline" className="text-blue-600 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-900">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="text-center mb-8">
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Our challenges are designed by industry experts to assess real-world skills. 
            Complete them to showcase your abilities and get matched with relevant opportunities.
          </p>
        </div>

        {isLoadingChallenges ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-700 dark:text-gray-300" />
          </div>
        ) : challenges?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {challenges.slice(0, 3).map((challenge: Challenge, index: number) => {
              // Determine border color based on category
              const getBorderColor = (category: string) => {
                if (category.toLowerCase().includes('web')) return 'border-blue-500';
                if (category.toLowerCase().includes('data')) return 'border-emerald-500';
                if (category.toLowerCase().includes('mobile')) return 'border-purple-500';
                if (category.toLowerCase().includes('backend')) return 'border-amber-500';
                if (category.toLowerCase().includes('database')) return 'border-indigo-500';
                if (category.toLowerCase().includes('ai')) return 'border-rose-500';
                if (category.toLowerCase().includes('cloud')) return 'border-cyan-500';
                if (category.toLowerCase().includes('security')) return 'border-red-500';
                return 'border-blue-500';
              };
              
              // Generate a difficulty UI element
              const getDifficultyElement = (difficulty: string) => {
                const getColor = (diff: string) => {
                  if (diff.toLowerCase() === 'easy') return 'text-green-500';
                  if (diff.toLowerCase() === 'medium') return 'text-yellow-500';
                  if (diff.toLowerCase() === 'hard') return 'text-orange-500';
                  if (diff.toLowerCase() === 'expert') return 'text-red-500';
                  return 'text-blue-500';
                };
                
                return (
                  <div className="flex items-center">
                    <span className={`font-medium ${getColor(difficulty)}`}>{difficulty}</span>
                    <div className="flex ml-2">
                      {['Easy', 'Medium', 'Hard', 'Expert'].map((level, i) => {
                        const isActive = difficulty.toLowerCase() === level.toLowerCase();
                        const getActiveColor = (level: string) => {
                          if (level.toLowerCase() === 'easy') return 'bg-green-500';
                          if (level.toLowerCase() === 'medium') return 'bg-yellow-500';
                          if (level.toLowerCase() === 'hard') return 'bg-orange-500';
                          if (level.toLowerCase() === 'expert') return 'bg-red-500';
                          return 'bg-blue-500';
                        };
                        return (
                          <div 
                            key={i} 
                            className={`h-1.5 w-4 rounded-sm mx-0.5 ${isActive ? getActiveColor(level) : 'bg-gray-200 dark:bg-gray-700'}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              };
              
              return (
                <Link key={challenge.id} href={`/challenge/${challenge.id}`}>
                  <Card 
                    className={`group hover:shadow-lg transition-all border-l-4 ${getBorderColor(challenge.category)} 
                    cursor-pointer h-full transform hover:-translate-y-1 ${getAnimationClass(index)}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <Badge className={`${getCategoryColor(challenge.category)}`}>
                          {challenge.category}
                        </Badge>
                        {getDifficultyElement(challenge.difficulty || 'Medium')}
                      </div>
                      <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{challenge.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{challenge.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">{challenge.timeEstimate}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">{challenge.completions} completions</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          <div className="flex gap-1.5">
                            {['React', 'TypeScript', 'Node.js'].map((skill, i) => (
                              <span key={i} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                                {skill}
                              </span>
                            ))}
                          </div>
                          <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">No challenges available right now. Check back soon!</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Features Section with Staggered Animation */}
      <section className="mb-16">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">How We're Different</h2>
          <p className="text-gray-600 max-w-2xl mb-4">Traditional hiring is broken. We've built a new approach that focuses on skills and potential, not keywords and credentials.</p>
          <div className="max-w-3xl mx-auto bg-blue-50 dark:bg-blue-900 p-6 rounded-lg border-l-4 border-blue-500 mb-8">
            <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-2">Our Unique Approach</h3>
            <p className="text-gray-700 dark:text-gray-300">
              We've reimagined the hiring process from the ground up. Our platform uses blind skill assessments to eliminate bias,
              AI-powered matching to connect talent with opportunities, and real-world challenges to showcase what truly matters - your abilities.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white dark:bg-blue-800 p-4 rounded shadow-sm">
                <p className="text-blue-600 dark:text-blue-200 font-medium">75% faster hiring</p>
              </div>
              <div className="bg-white dark:bg-blue-800 p-4 rounded shadow-sm">
                <p className="text-blue-600 dark:text-blue-200 font-medium">90% retention rate</p>
              </div>
              <div className="bg-white dark:bg-blue-800 p-4 rounded shadow-sm">
                <p className="text-blue-600 dark:text-blue-200 font-medium">100% skill-focused</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      <section className="mb-16">
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {user 
                  ? "Ready to Showcase Your Skills?" 
                  : "Ready to Transform Your Career Journey?"}
              </h2>
              <p className="text-gray-600 mb-8">
                {user 
                  ? "Take on challenges that align with your skills and career goals." 
                  : "Join thousands of professionals who have found meaningful work through skill-based matching."}
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                {user ? (
                  <>
                    <Link href="/challenges">
                      <Button className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-md shadow hover:bg-gray-700 transition">
                        Browse Challenges
                      </Button>
                    </Link>
                    <Link href="/insights">
                      <Button variant="outline" className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition">
                        View Insights
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Button 
                      className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-md shadow hover:bg-gray-700 transition"
                      onClick={navigateToAuth}
                    >
                      Create Profile
                    </Button>
                    <Link href="/insights">
                      <Button variant="outline" className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition">
                        Learn More
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="md:w-1/2 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center p-8">
              <div className="text-white text-center">
                <i className="fas fa-users-cog text-6xl mb-4"></i>
                <h3 className="text-xl font-semibold">Join Our Community</h3>
                <p className="mt-2 opacity-90">Connect with professionals and companies focused on skills</p>
                <div className="mt-6 flex justify-center space-x-2">
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">4,500+ Candidates</span>
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">850+ Companies</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Improved Testimonials Section with Auto-rotation */}
      <section className="mb-16">
        <div className="flex flex-col items-center text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Success Stories</h2>
          <p className="text-gray-600 max-w-2xl">Here's how TalentMatch has transformed hiring for both candidates and companies.</p>
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
                  activeTestimonial === index ? 'bg-gray-700 dark:bg-gray-300' : 'bg-gray-300 dark:bg-gray-700'
                }`}
                onClick={() => setActiveTestimonial(index)}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-16">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8 shadow-inner">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">TalentMatch by the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">7,500+</div>
              <div className="text-gray-600">Skill Challenges</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">82%</div>
              <div className="text-gray-600">Hiring Success Rate</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">21 Days</div>
              <div className="text-gray-600">Average Time-to-Hire</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">96%</div>
              <div className="text-gray-600">Employer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
