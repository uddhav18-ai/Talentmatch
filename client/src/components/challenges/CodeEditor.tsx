import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { python } from '@codemirror/lang-python';
import { sql } from '@codemirror/lang-sql';
import { Loader2, Save, Clock, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';
import { Alert, AlertDescription } from '../ui/alert';

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
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Default time limit for challenges - 2 hours (7200 seconds)
  const MAX_TIME = 7200;
  const [countdownTimer, setCountdownTimer] = useState<{ active: boolean; timeLeft: number; interval?: NodeJS.Timeout }>({
    active: false,
    timeLeft: MAX_TIME,
  });
  
  // For tracking time spent (up counter)
  const [timer, setTimer] = useState<{ active: boolean; time: number; interval?: NodeJS.Timeout }>({
    active: false,
    time: 0,
  });

  // Load saved draft when component mounts
  useEffect(() => {
    if (user) {
      const savedDraft = localStorage.getItem(`draft_challenge_${challengeId}_${user.id}`);
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          setCode(draft.code);
          setLanguage(draft.language);
          setLastSaved(new Date(draft.timestamp));
          
          // If there's time remaining from a previous session, restore it
          if (draft.timeLeft && draft.timeLeft > 0) {
            setCountdownTimer(prev => ({ ...prev, timeLeft: draft.timeLeft }));
          }
          
          toast({
            title: "Draft loaded",
            description: "Your previous work has been restored",
          });
        } catch (e) {
          console.error("Error loading draft:", e);
        }
      }
    }
  }, [challengeId, user]);

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

  // Format time as mm:ss or hh:mm:ss
  const formatTime = (seconds: number, includeHours = false): string => {
    if (includeHours || seconds >= 3600) {
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  };

  // Save draft functionality
  const saveDraft = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save your draft",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const draftData = {
        code,
        language,
        timestamp: new Date().toISOString(),
        timeLeft: countdownTimer.timeLeft,
      };
      
      localStorage.setItem(`draft_challenge_${challengeId}_${user.id}`, JSON.stringify(draftData));
      setLastSaved(new Date());
      
      toast({
        title: "Draft saved",
        description: "Your progress has been saved",
      });
    } catch (e) {
      console.error("Error saving draft:", e);
      toast({
        title: "Error saving draft",
        description: "There was a problem saving your progress",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save every 2 minutes
  useEffect(() => {
    if (user && code !== initialCode) {
      const autoSaveInterval = setInterval(() => {
        saveDraft();
      }, 2 * 60 * 1000);
      
      return () => clearInterval(autoSaveInterval);
    }
  }, [user, code, language, challengeId]);

  // Start/Stop timer and countdown
  const toggleTimer = () => {
    // Toggle both the time tracker and the countdown
    if (timer.active) {
      // Stop timers
      if (timer.interval) clearInterval(timer.interval);
      if (countdownTimer.interval) clearInterval(countdownTimer.interval);
      
      setTimer(prev => ({ ...prev, active: false, interval: undefined }));
      setCountdownTimer(prev => ({ ...prev, active: false, interval: undefined }));
    } else {
      // Start time tracker (counting up)
      const upInterval = setInterval(() => {
        setTimer(prev => ({ ...prev, time: prev.time + 1 }));
      }, 1000);
      
      // Start countdown timer (counting down)
      const downInterval = setInterval(() => {
        setCountdownTimer(prev => {
          const newTimeLeft = Math.max(0, prev.timeLeft - 1);
          
          // When countdown reaches zero
          if (newTimeLeft === 0 && prev.timeLeft > 0) {
            clearInterval(downInterval);
            toast({
              title: "Time's up!",
              description: "Your time limit has been reached. Submit your solution now.",
              variant: "destructive",
            });
            return { ...prev, active: false, timeLeft: 0, interval: undefined };
          }
          
          return { ...prev, timeLeft: newTimeLeft };
        });
      }, 1000);
      
      setTimer(prev => ({ ...prev, active: true, interval: upInterval }));
      setCountdownTimer(prev => ({ ...prev, active: true, interval: downInterval }));
    }
  };

  // Reset timer
  const resetTimer = () => {
    if (timer.interval) clearInterval(timer.interval);
    if (countdownTimer.interval) clearInterval(countdownTimer.interval);
    
    setTimer({ active: false, time: 0 });
    setCountdownTimer({ active: false, timeLeft: MAX_TIME });
    
    toast({
      title: "Timers reset",
      description: "Both timers have been reset to their initial values.",
    });
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

  // Clear draft in localStorage after successful submission
  useEffect(() => {
    if (user && submitMutation.isSuccess) {
      localStorage.removeItem(`draft_challenge_${challengeId}_${user.id}`);
    }
  }, [submitMutation.isSuccess, challengeId, user]);

  return (
    <Card className="w-full max-w-5xl mx-auto mb-6">
      <CardHeader className="flex flex-col space-y-2">
        <div className="flex flex-row items-center justify-between">
          <CardTitle>Code Editor</CardTitle>
          
          {/* Timer Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTimer}
              className="flex items-center gap-1"
              data-testid="timer-toggle"
            >
              {timer.active ? (
                <><Pause className="h-4 w-4" /> Pause</>
              ) : (
                <><Play className="h-4 w-4" /> Start</>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetTimer}
              className="flex items-center gap-1"
              data-testid="timer-reset"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
          </div>
        </div>
        
        {/* Timer Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 dark:bg-gray-900 rounded-md p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Time Elapsed:</span>
            </div>
            <div className="text-xl font-mono font-bold text-blue-600" data-testid="up-timer">
              {formatTime(timer.time)}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Time Remaining:</span>
            </div>
            <div className={`text-xl font-mono font-bold ${countdownTimer.timeLeft < 300 ? 'text-red-600 animate-pulse' : 'text-red-600'}`} data-testid="down-timer">
              {formatTime(countdownTimer.timeLeft, true)}
            </div>
          </div>
        </div>
        
        {/* Last saved info */}
        {lastSaved && (
          <div className="text-xs text-gray-500 text-right">
            Last saved: {lastSaved.toLocaleTimeString()}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-2 items-start md:items-center">
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
          
          {/* Save Draft Button */}
          {!readOnly && user && (
            <Button 
              variant="outline"
              size="sm"
              onClick={saveDraft}
              disabled={isSaving || code === initialCode}
              className="flex items-center gap-1"
            >
              {isSaving ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
              ) : (
                <><Save className="h-4 w-4" /> Save Draft</>
              )}
            </Button>
          )}
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
        
        {/* Auto-save notice */}
        {user && !readOnly && (
          <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
            <Save className="h-3 w-3" /> Your code is automatically saved every 2 minutes
          </div>
        )}
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