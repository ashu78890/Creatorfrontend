/**
 * Authentication Utility
 * 
 * Placeholder authentication module that can be replaced with
 * real auth providers (Clerk, NextAuth, etc.) in the future.
 * 
 * Currently uses a mock user for development purposes.
 */

import mongoose from "mongoose";
import connectToDatabase from "./db";
import User, { type IUser } from "./models/user";

// Mock user ID for development
// In production, replace with actual auth provider
const MOCK_USER_ID = "507f1f77bcf86cd799439011";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  plan: "free" | "pro" | "studio";
}

/**
 * Get the current authenticated user
 * 
 * This is a placeholder that returns a mock user.
 * Replace with actual auth logic when integrating Clerk/NextAuth.
 * 
 * @returns The authenticated user or null
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    await connectToDatabase();

    // Try to find existing mock user
    let user = await User.findById(MOCK_USER_ID);

    // Create mock user if doesn't exist (first run)
    if (!user) {
      user = await User.create({
        _id: new mongoose.Types.ObjectId(MOCK_USER_ID),
        name: "Demo Creator",
        email: "demo@creatorflow.app",
        plan: "pro",
      });
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      plan: user.plan,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Get the current user ID
 * 
 * @returns The user's ObjectId or null if not authenticated
 */
export async function getCurrentUserId(): Promise<mongoose.Types.ObjectId | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  return new mongoose.Types.ObjectId(user.id);
}

/**
 * Require authentication
 * 
 * Use this in API routes to ensure user is authenticated.
 * Throws an error if not authenticated.
 * 
 * @returns The authenticated user
 * @throws Error if not authenticated
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

/**
 * Check if user has required plan level
 * 
 * @param user The authenticated user
 * @param requiredPlan The minimum plan required
 * @returns true if user has sufficient plan
 */
export function hasRequiredPlan(
  user: AuthUser,
  requiredPlan: "free" | "pro" | "studio"
): boolean {
  const planLevels = { free: 0, pro: 1, studio: 2 };
  return planLevels[user.plan] >= planLevels[requiredPlan];
}
