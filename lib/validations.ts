/**
 * Zod Validation Schemas
 * 
 * Centralized validation schemas for API request bodies.
 * These ensure type safety and data integrity.
 */

import { z } from "zod";

// ============================================
// Common Validators
// ============================================

export const objectIdSchema = z.string().regex(/^[a-fA-F0-9]{24}$/, {
  message: "Invalid ObjectId format",
});

export const platformSchema = z.enum(["instagram", "youtube", "tiktok", "twitter"]);

// ============================================
// Brand Schemas
// ============================================

export const createBrandSchema = z.object({
  name: z
    .string()
    .min(1, "Brand name is required")
    .max(100, "Brand name cannot exceed 100 characters")
    .trim(),
  instagramHandle: z
    .string()
    .max(50, "Instagram handle cannot exceed 50 characters")
    .trim()
    .optional(),
  platform: platformSchema,
});

export const updateBrandSchema = createBrandSchema.partial();

export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;

// ============================================
// Deliverable Schemas
// ============================================

export const deliverableTypeSchema = z.enum(["reel", "post", "story", "short"]);

export const deliverableSchema = z.object({
  type: deliverableTypeSchema,
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1")
    .max(100, "Quantity cannot exceed 100"),
  status: z.enum(["pending", "posted"]).default("pending"),
});

// ============================================
// Deal Schemas
// ============================================

export const createDealSchema = z.object({
  brandId: objectIdSchema,
  dealName: z
    .string()
    .min(1, "Deal name is required")
    .max(200, "Deal name cannot exceed 200 characters")
    .trim(),
  platform: platformSchema,
  deliverables: z
    .array(deliverableSchema)
    .min(1, "At least one deliverable is required")
    .max(20, "Cannot have more than 20 deliverables"),
  dueDate: z.coerce.date({
    required_error: "Due date is required",
    invalid_type_error: "Invalid date format",
  }),
  paymentAmount: z
    .number()
    .min(0, "Payment amount cannot be negative")
    .max(10000000, "Payment amount exceeds maximum"),
  paymentStatus: z.enum(["pending", "partial", "paid"]).default("pending"),
  notes: z
    .string()
    .max(2000, "Notes cannot exceed 2000 characters")
    .trim()
    .optional(),
});

export const updateDealSchema = createDealSchema.partial();

export type CreateDealInput = z.infer<typeof createDealSchema>;
export type UpdateDealInput = z.infer<typeof updateDealSchema>;

// ============================================
// User Schemas
// ============================================

export const createUserSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters")
    .trim(),
  email: z.string().email("Please enter a valid email address").toLowerCase(),
  plan: z.enum(["free", "pro", "studio"]).default("free"),
});

export const updateUserSchema = createUserSchema.partial();

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
