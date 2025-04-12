import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ChallengeCard from '../components/challenges/ChallengeCard';
import { Challenge } from '@shared/schema';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

const ChallengesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);

  // Fetch challenges from the API
  const { data: challenges, isLoading, error } = useQuery({
    queryKey: ['/api/challenges'],
    queryFn: async () => {
      const response = await fetch('/api/challenges');
      if (!response.ok) {
        throw new Error('Failed to fetch challenges');
      }
      return response.json();
    }
  });

  // Extract unique categories from challenges
  const uniqueCategories = challenges 
    ? ['all', ...new Set(challenges.map((challenge: Challenge) => challenge.category))]
    : ['all'];
  
  const categories = uniqueCategories.map(cat => ({
    id: cat === 'all' ? 'all' : cat.toLowerCase().replace(/\s+/g, '-'),
    name: cat === 'all' ? 'All Challenges' : cat
  }));

  // Filter challenges when activeCategory changes
  useEffect(() => {
    if (!challenges) return;
    
    if (activeCategory === 'all') {
      setFilteredChallenges(challenges);
    } else {
      const categoryName = categories.find(cat => cat.id === activeCategory)?.name;
      setFilteredChallenges(challenges.filter((challenge: Challenge) => 
        challenge.category === categoryName
      ));
    }
  }, [challenges, activeCategory, categories]);

  // Map challenge difficulty to a color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'green';
      case 'intermediate': return 'blue';
      case 'advanced': return 'red';
      default: return 'blue';
    }
  };

  // Map challenge category to a color
  const getCategoryColor = (category: string) => {
    if (category.toLowerCase().includes('web')) return 'blue';
    if (category.toLowerCase().includes('data')) return 'indigo';
    if (category.toLowerCase().includes('mobile')) return 'green';
    if (category.toLowerCase().includes('backend')) return 'red';
    if (category.toLowerCase().includes('database')) return 'yellow';
    return 'purple';
  };

  const creatorBenefits = [
    {
      icon: 'fas fa-users text-primary',
      iconBgColor: 'bg-blue-100',
      title: 'Help Others Grow',
      description: 'Create challenges that help candidates develop and verify skills in your area of expertise.'
    },
    {
      icon: 'fas fa-building text-secondary',
      iconBgColor: 'bg-green-100',
      title: 'Find Top Talent',
      description: 'Sponsor challenges to identify skilled professionals for your organization\'s specific needs.'
    },
    {
      icon: 'fas fa-medal text-accent',
      iconBgColor: 'bg-indigo-100',
      title: 'Build Your Reputation',
      description: 'Gain recognition as a challenge creator and establish yourself as an industry expert.'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Error loading challenges
        </h1>
        <p className="text-gray-600 mb-6">
          We couldn't load the challenges. Please try again later.
        </p>
        <Button onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="mb-12 animate-fade-in">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Skill Challenges</h1>
        <p className="text-xl text-gray-600">Verify your abilities through real-world challenges designed by industry experts.</p>
      </div>

      {/* Challenge Categories */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        {categories.map(category => (
          <Button 
            key={category.id}
            variant={activeCategory === category.id ? 'default' : 'outline'}
            className={
              activeCategory === category.id 
                ? 'px-4 py-2 bg-primary text-white font-medium rounded-md' 
                : 'px-4 py-2 bg-white text-gray-700 font-medium rounded-md hover:bg-gray-50 border border-gray-300'
            }
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Challenge Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredChallenges.map((challenge: Challenge) => (
          <Link key={challenge.id} href={`/challenge/${challenge.id}`}>
            <a className="cursor-pointer">
              <ChallengeCard
                category={challenge.category}
                categoryColor={getCategoryColor(challenge.category)}
                title={challenge.title}
                description={challenge.description}
                skills={challenge.skills}
                timeEstimate={challenge.timeEstimate}
                completions={challenge.completions || 0}
                accentColor={`bg-${getDifficultyColor(challenge.difficulty)}-500`}
              />
            </a>
          </Link>
        ))}
      </div>

      {/* Featured Challenge */}
      <Card className="mb-12">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-center mb-4">
            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">Featured Challenge</span>
            <span className="ml-auto text-sm bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Sponsored by TechCorp</span>
          </div>
          
          <h2 className="text-2xl font-bold mb-4">Full-Stack E-Commerce Challenge</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <p className="text-gray-700 mb-4">
                Build a fully functional e-commerce application with product listing, search, shopping cart, checkout, and order management features. This challenge tests your abilities across the full stack.
              </p>
              
              <div className="mb-6">
                <h4 className="font-medium mb-2">Challenge Requirements:</h4>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>Product catalog with filtering and search</li>
                  <li>User authentication and profile management</li>
                  <li>Shopping cart functionality with persistence</li>
                  <li>Checkout process with order confirmation</li>
                  <li>Responsive design for all device sizes</li>
                  <li>API endpoints for all functionality</li>
                </ul>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">React</span>
                <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">Node.js</span>
                <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">MongoDB</span>
                <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">Responsive Design</span>
                <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">API Design</span>
                <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">User Authentication</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-gray-500 text-sm">Time Estimate:</span>
                  <span className="font-medium ml-1">3-5 hours</span>
                </div>
                <Link href="/challenge/featured">
                  <Button className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-colors shadow-sm">
                    Start Challenge
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold mb-4">Top Performers Get:</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <i className="fas fa-trophy text-yellow-500 mt-1 mr-2"></i>
                  <span>Interview opportunity with TechCorp's engineering team</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-certificate text-blue-500 mt-1 mr-2"></i>
                  <span>Verified skill badge on your profile</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-gift text-green-500 mt-1 mr-2"></i>
                  <span>$500 Amazon gift card for the top solution</span>
                </li>
              </ul>
              
              <div className="mt-6 pt-4 border-t border-purple-100">
                <h4 className="font-semibold mb-2">About the Sponsor:</h4>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
                    <span className="font-bold text-purple-700">T</span>
                  </div>
                  <div>
                    <p className="font-medium">TechCorp</p>
                    <p className="text-sm text-gray-600">Leading e-commerce platform provider</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Challenge Creation */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Create Your Own Challenge</h2>
              <p className="text-gray-600">Share your expertise by creating challenges that test real-world skills in your domain.</p>
            </div>
            <Link href="/auth">
              <Button className="mt-4 md:mt-0 px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-blue-600 transition-colors shadow-sm">
                Submit a Challenge
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {creatorBenefits.map((benefit, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:border-primary hover:shadow-md transition-all">
                <div className={`rounded-full ${benefit.iconBgColor} w-12 h-12 flex items-center justify-center mb-4`}>
                  <i className={`${benefit.icon} text-xl`}></i>
                </div>
                <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChallengesPage;
