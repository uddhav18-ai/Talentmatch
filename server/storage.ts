import { users, challenges, submissions, type User, type InsertUser, type Challenge, type InsertChallenge, type Submission, type InsertSubmission, difficultyLevels } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserSkills(userId: number, skills: string[]): Promise<User | undefined>;
  incrementCompletedChallenges(userId: number): Promise<User | undefined>;
  
  // Challenge methods
  getAllChallenges(): Promise<Challenge[]>;
  getChallenge(id: number): Promise<Challenge | undefined>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  getChallengesByCategory(category: string): Promise<Challenge[]>;
  incrementChallengeCompletions(challengeId: number): Promise<Challenge | undefined>;
  
  // Submission methods
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  getSubmission(id: number): Promise<Submission | undefined>;
  getUserSubmissions(userId: number): Promise<Submission[]>;
  getChallengeSubmissions(challengeId: number): Promise<Submission[]>;
  updateSubmissionStatus(id: number, status: string, assessmentData?: Partial<Submission>): Promise<Submission | undefined>;
  
  // Session store
  sessionStore: any; // Using any type to avoid Store type issue
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private challenges: Map<number, Challenge>;
  private submissions: Map<number, Submission>;
  private userIdCounter: number;
  private challengeIdCounter: number;
  private submissionIdCounter: number;
  public sessionStore: any; // Using any type to avoid Store type issue

  constructor() {
    this.users = new Map();
    this.challenges = new Map();
    this.submissions = new Map();
    this.userIdCounter = 1;
    this.challengeIdCounter = 1;
    this.submissionIdCounter = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // Prune expired entries every 24h
    });
    
    // Add some initial challenges
    this.seedChallenges();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const completedChallenges = 0;
    const skills = insertUser.skills || [];
    
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt, 
      completedChallenges,
      skills: skills
    };
    
    this.users.set(id, user);
    return user;
  }
  
  async updateUserSkills(userId: number, skills: string[]): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const updatedUser = { ...user, skills };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async incrementCompletedChallenges(userId: number): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const completedChallenges = (user.completedChallenges || 0) + 1;
    const updatedUser = { ...user, completedChallenges };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async getAllChallenges(): Promise<Challenge[]> {
    return Array.from(this.challenges.values());
  }
  
  async getChallenge(id: number): Promise<Challenge | undefined> {
    return this.challenges.get(id);
  }
  
  async createChallenge(insertChallenge: InsertChallenge): Promise<Challenge> {
    const id = this.challengeIdCounter++;
    const createdAt = new Date();
    const completions = insertChallenge.completions || 0;
    
    const challenge: Challenge = { 
      ...insertChallenge, 
      id, 
      createdAt, 
      completions
    };
    
    this.challenges.set(id, challenge);
    return challenge;
  }
  
  async getChallengesByCategory(category: string): Promise<Challenge[]> {
    return Array.from(this.challenges.values()).filter(
      (challenge) => challenge.category === category
    );
  }
  
  async incrementChallengeCompletions(challengeId: number): Promise<Challenge | undefined> {
    const challenge = this.challenges.get(challengeId);
    if (!challenge) return undefined;
    
    const completions = (challenge.completions || 0) + 1;
    const updatedChallenge = { ...challenge, completions };
    this.challenges.set(challengeId, updatedChallenge);
    return updatedChallenge;
  }
  
  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const id = this.submissionIdCounter++;
    const createdAt = new Date();
    const status = submission.status || 'submitted';
    
    const newSubmission: Submission = {
      ...submission,
      id,
      createdAt,
      status,
      assessedAt: null
    };
    
    this.submissions.set(id, newSubmission);
    return newSubmission;
  }
  
  async getSubmission(id: number): Promise<Submission | undefined> {
    return this.submissions.get(id);
  }
  
  async getUserSubmissions(userId: number): Promise<Submission[]> {
    return Array.from(this.submissions.values()).filter(
      (submission) => submission.userId === userId
    );
  }
  
  async getChallengeSubmissions(challengeId: number): Promise<Submission[]> {
    return Array.from(this.submissions.values()).filter(
      (submission) => submission.challengeId === challengeId
    );
  }
  
  async updateSubmissionStatus(
    id: number, 
    status: string, 
    assessmentData?: Partial<Submission>
  ): Promise<Submission | undefined> {
    const submission = this.submissions.get(id);
    if (!submission) return undefined;
    
    const assessedAt = status !== 'submitted' ? new Date() : submission.assessedAt;
    
    const updatedSubmission: Submission = {
      ...submission,
      ...assessmentData,
      status,
      assessedAt
    };
    
    this.submissions.set(id, updatedSubmission);
    return updatedSubmission;
  }
  
  private seedChallenges() {
    const predefinedChallenges: InsertChallenge[] = [
      {
        title: "Frontend Interactive Dashboard",
        description: "Create a responsive dashboard with interactive charts and filters using React. The dashboard should display various metrics, allow filtering by date ranges, and include at least one interactive chart component.",
        category: "Web Development",
        difficulty: "Medium",
        skills: ["React", "JavaScript", "CSS", "Data Visualization"],
        timeEstimate: "3-4 hours",
        completions: 145,
        expectedFunctionality: "A fully functional React dashboard that loads data, displays metrics in charts/graphs, and allows user interaction through filters. Should be responsive for different screen sizes.",
        sampleSolution: "// Sample React component structure\nimport React, { useState, useEffect } from 'react';\nimport Chart from './Chart';\n\nfunction Dashboard() {\n  const [data, setData] = useState([]);\n  const [filters, setFilters] = useState({ date: 'all' });\n\n  useEffect(() => {\n    // Fetch data\n    fetchData(filters).then(setData);\n  }, [filters]);\n\n  return (\n    <div className=\"dashboard\">\n      <FilterPanel filters={filters} onChange={setFilters} />\n      <MetricsOverview data={data} />\n      <Chart data={data} type=\"line\" />\n      <Chart data={data} type=\"bar\" />\n    </div>\n  );\n}"
      },
      {
        title: "Database Optimization Challenge",
        description: "Optimize a set of SQL queries to improve performance for a high-traffic application. You'll be given a database schema and several slow-performing queries that need to be refactored.",
        category: "Database",
        difficulty: "Hard",
        skills: ["SQL", "Database Design", "Performance Tuning"],
        timeEstimate: "2-3 hours",
        completions: 89,
        expectedFunctionality: "Optimized SQL queries that perform significantly faster than the original versions, with explanations for each optimization technique used.",
        sampleSolution: "-- Original slow query\nSELECT * FROM orders\nJOIN customers ON orders.customer_id = customers.id\nWHERE orders.created_at > '2022-01-01'\n\n-- Optimized query\nSELECT o.id, o.amount, o.status, c.name, c.email\nFROM orders o\nJOIN customers c ON o.customer_id = c.id\nWHERE o.created_at > '2022-01-01'\nAND o.status = 'completed'\nINDEX HINT(orders created_at_idx)"
      },
      {
        title: "Mobile App User Authentication",
        description: "Implement secure user authentication flow with social login options for a mobile app. Include email/password authentication, password reset functionality, and at least one social provider integration.",
        category: "Mobile Development",
        difficulty: "Medium",
        skills: ["React Native", "Authentication", "API Integration"],
        timeEstimate: "4-5 hours",
        completions: 112,
        expectedFunctionality: "A complete authentication system with signup, login, password reset, and social login integration. Must include proper error handling and validation.",
        sampleSolution: "// Auth provider component\nimport React, { createContext, useState } from 'react';\nimport auth from '@react-native-firebase/auth';\n\nexport const AuthContext = createContext({});\n\nexport const AuthProvider = ({ children }) => {\n  const [user, setUser] = useState(null);\n\n  return (\n    <AuthContext.Provider\n      value={{\n        user,\n        login: async (email, password) => {\n          try {\n            await auth().signInWithEmailAndPassword(email, password);\n          } catch (e) {\n            console.error(e);\n          }\n        },\n        register: async (email, password) => {\n          try {\n            await auth().createUserWithEmailAndPassword(email, password);\n          } catch (e) {\n            console.error(e);\n          }\n        },\n        logout: async () => {\n          try {\n            await auth().signOut();\n          } catch (e) {\n            console.error(e);\n          }\n        }\n      }}\n    >\n      {children}\n    </AuthContext.Provider>\n  );\n};"
      },
      {
        title: "API Design Challenge",
        description: "Design and document a RESTful API for a content management system. Create the API specification, endpoint documentation, and a simple implementation of key endpoints.",
        category: "Backend Development",
        difficulty: "Medium",
        skills: ["API Design", "REST", "Documentation"],
        timeEstimate: "2-3 hours",
        completions: 203,
        expectedFunctionality: "A complete API specification with endpoints for managing content items, users, and permissions. Include documentation for request/response formats and authentication.",
        sampleSolution: "// Example API specification for a CMS\n\n// 1. Content Items API\nGET /api/content - List all content items\nGET /api/content/{id} - Get specific content item\nPOST /api/content - Create new content item\nPUT /api/content/{id} - Update content item\nDELETE /api/content/{id} - Delete content item\n\n// 2. Users API\nGET /api/users - List all users\nGET /api/users/{id} - Get specific user\nPOST /api/users - Create new user\nPUT /api/users/{id} - Update user\nDELETE /api/users/{id} - Delete user\n\n// 3. Authentication\nPOST /api/auth/login - Authenticate user\nPOST /api/auth/logout - Logout user\nPOST /api/auth/refresh - Refresh access token"
      },
      {
        title: "Machine Learning Classification",
        description: "Build a model to classify customer feedback as positive, negative, or neutral. You'll be given a dataset of customer comments and need to train a model to automatically categorize new feedback.",
        category: "Data Science",
        difficulty: "Expert",
        skills: ["Python", "Machine Learning", "NLP", "Data Analysis"],
        timeEstimate: "5-6 hours",
        completions: 67,
        expectedFunctionality: "A trained ML model that can classify text as positive, negative, or neutral with at least 80% accuracy. Include code for preprocessing text data and evaluating model performance.",
        sampleSolution: "import pandas as pd\nimport numpy as np\nfrom sklearn.feature_extraction.text import CountVectorizer\nfrom sklearn.naive_bayes import MultinomialNB\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.metrics import accuracy_score, classification_report\n\n# Load data\ndf = pd.read_csv('feedback.csv')\n\n# Split into train/test\nfrom sklearn.model_selection import train_test_split\nX_train, X_test, y_train, y_test = train_test_split(\n    df['text'], df['sentiment'], test_size=0.2, random_state=42\n)\n\n# Create pipeline\npipeline = Pipeline([\n    ('vectorizer', CountVectorizer(stop_words='english')),\n    ('classifier', MultinomialNB())\n])\n\n# Train model\npipeline.fit(X_train, y_train)\n\n# Evaluate\ny_pred = pipeline.predict(X_test)\nprint(f'Accuracy: {accuracy_score(y_test, y_pred)}')\nprint(classification_report(y_test, y_pred))"
      }
    ];
    
    predefinedChallenges.forEach(challenge => {
      const id = this.challengeIdCounter++;
      const createdAt = new Date();
      const completions = challenge.completions || 0;
      
      this.challenges.set(id, { 
        ...challenge, 
        id, 
        createdAt, 
        completions 
      });
    });
  }
}

export const storage = new MemStorage();
