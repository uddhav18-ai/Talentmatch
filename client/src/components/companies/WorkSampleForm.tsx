import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircle, X, Upload, Clock, FileText, MapPin, BriefcaseIcon } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  FormDescription 
} from '@/components/ui/form';
import SkillSelector from '../candidates/SkillSelector';

// Form validation schema
const workSampleSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  description: z.string().min(20, { message: 'Description must be at least 20 characters' }),
  requirements: z.string().min(10, { message: 'Requirements must be at least 10 characters' }),
  location: z.string().min(2, { message: 'Please select a location' }),
  jobType: z.string().min(1, { message: 'Please select a job type' }),
  estimatedTime: z.string().min(1, { message: 'Please provide estimated completion time' }),
  companyName: z.string().min(2, { message: 'Company name must be at least 2 characters' }),
  isRemote: z.boolean().optional(),
});

type WorkSampleFormValues = z.infer<typeof workSampleSchema>;

const locations = [
  'Remote',
  'New York, NY',
  'San Francisco, CA',
  'Chicago, IL',
  'Austin, TX',
  'Seattle, WA',
  'Boston, MA',
  'Los Angeles, CA',
  'Denver, CO',
  'Atlanta, GA',
  'Portland, OR',
  'Other',
];

const jobTypes = [
  'Full-time',
  'Part-time',
  'Contract',
  'Freelance',
  'Internship',
];

const WorkSampleForm: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Initialize form with default values
  const form = useForm<WorkSampleFormValues>({
    resolver: zodResolver(workSampleSchema),
    defaultValues: {
      title: '',
      description: '',
      requirements: '',
      location: '',
      jobType: '',
      estimatedTime: '',
      companyName: '',
      isRemote: false,
    },
  });

  // Handle form submission
  const onSubmit = async (data: WorkSampleFormValues) => {
    if (selectedSkills.length === 0) {
      toast({
        title: 'Skills Required',
        description: 'Please add at least one skill required for this work sample',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      console.log('Work sample form data:', { ...data, skills: selectedSkills });
      
      // Show success message
      toast({
        title: 'Work Sample Created',
        description: 'Your work sample has been successfully posted',
        variant: 'default',
      });
      
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  // Handle skills change
  const handleSkillsChange = (skills: string[]) => {
    setSelectedSkills(skills);
  };

  // Reset form
  const handleReset = () => {
    form.reset();
    setSelectedSkills([]);
    setIsSubmitted(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 animate-fade-in">
      <Card className="interactive-card shadow-md dark:shadow-purple-900/20">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-purple-50">
                Post a Work Sample
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-purple-200">
                Create a real-world task for candidates to demonstrate their skills
              </CardDescription>
            </div>
            <div className="bg-primary/10 p-3 rounded-full dark:bg-purple-800/30">
              <BriefcaseIcon className="h-6 w-6 text-primary dark:text-purple-300" />
            </div>
          </div>
        </CardHeader>
        
        {isSubmitted ? (
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-300" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-purple-50">
                Work Sample Posted Successfully!
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-purple-300">
                Your work sample has been published and is now visible to candidates.
              </p>
              <div className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="mr-3"
                >
                  Create Another
                </Button>
                <Button type="button">
                  View Work Samples
                </Button>
              </div>
            </div>
          </CardContent>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Work Sample Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="E.g., Build a React Component for Data Visualization" 
                          {...field} 
                          className="dark:bg-purple-900/40 dark:border-purple-800"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the work sample in detail..." 
                          {...field} 
                          className="min-h-[120px] dark:bg-purple-900/40 dark:border-purple-800" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Requirements</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List specific requirements or deliverables..." 
                          {...field} 
                          className="min-h-[80px] dark:bg-purple-900/40 dark:border-purple-800"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-purple-200 mb-2">
                    Required Skills
                  </label>
                  <SkillSelector 
                    selectedSkills={selectedSkills} 
                    onSkillsChange={handleSkillsChange} 
                  />
                  {selectedSkills.length === 0 && (
                    <p className="text-sm text-red-500 mt-1">
                      Please add at least one skill
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Company Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your company name" 
                            {...field} 
                            className="dark:bg-purple-900/40 dark:border-purple-800"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="estimatedTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Estimated Time</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-purple-400" />
                            <Input 
                              placeholder="E.g., 2-3 hours, 1-2 days" 
                              {...field} 
                              className="pl-10 dark:bg-purple-900/40 dark:border-purple-800"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="jobType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Job Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="dark:bg-purple-900/40 dark:border-purple-800">
                              <SelectValue placeholder="Select job type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {jobTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Location</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <div className="relative">
                              <SelectTrigger className="dark:bg-purple-900/40 dark:border-purple-800">
                                <MapPin className="h-4 w-4 absolute left-3 text-gray-400 dark:text-purple-400" />
                                <SelectValue className="pl-7" placeholder="Select location" />
                              </SelectTrigger>
                            </div>
                          </FormControl>
                          <SelectContent>
                            {locations.map((location) => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="isRemote"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 dark:border-purple-800">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Remote Work</FormLabel>
                        <FormDescription className="text-sm text-gray-500 dark:text-purple-300">
                          This work sample can be completed remotely
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
              
              <CardFooter className="flex justify-between border-t pt-6 dark:border-purple-800">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => form.reset()}
                  className="dark:bg-purple-900/40 dark:border-purple-800 dark:text-purple-200"
                >
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="hover:scale-105 transition-transform"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Posting...' : 'Post Work Sample'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default WorkSampleForm;