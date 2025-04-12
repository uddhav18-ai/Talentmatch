import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';
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
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactPage: React.FC = () => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Initialize form
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  // Handle form submission
  const onSubmit = (data: ContactFormValues) => {
    // In a real app, this would send the data to a server
    console.log('Form submitted:', data);
    
    // Show success toast
    toast({
      title: "Message sent",
      description: "We've received your message and will get back to you soon.",
    });

    // Show the success state
    setIsSubmitted(true);
  };

  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6 text-blue-500" />,
      title: 'Email',
      description: 'Our friendly team is here to help.',
      contact: 'contact@talentmatch.com',
    },
    {
      icon: <Phone className="h-6 w-6 text-green-500" />,
      title: 'Phone',
      description: 'Monday-Friday from 8am to 5pm.',
      contact: '+1 (555) 000-0000',
    },
    {
      icon: <MapPin className="h-6 w-6 text-red-500" />,
      title: 'Office',
      description: 'Come say hello at our office.',
      contact: '123 Innovation Way, San Francisco, CA',
    },
  ];

  return (
    <div className="container px-4 py-8 mx-auto animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600">
            Questions, feedback, or partnership inquiries? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {contactMethods.map((method, index) => (
            <Card key={index} className="hover:shadow-md transition-all duration-200">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-gray-100 p-3 mb-4">
                  {method.icon}
                </div>
                <h3 className="text-lg font-semibold mb-1">{method.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{method.description}</p>
                <p className="font-medium">{method.contact}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex flex-col justify-center">
              <h2 className="text-2xl font-bold mb-6">We'd love to hear from you</h2>
              <p className="mb-6 opacity-90">
                Whether you're curious about features, a trial, or even press—we're ready to answer any and all questions.
              </p>

              <div className="space-y-4 mt-4">
                <div className="flex items-center">
                  <Check className="mr-2 h-5 w-5 text-white opacity-90" />
                  <span>Get information about our platform</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-2 h-5 w-5 text-white opacity-90" />
                  <span>Request a demo for your company</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-2 h-5 w-5 text-white opacity-90" />
                  <span>Partner with us for custom challenges</span>
                </div>
              </div>
            </div>

            <div className="p-8">
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="rounded-full bg-green-100 p-3 mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                  <p className="text-gray-600 mb-4">
                    Your message has been received. We'll get back to you shortly.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsSubmitted(false);
                      form.reset();
                    }}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4">Send us a message</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="How can we help you?" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Your message" 
                              className="resize-none min-h-[120px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? (
                        <span className="flex items-center">
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          Send Message <Send className="ml-2 h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">How does the skills verification process work?</h3>
              <p className="text-gray-600">
                Candidates complete real-world challenges that assess specific skills. These are evaluated based on clear criteria, creating an objective measure of ability.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">What types of companies use TalentMatch?</h3>
              <p className="text-gray-600">
                We work with companies of all sizes—from startups to Fortune 500s—who are committed to skills-based hiring and reducing bias in their recruitment.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Is TalentMatch free for candidates?</h3>
              <p className="text-gray-600">
                Yes, TalentMatch is completely free for candidates. You can create a profile, complete challenges, and get matched with opportunities at no cost.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">How do I get started as a company?</h3>
              <p className="text-gray-600">
                Create a company profile, select the skills you're looking for, and browse candidates who've already completed relevant challenges—or create custom challenges.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;