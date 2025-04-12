import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  ChevronDown, 
  Loader2, 
  User, 
  Bot,
  Sparkles,
  MoreHorizontal,
  Lightbulb,
  HelpCircle,
  Settings,
  BookOpen 
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tooltip } from '../ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useAuth } from '@/hooks/use-auth';

// FAQ questions and answers
const faqs = [
  {
    id: 1,
    question: "How does AI assessment work?",
    answer: "Our AI assessment system evaluates your code submissions based on multiple criteria including functionality, code quality, performance, and documentation. It provides detailed feedback to help you improve your skills."
  },
  {
    id: 2,
    question: "What skills are most in-demand?",
    answer: "Currently, the most in-demand skills include React, Node.js, Python, SQL, and cloud technologies like AWS. Full-stack development, data analysis, and machine learning are also highly valued."
  },
  {
    id: 3,
    question: "How do I update my skills profile?",
    answer: "To update your skills profile, go to your Account Settings and select the 'Skills' tab. You can add new skills or update your proficiency level for existing skills."
  },
  {
    id: 4,
    question: "Can I retry a challenge?",
    answer: "Yes, you can attempt any challenge multiple times. Each new submission will be assessed independently, allowing you to improve your solution based on previous feedback."
  },
  {
    id: 5,
    question: "How are challenges created?",
    answer: "Challenges are created by industry experts and vetted by our team to ensure they reflect real-world scenarios and test relevant skills. We regularly update our challenge library based on industry trends."
  },
  {
    id: 6,
    question: "Do employers see my failed attempts?",
    answer: "No, employers only see your successful submissions. Your learning process is private, and you control which challenges and skills to showcase on your public profile."
  },
  {
    id: 7,
    question: "What happens after I pass a challenge?",
    answer: "After passing a challenge, the skill is verified on your profile. You can showcase this achievement to potential employers, and it may increase your visibility to recruiters searching for those specific skills."
  },
  {
    id: 8,
    question: "How does blind matching work?",
    answer: "Our blind matching system connects candidates with employers based purely on skills and qualifications, without revealing personal information that could lead to bias. Initial matches are made before personal details are shared."
  }
];

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      content: "Hello! I'm the TalentMatch assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [aiMode, setAiMode] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Suggested questions for quick selection
  const suggestedQuestions = [
    "How does AI assessment work?",
    "What skills are most in-demand?",
    "Can I retry a challenge?",
    "Do employers see my failed attempts?"
  ];

  // Auto-scroll to the bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Increase unread count when receiving new messages while closed
  useEffect(() => {
    if (!isOpen && messages.length > 1 && messages[messages.length - 1].sender === 'bot') {
      setUnreadCount(prev => prev + 1);
    }
  }, [messages, isOpen]);

  // Reset unread count when opening the chat
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = generateResponse(inputValue.trim());
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Toggle AI mode
  const toggleAiMode = () => {
    if (!aiMode) {
      toast({
        title: "AI Mode activated",
        description: "You're now using the enhanced AI assistant for more dynamic responses.",
        variant: "default",
      });
    }
    setAiMode(!aiMode);
  };

  const generateResponse = (userMessage: string): string => {
    // Use advanced AI mode responses if enabled
    if (aiMode) {
      const normalizedMessage = userMessage.toLowerCase();
      
      // Generate more sophisticated AI responses based on context
      if (normalizedMessage.match(/career|job|opportunity|position/i)) {
        return `Based on your skills and portfolio, I've analyzed the current job market and can recommend a few career paths. 
                Your strengths in ${user?.skills?.join(', ') || 'your selected skills'} align well with roles in 
                ${normalizedMessage.includes('data') ? 'data science and analytics' : 'software development and architecture'}. 
                Would you like me to show you specific job openings that match your skill profile?`;
      }
      
      if (normalizedMessage.match(/salary|compensation|pay|worth/i)) {
        return `Based on current market data, professionals with your skill set typically earn between $90,000-$120,000 annually.
                Specialists in ${user?.skills?.[0] || 'your top skill'} can command premium rates. 
                Would you like personalized recommendations on how to improve your earning potential?`;
      }
      
      if (normalizedMessage.match(/learn|improve|study|course|tutorial/i)) {
        const skillToImprove = user?.skills?.find(skill => 
          normalizedMessage.includes(skill.toLowerCase())
        ) || (normalizedMessage.includes('javascript') ? 'JavaScript' : 
              normalizedMessage.includes('python') ? 'Python' : 
              normalizedMessage.includes('data') ? 'Data Science' : 'your selected skills');
        
        return `I've analyzed your profile and identified resources to help you master ${skillToImprove}.
                I recommend starting with interactive projects that build on your existing knowledge.
                Our skill assessment tool can also identify specific areas where you can improve. Would you like me to create a personalized learning path?`;
      }
      
      if (normalizedMessage.match(/portfolio|project|showcase/i)) {
        return `Your portfolio could be strengthened with projects demonstrating ${user?.skills?.join(' and ') || 'your skills in real-world scenarios'}.
                Consider adding a challenge solution with source code that highlights your problem-solving approach.
                Would you like suggestions for portfolio projects that appeal to employers in your target industry?`;
      }
      
      // Default AI response with more personalization
      return `I understand you're asking about ${userMessage.split(' ').slice(0, 3).join(' ')}...
              Based on your profile and previous interactions, I can help with personalized guidance on this topic.
              Could you specify which aspect of ${normalizedMessage.includes('skill') ? 'skill development' : 
                                               normalizedMessage.includes('job') ? 'job searching' : 
                                               'your professional growth'} you're most interested in?`;
    }
    
    // Regular mode responses (non-AI)
    const normalizedMessage = userMessage.toLowerCase();
    
    // Look for matches in FAQs
    const matchedFaq = faqs.find(faq => 
      normalizedMessage.includes(faq.question.toLowerCase()) || 
      normalizedMessage.includes(faq.answer.toLowerCase().substring(0, 15))
    );

    if (matchedFaq) {
      return matchedFaq.answer;
    }

    // Check for greetings
    if (normalizedMessage.match(/hello|hi|hey|greetings/i)) {
      return `Hello${user ? ' ' + user.username : ''}! How can I help you with TalentMatch today?`;
    }

    // Check for thank you
    if (normalizedMessage.match(/thank|thanks/i)) {
      return "You're welcome! Is there anything else I can help you with?";
    }

    // Check for specific topic mentions
    if (normalizedMessage.includes('skill')) {
      return "Skills are the core of TalentMatch. You can update your skills in your profile, and verify them by completing challenges. What specific aspect of skills would you like to know more about?";
    }

    if (normalizedMessage.includes('challenge')) {
      return "Challenges are coding exercises designed to verify your skills. Each challenge has a difficulty level and is associated with specific skills. Would you like to know more about how challenges are assessed?";
    }

    if (normalizedMessage.includes('employ') || normalizedMessage.includes('company') || normalizedMessage.includes('job')) {
      return "Employers on TalentMatch can browse verified skills and blind candidate profiles. Our matching algorithm connects candidates with positions based on skills rather than just keywords. Would you like to know more about how matching works?";
    }

    // Default response with suggestions
    return "I'm not sure I understand. Could you try phrasing your question differently? You can ask about challenges, skills assessment, profiles, or matching with employers.";
  };

  const handleSuggestedQuestion = (question: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: question,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      // Find corresponding FAQ
      const matchedFaq = faqs.find(faq => faq.question === question);
      const answer = matchedFaq ? matchedFaq.answer : "I don't have a specific answer for that question yet.";
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: answer,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      {/* Chat button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          className="rounded-full h-12 w-12 p-0 relative"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <>
              <MessageSquare className="h-6 w-6" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {unreadCount}
                </div>
              )}
            </>
          )}
        </Button>
      </div>

      {/* Chat window */}
      {isOpen && (
        <Card className="fixed bottom-20 right-6 w-80 md:w-96 shadow-xl z-50 border-2">
          <CardHeader className="bg-primary/5 pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-md flex items-center">
                {activeTab === 'chat' ? (
                  <MessageSquare className="mr-2 h-5 w-5" />
                ) : activeTab === 'learn' ? (
                  <BookOpen className="mr-2 h-5 w-5" />
                ) : (
                  <HelpCircle className="mr-2 h-5 w-5" />
                )}
                TalentMatch Assistant
                {aiMode && (
                  <Tooltip content="AI Mode Enabled">
                    <span className="inline-flex ml-2">
                      <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
                    </span>
                  </Tooltip>
                )}
              </CardTitle>
              <div className="flex space-x-1">
                <Tooltip content={aiMode ? "Disable AI Mode" : "Enable AI Mode"}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`h-8 w-8 p-0 ${aiMode ? 'text-yellow-500' : ''}`} 
                    onClick={toggleAiMode}
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </Tooltip>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsOpen(false)}>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
              <TabsList className="grid w-full grid-cols-3 h-9">
                <TabsTrigger value="chat" className="text-xs">
                  <MessageSquare className="h-3 w-3 mr-1" /> Chat
                </TabsTrigger>
                <TabsTrigger value="learn" className="text-xs">
                  <BookOpen className="h-3 w-3 mr-1" /> Learn
                </TabsTrigger>
                <TabsTrigger value="help" className="text-xs">
                  <HelpCircle className="h-3 w-3 mr-1" /> Help
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          
          <CardContent className="p-0">
            <TabsContent value="chat" className="m-0">
              <ScrollArea className="h-80 px-4 py-2">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`rounded-full h-8 w-8 flex items-center justify-center mr-2 ${message.sender === 'user' ? 'ml-2 mr-0 bg-primary text-primary-foreground' : 'bg-muted'}`}>
                          {message.sender === 'user' ? (
                            <User className="h-5 w-5" />
                          ) : (
                            <div className="relative">
                              <Bot className="h-5 w-5" />
                              {aiMode && message.sender === 'bot' && (
                                <Sparkles className="h-3 w-3 text-yellow-500 absolute -top-1 -right-1" />
                              )}
                            </div>
                          )}
                        </div>
                        <div
                          className={`rounded-lg px-3 py-2 ${
                            message.sender === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : aiMode && message.sender === 'bot'
                                ? 'bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-950/60 dark:to-indigo-950/60 text-foreground dark:text-white'
                                : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-line">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-start max-w-[80%]">
                        <div className="rounded-full h-8 w-8 flex items-center justify-center mr-2 bg-muted">
                          <div className="relative">
                            <Bot className="h-5 w-5" />
                            {aiMode && <Sparkles className="h-3 w-3 text-yellow-500 absolute -top-1 -right-1" />}
                          </div>
                        </div>
                        <div className={`rounded-lg px-4 py-2 ${
                          aiMode 
                            ? 'bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-950/60 dark:to-indigo-950/60'
                            : 'bg-muted'
                        }`}>
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Suggested questions - show only at the beginning */}
                {messages.length <= 2 && (
                  <div className="mt-4 mb-2">
                    <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedQuestions.map((question, index) => (
                        <Badge 
                          key={index} 
                          className="cursor-pointer bg-muted hover:bg-muted/80 text-foreground"
                          onClick={() => handleSuggestedQuestion(question)}
                        >
                          {question}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="learn" className="m-0">
              <ScrollArea className="h-80 px-4 py-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Learning Resources</h3>
                  <p className="text-sm text-muted-foreground">
                    Discover resources to improve your skills based on your profile and interests.
                  </p>
                  
                  {/* Learning categories */}
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-3 rounded-lg border bg-card hover:bg-card/80 cursor-pointer transition-colors">
                      <div className="flex items-center mb-2">
                        <div className="bg-primary/10 rounded-full p-1.5 mr-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                        </div>
                        <h4 className="font-medium">Interactive Tutorials</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Hands-on learning experiences to build practical skills
                      </p>
                    </div>
                    
                    <div className="p-3 rounded-lg border bg-card hover:bg-card/80 cursor-pointer transition-colors">
                      <div className="flex items-center mb-2">
                        <div className="bg-primary/10 rounded-full p-1.5 mr-2">
                          <Lightbulb className="h-4 w-4 text-primary" />
                        </div>
                        <h4 className="font-medium">Skill Assessments</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Test your knowledge and identify areas for improvement
                      </p>
                    </div>
                    
                    <div className="p-3 rounded-lg border bg-card hover:bg-card/80 cursor-pointer transition-colors">
                      <div className="flex items-center mb-2">
                        <div className="bg-primary/10 rounded-full p-1.5 mr-2">
                          <MessageSquare className="h-4 w-4 text-primary" />
                        </div>
                        <h4 className="font-medium">Expert Guidance</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Get personalized advice from industry professionals
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="help" className="m-0">
              <ScrollArea className="h-80 px-4 py-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Help & FAQ</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get answers to common questions about TalentMatch features.
                  </p>
                  
                  <div className="space-y-3">
                    {faqs.slice(0, 5).map((faq, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <h4 className="font-medium text-sm mb-1">{faq.question}</h4>
                        <p className="text-xs text-muted-foreground">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </CardContent>
          
          <CardFooter className="p-3 pt-2">
            {activeTab === 'chat' && (
              <div className="flex w-full items-center space-x-2">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder={aiMode ? "Ask me anything..." : "Type your message..."}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  className={`px-3 ${aiMode ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : ''}`}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {activeTab !== 'chat' && (
              <Button 
                className="w-full text-sm" 
                onClick={() => setActiveTab('chat')}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Return to Chat
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </>
  );
}