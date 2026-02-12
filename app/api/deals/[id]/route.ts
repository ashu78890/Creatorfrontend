/**
 * Single Deal API Routes
 * 
 * GET /api/deals/[id] - Fetch a single deal
 * PUT /api/deals/[id] - Update a deal
 * DELETE /api/deals/[id] - Delete a deal
 */

import { type NextRequest } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import Deal from "@/lib/models/deal";
import Brand from "@/lib/models/brand";
import { getCurrentUserId } from "@/lib/auth";
import { updateDealSchema, objectIdSchema } from "@/lib/validations";
import {
  successResponse,
  noContentResponse,
  unauthorizedResponse,
  notFoundResponse,
  badRequestResponse,
  handleApiError,
} from "@/lib/api-utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/deals/[id]
 * 
 * Fetch a single deal by ID.
 * Only returns deals belonging to the authenticated user.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();

    const userId = await getCurrentUserId();
    if (!userId) {
      return unauthorizedResponse();
    }

    const { id } = await params;

    // Validate ObjectId format
    const idValidation = objectIdSchema.safeParse(id);
    if (!idValidation.success) {
      return badRequestResponse("Invalid deal ID format");
    }

    // Find deal belonging to user
    const deal = await Deal.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId,
    })
      .populate("brandId", "name instagramHandle platform")
      .lean();

    if (!deal) {
      return notFoundResponse("Deal not found");
    }

    return successResponse(deal);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/deals/[id]
 * 
 * Update a deal by ID.
 * Only allows updating deals belonging to the authenticated user.
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();

    const userId = await getCurrentUserId();
    if (!userId) {
      return unauthorizedResponse();
    }

    const { id } = await params;

    // Validate ObjectId format
    const idValidation = objectIdSchema.safeParse(id);
    if (!idValidation.success) {
      return badRequestResponse("Invalid deal ID format");
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateDealSchema.parse(body);

    // If brandId is being updated, verify it exists and belongs to user
    if (validatedData.brandId) {
      const brand = await Brand.findOne({
        _id: new mongoose.Types.ObjectId(validatedData.brandId),
        userId,
      });

      if (!brand) {
        return badRequestResponse("Brand not found or does not belong to you");
      }
    }

    // Update the deal
    const deal = await Deal.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
        userId,
      },
      {
        ...validatedData,
        ...(validatedData.brandId && {
          brandId: new mongoose.Types.ObjectId(validatedData.brandId),
        }),
      },
      { new: true, runValidators: true }
    )
      .populate("brandId", "name instagramHandle platform")
      .lean();

    if (!deal) {
      return notFoundResponse("Deal not found");
    }

    return successResponse(deal);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/deals/[id]
 * 
 * Delete a deal by ID.
 * Only allows deleting deals belonging to the authenticated user.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();

    const userId = await getCurrentUserId();
    if (!userId) {
      return unauthorizedResponse();
    }

    const { id } = await params;

    // Validate ObjectId format
    const idValidation = objectIdSchema.safeParse(id);
    if (!idValidation.success) {
      return badRequestResponse("Invalid deal ID format");
    }

    // Delete the deal
    const result = await Deal.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(id),
      userId,
    });

    if (!result) {
      return notFoundResponse("Deal not found");
    }

    return noContentResponse();
  } catch (error) {
    return handleApiError(error);
  }
}
