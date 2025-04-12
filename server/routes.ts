import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertChallengeSchema, insertSubmissionSchema } from "@shared/schema";
import { assessCode } from "./services/aiCodeAssessment";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  
  // Challenge API Endpoints
  app.get("/api/challenges", async (req: Request, res: Response) => {
    try {
      const challenges = await storage.getAllChallenges();
      res.json(challenges);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      res.status(500).json({ error: "Failed to fetch challenges" });
    }
  });
  
  app.get("/api/challenges/category/:category", async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      const challenges = await storage.getChallengesByCategory(category);
      res.json(challenges);
    } catch (error) {
      console.error(`Error fetching challenges by category ${req.params.category}:`, error);
      res.status(500).json({ error: "Failed to fetch challenges by category" });
    }
  });
  
  app.get("/api/challenges/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid challenge ID" });
      }
      
      const challenge = await storage.getChallenge(id);
      if (!challenge) {
        return res.status(404).json({ error: "Challenge not found" });
      }
      
      res.json(challenge);
    } catch (error) {
      console.error(`Error fetching challenge ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch challenge" });
    }
  });
  
  app.post("/api/challenges", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      // Validate request body
      const parseResult = insertChallengeSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ 
          error: "Invalid challenge data",
          details: parseResult.error.format()
        });
      }
      
      const challenge = await storage.createChallenge(parseResult.data);
      res.status(201).json(challenge);
    } catch (error) {
      console.error("Error creating challenge:", error);
      res.status(500).json({ error: "Failed to create challenge" });
    }
  });

  // Submission API Endpoints
  app.post("/api/submissions", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      // Validate request body
      const parseResult = insertSubmissionSchema.safeParse({
        ...req.body,
        userId: req.user!.id,
        status: 'submitted'
      });
      
      if (!parseResult.success) {
        return res.status(400).json({ 
          error: "Invalid submission data",
          details: parseResult.error.format()
        });
      }
      
      const submission = await storage.createSubmission(parseResult.data);
      res.status(201).json(submission);
      
      // Trigger assessment in the background
      processSubmission(submission.id).catch(err => {
        console.error(`Error processing submission ${submission.id}:`, err);
      });
      
    } catch (error) {
      console.error("Error creating submission:", error);
      res.status(500).json({ error: "Failed to create submission" });
    }
  });
  
  app.get("/api/submissions/:id", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid submission ID" });
      }
      
      const submission = await storage.getSubmission(id);
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
      
      // Only allow users to view their own submissions
      if (submission.userId !== req.user!.id) {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      res.json(submission);
    } catch (error) {
      console.error(`Error fetching submission ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch submission" });
    }
  });
  
  app.get("/api/user/submissions", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      const submissions = await storage.getUserSubmissions(req.user!.id);
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching user submissions:", error);
      res.status(500).json({ error: "Failed to fetch user submissions" });
    }
  });
  
  // User Skills Endpoint
  app.put("/api/user/skills", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      const { skills } = req.body;
      if (!Array.isArray(skills)) {
        return res.status(400).json({ error: "Invalid skills data" });
      }
      
      const user = await storage.updateUserSkills(req.user!.id, skills);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json({ skills: user.skills });
    } catch (error) {
      console.error("Error updating user skills:", error);
      res.status(500).json({ error: "Failed to update user skills" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

// Function to handle submission assessment in the background
async function processSubmission(submissionId: number): Promise<void> {
  try {
    // Get submission
    const submission = await storage.getSubmission(submissionId);
    if (!submission) {
      console.error(`Submission ${submissionId} not found for assessment`);
      return;
    }
    
    // Get challenge details
    const challenge = await storage.getChallenge(submission.challengeId);
    if (!challenge) {
      console.error(`Challenge ${submission.challengeId} not found for submission ${submissionId}`);
      await storage.updateSubmissionStatus(submissionId, 'failed', {
        feedback: 'Challenge not found'
      });
      return;
    }
    
    // Skip assessment if no expected functionality is defined
    if (!challenge.expectedFunctionality) {
      await storage.updateSubmissionStatus(submissionId, 'assessed', {
        feedback: 'Challenge does not have assessment criteria defined'
      });
      return;
    }
    
    // Perform AI assessment
    const assessment = await assessCode(
      submission.code,
      challenge.description,
      challenge.expectedFunctionality,
      challenge.difficulty
    );
    
    // Update submission with assessment results
    await storage.updateSubmissionStatus(submissionId, 'assessed', {
      score: assessment.score,
      feedback: assessment.feedback,
      strengths: assessment.strengths,
      areasForImprovement: assessment.areas_for_improvement,
      suggestions: assessment.suggestions
    });
    
    // Update user and challenge stats if the submission passes a certain threshold
    if (assessment.score >= 70) {
      await storage.incrementCompletedChallenges(submission.userId);
      await storage.incrementChallengeCompletions(submission.challengeId);
    }
    
  } catch (error) {
    console.error(`Error processing submission ${submissionId}:`, error);
    await storage.updateSubmissionStatus(submissionId, 'failed', {
      feedback: 'An error occurred during assessment'
    });
  }
}
