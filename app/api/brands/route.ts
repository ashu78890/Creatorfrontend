/**
 * Brands API Routes
 * 
 * POST /api/brands - Create a new brand
 * GET /api/brands - List all brands for the current user
 */

import { type NextRequest } from "next/server";
import connectToDatabase from "@/lib/db";
import Brand from "@/lib/models/brand";
import { getCurrentUserId } from "@/lib/auth";
import { createBrandSchema } from "@/lib/validations";
import {
  successResponse,
  createdResponse,
  unauthorizedResponse,
  handleApiError,
} from "@/lib/api-utils";

/**
 * GET /api/brands
 * 
 * List all brands for the authenticated user.
 * Supports filtering by platform and searching by name.
 * 
 * Query params:
 * - platform: "instagram" | "youtube" | "tiktok" | "twitter"
 * - search: string (searches by name)
 * - sort: "name" | "createdAt" (default: name)
 * - limit: number (default: 100)
 */
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const userId = await getCurrentUserId();
    if (!userId) {
      return unauthorizedResponse();
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get("platform");
    const search = searchParams.get("search");
    const sortField = searchParams.get("sort") || "name";
    const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 200);

    // Build query
    const query: Record<string, unknown> = { userId };
    
    if (platform && ["instagram", "youtube", "tiktok", "twitter"].includes(platform)) {
      query.platform = platform;
    }
    
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Execute query
    const brands = await Brand.find(query)
      .sort(sortField)
      .limit(limit)
      .lean();

    // Get total count
    const total = await Brand.countDocuments(query);

    return successResponse({
      brands,
      total,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/brands
 * 
 * Create a new brand for the authenticated user.
 */
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const userId = await getCurrentUserId();
    if (!userId) {
      return unauthorizedResponse();
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createBrandSchema.parse(body);

    // Create the brand
    const brand = await Brand.create({
      ...validatedData,
      userId,
    });

    return createdResponse(brand);
  } catch (error) {
    return handleApiError(error);
  }
}
