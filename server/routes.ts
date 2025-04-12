import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertChallengeSchema } from "@shared/schema";

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

  const httpServer = createServer(app);

  return httpServer;
}
