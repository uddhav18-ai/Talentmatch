import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { python } from '@codemirror/lang-python';
import { sql } from '@codemirror/lang-sql';
import { Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';

const languageOptions = [
  { value: 'javascript', label: 'JavaScript', extension: () => javascript() },
  { value: 'html', label: 'HTML', extension: () => html() },
  { value: 'css', label: 'CSS', extension: () => css() },
  { value: 'python', label: 'Python', extension: () => python() },
  { value: 'sql', label: 'SQL', extension: () => sql() },
];

interface CodeEditorProps {
  challengeId: number;
  initialLanguage?: string;
  initialCode?: string;
  readOnly?: boolean;
  onSubmitSuccess?: (submission: any) => void;
}

export default function CodeEditor({
  challengeId,
  initialLanguage = 'javascript',
  initialCode = '// Write your solution here\n',
  readOnly = false,
  onSubmitSuccess
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState(initialLanguage);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const [timer, setTimer] = useState<{ active: boolean; time: number; interval?: NodeJS.Timeout }>({
    active: false,
    time: 0,
  });

  const languageExtension = languageOptions.find(lang => lang.value === language)?.extension || javascript;

  // Code submission mutation
  const submitMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/submissions', {
        challengeId,
        code,
        status: 'submitted',
      });
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Solution submitted successfully',
        description: 'Your code is being evaluated. Check back shortly for results.',
      });
      if (onSubmitSuccess) {
        onSubmitSuccess(data);
      }
      queryClient.invalidateQueries({ queryKey: ['/api/user/submissions'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Submission failed',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  // Format time as mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start/Stop timer
  const toggleTimer = () => {
    if (timer.active) {
      // Stop timer
      if (timer.interval) {
        clearInterval(timer.interval);
      }
      setTimer(prev => ({ ...prev, active: false, interval: undefined }));
    } else {
      // Start timer
      const interval = setInterval(() => {
        setTimer(prev => ({ ...prev, time: prev.time + 1 }));
      }, 1000);
      setTimer(prev => ({ ...prev, active: true, interval }));
    }
  };

  // Reset timer
  const resetTimer = () => {
    if (timer.interval) {
      clearInterval(timer.interval);
    }
    setTimer({ active: false, time: 0 });
  };

  // Submit code solution
  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to submit your solution',
        variant: 'destructive',
      });
      return;
    }

    if (!code.trim()) {
      toast({
        title: 'Empty submission',
        description: 'Please write some code before submitting',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    submitMutation.mutate();
  };

  // Reset timer when component unmounts
  useEffect(() => {
    return () => {
      if (timer.interval) {
        clearInterval(timer.interval);
      }
    };
  }, [timer.interval]);

  return (
    <Card className="w-full max-w-5xl mx-auto mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Code Editor</CardTitle>
        <div className="flex items-center space-x-4">
          <div className="text-lg font-mono font-bold" data-testid="timer">
            {formatTime(timer.time)}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTimer}
            data-testid="timer-toggle"
          >
            {timer.active ? 'Pause' : 'Start'} Timer
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetTimer}
            data-testid="timer-reset"
          >
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select
            value={language}
            onValueChange={(value) => setLanguage(value)}
            disabled={readOnly}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="border rounded-md overflow-hidden">
          <CodeMirror
            value={code}
            height="400px"
            extensions={[languageExtension()]}
            onChange={(value) => setCode(value)}
            theme="dark"
            readOnly={readOnly || isSubmitting}
            basicSetup={{
              lineNumbers: true,
              highlightActiveLineGutter: true,
              highlightSpecialChars: true,
              foldGutter: true,
              dropCursor: true,
              allowMultipleSelections: true,
              indentOnInput: true,
              syntaxHighlighting: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              rectangularSelection: true,
              crosshairCursor: true,
              highlightActiveLine: true,
              highlightSelectionMatches: true,
              closeBracketsKeymap: true,
              searchKeymap: true,
              lintKeymap: true,
              completionKeymap: true,
              foldKeymap: true,
            }}
          />
        </div>
      </CardContent>
      {!readOnly && (
        <CardFooter className="justify-end space-x-2">
          <Button variant="outline" onClick={() => setCode(initialCode)} disabled={isSubmitting}>
            Reset Code
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !user}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Solution'
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}