import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import WorkSampleForm from '../components/companies/WorkSampleForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Lock } from 'lucide-react';

const PostWorkSamplePage: React.FC = () => {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  // Check if user is logged in
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <Card className="border border-yellow-200 dark:border-yellow-800">
          <CardHeader className="bg-yellow-50 dark:bg-yellow-900/30">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-500 mr-2" />
              <CardTitle className="text-lg font-semibold text-yellow-800 dark:text-yellow-400">
                Authentication Required
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 pb-4">
            <CardDescription className="text-base text-gray-700 dark:text-gray-300 mb-4">
              You need to be logged in as an employer to post work samples.
            </CardDescription>
            <div className="flex gap-4">
              <Button 
                onClick={() => setLocation('/auth')}
                className="bg-primary hover:bg-primary/90"
              >
                Sign In
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setLocation('/')}
              >
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Check if user has employer profile type
  const isEmployer = user.profileType === 'employer';
  
  if (!isEmployer) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <Card className="border border-red-200 dark:border-red-900/50">
          <CardHeader className="bg-red-50 dark:bg-red-900/30">
            <div className="flex items-center">
              <Lock className="h-6 w-6 text-red-600 dark:text-red-500 mr-2" />
              <CardTitle className="text-lg font-semibold text-red-800 dark:text-red-400">
                Employer Access Only
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 pb-4">
            <CardDescription className="text-base text-gray-700 dark:text-gray-300 mb-4">
              Only users with employer accounts can post work samples. 
              If you're a company representative, please update your profile type to employer.
            </CardDescription>
            <div className="flex gap-4">
              <Button 
                onClick={() => setLocation('/profile')}
                className="bg-primary hover:bg-primary/90"
              >
                Update Profile
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setLocation('/')}
              >
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <WorkSampleForm />;
};

export default PostWorkSamplePage;