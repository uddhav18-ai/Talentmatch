import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Loader2, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Separator } from '../ui/separator';
import { getQueryFn } from '@/lib/queryClient';
import { Button } from '../ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

interface SubmissionResultsProps {
  submissionId: number;
  onRetry?: () => void;
}

export default function SubmissionResults({ submissionId, onRetry }: SubmissionResultsProps) {
  const {
    data: submission,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: [`/api/submissions/${submissionId}`],
    queryFn: getQueryFn({ on401: 'throw' }),
    refetchInterval: (data) => {
      // Refetch every 3 seconds until the submission is assessed or failed
      return data?.status === 'submitted' ? 3000 : false;
    },
  });

  if (isLoading) {
    return (
      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Loading Submission Results...
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="w-full mt-6 border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <AlertCircle className="h-5 w-5 mr-2" />
            Error Loading Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>There was an error loading the submission results.</p>
          {error instanceof Error && <p className="text-sm text-muted-foreground">{error.message}</p>}
          {onRetry && (
            <Button onClick={onRetry} className="mt-4" variant="outline">
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (submission?.status === 'submitted') {
    return (
      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Assessing Your Solution...
          </CardTitle>
          <CardDescription>
            Your code is being evaluated by our AI. This might take a minute.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-6">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-center text-muted-foreground">
            We're using AI to assess your code for correctness, efficiency, and best practices.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (submission?.status === 'failed') {
    return (
      <Card className="w-full mt-6 border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <AlertCircle className="h-5 w-5 mr-2" />
            Assessment Failed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{submission.feedback || 'There was an error assessing your code submission.'}</p>
          {onRetry && (
            <Button onClick={onRetry} className="mt-4">
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // Score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            Assessment Results
          </CardTitle>
          <Badge variant={submission.score >= 70 ? 'success' : 'secondary'}>
            {submission.score >= 70 ? 'PASSED' : 'NEEDS IMPROVEMENT'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Overall Score</span>
            <span className={`font-bold text-xl ${getScoreColor(submission.score)}`}>
              {submission.score}/100
            </span>
          </div>
          <Progress value={submission.score} className="h-2" />
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Feedback</h3>
            <p className="text-muted-foreground">{submission.feedback}</p>
          </div>

          <Separator />

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="strengths">
              <AccordionTrigger className="text-green-500">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Strengths
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc list-inside pl-2 space-y-1">
                  {submission.strengths?.map((strength, index) => (
                    <li key={`strength-${index}`} className="text-muted-foreground">
                      {strength}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="improvements">
              <AccordionTrigger className="text-amber-500">
                <div className="flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  Areas for Improvement
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc list-inside pl-2 space-y-1">
                  {submission.areasForImprovement?.map((area, index) => (
                    <li key={`improvement-${index}`} className="text-muted-foreground">
                      {area}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="suggestions">
              <AccordionTrigger>
                <div className="flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  Suggestions
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc list-inside pl-2 space-y-1">
                  {submission.suggestions?.map((suggestion, index) => (
                    <li key={`suggestion-${index}`} className="text-muted-foreground">
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {onRetry && (
          <div className="mt-6 flex justify-end">
            <Button onClick={onRetry}>Try Again</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}