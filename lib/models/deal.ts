/**
 * Deal Model
 * 
 * Represents a brand deal with deliverables and payment tracking.
 */

import mongoose, { Schema, type Document, type Model } from "mongoose";

// Deliverable sub-document interface
export interface IDeliverable {
  type: "reel" | "post" | "story" | "short";
  quantity: number;
  status: "pending" | "posted";
}

export interface IDeal extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  brandId: mongoose.Types.ObjectId;
  dealName: string;
  platform: "instagram" | "youtube" | "tiktok" | "twitter";
  deliverables: IDeliverable[];
  dueDate: Date;
  paymentAmount: number;
  paymentStatus: "pending" | "partial" | "paid";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Deliverable sub-schema
const DeliverableSchema = new Schema<IDeliverable>(
  {
    type: {
      type: String,
      enum: ["reel", "post", "story", "short"],
      required: [true, "Deliverable type is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
      max: [100, "Quantity cannot exceed 100"],
    },
    status: {
      type: String,
      enum: ["pending", "posted"],
      default: "pending",
    },
  },
  { _id: false } // Don't create _id for sub-documents
);

const DealSchema = new Schema<IDeal>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    brandId: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: [true, "Brand ID is required"],
    },
    dealName: {
      type: String,
      required: [true, "Deal name is required"],
      trim: true,
      maxlength: [200, "Deal name cannot exceed 200 characters"],
    },
    platform: {
      type: String,
      enum: ["instagram", "youtube", "tiktok", "twitter"],
      required: [true, "Platform is required"],
    },
    deliverables: {
      type: [DeliverableSchema],
      required: [true, "At least one deliverable is required"],
      validate: {
        validator: function (v: IDeliverable[]) {
          return v && v.length > 0;
        },
        message: "At least one deliverable is required",
      },
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    paymentAmount: {
      type: Number,
      required: [true, "Payment amount is required"],
      min: [0, "Payment amount cannot be negative"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "paid"],
      default: "pending",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [2000, "Notes cannot exceed 2000 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common query patterns
DealSchema.index({ userId: 1, dueDate: 1 });
DealSchema.index({ userId: 1, paymentStatus: 1 });
DealSchema.index({ userId: 1, createdAt: -1 });

const Deal: Model<IDeal> =
  mongoose.models.Deal || mongoose.model<IDeal>("Deal", DealSchema);

export default Deal;
