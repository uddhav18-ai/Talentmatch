import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ChallengeCard from '../components/challenges/ChallengeCard';

const ChallengesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Challenges' },
    { id: 'development', name: 'Development' },
    { id: 'design', name: 'Design' },
    { id: 'data', name: 'Data Analysis' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'product', name: 'Product Management' }
  ];

  const challenges = [
    {
      category: 'Front-End',
      categoryColor: 'blue',
      title: 'Responsive Web Dashboard',
      description: 'Build a responsive dashboard that displays user analytics data with filtering options.',
      skills: ['HTML/CSS', 'JavaScript', 'Responsive Design', 'Data Visualization'],
      timeEstimate: '45-60 min',
      completions: 432,
      accentColor: 'bg-primary'
    },
    {
      category: 'UX Design',
      categoryColor: 'green',
      title: 'Mobile App Onboarding Flow',
      description: 'Design an intuitive onboarding experience for a health tracking mobile application.',
      skills: ['UI Design', 'UX Principles', 'Figma', 'Mobile Design'],
      timeEstimate: '90-120 min',
      completions: 289,
      accentColor: 'bg-secondary'
    },
    {
      category: 'Data Analysis',
      categoryColor: 'indigo',
      title: 'Customer Segmentation Analysis',
      description: 'Analyze customer data to identify key segments and provide actionable recommendations.',
      skills: ['Data Analysis', 'Python', 'SQL', 'Data Visualization'],
      timeEstimate: '60-75 min',
      completions: 176,
      accentColor: 'bg-accent'
    },
    {
      category: 'Marketing',
      categoryColor: 'red',
      title: 'Campaign Strategy & Execution',
      description: 'Develop a comprehensive marketing strategy for a new product launch, including channel selection and budget allocation.',
      skills: ['Marketing Strategy', 'Campaign Planning', 'Budget Management', 'Analytics'],
      timeEstimate: '60-90 min',
      completions: 201,
      accentColor: 'bg-status-error'
    },
    {
      category: 'Product Management',
      categoryColor: 'yellow',
      title: 'Product Roadmap & Prioritization',
      description: 'Develop a product roadmap and prioritize features based on user needs, business goals, and technical constraints.',
      skills: ['Product Strategy', 'Prioritization', 'User Research', 'Roadmapping'],
      timeEstimate: '90-120 min',
      completions: 155,
      accentColor: 'bg-status-warning'
    },
    {
      category: 'Back-End',
      categoryColor: 'blue',
      title: 'API Design & Implementation',
      description: 'Design and implement a RESTful API for a resource management system with authentication and authorization.',
      skills: ['API Design', 'Node.js', 'Database Design', 'Security'],
      timeEstimate: '60-90 min',
      completions: 312,
      accentColor: 'bg-primary'
    }
  ];

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
        {challenges.map((challenge, index) => (
          <ChallengeCard
            key={index}
            category={challenge.category}
            categoryColor={challenge.categoryColor}
            title={challenge.title}
            description={challenge.description}
            skills={challenge.skills}
            timeEstimate={challenge.timeEstimate}
            completions={challenge.completions}
            accentColor={challenge.accentColor}
          />
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
                <Button className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-colors shadow-sm">
                  Start Challenge
                </Button>
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
            <Button className="mt-4 md:mt-0 px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-blue-600 transition-colors shadow-sm">
              Submit a Challenge
            </Button>
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
