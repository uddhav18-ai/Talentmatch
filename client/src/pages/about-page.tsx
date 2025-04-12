import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Target, 
  Award, 
  Briefcase, 
  Code, 
  Lightbulb, 
  Timer as TimerIcon, 
  UserCheck,
  BarChart
} from 'lucide-react';

const AboutPage: React.FC = () => {
  // Company team members
  const teamMembers = [
    {
      name: 'Alex Chen',
      role: 'Founder & CEO',
      bio: 'Former tech recruiter who saw the flaws in traditional hiring. Founded TalentMatch to create a fairer system focused on real skills.',
      imagePath: 'A' // We'll use initials instead of images
    },
    {
      name: 'Priya Sharma',
      role: 'CTO',
      bio: 'Data scientist and software architect passionate about using AI and algorithms to eliminate bias in hiring.',
      imagePath: 'P'
    },
    {
      name: 'Marcus Johnson',
      role: 'Head of Product',
      bio: 'UX specialist focused on creating intuitive experiences that help candidates showcase their true abilities.',
      imagePath: 'M'
    },
    {
      name: 'Sarah Kim',
      role: 'VP of Partnerships',
      bio: 'Former HR executive who builds relationships with forward-thinking companies ready to change how they hire.',
      imagePath: 'S'
    }
  ];

  // Company values
  const values = [
    {
      title: 'Skill Over Status',
      description: "We believe what you can do matters more than where you've been or who you know.",
      icon: <Code className="w-10 h-10 text-blue-600" />
    },
    {
      title: 'Transparency',
      description: "We're committed to sharing real salary data and honest company culture insights.",
      icon: <Lightbulb className="w-10 h-10 text-yellow-600" />
    },
    {
      title: 'Bias Elimination',
      description: 'Our blind matching process focuses purely on capability, not background characteristics.',
      icon: <UserCheck className="w-10 h-10 text-green-600" />
    },
    {
      title: 'Continuous Growth',
      description: 'We help candidates and companies improve through ongoing feedback and learning.',
      icon: <BarChart className="w-10 h-10 text-purple-600" />
    }
  ];

  // Company metrics
  const metrics = [
    { label: 'Candidates Placed', value: '4,500+' },
    { label: 'Partner Companies', value: '850+' },
    { label: 'Average Hiring Time', value: '21 days' },
    { label: 'Skills Verified', value: '125+' }
  ];

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Our Mission</h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              We're building a world where your skills—not your background—determine your career opportunities.
            </p>
            <div className="relative h-1 w-20 bg-primary mx-auto"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-4 mb-4">
                <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
              <p className="text-gray-600 dark:text-gray-300">
                A hiring ecosystem where skills and potential take precedence over credentials and connections.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="rounded-full bg-green-100 dark:bg-green-900 p-4 mb-4">
                <Award className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Our Approach</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We've reimagined hiring by developing real-world challenges that accurately assess capabilities.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-4 mb-4">
                <Briefcase className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Our Impact</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We've helped thousands of candidates find roles suited to their true abilities, not just their resumes.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Company Values */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <Badge className="mb-2">Our Values</Badge>
          <h2 className="text-3xl font-bold mb-4">What Drives Us</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            These core principles guide everything we do at TalentMatch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700">
              <div className="mb-4">{value.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Company Metrics */}
      <section className="mb-16 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl py-12 px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">TalentMatch by the Numbers</h2>
          <p className="opacity-80">Our impact on the hiring landscape</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <p className="text-4xl font-bold mb-2">{metric.value}</p>
              <p className="text-sm opacity-80">{metric.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <Badge className="mb-2">Our Team</Badge>
          <h2 className="text-3xl font-bold mb-4">The People Behind TalentMatch</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We're a diverse team passionate about transforming how hiring works.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow"
            >
              <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">{member.imagePath}</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-blue-600 dark:text-blue-400 text-sm mb-3">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-2">Our Story</Badge>
            <h2 className="text-3xl font-bold mb-4">How We Started</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              TalentMatch began when our founder, Alex, a former tech recruiter, became frustrated with how traditional hiring processes overlooked talented individuals who didn't have the "right" background or connections.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              After seeing countless skilled professionals rejected due to resume filtering, Alex decided to create a platform that would prioritize what candidates could actually do rather than what was written on their resumes.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Since our founding in 2021, we've grown rapidly, partnering with forward-thinking companies who share our vision of skills-based hiring and helping thousands of candidates find opportunities that truly match their abilities.
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-lg">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-white dark:bg-gray-800 rounded-full p-2 mr-4 shadow-sm">
                  <TimerIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold">2021</h3>
                  <p className="text-gray-600 dark:text-gray-300">Founded in San Francisco with a mission to transform hiring</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-white dark:bg-gray-800 rounded-full p-2 mr-4 shadow-sm">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold">2022</h3>
                  <p className="text-gray-600 dark:text-gray-300">Expanded team and launched our skills-based challenge platform</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-white dark:bg-gray-800 rounded-full p-2 mr-4 shadow-sm">
                  <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold">2023</h3>
                  <p className="text-gray-600 dark:text-gray-300">Reached 500+ company partnerships and expanded globally</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-white dark:bg-gray-800 rounded-full p-2 mr-4 shadow-sm">
                  <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold">2024</h3>
                  <p className="text-gray-600 dark:text-gray-300">Recognized as one of the most innovative HR tech companies</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;