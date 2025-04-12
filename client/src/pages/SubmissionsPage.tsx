import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileText,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'wouter';
import { Submission } from '@shared/schema';

const SubmissionsPage: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Fetch user submissions
  const { data: submissions, isLoading } = useQuery({
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

  // Filter submissions based on search and status
  const filteredSubmissions = submissions?.filter((submission: Submission) => {
    // Filter by search term
    const matchesSearch = searchTerm === '' || 
      submission.challengeTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const matchesStatus = statusFilter === null || submission.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sort submissions by date (newest first)
  const sortedSubmissions = filteredSubmissions?.sort((a: Submission, b: Submission) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-gray-700 dark:text-gray-300" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-gray-700 dark:text-gray-300" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-700 dark:text-gray-300" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'in_progress':
        return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">My Submissions</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View and manage all your challenge submissions
        </p>
      </header>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search submissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={statusFilter === null ? "secondary" : "outline"}
                onClick={() => setStatusFilter(null)}
                className="whitespace-nowrap"
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'completed' ? "secondary" : "outline"}
                onClick={() => setStatusFilter('completed')}
                className="whitespace-nowrap"
              >
                Completed
              </Button>
              <Button
                variant={statusFilter === 'in_progress' ? "secondary" : "outline"}
                onClick={() => setStatusFilter('in_progress')}
                className="whitespace-nowrap"
              >
                In Progress
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-gray-500 rounded-full border-t-transparent"></div>
          </div>
        ) : sortedSubmissions && sortedSubmissions.length > 0 ? (
          sortedSubmissions.map((submission: Submission) => (
            <Card key={submission.id} className="hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-10 w-10 flex items-center justify-center shrink-0">
                    {getStatusIcon(submission.status)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <h3 className="text-xl font-bold">{submission.challengeTitle}</h3>
                      <Badge className={getStatusBadgeClass(submission.status)}>
                        {submission.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="mt-2 flex flex-wrap gap-2 md:gap-6">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500">Submitted:</span>
                        <span className="text-sm ml-1">{formatDate(submission.createdAt)}</span>
                      </div>
                      
                      {submission.language && (
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500">Language:</span>
                          <span className="text-sm ml-1">{submission.language}</span>
                        </div>
                      )}
                      
                      {submission.assessmentData?.score !== undefined && (
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500">Score:</span>
                          <span className="text-sm ml-1">{submission.assessmentData.score}/100</span>
                        </div>
                      )}
                    </div>
                    
                    {submission.assessmentData && (
                      <div className="mt-4 border-t pt-4">
                        <h4 className="text-sm font-medium mb-2">Assessment Feedback</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {submission.assessmentData.strengths && (
                            <div>
                              <h5 className="text-xs font-medium text-gray-500 mb-1">Strengths</h5>
                              <ul className="text-sm list-disc list-inside space-y-1">
                                {submission.assessmentData.strengths.map((strength, index) => (
                                  <li key={index}>{strength}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {submission.assessmentData.areas_for_improvement && (
                            <div>
                              <h5 className="text-xs font-medium text-gray-500 mb-1">Areas for Improvement</h5>
                              <ul className="text-sm list-disc list-inside space-y-1">
                                {submission.assessmentData.areas_for_improvement.map((area, index) => (
                                  <li key={index}>{area}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link href={`/challenge/${submission.challengeId}`}>
                        <Button variant="outline" size="sm">
                          View Challenge <ArrowUpRight className="ml-1 h-3 w-3" />
                        </Button>
                      </Link>
                      
                      {submission.status === 'in_progress' && (
                        <Button size="sm">
                          Continue Working
                        </Button>
                      )}
                      
                      {submission.status === 'completed' && (
                        <Button variant="secondary" size="sm">
                          View Complete Assessment
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mb-4">
                <FileText className="h-12 w-12 mx-auto text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No submissions found</h3>
              {searchTerm || statusFilter ? (
                <p className="text-gray-500 mb-4">
                  No submissions match your current filters. Try adjusting your search or filter criteria.
                </p>
              ) : (
                <p className="text-gray-500 mb-4">
                  You haven't submitted any challenges yet. Start by taking on a challenge!
                </p>
              )}
              <div className="flex justify-center gap-4">
                {(searchTerm || statusFilter) && (
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter(null);
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
                <Link href="/challenges">
                  <Button>
                    Browse Challenges
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SubmissionsPage;