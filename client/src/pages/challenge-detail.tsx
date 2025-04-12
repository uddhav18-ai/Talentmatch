import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  Clock, 
  Award, 
  ArrowLeft, 
  Users, 
  Layers, 
  CheckCircle, 
  ExternalLink,
  Loader2,
  Code
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import CodeEditor from "@/components/challenges/CodeEditor";
import SubmissionResults from "@/components/challenges/SubmissionResults";
import { getQueryFn } from "@/lib/queryClient";

interface ChallengeParams {
  id: string;
}

export default function ChallengeDetail() {
  const { id } = useParams<ChallengeParams>();
  const { user } = useAuth();
  const [hasStarted, setHasStarted] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [currentSubmissionId, setCurrentSubmissionId] = useState<number | null>(null);

  // Fetch challenge details
  const { data: challenge, isLoading: isLoadingChallenge, error: challengeError } = useQuery({
    queryKey: [`/api/challenges/${id}`],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });

  // Fetch user submissions for this challenge
  const { data: userSubmissions, isLoading: isLoadingSubmissions } = useQuery({
    queryKey: ['/api/user/submissions'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    enabled: !!user, // Only fetch if user is logged in
  });

  // Find user's submissions for this challenge
  const challengeSubmissions = userSubmissions?.filter(
    (submission: any) => submission.challengeId === parseInt(id)
  ) || [];

  // Latest submission
  const latestSubmission = challengeSubmissions.length > 0 
    ? challengeSubmissions.reduce((latest: any, current: any) => 
        new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
      )
    : null;

  // Set initial active tab when challenge is loaded and user has a submission
  useEffect(() => {
    if (latestSubmission && !hasStarted) {
      setHasStarted(true);
      setActiveTab("submission");
      setCurrentSubmissionId(latestSubmission.id);
    }
  }, [latestSubmission, hasStarted]);

  // Handle successful submission
  const handleSubmissionSuccess = (submission: any) => {
    setCurrentSubmissionId(submission.id);
    setActiveTab("results");
  };

  // Start a new attempt
  const handleNewAttempt = () => {
    setCurrentSubmissionId(null);
    setActiveTab("submission");
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-green-500 bg-green-50";
      case "medium":
        return "text-amber-500 bg-amber-50";
      case "hard":
        return "text-red-500 bg-red-50";
      case "expert":
        return "text-purple-500 bg-purple-50";
      default:
        return "text-blue-500 bg-blue-50";
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "web development":
        return "text-indigo-600 bg-indigo-50";
      case "database":
        return "text-emerald-600 bg-emerald-50";
      case "mobile development":
        return "text-pink-600 bg-pink-50";
      case "backend development":
        return "text-amber-600 bg-amber-50";
      case "data science":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (isLoadingChallenge) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (challengeError || !challenge) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Challenge not found
        </h2>
        <p className="text-gray-600 mb-6">
          The challenge you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/challenges">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Challenges
          </Button>
        </Link>
      </div>
    );
  }

  // Get sample starter code based on difficulty
  const getStarterCode = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "// Easy difficulty starter code\n// Complete the function below\n\nfunction solution(input) {\n  // Your code here\n  \n  return result;\n}\n";
      case "medium":
        return "// Medium difficulty starter code\n// Implement the solution following the requirements\n\nfunction solution(input) {\n  // Your code here\n  // Consider edge cases\n  \n  return result;\n}\n";
      case "hard":
        return "// Hard difficulty starter code\n// Implement an efficient solution\n\nfunction solution(input) {\n  // Your code here\n  // Consider time and space complexity\n  \n  return result;\n}\n";
      case "expert":
        return "// Expert difficulty starter code\n// Implement an optimal solution\n\nfunction solution(input) {\n  // Your code here\n  // Consider optimizations and edge cases\n  \n  return result;\n}\n";
      default:
        return "// Write your solution here\n";
    }
  };

  const starterCode = challenge.sampleSolution ? 
    "// Challenge starter code\n// Replace this with your solution\n\n" + challenge.sampleSolution : 
    getStarterCode(challenge.difficulty);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <Link href="/challenges">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Challenges
          </Button>
        </Link>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <Badge className={`mb-2 font-medium ${getCategoryColor(challenge.category)}`}>
              {challenge.category}
            </Badge>
            <h1 className="text-3xl font-bold text-gray-900">{challenge.title}</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={`font-medium ${getDifficultyColor(challenge.difficulty)}`}>
              <Award className="mr-1 h-4 w-4" />
              {challenge.difficulty}
            </Badge>
            <Badge variant="outline" className="font-medium">
              <Users className="mr-1 h-4 w-4" />
              {challenge.completions} Completions
            </Badge>
            <Badge variant="outline" className="font-medium">
              <Clock className="mr-1 h-4 w-4" />
              {challenge.timeEstimate}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-3 space-y-6">
          {!hasStarted ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-line">{challenge.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Required Skills</CardTitle>
                  <CardDescription>You'll need these skills to complete the challenge</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {challenge.skills.map((skill: string, index: number) => (
                      <Badge key={index} className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Evaluation Criteria</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Functionality</span>
                    <span className="text-sm font-medium">40%</span>
                  </div>
                  <Progress value={40} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Code Quality</span>
                    <span className="text-sm font-medium">30%</span>
                  </div>
                  <Progress value={30} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Performance</span>
                    <span className="text-sm font-medium">20%</span>
                  </div>
                  <Progress value={20} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Documentation</span>
                    <span className="text-sm font-medium">10%</span>
                  </div>
                  <Progress value={10} className="h-2" />
                </CardContent>
              </Card>
            </>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="submission">Code Editor</TabsTrigger>
                <TabsTrigger value="results" disabled={!currentSubmissionId}>Results</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Challenge Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 whitespace-pre-line">{challenge.description}</p>
                    
                    {challenge.expectedFunctionality && (
                      <div className="mt-4">
                        <h3 className="font-semibold mb-2">Expected Functionality:</h3>
                        <p className="text-gray-700">{challenge.expectedFunctionality}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Required Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {challenge.skills.map((skill: string, index: number) => (
                        <Badge key={index} className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Challenge Instructions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <h3 className="font-semibold">Objectives:</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Create a functional implementation that meets all requirements</li>
                      <li>Follow best practices for code organization and style</li>
                      <li>Include comments explaining your approach and decisions</li>
                      <li>Test your solution with different inputs</li>
                    </ul>
                    
                    <div className="mt-4 flex justify-end">
                      <Button onClick={() => setActiveTab("submission")}>
                        <Code className="mr-2 h-4 w-4" />
                        Go to Code Editor
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="submission">
                <CodeEditor 
                  challengeId={parseInt(id)} 
                  initialCode={starterCode}
                  onSubmitSuccess={handleSubmissionSuccess}
                />
              </TabsContent>
              
              <TabsContent value="results">
                {currentSubmissionId && (
                  <SubmissionResults 
                    submissionId={currentSubmissionId} 
                    onRetry={handleNewAttempt}
                  />
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <Card className="border-2 border-primary">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-center">Challenge Status</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {!hasStarted ? (
                <>
                  <div className="text-center mb-6">
                    <Layers className="mx-auto h-16 w-16 text-primary mb-4" />
                    <h3 className="text-lg font-semibold">Ready to begin?</h3>
                    <p className="text-gray-500 text-sm mt-2">
                      Start this challenge to showcase your {challenge.skills.join(", ")} skills
                    </p>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => setHasStarted(true)}
                    disabled={!user}
                  >
                    {user ? "Start Challenge" : "Login to Start"}
                  </Button>
                  
                  {!user && (
                    <p className="mt-4 text-xs text-center text-amber-600">
                      You need to be logged in to attempt challenges
                    </p>
                  )}
                  
                  {user && (
                    <div className="mt-4 text-xs text-gray-500 text-center">
                      Timer will begin once you start
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                  <h3 className="text-lg font-semibold">Challenge in Progress</h3>
                  
                  {latestSubmission && (
                    <div className="mt-4 mb-6">
                      <p className="text-sm font-medium">Latest Submission Status:</p>
                      <Badge className="mt-1" variant={latestSubmission.status === 'assessed' && latestSubmission.score >= 70 ? 'success' : 'secondary'}>
                        {latestSubmission.status === 'submitted' && 'Processing'}
                        {latestSubmission.status === 'assessed' && latestSubmission.score >= 70 && 'Passed'}
                        {latestSubmission.status === 'assessed' && latestSubmission.score < 70 && 'Needs Improvement'}
                        {latestSubmission.status === 'failed' && 'Failed'}
                      </Badge>
                      
                      {latestSubmission.status === 'assessed' && (
                        <p className="mt-2 font-bold text-xl">
                          Score: {latestSubmission.score}/100
                        </p>
                      )}
                    </div>
                  )}
                  
                  <div className="space-y-3 mt-4">
                    <Button 
                      className="w-full" 
                      onClick={() => setActiveTab("submission")}
                    >
                      {currentSubmissionId ? "Try Again" : "Submit Solution"}
                    </Button>
                    
                    {currentSubmissionId && (
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => setActiveTab("results")}
                      >
                        View Results
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {hasStarted && (
            <Card>
              <CardHeader>
                <CardTitle>My Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingSubmissions ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : challengeSubmissions.length > 0 ? (
                  <div className="space-y-3">
                    {challengeSubmissions.slice(0, 5).map((submission: any) => (
                      <div 
                        key={submission.id} 
                        className={`p-3 rounded-md border ${submission.id === currentSubmissionId ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                        onClick={() => {
                          setCurrentSubmissionId(submission.id);
                          setActiveTab("results");
                        }}
                      >
                        <div className="flex justify-between items-center cursor-pointer">
                          <div>
                            <p className="text-sm font-medium">
                              {new Date(submission.createdAt).toLocaleDateString()} 
                              {" at "}
                              {new Date(submission.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                            <Badge className="mt-1" variant={submission.status === 'assessed' && submission.score >= 70 ? 'success' : 'secondary'}>
                              {submission.status === 'submitted' && 'Processing'}
                              {submission.status === 'assessed' && submission.score >= 70 && 'Passed'}
                              {submission.status === 'assessed' && submission.score < 70 && 'Needs Improvement'}
                              {submission.status === 'failed' && 'Failed'}
                            </Badge>
                          </div>
                          {submission.status === 'assessed' && (
                            <span className="font-bold">
                              {submission.score}/100
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                    {challengeSubmissions.length > 5 && (
                      <p className="text-xs text-center text-gray-500 mt-2">
                        Showing 5 of {challengeSubmissions.length} submissions
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    No submissions yet
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}