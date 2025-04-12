import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileType: text("profile_type").default("candidate"),
  createdAt: timestamp("created_at").defaultNow(),
  completedChallenges: integer("completed_challenges").default(0),
  skills: text("skills").array(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  firstName: true,
  lastName: true,
  profileType: true,
  skills: true,
});

// Define difficulty levels as enum
export const difficultyLevels = ['Easy', 'Medium', 'Hard', 'Expert'] as const;
export type DifficultyLevel = typeof difficultyLevels[number];

// Validate difficulty level
export const difficultySchema = z.enum(difficultyLevels);

// Create a schema specifically for challenges
export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(),
  skills: text("skills").array().notNull(),
  timeEstimate: text("time_estimate").notNull(),
  completions: integer("completions").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  expectedFunctionality: text("expected_functionality"), // What the solution should accomplish
  sampleSolution: text("sample_solution"), // Sample correct solution for comparison
  testCases: jsonb("test_cases"), // Test cases for automated validation
});

export const insertChallengeSchema = createInsertSchema(challenges).pick({
  title: true,
  description: true,
  category: true,
  difficulty: true,
  skills: true,
  timeEstimate: true,
  completions: true,
  expectedFunctionality: true,
  sampleSolution: true,
  testCases: true,
});

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  challengeId: integer("challenge_id").notNull(),
  code: text("code").notNull(),
  status: text("status").notNull(), // 'submitted', 'assessed', 'passed', 'failed'
  score: integer("score"),
  feedback: text("feedback"),
  strengths: text("strengths").array(),
  areasForImprovement: text("areas_for_improvement").array(),
  suggestions: text("suggestions").array(),
  createdAt: timestamp("created_at").defaultNow(),
  assessedAt: timestamp("assessed_at"),
});

export const insertSubmissionSchema = createInsertSchema(submissions).pick({
  userId: true,
  challengeId: true,
  code: true,
  status: true,
  score: true,
  feedback: true,
  strengths: true,
  areasForImprovement: true,
  suggestions: true,
});

// Create types for each schema
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type Challenge = typeof challenges.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissions.$inferSelect;
