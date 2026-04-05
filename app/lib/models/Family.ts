// lib/models/Person.ts

import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * TypeScript Interface
 */
export interface IPerson extends Document {
  name: string;
  gender: "M" | "F";
  photo: string;
  dob: Date;
  death: Date | null;
  isMarried: boolean;
  isAlive: boolean;
  isApproved: boolean;
  spouse: mongoose.Types.ObjectId[];
  parents: mongoose.Types.ObjectId[];
  children: mongoose.Types.ObjectId[];
  approvedBy?: mongoose.Types.ObjectId | null;
}

/**
 * Schema
 */
const PersonSchema: Schema<IPerson> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 100,
    },

    gender: {
      type: String,
      enum: ["M", "F"],
      required: true,
    },

    photo: {
      type: String,
      default: "",
    },

    dob: {
      type: Date,
      required: true,
    },

    death: {
      type: Date,
      default: null,
    },

    isMarried: {
      type: Boolean,
      default: false,
    },

    isAlive: {
      type: Boolean,
      default: true,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    /**
     * Relations (Self referencing)
     */
    spouse: [
      {
        type: Schema.Types.ObjectId,
        ref: "Person",
      },
    ],

    parents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Person",
      },
    ],

    children: [
      {
        type: Schema.Types.ObjectId,
        ref: "Person",
      },
    ],

    /**
     * Approval reference (User/Admin)
     */
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User", // change if different collection
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * Prevent re-compilation in Next.js
 */
export const PersonModel: Model<IPerson> =
  mongoose.models.Person || mongoose.model<IPerson>("Person", PersonSchema);