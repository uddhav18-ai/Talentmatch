import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { YoutubeIcon, ExternalLink, Bookmark, ThumbsUp } from 'lucide-react';

interface VideoResource {
  id: string;
  title: string;
  channelName: string;
  description: string;
  thumbnail: string;
  url: string;
  tags: string[];
  viewCount: string;
  publishedAt: string;
}

interface VideoResourcesProps {
  skills: string[];
  portfolioType?: 'frontend' | 'backend' | 'fullstack' | 'data' | 'mobile' | null;
}

export default function VideoResources({ skills = [], portfolioType = null }: VideoResourcesProps) {
  const [activeSkill, setActiveSkill] = useState<string>(skills[0] || "React");
  const [activePortfolio, setActivePortfolio] = useState<string>(portfolioType || 'all');
  const [videos, setVideos] = useState<VideoResource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [savedVideos, setSavedVideos] = useState<string[]>([]);

  // Portfolio-specific technologies
  const portfolioTechnologies: Record<string, string[]> = {
    'frontend': ['React', 'JavaScript', 'CSS', 'HTML', 'Web Development'],
    'backend': ['Node.js', 'Python', 'Java', 'API Development', 'Database'],
    'fullstack': ['JavaScript', 'React', 'Node.js', 'Web Development', 'Database'],
    'data': ['Python', 'Data Science', 'SQL', 'Machine Learning', 'Data Visualization'],
    'mobile': ['React Native', 'Swift', 'Kotlin', 'Mobile Development', 'App Design'],
    'all': []
  };
  
  // Predefined videos by skill/technology to avoid actual API calls
  const videosBySkill: Record<string, VideoResource[]> = {
    "CSS": [
      {
        id: "1Rs2ND1ryYc",
        title: "CSS Tutorial - Zero to Hero (Complete Course)",
        channelName: "freeCodeCamp.org",
        description: "Learn CSS in this complete tutorial course. CSS is the language used to style websites.",
        thumbnail: "https://i.ytimg.com/vi/1Rs2ND1ryYc/mqdefault.jpg",
        url: "https://www.youtube.com/watch?v=1Rs2ND1ryYc",
        tags: ["CSS", "Web Development", "Frontend"],
        viewCount: "1.1M",
        publishedAt: "2021-02-13"
      },
      {
        id: "yfoY53QXEnI",
        title: "CSS Crash Course For Absolute Beginners",
        channelName: "Traversy Media",
        description: "In this crash course we will go over CSS fundamentals and basic styling concepts.",
        thumbnail: "https://i.ytimg.com/vi/yfoY53QXEnI/mqdefault.jpg",
        url: "https://www.youtube.com/watch?v=yfoY53QXEnI",
        tags: ["CSS", "Web Development", "Frontend"],
        viewCount: "2.3M",
        publishedAt: "2017-02-07"
      }
    ],
    "HTML": [
      {
        id: "pQN-pnXPaVg",
        title: "HTML Full Course - Build a Website Tutorial",
        channelName: "freeCodeCamp.org",
        description: "Learn the basics of HTML in this comprehensive tutorial.",
        thumbnail: "https://i.ytimg.com/vi/pQN-pnXPaVg/mqdefault.jpg",
        url: "https://www.youtube.com/watch?v=pQN-pnXPaVg",
        tags: ["HTML", "Web Development", "Tutorial"],
        viewCount: "6.7M",
        publishedAt: "2019-02-18"
      }
    ],
    "React Native": [
      {
        id: "0-S5a0eXPoc",
        title: "React Native Tutorial for Beginners - Build a React Native App",
        channelName: "Programming with Mosh",
        description: "Learn React Native by building a complete mobile app.",
        thumbnail: "https://i.ytimg.com/vi/0-S5a0eXPoc/mqdefault.jpg",
        url: "https://www.youtube.com/watch?v=0-S5a0eXPoc",
        tags: ["React Native", "Mobile Development", "App Development"],
        viewCount: "982K",
        publishedAt: "2020-05-22"
      }
    ],
    "Swift": [
      {
        id: "comQ1-x2a1Q",
        title: "Swift Programming Tutorial | FULL COURSE | Absolute Beginner",
        channelName: "CodeWithChris",
        description: "This Swift tutorial will teach you all the basics of Swift programming.",
        thumbnail: "https://i.ytimg.com/vi/comQ1-x2a1Q/mqdefault.jpg",
        url: "https://www.youtube.com/watch?v=comQ1-x2a1Q",
        tags: ["Swift", "iOS", "Apple", "Mobile Development"],
        viewCount: "753K",
        publishedAt: "2019-10-21"
      }
    ],
    "Data Science": [
      {
        id: "ua-CiDNNj30",
        title: "Data Science Full Course - Learn Data Science in 10 Hours",
        channelName: "Edureka",
        description: "This Data Science Full Course video will help you understand various Data Science concepts.",
        thumbnail: "https://i.ytimg.com/vi/ua-CiDNNj30/mqdefault.jpg",
        url: "https://www.youtube.com/watch?v=ua-CiDNNj30",
        tags: ["Data Science", "Python", "Machine Learning"],
        viewCount: "2.3M",
        publishedAt: "2019-08-23"
      }
    ],
    "React": [
      {
        id: "SqcY0GlETPk",
        title: "React Tutorial for Beginners",
        channelName: "Programming with Mosh",
        description: "Learn React in this comprehensive tutorial for beginners. This course teaches you React step by step.",
        thumbnail: "https://i.ytimg.com/vi/SqcY0GlETPk/mqdefault.jpg",
        url: "https://www.youtube.com/watch?v=SqcY0GlETPk",
        tags: ["React", "JavaScript", "Web Development"],
        viewCount: "2.4M",
        publishedAt: "2019-03-12"
      },
      {
        id: "bMknfKXIFA8",
        title: "React Course - Beginner's Tutorial for React JavaScript Library [2022]",
        channelName: "freeCodeCamp.org",
        description: "Learn React by building eight real-world projects and solving 140+ coding challenges.",
        thumbnail: "https://i.ytimg.com/vi/bMknfKXIFA8/mqdefault.jpg",
        url: "https://www.youtube.com/watch?v=bMknfKXIFA8",
        tags: ["React", "JavaScript", "Tutorial"],
        viewCount: "1.2M",
        publishedAt: "2022-01-10"
      },
      {
        id: "w7ejDZ8SWv8",
        title: "React JS Crash Course",
        channelName: "Traversy Media",
        description: "Get up to speed with React in this crash course. We will look at components, hooks, props, state and more.",
        thumbnail: "https://i.ytimg.com/vi/w7ejDZ8SWv8/mqdefault.jpg",
        url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8",
        tags: ["React", "Crash Course", "Web Development"],
        viewCount: "1.9M",
        publishedAt: "2021-03-11"
      }
    ],
    "JavaScript": [
      {
        id: "hdI2bqOjy3c",
        title: "JavaScript Crash Course For Beginners",
        channelName: "Traversy Media",
        description: "This crash course focuses on JavaScript fundamentals that you need to know as a developer.",
        thumbnail: "https://i.ytimg.com/vi/hdI2bqOjy3c/mqdefault.jpg",
        url: "https://www.youtube.com/watch?v=hdI2bqOjy3c",
        tags: ["JavaScript", "Web Development", "Programming"],
        viewCount: "3.1M",
        publishedAt: "2019-01-15"
      },
      {
        id: "PkZNo7MFNFg",
        title: "Learn JavaScript - Full Course for Beginners",
        channelName: "freeCodeCamp.org",
        description: "This complete JavaScript course will teach you everything you need to know to get started with JavaScript programming.",
        thumbnail: "https://i.ytimg.com/vi/PkZNo7MFNFg/mqdefault.jpg",
        url: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
        tags: ["JavaScript", "Full Course", "Beginners"],
        viewCount: "5.7M",
        publishedAt: "2018-12-10"
      }
    ],
    "Node.js": [
      {
        id: "Oe421EPjeBE",
        title: "Node.js and Express.js - Full Course",
        channelName: "freeCodeCamp.org",
        description: "Learn Node.js and Express.js in this comprehensive course for beginners.",
        thumbnail: "https://i.ytimg.com/vi/Oe421EPjeBE/mqdefault.jpg",
        url: "https://www.youtube.com/watch?v=Oe421EPjeBE",
        tags: ["Node.js", "Express.js", "Backend"],
        viewCount: "1.8M",
        publishedAt: "2021-04-16"
      }
    ],
    "Python": [
      {
        id: "_uQrJ0TkZlc",
        title: "Python Tutorial - Python Full Course for Beginners",
        channelName: "Programming with Mosh",
        description: "This Python tutorial is a full course for beginners, teaching you everything you need to know about Python.",
        thumbnail: "https://i.ytimg.com/vi/_uQrJ0TkZlc/mqdefault.jpg",
        url: "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
        tags: ["Python", "Programming", "Beginners"],
        viewCount: "21M",
        publishedAt: "2019-02-19"
      }
    ],
    "Data Structures": [
      {
        id: "RBSGKlAvoiM",
        title: "Data Structures Easy to Advanced Course",
        channelName: "freeCodeCamp.org",
        description: "Learn data structures through animations, examples, and detailed explanations.",
        thumbnail: "https://i.ytimg.com/vi/RBSGKlAvoiM/mqdefault.jpg",
        url: "https://www.youtube.com/watch?v=RBSGKlAvoiM",
        tags: ["Data Structures", "Algorithms", "Computer Science"],
        viewCount: "3.4M",
        publishedAt: "2019-09-03"
      }
    ],
    "Web Development": [
      {
        id: "PwsigsH4oXw",
        title: "Web Development In 2023 - A Practical Guide",
        channelName: "Traversy Media",
        description: "In this video, we will look at the state of web development in 2023 and what you may want to learn.",
        thumbnail: "https://i.ytimg.com/vi/PwsigsH4oXw/mqdefault.jpg",
        url: "https://www.youtube.com/watch?v=PwsigsH4oXw",
        tags: ["Web Development", "2023", "Career"],
        viewCount: "847K",
        publishedAt: "2023-01-03"
      }
    ]
  };

  // Get portfolio-specific skills or default skills if none are provided
  const availableSkills = React.useMemo(() => {
    // If we have a portfolio type, filter by that
    if (portfolioType && portfolioType !== 'all') {
      return portfolioTechnologies[portfolioType] || Object.keys(videosBySkill);
    }
    
    // Otherwise use provided skills or all skills
    return skills.length > 0 ? skills : Object.keys(videosBySkill);
  }, [portfolioType, skills]);

  // Set initial active skill based on available skills
  useEffect(() => {
    if (availableSkills.length > 0 && !availableSkills.includes(activeSkill)) {
      setActiveSkill(availableSkills[0]);
    }
  }, [availableSkills]);

  // Load videos when active skill changes
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const skillVideos = videosBySkill[activeSkill] || videosBySkill["JavaScript"];
      setVideos(skillVideos);
      setIsLoading(false);
    }, 500);
  }, [activeSkill]);

  // Load saved videos from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedVideos');
    if (saved) {
      setSavedVideos(JSON.parse(saved));
    }
  }, []);

  // Toggle saved state for a video
  const toggleSaveVideo = (videoId: string) => {
    const updatedSavedVideos = savedVideos.includes(videoId)
      ? savedVideos.filter(id => id !== videoId)
      : [...savedVideos, videoId];
    
    setSavedVideos(updatedSavedVideos);
    localStorage.setItem('savedVideos', JSON.stringify(updatedSavedVideos));
  };

  // Open video in new tab
  const openVideo = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center">
          <YoutubeIcon className="h-5 w-5 mr-2 text-red-600" />
          Learning Resources
        </CardTitle>
        <CardDescription>
          Video tutorials and courses related to your selected skills
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeSkill} onValueChange={setActiveSkill} className="w-full">
          <TabsList className="mb-4 flex flex-wrap h-auto">
            {availableSkills.map(skill => (
              <TabsTrigger key={skill} value={skill} className="mb-1">
                {skill}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map(video => (
                <Card 
                  key={video.id} 
                  className="overflow-hidden border border-gray-200 dark:border-gray-800 h-full flex flex-col transition-all duration-300 hover:shadow-md"
                >
                  <div 
                    className="h-40 bg-gray-200 dark:bg-gray-800 cursor-pointer overflow-hidden" 
                    style={{ backgroundImage: `url(${video.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    onClick={() => openVideo(video.url)}
                  >
                    <div className="w-full h-full flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-10 transition-all">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                        <YoutubeIcon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 
                      className="font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                      onClick={() => openVideo(video.url)}
                    >
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{video.channelName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">{video.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {video.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-auto flex justify-between items-center">
                      <div className="flex items-center text-xs text-gray-500">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        <span>{video.viewCount} views</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-1 h-auto"
                        onClick={() => toggleSaveVideo(video.id)}
                      >
                        <Bookmark 
                          className={`h-4 w-4 ${savedVideos.includes(video.id) ? 'fill-primary text-primary' : 'text-gray-500'}`} 
                        />
                      </Button>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="m-2 mt-0 flex gap-1 text-primary"
                    onClick={() => openVideo(video.url)}
                  >
                    <span>Watch on YouTube</span>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Card>
              ))}
            </div>
          )}
          
          {videos.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <p className="text-gray-500">No videos found for {activeSkill}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setActiveSkill(Object.keys(videosBySkill)[0])}
              >
                View recommended videos
              </Button>
            </div>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}