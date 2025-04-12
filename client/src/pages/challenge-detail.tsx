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
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/lib/protected-route";

interface ChallengeParams {
  id: string;
}

export default function ChallengeDetail() {
  const { id } = useParams<ChallengeParams>();
  const { user } = useAuth();
  const [hasStarted, setHasStarted] = useState(false);

  const { data: challenge, isLoading, error } = useQuery({
    queryKey: ["/api/challenges", parseInt(id)],
    queryFn: async () => {
      const response = await fetch(`/api/challenges/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch challenge");
      }
      return response.json();
    },
  });

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "text-green-500 bg-green-50";
      case "intermediate":
        return "text-amber-500 bg-amber-50";
      case "advanced":
        return "text-red-500 bg-red-50";
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !challenge) {
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-6">
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

          {hasStarted && (
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
                  <li>Submit your solution before the deadline</li>
                </ul>
                
                <h3 className="font-semibold">Resources:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <a href="#" className="text-blue-600 hover:underline inline-flex items-center">
                      Download starter files <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline inline-flex items-center">
                      Challenge documentation <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                </ul>
                
                <div className="bg-amber-50 p-4 rounded-md border border-amber-200 mt-4">
                  <h3 className="text-amber-800 font-medium flex items-center">
                    <Clock className="mr-2 h-5 w-5" /> Time Remaining: 
                    <span className="ml-2 font-semibold">3:45:12</span>
                  </h3>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column (Sidebar) */}
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
                  >
                    Start Challenge
                  </Button>
                  
                  <div className="mt-4 text-xs text-gray-500 text-center">
                    Timer will begin once you start
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                  <h3 className="text-lg font-semibold">Challenge in Progress</h3>
                  <p className="text-gray-500 text-sm mt-2 mb-6">
                    You've started this challenge. Good luck!
                  </p>
                  
                  <Button className="w-full mb-3" variant="secondary">
                    Submit Solution
                  </Button>
                  
                  <Button variant="outline" className="w-full text-red-500 hover:text-red-600">
                    Abandon Challenge
                  </Button>
                </div>
              )}
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
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "40%" }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Code Quality</span>
                <span className="text-sm font-medium">30%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "30%" }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Performance</span>
                <span className="text-sm font-medium">20%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "20%" }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Documentation</span>
                <span className="text-sm font-medium">10%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "10%" }}></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}