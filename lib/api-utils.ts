/**
 * API Utility Functions
 * 
 * Helpers for consistent API responses and error handling.
 */

import { NextResponse } from "next/server";
import { ZodError } from "zod";

// ============================================
// Response Types
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
}

// ============================================
// Success Responses
// ============================================

export function successResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(
    { success: true, data } satisfies ApiResponse<T>,
    { status }
  );
}

export function createdResponse<T>(data: T): NextResponse {
  return successResponse(data, 201);
}

export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

// ============================================
// Error Responses
// ============================================

export function errorResponse(
  message: string,
  status = 500
): NextResponse {
  return NextResponse.json(
    { success: false, error: message } satisfies ApiResponse,
    { status }
  );
}

export function badRequestResponse(message = "Bad request"): NextResponse {
  return errorResponse(message, 400);
}

export function unauthorizedResponse(message = "Unauthorized"): NextResponse {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message = "Forbidden"): NextResponse {
  return errorResponse(message, 403);
}

export function notFoundResponse(message = "Not found"): NextResponse {
  return errorResponse(message, 404);
}

export function validationErrorResponse(error: ZodError): NextResponse {
  const errors = error.errors.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));

  return NextResponse.json(
    {
      success: false,
      error: "Validation failed",
      errors,
    } satisfies ApiResponse,
    { status: 400 }
  );
}

// ============================================
// Error Handler
// ============================================

/**
 * Wrap API handlers with consistent error handling
 */
export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error);

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return validationErrorResponse(error);
  }

  // Handle known errors
  if (error instanceof Error) {
    // Authentication errors
    if (error.message === "Unauthorized") {
      return unauthorizedResponse();
    }

    // MongoDB duplicate key error
    if (error.message.includes("duplicate key")) {
      return badRequestResponse("A record with this value already exists");
    }

    // MongoDB validation error
    if (error.name === "ValidationError") {
      return badRequestResponse(error.message);
    }

    // MongoDB cast error (invalid ObjectId)
    if (error.name === "CastError") {
      return badRequestResponse("Invalid ID format");
    }
  }

  // Generic server error
  return errorResponse("Internal server error", 500);
}
