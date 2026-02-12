/**
 * Single Brand API Routes
 * 
 * GET /api/brands/[id] - Fetch a single brand
 * PUT /api/brands/[id] - Update a brand
 * DELETE /api/brands/[id] - Delete a brand
 */

import { type NextRequest } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import Brand from "@/lib/models/brand";
import Deal from "@/lib/models/deal";
import { getCurrentUserId } from "@/lib/auth";
import { updateBrandSchema, objectIdSchema } from "@/lib/validations";
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
 * GET /api/brands/[id]
 * 
 * Fetch a single brand by ID.
 * Only returns brands belonging to the authenticated user.
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
      return badRequestResponse("Invalid brand ID format");
    }

    // Find brand belonging to user
    const brand = await Brand.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId,
    }).lean();

    if (!brand) {
      return notFoundResponse("Brand not found");
    }

    // Get deal count for this brand
    const dealCount = await Deal.countDocuments({ brandId: brand._id });

    return successResponse({
      ...brand,
      dealCount,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/brands/[id]
 * 
 * Update a brand by ID.
 * Only allows updating brands belonging to the authenticated user.
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
      return badRequestResponse("Invalid brand ID format");
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateBrandSchema.parse(body);

    // Update the brand
    const brand = await Brand.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
        userId,
      },
      validatedData,
      { new: true, runValidators: true }
    ).lean();

    if (!brand) {
      return notFoundResponse("Brand not found");
    }

    return successResponse(brand);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/brands/[id]
 * 
 * Delete a brand by ID.
 * Only allows deleting brands belonging to the authenticated user.
 * Optionally deletes associated deals.
 * 
 * Query params:
 * - deleteDeals: "true" to also delete associated deals
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();

    const userId = await getCurrentUserId();
    if (!userId) {
      return unauthorizedResponse();
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const deleteDeals = searchParams.get("deleteDeals") === "true";

    // Validate ObjectId format
    const idValidation = objectIdSchema.safeParse(id);
    if (!idValidation.success) {
      return badRequestResponse("Invalid brand ID format");
    }

    const brandId = new mongoose.Types.ObjectId(id);

    // Check if brand has deals
    const dealCount = await Deal.countDocuments({ brandId, userId });
    
    if (dealCount > 0 && !deleteDeals) {
      return badRequestResponse(
        `Brand has ${dealCount} associated deal(s). Set deleteDeals=true to also delete them.`
      );
    }

    // Delete deals if requested
    if (deleteDeals && dealCount > 0) {
      await Deal.deleteMany({ brandId, userId });
    }

    // Delete the brand
    const result = await Brand.findOneAndDelete({
      _id: brandId,
      userId,
    });

    if (!result) {
      return notFoundResponse("Brand not found");
    }

    return noContentResponse();
  } catch (error) {
    return handleApiError(error);
  }
}
