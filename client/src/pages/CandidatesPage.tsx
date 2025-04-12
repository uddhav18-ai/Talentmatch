import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SkillPill from '../components/candidates/SkillPill';
import SkillSelector from '../components/candidates/SkillSelector';
import ProgressBar from '../components/ui/progress-bar';
import Testimonial from '../components/home/Testimonial';
import { Link } from 'wouter';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Building, 
  Code, 
  ChevronRight, 
  BarChart, 
  PieChart,
  ClipboardEdit,
  Eye,
  Timer
} from 'lucide-react';

const CandidatesPage: React.FC = () => {
  const [skills, setSkills] = useState<string[]>([
    'JavaScript', 'React', 'UI Design', 'Project Management', 'Data Analysis'
  ]);
  const [showSkillSelector, setShowSkillSelector] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState<number | null>(null);
  const [timer, setTimer] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [animateSections, setAnimateSections] = useState({
    profile: false,
    challenge: false,
    testimonials: false
  });

  const profileRef = useRef<HTMLDivElement>(null);
  const challengeRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  // Animation observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (entry.target === profileRef.current) {
              setAnimateSections(prev => ({ ...prev, profile: true }));
            } else if (entry.target === challengeRef.current) {
              setAnimateSections(prev => ({ ...prev, challenge: true }));
            } else if (entry.target === testimonialsRef.current) {
              setAnimateSections(prev => ({ ...prev, testimonials: true }));
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (profileRef.current) observer.observe(profileRef.current);
    if (challengeRef.current) observer.observe(challengeRef.current);
    if (testimonialsRef.current) observer.observe(testimonialsRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Challenge timer functionality
  useEffect(() => {
    if (isTimerRunning && timer !== null) {
      timerRef.current = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer !== null && prevTimer > 0) {
            return prevTimer - 1;
          } else {
            clearInterval(timerRef.current as NodeJS.Timeout);
            setIsTimerRunning(false);
            return 0;
          }
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning, timer]);

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

  const challenges = [
    {
      id: 1,
      category: 'Front-End Development',
      title: 'Interactive Dashboard Component',
      description: 'Create a responsive dashboard widget that displays data in both chart and table format. The component should allow users to toggle between views and filter the data.',
      skills: ['HTML/CSS', 'JavaScript', 'Data Visualization', 'UI Design'],
      time: '45-60 minutes',
      company: 'DataViz Inc.',
      code: `// Sample Code
function Dashboard() {
  const [view, setView] = useState('chart');
  const [data, setData] = useState([]);
  
  useEffect(() => {
    // Fetch data here
    fetchData().then(setData);
  }, []);
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-controls">
        <button onClick={() => setView('chart')}>Chart View</button>
        <button onClick={() => setView('table')}>Table View</button>
      </div>
      
      {view === 'chart' ? (
        <div className="chart-view">
          {/* Implement chart visualization here */}
        </div>
      ) : (
        <div className="table-view">
          {/* Implement table view here */}
        </div>
      )}
    </div>
  );
}`
    },
    {
      id: 2,
      category: 'Backend Development',
      title: 'RESTful API Implementation',
      description: 'Build a RESTful API with proper error handling and authentication for a simple resource management system.',
      skills: ['Node.js', 'Express', 'REST API Design', 'Authentication'],
      time: '60-90 minutes',
      company: 'ServerLogic Corp',
      code: `// Sample Code
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Get all resources
router.get('/resources', auth, async (req, res) => {
  try {
    // Implement resource retrieval logic
    
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new resource
router.post('/resources', auth, async (req, res) => {
  try {
    // Validate input
    // Create resource
    
    res.status(201).json(newResource);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});`
    }
  ];

  const handleStartChallenge = (challengeId: number) => {
    setActiveChallenge(challengeId);
    // Set timer for 60 minutes (3600 seconds)
    setTimer(3600);
    setIsTimerRunning(true);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSkillChange = (newSkills: string[]) => {
    setSkills(newSkills);
  };

  return (
    <div className="mb-12 animate-fade-in">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <div className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-sm font-medium mb-3 animate-fade-in">
          Skill-Based Hiring Platform
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">For Candidates</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">Showcase your actual skills, not just your resume. Get matched with opportunities that value what you can do.</p>
      </div>

      {/* Profile Creation Process */}
      <Card 
        className={`mb-12 overflow-hidden transition-all duration-300 hover:shadow-md ${animateSections.profile ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        ref={profileRef}
      >
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">Create Your Skill-Based Profile</h2>
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-6 md:space-y-0">
            <div className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-primary hover:shadow-md transition-all duration-300 bg-white dark:bg-gray-800">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900 w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-primary dark:text-blue-400 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-lg mb-2 dark:text-white">Select Your Skills</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Choose from a comprehensive list or add custom skills that represent your capabilities.</p>
              
              {showSkillSelector ? (
                <div className="animate-fade-in">
                  <SkillSelector
                    selectedSkills={skills}
                    onSkillsChange={handleSkillChange}
                  />
                  <Button 
                    variant="outline" 
                    className="mt-4 w-full"
                    onClick={() => setShowSkillSelector(false)}
                  >
                    Done
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 mb-4">
                  {skills.map((skill, index) => (
                    <SkillPill 
                      key={index} 
                      name={skill} 
                      removable
                      onRemove={(skill) => setSkills(skills.filter(s => s !== skill))}
                    />
                  ))}
                  <Button 
                    variant="outline" 
                    className="px-3 py-1 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 rounded-full text-sm border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                    onClick={() => setShowSkillSelector(true)}
                  >
                    + Add More
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-primary hover:shadow-md transition-all duration-300 bg-white dark:bg-gray-800">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900 w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-primary dark:text-blue-400 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-lg mb-2 dark:text-white">Verify Your Skills</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Complete skill-specific challenges to demonstrate and validate your proficiency.</p>
              
              <div className="mb-4 space-y-3">
                {skillProgress.map((skill, index) => (
                  <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                    <ProgressBar
                      label={skill.name}
                      value={skill.value}
                      max={100}
                      status={skill.status}
                      color={
                        skill.status === 'Verified' ? '#10b981' :
                        skill.status === 'In Progress' ? '#3b82f6' : '#6b7280'
                      }
                    />
                  </div>
                ))}
              </div>
              
              <Button 
                className="w-full flex items-center justify-center gap-2 transition-all duration-300 hover:translate-y-[-2px]"
                onClick={() => document.getElementById('challenge-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <ClipboardEdit className="h-4 w-4" /> Take a Challenge
              </Button>
            </div>
            
            <div className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-primary hover:shadow-md transition-all duration-300 bg-white dark:bg-gray-800">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900 w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-primary dark:text-blue-400 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-lg mb-2 dark:text-white">Get Matched</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Our AI algorithm matches your verified skills with opportunities that fit your abilities.</p>
              
              <div className="relative h-40 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center overflow-hidden">
                <div className="absolute w-full h-full flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center z-10">
                    <User className="h-8 w-8 text-primary dark:text-blue-400" />
                  </div>
                  <div className="absolute w-full h-0.5 bg-blue-200 dark:bg-blue-700">
                    <div className="absolute right-1/2 w-2/5 h-0.5 bg-blue-400 dark:bg-blue-500 animate-pulse"></div>
                  </div>
                  <div className="absolute right-8 w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center z-10">
                    <Building className="h-7 w-7 text-secondary dark:text-indigo-400" />
                  </div>
                </div>
                <div className="z-20 text-center">
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-300">AI Matching</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Challenge Demo */}
      <div id="challenge-section">
        <Card 
          className={`mb-12 overflow-hidden transition-all duration-300 hover:shadow-md ${animateSections.challenge ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          ref={challengeRef}
        >
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h2 className="text-2xl font-bold dark:text-white">Try a Sample Challenge</h2>
              <div className="flex space-x-2 mt-4 md:mt-0">
                <Link href="/challenges">
                  <Button variant="link" className="text-primary dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                    View All Challenges
                  </Button>
                </Link>
              </div>
            </div>
            
            {activeChallenge !== null ? (
              <div className="animate-fade-in">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded">
                        {challenges[activeChallenge-1].category}
                      </span>
                      <h3 className="text-xl font-semibold mt-2 dark:text-white">
                        {challenges[activeChallenge-1].title}
                      </h3>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center text-sm font-medium bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 px-3 py-1 rounded-full">
                        <Timer className="h-4 w-4 mr-1" />
                        {timer !== null ? formatTime(timer) : challenges[activeChallenge-1].time}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => {
                          setActiveChallenge(null);
                          setIsTimerRunning(false);
                          if (timerRef.current) clearInterval(timerRef.current);
                        }}
                      >
                        Exit Challenge
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-medium mb-2 dark:text-white">Challenge Description:</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {challenges[activeChallenge-1].description}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-medium mb-2 dark:text-white">Your Solution:</h4>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 font-mono text-sm overflow-auto max-h-80">
                      <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-300">
                        {challenges[activeChallenge-1].code}
                      </pre>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Save Draft</Button>
                    <Button className="bg-green-600 hover:bg-green-700">Submit Solution</Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {challenges.map((challenge, index) => (
                  <div 
                    key={challenge.id} 
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group animate-fade-in"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded">
                          {challenge.category}
                        </span>
                        <h3 className="text-xl font-semibold mt-2 dark:text-white group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">
                          {challenge.title}
                        </h3>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          <span>{challenge.time}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                        {challenge.description}
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2 dark:text-white">Skills Tested:</h4>
                      <div className="flex flex-wrap gap-2">
                        {challenge.skills.map((skill, i) => (
                          <Badge 
                            key={i} 
                            variant="outline"
                            className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 dark:text-gray-400 mr-1">By:</span>
                        <span className="font-medium dark:text-gray-200">{challenge.company}</span>
                      </div>
                      <Button 
                        size="sm"
                        className="relative overflow-hidden group-hover:bg-blue-600 group-hover:text-white transition-colors"
                        onClick={() => handleStartChallenge(challenge.id)}
                      >
                        <span className="relative z-10 flex items-center">
                          Start Challenge <ChevronRight className="h-4 w-4 ml-1" />
                        </span>
                        <span className="absolute bottom-0 left-0 w-0 h-full bg-blue-700 transition-all duration-300 group-hover:w-full -z-0"></span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Testimonials */}
      <Card 
        className={`overflow-hidden transition-all duration-300 hover:shadow-md ${animateSections.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        ref={testimonialsRef}
      >
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">Candidate Success Stories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
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
          
          <div className="mt-8 text-center">
            <Link href="/auth">
              <Button className="px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-blue-600 transition-all duration-300 shadow-sm hover:shadow-md hover:translate-y-[-2px]">
                Create Your Profile
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidatesPage;
