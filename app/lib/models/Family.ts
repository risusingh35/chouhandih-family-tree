import { Types, Document, Schema, model, models } from "mongoose";
import { Vansh } from "./Vansh";
export interface IFamily extends Document {
  name: string;
  gender: "M" | "F";
  photo: string;
  dob: Date;
  dom: Date | null;
  dod: Date | null;
  isMarried: boolean;
  isAlive: boolean;
  isApproved: boolean;
  spouse: Types.ObjectId[] | [];
  parents: Types.ObjectId[];
  children: Types.ObjectId[];
  approvedBy?: Types.ObjectId | null;
  vanshId?: Types.ObjectId | null;
}

/**
 * Schema
 */
const FamilySchema: Schema<IFamily> = new Schema(
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

    dom: {
      type: Date,
      default: null,
    },
    dod: {
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
    spouse: {
      type: [Schema.Types.ObjectId],
      ref: "Family",
      default: [],
    },
    parents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Family",
      },
    ],

    vanshId: {
      type: Schema.Types.ObjectId,
      ref: "Vansh",
      required: true,
      default: null,
      index: true,
    },
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
    strict: true, //  ensure unknown fields are removed
  }
);
export const Family = models.Family || model("Family", FamilySchema);