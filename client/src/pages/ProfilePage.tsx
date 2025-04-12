import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '../hooks/use-auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import SkillSelector from '../components/candidates/SkillSelector';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { ChevronRight, Award, CheckCircle, Code, FileEdit, User, Briefcase, GraduationCap, Settings } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('personal');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(user?.skills || []);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    bio: '',
    location: '',
    website: '',
    githubUrl: '',
    linkedinUrl: '',
  });

  // Load user submissions
  const { data: submissions = [] as any[] } = useQuery({
    queryKey: ['/api/user/submissions'],
    enabled: !!user,
  });

  // Update user skills mutation
  const updateSkillsMutation = useMutation({
    mutationFn: async (skills: string[]) => {
      const response = await apiRequest('PUT', '/api/user/skills', { skills });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Skills updated',
        description: 'Your skills have been updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: 'Failed to update skills. ' + error.message,
        variant: 'destructive',
      });
    },
  });

  // Handle form data changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save profile changes
  const handleSaveProfile = () => {
    // Would need a backend endpoint for this
    toast({
      title: 'Profile updated',
      description: 'Your profile details have been saved.',
    });
    setEditMode(false);
  };

  // Save skills changes
  const handleSaveSkills = () => {
    updateSkillsMutation.mutate(selectedSkills);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-96">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 animate-fade-in">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Profile Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your profile, track your progress, and update your information
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setEditMode(!editMode)}>
            {editMode ? 'Cancel Editing' : 'Edit Profile'}
          </Button>
          {editMode && (
            <Button onClick={handleSaveProfile} variant="default">
              Save Changes
            </Button>
          )}
        </div>
      </div>

      {/* Profile Content with Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-0">
              <div className="p-6 flex flex-col items-center text-center border-b">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 dark:from-purple-600 dark:to-purple-800 mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {user.firstName?.charAt(0) || user.username.charAt(0)}
                </div>
                <h2 className="text-xl font-bold">{user.firstName || user.username}</h2>
                <p className="text-gray-600 dark:text-gray-300">{user.profileType === 'candidate' ? 'Candidate' : 'Employer'}</p>
                <Badge className="mt-2">{user.completedChallenges} Challenges Completed</Badge>
              </div>
              
              <nav className="p-4">
                <ul className="space-y-2">
                  <li>
                    <button 
                      onClick={() => setActiveTab('personal')}
                      className={`w-full text-left p-2 rounded-md flex items-center ${
                        activeTab === 'personal' ? 'bg-blue-50 dark:bg-purple-800/40 text-blue-700 dark:text-purple-200' : ''
                      }`}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Personal Info
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('skills')}
                      className={`w-full text-left p-2 rounded-md flex items-center ${
                        activeTab === 'skills' ? 'bg-blue-50 dark:bg-purple-800/40 text-blue-700 dark:text-purple-200' : ''
                      }`}
                    >
                      <Code className="h-4 w-4 mr-2" />
                      Skills
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('submissions')}
                      className={`w-full text-left p-2 rounded-md flex items-center ${
                        activeTab === 'submissions' ? 'bg-blue-50 dark:bg-purple-800/40 text-blue-700 dark:text-purple-200' : ''
                      }`}
                    >
                      <FileEdit className="h-4 w-4 mr-2" />
                      Submissions
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </button>
                  </li>
                  {user.profileType === 'candidate' && (
                    <li>
                      <button 
                        onClick={() => setActiveTab('education')}
                        className={`w-full text-left p-2 rounded-md flex items-center ${
                          activeTab === 'education' ? 'bg-blue-50 dark:bg-purple-800/40 text-blue-700 dark:text-purple-200' : ''
                        }`}
                      >
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Education
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      </button>
                    </li>
                  )}
                  {user.profileType === 'employer' && (
                    <li>
                      <button 
                        onClick={() => setActiveTab('company')}
                        className={`w-full text-left p-2 rounded-md flex items-center ${
                          activeTab === 'company' ? 'bg-blue-50 dark:bg-purple-800/40 text-blue-700 dark:text-purple-200' : ''
                        }`}
                      >
                        <Briefcase className="h-4 w-4 mr-2" />
                        Company Info
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      </button>
                    </li>
                  )}
                  <li>
                    <button 
                      onClick={() => setActiveTab('settings')}
                      className={`w-full text-left p-2 rounded-md flex items-center ${
                        activeTab === 'settings' ? 'bg-blue-50 dark:bg-purple-800/40 text-blue-700 dark:text-purple-200' : ''
                      }`}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Account Settings
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </button>
                  </li>
                </ul>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card className="shadow-md">
            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <div>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          disabled={!editMode}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          disabled={!editMode}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location" 
                        name="location"
                        placeholder="City, Country"
                        value={formData.location}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Personal Website</Label>
                      <Input 
                        id="website" 
                        name="website"
                        placeholder="https://yourwebsite.com"
                        value={formData.website}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label htmlFor="githubUrl">GitHub URL</Label>
                      <Input 
                        id="githubUrl" 
                        name="githubUrl"
                        placeholder="https://github.com/username"
                        value={formData.githubUrl}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                      <Input 
                        id="linkedinUrl" 
                        name="linkedinUrl"
                        placeholder="https://linkedin.com/in/username"
                        value={formData.linkedinUrl}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </div>
                  </div>
                </CardContent>
                {editMode && (
                  <CardFooter>
                    <Button className="ml-auto" onClick={handleSaveProfile}>
                      Save Changes
                    </Button>
                  </CardFooter>
                )}
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div>
                <CardHeader>
                  <CardTitle>Skills & Expertise</CardTitle>
                  <CardDescription>
                    Manage your technical skills to better match with opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <Label className="mb-2 block">Your skills</Label>
                      <div className="border p-4 rounded-md bg-gray-50 dark:bg-purple-900/20">
                        <SkillSelector
                          selectedSkills={selectedSkills}
                          onSkillsChange={setSelectedSkills}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {selectedSkills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-sm py-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleSaveSkills} 
                    disabled={updateSkillsMutation.isPending}
                    className="ml-auto"
                  >
                    {updateSkillsMutation.isPending ? 'Saving...' : 'Save Skills'}
                  </Button>
                </CardFooter>
              </div>
            )}

            {/* Submissions Tab */}
            {activeTab === 'submissions' && (
              <div>
                <CardHeader>
                  <CardTitle>Challenge Submissions</CardTitle>
                  <CardDescription>
                    View your challenge submissions and assessment results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submissions.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500 dark:text-gray-400">
                        You haven't submitted any challenges yet.
                      </p>
                      <Button className="mt-4" onClick={() => window.location.href = '/challenges'}>
                        Browse Challenges
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {submissions.map((submission: any) => (
                        <Card key={submission.id} className="overflow-hidden bg-gray-50 dark:bg-purple-900/20">
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-semibold">Challenge #{submission.challengeId}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Submitted on {formatDate(submission.createdAt)}
                                </p>
                              </div>
                              <Badge 
                                variant={
                                  submission.status === 'assessed' || submission.status === 'passed' 
                                    ? 'default' 
                                    : submission.status === 'failed' 
                                    ? 'destructive' 
                                    : 'secondary'
                                }
                              >
                                {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                              </Badge>
                            </div>
                            {submission.score !== null && (
                              <div className="mb-2">
                                <p className="text-sm font-medium">
                                  Score: <span className="font-bold">{submission.score}/100</span>
                                </p>
                              </div>
                            )}
                            {submission.feedback && (
                              <div className="mt-2 bg-white dark:bg-purple-900/40 p-3 rounded-md">
                                <p className="text-sm font-medium mb-1">Feedback:</p>
                                <p className="text-sm">{submission.feedback}</p>
                              </div>
                            )}
                            <div className="mt-3">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.location.href = `/challenge/${submission.challengeId}`}
                              >
                                View Challenge
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </div>
            )}

            {/* Education Tab - Only for Candidates */}
            {activeTab === 'education' && user.profileType === 'candidate' && (
              <div>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                  <CardDescription>
                    Add your educational background and certifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-10">
                    <p className="text-gray-500 dark:text-gray-400">
                      This section is under development. You'll be able to add your education details soon.
                    </p>
                  </div>
                </CardContent>
              </div>
            )}

            {/* Company Info Tab - Only for Employers */}
            {activeTab === 'company' && user.profileType === 'employer' && (
              <div>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                  <CardDescription>
                    Manage your company details and job postings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-10">
                    <p className="text-gray-500 dark:text-gray-400">
                      This section is under development. You'll be able to manage your company information soon.
                    </p>
                  </div>
                </CardContent>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences and security settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Password</h3>
                      <Button variant="outline">Change Password</Button>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-medium mb-2">Account Type</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        Current account type: <Badge>{user.profileType ? user.profileType.charAt(0).toUpperCase() + user.profileType.slice(1) : 'Candidate'}</Badge>
                      </p>
                      <Button variant="outline" disabled>Switch Account Type</Button>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-medium mb-2 text-red-600 dark:text-red-400">Danger Zone</h3>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}