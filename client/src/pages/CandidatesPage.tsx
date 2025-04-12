import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SkillPill from '../components/candidates/SkillPill';
import ProgressBar from '../components/ui/progress-bar';
import Testimonial from '../components/home/Testimonial';

const CandidatesPage: React.FC = () => {
  const skills = [
    'JavaScript', 'React', 'UI Design', 'Project Management', 'Data Analysis'
  ];

  const skillProgress = [
    { name: 'JavaScript', value: 100, status: 'Verified' },
    { name: 'React', value: 60, status: 'In Progress' },
    { name: 'UI Design', value: 0, status: 'Not Started' }
  ];

  const testimonials = [
    {
      name: 'Maya Patel',
      role: 'UX Designer at DesignLabs',
      quote: 'As a self-taught designer without formal education, I struggled to get interviews. Through TalentMatch, I completed UX challenges that proved my abilities, and I received 3 job offers in my first month!',
      rating: 5,
      additionalInfo: 'Found job in 28 days'
    },
    {
      name: 'James Wilson',
      role: 'Data Analyst at FinTech Solutions',
      quote: 'After being laid off, I needed a career change. TalentMatch helped me verify my transferable skills and connected me with companies that valued my analytical abilities rather than just my past job titles.',
      rating: 5,
      additionalInfo: 'Career transition success'
    }
  ];

  return (
    <div className="mb-12 animate-fade-in">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">For Candidates</h1>
        <p className="text-xl text-gray-600">Showcase your actual skills, not just your resume. Get matched with opportunities that value what you can do.</p>
      </div>

      {/* Profile Creation Process */}
      <Card className="mb-12">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-6">Create Your Skill-Based Profile</h2>
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-6 md:space-y-0">
            <div className="flex-1 border border-gray-200 rounded-lg p-6 hover:border-primary hover:shadow-md transition-all">
              <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-primary font-bold">1</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Select Your Skills</h3>
              <p className="text-gray-600 mb-4">Choose from a comprehensive list or add custom skills that represent your capabilities.</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map((skill, index) => (
                  <SkillPill key={index} name={skill} />
                ))}
                <Button variant="outline" className="px-3 py-1 bg-white text-gray-500 rounded-full text-sm border border-gray-300 hover:border-gray-400">
                  + Add More
                </Button>
              </div>
            </div>
            
            <div className="flex-1 border border-gray-200 rounded-lg p-6 hover:border-primary hover:shadow-md transition-all">
              <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-primary font-bold">2</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Verify Your Skills</h3>
              <p className="text-gray-600 mb-4">Complete skill-specific challenges to demonstrate and validate your proficiency.</p>
              
              <div className="mb-4 space-y-3">
                {skillProgress.map((skill, index) => (
                  <ProgressBar
                    key={index}
                    label={skill.name}
                    value={skill.value}
                    max={100}
                    status={skill.status}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex-1 border border-gray-200 rounded-lg p-6 hover:border-primary hover:shadow-md transition-all">
              <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-primary font-bold">3</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Get Matched</h3>
              <p className="text-gray-600 mb-4">Our AI algorithm matches your verified skills with opportunities that fit your abilities.</p>
              
              <div className="relative h-40 bg-blue-50 rounded-lg flex items-center justify-center overflow-hidden">
                <div className="absolute w-full h-full flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center z-10">
                    <i className="fas fa-user text-primary text-xl"></i>
                  </div>
                  <div className="absolute w-full h-0.5 bg-blue-200">
                    <div className="absolute right-1/2 w-2/5 h-0.5 bg-blue-400 animate-pulse"></div>
                  </div>
                  <div className="absolute right-8 w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center z-10">
                    <i className="fas fa-building text-secondary text-xl"></i>
                  </div>
                </div>
                <div className="z-20 text-center">
                  <span className="text-sm font-medium text-blue-800">AI Matching</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Challenge Demo */}
      <Card className="mb-12">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-2xl font-bold">Try a Sample Challenge</h2>
            <div className="flex space-x-2 mt-4 md:mt-0">
              <Button variant="link" className="text-primary hover:text-blue-700 font-medium">View All Challenges</Button>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Front-End Development</span>
                <h3 className="text-xl font-semibold mt-2">Interactive Dashboard Component</h3>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-500">Estimated time:</span>
                <p className="font-medium">45-60 minutes</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium mb-2">Challenge Description:</h4>
              <p className="text-gray-600">Create a responsive dashboard widget that displays data in both chart and table format. The component should allow users to toggle between views and filter the data.</p>
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium mb-2">Skills Tested:</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">HTML/CSS</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">JavaScript</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">Data Visualization</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">UI Design</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="mb-4 sm:mb-0">
                <span className="text-sm text-gray-500">This challenge was created by:</span>
                <div className="flex items-center mt-1">
                  <div className="w-8 h-8 rounded-full mr-2 bg-gray-300 flex items-center justify-center">
                    <i className="fas fa-building text-gray-600 text-xs"></i>
                  </div>
                  <span className="font-medium">DataViz Inc.</span>
                </div>
              </div>
              <Button className="w-full sm:w-auto px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-blue-600 transition-colors shadow-sm">
                Start Challenge
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testimonials */}
      <Card>
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-6">Candidate Success Stories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <Testimonial
                key={index}
                name={testimonial.name}
                role={testimonial.role}
                quote={testimonial.quote}
                rating={testimonial.rating}
                additionalInfo={testimonial.additionalInfo}
              />
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Button className="px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-blue-600 transition-colors shadow-sm">
              Create Your Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidatesPage;
