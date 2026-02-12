/**
 * Deals API Routes
 * 
 * POST /api/deals - Create a new deal
 * GET /api/deals - List all deals for the current user
 */

import { type NextRequest } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import Deal from "@/lib/models/deal";
import Brand from "@/lib/models/brand";
import { getCurrentUserId } from "@/lib/auth";
import { createDealSchema } from "@/lib/validations";
import {
  successResponse,
  createdResponse,
  unauthorizedResponse,
  badRequestResponse,
  handleApiError,
} from "@/lib/api-utils";

/**
 * GET /api/deals
 * 
 * List all deals for the authenticated user.
 * Supports filtering by status, platform, and sorting.
 * 
 * Query params:
 * - status: "pending" | "partial" | "paid"
 * - platform: "instagram" | "youtube" | "tiktok" | "twitter"
 * - sort: "dueDate" | "createdAt" | "paymentAmount" (default: -createdAt)
 * - limit: number (default: 50)
 * - skip: number (default: 0)
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
    const status = searchParams.get("status");
    const platform = searchParams.get("platform");
    const sortField = searchParams.get("sort") || "-createdAt";
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const skip = parseInt(searchParams.get("skip") || "0");

    // Build query
    const query: Record<string, unknown> = { userId };
    
    if (status && ["pending", "partial", "paid"].includes(status)) {
      query.paymentStatus = status;
    }
    
    if (platform && ["instagram", "youtube", "tiktok", "twitter"].includes(platform)) {
      query.platform = platform;
    }

    // Execute query with population
    const deals = await Deal.find(query)
      .populate("brandId", "name instagramHandle platform")
      .sort(sortField)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Deal.countDocuments(query);

    return successResponse({
      deals,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + deals.length < total,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/deals
 * 
 * Create a new deal for the authenticated user.
 * Validates that the brand exists and belongs to the user.
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
    const validatedData = createDealSchema.parse(body);

    // Verify brand exists and belongs to user
    const brand = await Brand.findOne({
      _id: new mongoose.Types.ObjectId(validatedData.brandId),
      userId,
    });

    if (!brand) {
      return badRequestResponse("Brand not found or does not belong to you");
    }

    // Create the deal
    const deal = await Deal.create({
      ...validatedData,
      userId,
      brandId: new mongoose.Types.ObjectId(validatedData.brandId),
    });

    // Populate brand info for response
    const populatedDeal = await Deal.findById(deal._id)
      .populate("brandId", "name instagramHandle platform")
      .lean();

    return createdResponse(populatedDeal);
  } catch (error) {
    return handleApiError(error);
  }
}
