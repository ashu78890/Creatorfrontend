/**
 * Brand Model
 * 
 * Represents a brand that a creator works with for deals.
 */

import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IBrand extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  instagramHandle?: string;
  platform: "instagram" | "youtube" | "tiktok" | "twitter";
  createdAt: Date;
  updatedAt: Date;
}

const BrandSchema = new Schema<IBrand>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true, // Index for faster queries by user
    },
    name: {
      type: String,
      required: [true, "Brand name is required"],
      trim: true,
      maxlength: [100, "Brand name cannot exceed 100 characters"],
    },
    instagramHandle: {
      type: String,
      trim: true,
      maxlength: [50, "Instagram handle cannot exceed 50 characters"],
    },
    platform: {
      type: String,
      enum: ["instagram", "youtube", "tiktok", "twitter"],
      required: [true, "Platform is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient user + brand queries
BrandSchema.index({ userId: 1, name: 1 });

const Brand: Model<IBrand> =
  mongoose.models.Brand || mongoose.model<IBrand>("Brand", BrandSchema);

export default Brand;
