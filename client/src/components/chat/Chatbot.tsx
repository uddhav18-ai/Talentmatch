import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  ChevronDown, 
  Loader2, 
  User, 
  Bot 
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

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

  const generateResponse = (userMessage: string): string => {
    // Check if the message matches a FAQ
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
                <MessageSquare className="mr-2 h-5 w-5" />
                TalentMatch Assistant
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsOpen(false)}>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-80 px-4 py-2">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`rounded-full h-8 w-8 flex items-center justify-center mr-2 ${message.sender === 'user' ? 'ml-2 mr-0 bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        {message.sender === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                      </div>
                      <div
                        className={`rounded-lg px-3 py-2 ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
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
                        <Bot className="h-5 w-5" />
                      </div>
                      <div className="rounded-lg px-4 py-2 bg-muted">
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
          </CardContent>
          <CardFooter className="p-3 pt-2">
            <div className="flex w-full items-center space-x-2">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1"
              />
              <Button
                size="sm"
                className="px-3"
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
}