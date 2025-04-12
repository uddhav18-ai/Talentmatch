import React from 'react';
import { Button } from '@/components/ui/button';
import FeatureCard from '../components/home/FeatureCard';
import Testimonial from '../components/home/Testimonial';
import { Link } from 'wouter';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: 'fas fa-tasks text-primary',
      iconBgColor: 'bg-blue-100',
      title: 'Skills-Based Challenges',
      description: 'Complete real-world tasks that showcase your abilities instead of submitting another resume.',
      buttonText: 'Try a challenge'
    },
    {
      icon: 'fas fa-robot text-secondary',
      iconBgColor: 'bg-green-100',
      title: 'AI-Powered Matching',
      description: 'Our intelligent system matches you with roles based on your demonstrated abilities, not just keywords.',
      buttonText: 'How it works'
    },
    {
      icon: 'fas fa-eye-slash text-accent',
      iconBgColor: 'bg-indigo-100',
      title: 'Blind Matching Process',
      description: 'Eliminates unconscious bias by focusing on skills first, revealing personal details only when necessary.',
      buttonText: 'Learn more'
    },
    {
      icon: 'fas fa-briefcase text-yellow-500',
      iconBgColor: 'bg-yellow-100',
      title: 'Real Work Samples',
      description: 'Companies provide actual work examples rather than generic requirements so you know what to expect.',
      buttonText: 'View examples'
    },
    {
      icon: 'fas fa-chart-bar text-status-error',
      iconBgColor: 'bg-red-100',
      title: 'Transparent Metrics',
      description: 'Access real salary data and company culture scores to make informed decisions about your career.',
      buttonText: 'Explore data'
    },
    {
      icon: 'fas fa-sync text-purple-500',
      iconBgColor: 'bg-purple-100',
      title: 'Feedback Loop',
      description: 'Post-hire feedback improves our matching algorithm and helps you grow professionally.',
      buttonText: 'How feedback works'
    }
  ];
  
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer at TechCorp',
      quote: 'I was overlooked for years because I didn\'t have a CS degree, despite my coding skills. Through TalentMatch\'s challenges, I proved my abilities and landed my dream job in two weeks.',
      rating: 5
    },
    {
      name: 'Marcus Chen',
      role: 'HR Director at InnovateCo',
      quote: 'We\'ve reduced our hiring time by 60% and improved retention by focusing on skills rather than resumes. The quality of candidates we\'re getting through TalentMatch is outstanding.',
      rating: 5
    }
  ];

  return (
    <div className="mb-12 animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-white rounded-xl shadow-md overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-90"></div>
        <div className="relative px-6 py-12 md:py-20 md:px-12 lg:px-20 text-white max-w-4xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">Reimagining Hiring Through Skills, Not Resumes</h1>
          <p className="text-lg md:text-xl opacity-90 mb-8">Join the platform that matches talented people with opportunities based on what they can do, not who they know or where they've been.</p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/candidates">
              <Button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-md shadow hover:shadow-lg transition transform hover:-translate-y-0.5">
                Find Work
              </Button>
            </Link>
            <Link href="/companies">
              <Button variant="outline" className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-md hover:bg-white hover:bg-opacity-10 transition">
                Hire Talent
              </Button>
            </Link>
          </div>
        </div>
        <div className="hidden lg:block absolute right-0 bottom-0 w-1/3 h-full">
          <div className="h-full w-full bg-gradient-to-l from-indigo-800 to-transparent"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">How We're Different</h2>
          <p className="text-gray-600 max-w-2xl">Traditional hiring is broken. We've built a new approach that focuses on skills and potential, not keywords and credentials.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              iconBgColor={feature.iconBgColor}
              title={feature.title}
              description={feature.description}
              buttonText={feature.buttonText}
            />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mb-16">
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Transform Your Career Journey?</h2>
              <p className="text-gray-600 mb-8">Join thousands of professionals who have found meaningful work through skill-based matching.</p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Button className="px-6 py-3 bg-primary text-white font-semibold rounded-md shadow hover:bg-blue-600 transition">
                  Create Profile
                </Button>
                <Button variant="outline" className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-8">
              <div className="text-white text-center">
                <i className="fas fa-users-cog text-6xl mb-4"></i>
                <h3 className="text-xl font-semibold">Join Our Community</h3>
                <p className="mt-2 opacity-90">Connect with professionals and companies focused on skills</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="mb-16">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Success Stories</h2>
          <p className="text-gray-600 max-w-2xl">Here's how TalentMatch has transformed hiring for both candidates and companies.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              name={testimonial.name}
              role={testimonial.role}
              quote={testimonial.quote}
              rating={testimonial.rating}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
