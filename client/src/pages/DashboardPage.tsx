import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart3,
  User, 
  Award, 
  Code, 
  Clock,
  CheckCircle2, 
  BarChart, 
  Briefcase, 
  BookOpen,
  Calendar,
  PenTool,
  Star,
  Bookmark,
  ArrowUpRight,
  PieChart
} from 'lucide-react';
import { Link } from 'wouter';
import { Submission } from '@shared/schema';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch user submissions
  const { data: submissions, isLoading: isLoadingSubmissions } = useQuery({
    queryKey: ['/api/user/submissions'],
    queryFn: async () => {
      const response = await fetch('/api/user/submissions');
      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }
      return response.json();
    },
    enabled: !!user,
  });

  const renderActivityTimeline = () => {
    if (!submissions || submissions.length === 0) {
      return (
        <div className="text-gray-500 italic p-4 text-center">
          No recent activity to display
        </div>
      );
    }

    // Sort submissions by date
    const sortedSubmissions = [...submissions].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return (
      <div className="space-y-4">
        {sortedSubmissions.slice(0, 5).map((submission) => (
          <div key={submission.id} className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
              <PenTool className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">{submission.challengeTitle}</h4>
                <Badge variant="outline" className={
                  submission.status === 'completed' ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300' : 
                  submission.status === 'in_progress' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 
                  'bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                }>
                  {submission.status.replace('_', ' ')}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 mt-1">Submitted code for review</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-400">
                  {new Date(submission.createdAt).toLocaleDateString()} • {new Date(submission.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
                <Link href={`/challenge/${submission.challengeId}`}>
                  <Button variant="ghost" size="sm" className="text-xs h-7 px-3">
                    View Challenge <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderOverviewStats = () => {
    const completedSubmissions = submissions ? submissions.filter(s => s.status === 'completed').length : 0;
    const inProgressSubmissions = submissions ? submissions.filter(s => s.status === 'in_progress').length : 0;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Challenges</p>
                <h3 className="text-2xl font-bold mt-1">{submissions ? submissions.length : 0}</h3>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full">
                <Code className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
                <h3 className="text-2xl font-bold mt-1">{completedSubmissions}</h3>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</p>
                <h3 className="text-2xl font-bold mt-1">{inProgressSubmissions}</h3>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full">
                <Clock className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderRecommendedChallenges = () => {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Recommended Challenges</CardTitle>
          <CardDescription>Based on your skills and previous submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900/50 transition-colors">
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                <Code className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">RESTful API Development</h4>
                <p className="text-sm text-gray-500 mt-1">Build a complete REST API with authentication</p>
                <div className="flex items-center mt-2 space-x-2">
                  <Badge variant="outline" className="text-xs py-0 h-5">Backend</Badge>
                  <Badge variant="outline" className="text-xs py-0 h-5">API</Badge>
                  <Badge variant="outline" className="text-xs py-0 h-5">Node.js</Badge>
                </div>
              </div>
              <Button variant="outline" size="sm" className="whitespace-nowrap">
                View Challenge
              </Button>
            </div>
            
            <div className="flex items-start space-x-4 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900/50 transition-colors">
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                <BarChart className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Data Visualization Dashboard</h4>
                <p className="text-sm text-gray-500 mt-1">Create an interactive dashboard to visualize complex datasets</p>
                <div className="flex items-center mt-2 space-x-2">
                  <Badge variant="outline" className="text-xs py-0 h-5">Frontend</Badge>
                  <Badge variant="outline" className="text-xs py-0 h-5">Charts</Badge>
                  <Badge variant="outline" className="text-xs py-0 h-5">React</Badge>
                </div>
              </div>
              <Button variant="outline" size="sm" className="whitespace-nowrap">
                View Challenge
              </Button>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <Link href="/challenges">
              <Button variant="ghost">
                View All Challenges <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderUserProfile = () => {
    if (!user) return null;
    
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Profile Overview</CardTitle>
          <CardDescription>Your profile information and skills</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:items-start">
              <div className="bg-gray-200 dark:bg-gray-800 rounded-full h-24 w-24 flex items-center justify-center mb-4">
                <User className="h-12 w-12 text-gray-500 dark:text-gray-400" />
              </div>
              <Link href="/profile">
                <Button variant="outline">
                  Edit Profile
                </Button>
              </Link>
            </div>
            
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h3>
                  <p className="mt-1">{user.firstName} {user.lastName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Username</h3>
                  <p className="mt-1">{user.username}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
                  <p className="mt-1">{user.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Profile Type</h3>
                  <p className="mt-1 capitalize">{user.profileType || "Candidate"}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {user.skills && user.skills.length > 0 ? (
                    user.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">No skills added yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track your progress, manage challenges, and view your performance
        </p>
      </header>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="overview" className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="submissions" className="flex items-center">
            <PenTool className="mr-2 h-4 w-4" /> Submissions
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center">
            <Award className="mr-2 h-4 w-4" /> Skills
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center">
            <PieChart className="mr-2 h-4 w-4" /> Insights
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {renderOverviewStats()}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              {renderRecommendedChallenges()}
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                  <CardDescription>Your latest submissions and achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingSubmissions ? (
                    <div className="flex justify-center p-4">
                      <div className="animate-spin h-6 w-6 border-2 border-gray-500 rounded-full border-t-transparent"></div>
                    </div>
                  ) : (
                    renderActivityTimeline()
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Stats & Achievements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">Completion Rate</span>
                      <span className="text-sm font-medium">75%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-gray-600 dark:bg-gray-300 h-2 rounded-full" style={{ width: "75%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">Average Score</span>
                      <span className="text-sm font-medium">82/100</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-gray-600 dark:bg-gray-300 h-2 rounded-full" style={{ width: "82%" }}></div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-3">Recent Achievements</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full mr-3">
                          <Star className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">First Challenge Completed</p>
                          <p className="text-xs text-gray-500">Completed your first coding challenge</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full mr-3">
                          <Award className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Skill Master</p>
                          <p className="text-xs text-gray-500">Added 5+ skills to your profile</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full mr-3">
                        <Calendar className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Code Competition</p>
                        <p className="text-xs text-gray-500">May 15, 2023 • Virtual</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full mr-3">
                        <Briefcase className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Tech Career Fair</p>
                        <p className="text-xs text-gray-500">June 2, 2023 • Online</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle>All Submissions</CardTitle>
              <CardDescription>
                Track the status of all your challenge submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingSubmissions ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin h-8 w-8 border-2 border-gray-500 rounded-full border-t-transparent"></div>
                </div>
              ) : submissions && submissions.length > 0 ? (
                <div className="space-y-4">
                  {submissions.map((submission: Submission) => (
                    <div 
                      key={submission.id} 
                      className="p-4 border rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium">{submission.challengeTitle}</h3>
                        <div className="flex items-center mt-2 gap-4">
                          <Badge variant="outline" className={
                            submission.status === 'completed' ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300' : 
                            submission.status === 'in_progress' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 
                            'bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                          }>
                            {submission.status.replace('_', ' ')}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            Submitted on {new Date(submission.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {submission.assessmentData && (
                          <div className="mt-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Score:</span>
                              <span className="text-sm">{submission.assessmentData.score}/100</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 md:justify-end">
                        <Link href={`/challenge/${submission.challengeId}`}>
                          <Button variant="outline" size="sm">
                            View Challenge
                          </Button>
                        </Link>
                        {submission.status === 'completed' && (
                          <Button variant="secondary" size="sm">
                            View Feedback
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8">
                  <div className="mb-4">
                    <BookOpen className="h-12 w-12 mx-auto text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No submissions yet</h3>
                  <p className="text-gray-500 mb-4">
                    You haven't submitted any challenges yet. Start by taking on a challenge!
                  </p>
                  <Link href="/challenges">
                    <Button>
                      Browse Challenges
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="skills">
          {renderUserProfile()}
          
          <Card>
            <CardHeader>
              <CardTitle>Skills Assessment</CardTitle>
              <CardDescription>
                Track your progress in different skill areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">JavaScript</span>
                    <span className="text-sm text-gray-500">Advanced</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-gray-600 dark:bg-gray-300 h-2 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">React</span>
                    <span className="text-sm text-gray-500">Intermediate</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-gray-600 dark:bg-gray-300 h-2 rounded-full" style={{ width: "65%" }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Node.js</span>
                    <span className="text-sm text-gray-500">Intermediate</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-gray-600 dark:bg-gray-300 h-2 rounded-full" style={{ width: "70%" }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">TypeScript</span>
                    <span className="text-sm text-gray-500">Beginner</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-gray-600 dark:bg-gray-300 h-2 rounded-full" style={{ width: "40%" }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Python</span>
                    <span className="text-sm text-gray-500">Intermediate</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-gray-600 dark:bg-gray-300 h-2 rounded-full" style={{ width: "60%" }}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Recommended Learning Paths</h3>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                    <h4 className="font-medium">Advanced TypeScript</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Boost your TypeScript skills with advanced concepts and patterns
                    </p>
                    <div className="mt-3">
                      <Badge variant="outline">3 Weeks</Badge>
                      <Badge variant="outline" className="ml-2">5 Challenges</Badge>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                    <h4 className="font-medium">Full-Stack Development</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Complete end-to-end application development using React and Node.js
                    </p>
                    <div className="mt-3">
                      <Badge variant="outline">8 Weeks</Badge>
                      <Badge variant="outline" className="ml-2">12 Challenges</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Challenge Completion</CardTitle>
                <CardDescription>
                  Your challenge completion progress
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="relative w-36 h-36 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    <div 
                      className="absolute inset-[6px] rounded-full bg-white dark:bg-gray-950 flex items-center justify-center"
                    >
                      <div className="text-2xl font-bold">75%</div>
                    </div>
                    <svg className="absolute inset-0 w-full h-full rotate-[270deg]" viewBox="0 0 100 100">
                      <circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="10"
                        strokeDasharray="283" 
                        strokeDashoffset="70"
                        className="text-gray-600 dark:text-gray-300"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 mt-2">6 of 8 challenges completed</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Skill Growth</CardTitle>
                <CardDescription>
                  Your skill growth over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <div className="text-center w-full">
                  <div className="flex justify-between items-end h-32 mt-4 space-x-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 bg-gray-600 dark:bg-gray-300 rounded-t-md" style={{height: '30%'}}></div>
                      <p className="text-xs mt-2">Jan</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-8 bg-gray-600 dark:bg-gray-300 rounded-t-md" style={{height: '45%'}}></div>
                      <p className="text-xs mt-2">Feb</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-8 bg-gray-600 dark:bg-gray-300 rounded-t-md" style={{height: '60%'}}></div>
                      <p className="text-xs mt-2">Mar</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-8 bg-gray-600 dark:bg-gray-300 rounded-t-md" style={{height: '50%'}}></div>
                      <p className="text-xs mt-2">Apr</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-8 bg-gray-600 dark:bg-gray-300 rounded-t-md" style={{height: '75%'}}></div>
                      <p className="text-xs mt-2">May</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-8 bg-gray-600 dark:bg-gray-300 rounded-t-md" style={{height: '90%'}}></div>
                      <p className="text-xs mt-2">Jun</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Skills</CardTitle>
                <CardDescription>
                  Your highest rated skills based on challenges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">JavaScript</span>
                      <span className="text-sm">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-gray-600 dark:bg-gray-300 h-2 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Problem Solving</span>
                      <span className="text-sm">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-gray-600 dark:bg-gray-300 h-2 rounded-full" style={{ width: "78%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Code Quality</span>
                      <span className="text-sm">72%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-gray-600 dark:bg-gray-300 h-2 rounded-full" style={{ width: "72%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">React</span>
                      <span className="text-sm">65%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-gray-600 dark:bg-gray-300 h-2 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Industry Match</CardTitle>
                <CardDescription>
                  Industries your skills align with
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <div className="text-center w-full">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border p-4 bg-gray-50 dark:bg-gray-900">
                      <h4 className="font-medium">Web Development</h4>
                      <div className="mt-2">
                        <span className="text-xl font-bold">92%</span>
                        <span className="text-xs text-gray-500 ml-1">match</span>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border p-4 bg-gray-50 dark:bg-gray-900">
                      <h4 className="font-medium">Software Engineering</h4>
                      <div className="mt-2">
                        <span className="text-xl font-bold">87%</span>
                        <span className="text-xs text-gray-500 ml-1">match</span>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border p-4 bg-gray-50 dark:bg-gray-900">
                      <h4 className="font-medium">Data Analysis</h4>
                      <div className="mt-2">
                        <span className="text-xl font-bold">65%</span>
                        <span className="text-xs text-gray-500 ml-1">match</span>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border p-4 bg-gray-50 dark:bg-gray-900">
                      <h4 className="font-medium">DevOps</h4>
                      <div className="mt-2">
                        <span className="text-xl font-bold">58%</span>
                        <span className="text-xs text-gray-500 ml-1">match</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;