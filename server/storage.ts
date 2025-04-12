import { users, challenges, type User, type InsertUser, type Challenge, type InsertChallenge } from "@shared/schema";
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
  
  // Challenge methods
  getAllChallenges(): Promise<Challenge[]>;
  getChallenge(id: number): Promise<Challenge | undefined>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  getChallengesByCategory(category: string): Promise<Challenge[]>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private challenges: Map<number, Challenge>;
  private userIdCounter: number;
  private challengeIdCounter: number;
  public sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.challenges = new Map();
    this.userIdCounter = 1;
    this.challengeIdCounter = 1;
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
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
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
    const challenge: Challenge = { ...insertChallenge, id, createdAt };
    this.challenges.set(id, challenge);
    return challenge;
  }
  
  async getChallengesByCategory(category: string): Promise<Challenge[]> {
    return Array.from(this.challenges.values()).filter(
      (challenge) => challenge.category === category
    );
  }
  
  private seedChallenges() {
    const predefinedChallenges: InsertChallenge[] = [
      {
        title: "Frontend Interactive Dashboard",
        description: "Create a responsive dashboard with interactive charts and filters using React",
        category: "Web Development",
        difficulty: "Intermediate",
        skills: ["React", "JavaScript", "CSS", "Data Visualization"],
        timeEstimate: "3-4 hours",
        completions: 145
      },
      {
        title: "Database Optimization Challenge",
        description: "Optimize a set of SQL queries to improve performance for a high-traffic application",
        category: "Database",
        difficulty: "Advanced",
        skills: ["SQL", "Database Design", "Performance Tuning"],
        timeEstimate: "2-3 hours",
        completions: 89
      },
      {
        title: "Mobile App User Authentication",
        description: "Implement secure user authentication flow with social login options for a mobile app",
        category: "Mobile Development",
        difficulty: "Intermediate",
        skills: ["React Native", "Authentication", "API Integration"],
        timeEstimate: "4-5 hours",
        completions: 112
      },
      {
        title: "API Design Challenge",
        description: "Design and document a RESTful API for a content management system",
        category: "Backend Development",
        difficulty: "Intermediate",
        skills: ["API Design", "REST", "Documentation"],
        timeEstimate: "2-3 hours",
        completions: 203
      },
      {
        title: "Machine Learning Classification",
        description: "Build a model to classify customer feedback as positive, negative, or neutral",
        category: "Data Science",
        difficulty: "Advanced",
        skills: ["Python", "Machine Learning", "NLP", "Data Analysis"],
        timeEstimate: "5-6 hours",
        completions: 67
      }
    ];
    
    predefinedChallenges.forEach(challenge => {
      const id = this.challengeIdCounter++;
      const createdAt = new Date();
      this.challenges.set(id, { ...challenge, id, createdAt });
    });
  }
}

export const storage = new MemStorage();
