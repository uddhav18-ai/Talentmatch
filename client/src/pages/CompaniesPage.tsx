import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import WorkSampleForm from '../components/companies/WorkSampleForm';
import Testimonial from '../components/home/Testimonial';

const CompaniesPage: React.FC = () => {
  const benefits = [
    {
      icon: 'fas fa-clock text-blue-600 dark:text-blue-400',
      iconBgColor: 'bg-blue-100 dark:bg-blue-900',
      title: 'Reduce Hiring Time',
      description: 'Our customers report a 60% decrease in time-to-hire by focusing on pre-verified skills instead of resume screening.'
    },
    {
      icon: 'fas fa-user-check text-blue-600 dark:text-blue-400',
      iconBgColor: 'bg-blue-50 dark:bg-blue-800',
      title: 'Higher Quality Matches',
      description: 'Candidates are matched based on demonstrated abilities, resulting in better performance and higher retention rates.'
    },
    {
      icon: 'fas fa-palette text-blue-600 dark:text-blue-400',
      iconBgColor: 'bg-blue-100 dark:bg-blue-900',
      title: 'Diverse Talent Pool',
      description: 'Our blind matching process helps eliminate bias and connect you with talented candidates from all backgrounds.'
    }
  ];

  const processSteps = [
    {
      number: 1,
      title: 'Create Real Work Samples',
      description: 'Instead of generic job descriptions, share examples of actual work that the successful candidate will perform.',
      example: '"Design a user onboarding flow for our mobile banking app that simplifies account creation while meeting compliance requirements."'
    },
    {
      number: 2,
      title: 'Specify Skills & Requirements',
      description: 'Define the specific skills needed for success in the role, rather than years of experience or credentials.',
      skills: ['User Research', 'UI Design', 'Figma', 'Mobile Design', 'Financial Services']
    },
    {
      number: 3,
      title: 'Review Matched Candidates',
      description: 'Our AI presents candidates who have demonstrated the required skills through verified challenges.'
    }
  ];

  const testimonials = [
    {
      name: 'Lisa Rodriguez',
      role: 'Head of Talent, GrowthTech',
      quote: 'We\'ve cut our hiring process from 5 weeks to just 12 days using TalentMatch. The quality of candidates is remarkable because we see their actual skills, not just their interview performance.',
      rating: 5,
      additionalInfo: 'Time-to-hire reduced by 68%'
    },
    {
      name: 'David Kim',
      role: 'CTO, Cloudify Solutions',
      quote: 'As a startup, we need people who can hit the ground running. TalentMatch helped us find developers who could contribute immediately, with skills that matched our tech stack perfectly.',
      rating: 5,
      additionalInfo: '90% retention rate after 1 year'
    }
  ];

  return (
    <div className="mb-12 animate-fade-in">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">For Companies</h1>
        <p className="text-xl text-gray-600">Find candidates who can truly do the job, not just talk about it. Reduce hiring time and improve retention.</p>
      </div>

      {/* Benefits Section */}
      <Card className="mb-12">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-8">Why Companies Choose TalentMatch</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="border border-blue-200 dark:border-blue-800 rounded-lg p-6 hover:border-blue-500 hover:shadow-md transition-all bg-gradient-to-br from-white to-blue-50 dark:from-blue-950 dark:to-blue-900">
                <div className={`rounded-full ${benefit.iconBgColor} w-12 h-12 flex items-center justify-center mb-4 shadow-sm`}>
                  <i className={`${benefit.icon} text-xl`}></i>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-blue-700 dark:text-blue-300">{benefit.title}</h3>
                <p className="text-gray-700 dark:text-gray-300">{benefit.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card className="mb-12">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-6">How It Works For Employers</h2>
          
          <div className="flex flex-col space-y-8">
            {processSteps.map((step, index) => (
              <div key={index} className="flex flex-col md:flex-row">
                <div className="md:w-1/4 flex justify-center md:justify-start mb-4 md:mb-0">
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <span className="text-blue-600 dark:text-blue-400 text-2xl font-bold">{step.number}</span>
                  </div>
                </div>
                <div className="md:w-3/4">
                  <h3 className="text-xl font-semibold mb-2 text-blue-700 dark:text-blue-300">{step.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{step.description}</p>
                  
                  {step.example && (
                    <div className="bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <h4 className="font-medium text-sm text-blue-600 dark:text-blue-400 mb-2">Example:</h4>
                      <p className="text-gray-700 dark:text-gray-300">{step.example}</p>
                    </div>
                  )}
                  
                  {step.skills && (
                    <div className="bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex flex-wrap gap-2">
                        {step.skills.map((skill, idx) => (
                          <span key={idx} className="px-3 py-1 bg-white dark:bg-blue-800 text-blue-700 dark:text-blue-200 border border-blue-200 dark:border-blue-700 rounded-full text-sm shadow-sm">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {step.number === 3 && (
                    <div className="bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex flex-col sm:flex-row gap-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-300 dark:bg-blue-700 rounded-full mr-3 flex items-center justify-center text-white font-bold">JD</div>
                        <div>
                          <div className="h-3 w-24 bg-blue-200 dark:bg-blue-700 rounded"></div>
                          <div className="h-2 w-16 bg-blue-100 dark:bg-blue-800 rounded mt-1"></div>
                        </div>
                      </div>
                      <div className="flex-grow flex flex-wrap gap-1">
                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-200 rounded text-xs">98% UI Design</span>
                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-200 rounded text-xs">95% Mobile</span>
                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-200 rounded text-xs">90% Figma</span>
                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-200 rounded text-xs opacity-75">75% Finance</span>
                      </div>
                      <Button variant="link" className="text-blue-600 dark:text-blue-400 text-sm font-medium whitespace-nowrap">View Portfolio</Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Post Work Sample Form */}
      <Card className="mb-12">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-6">Post a Work Sample</h2>
          <WorkSampleForm />
        </CardContent>
      </Card>

      {/* Testimonials */}
      <Card>
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-6">Employer Success Stories</h2>
          
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
              Create Employer Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompaniesPage;
