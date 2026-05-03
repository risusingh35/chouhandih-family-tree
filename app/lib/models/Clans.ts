import { Schema, model, models, Document, Types } from "mongoose";
import { Vansh } from "./Vansh";
import { Group } from "./Group";

export interface IClan extends Document {
  slug: string;
  name: string;
  altName?: string;
  groupId: Types.ObjectId;
  vanshId: Types.ObjectId;
  origin?: string;
  kuldevi?: string;
  description?: string;
  subclans: string[];
  accent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClanSchema = new Schema<IClan>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    altName: {
      type: String,
      trim: true,
    },

    groupId: {
      type: Schema.Types.ObjectId,
      ref: Group,
      required: true,
      index: true,
    },

    vanshId: {
      type: Schema.Types.ObjectId,
      ref: Vansh,
      required: true,
      index: true,
    },

    origin: { type: String, trim: true },
    kuldevi: { type: String, trim: true },
    description: { type: String, trim: true },

    subclans: [
      {
        type: String,
        trim: true,
      },
    ],

    accent: {
      type: String,
      match: /^#([0-9A-Fa-f]{3}){1,2}$/, // hex validation
      default: "#000000",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Useful compound index (common filter pattern)
ClanSchema.index({ groupId: 1, vanshId: 1 });

// Prevent duplicate subclans (optional but clean)
// ClanSchema.pre("save", function (next) {
//   if (this.subclans) {
//     this.subclans = [...new Set(this.subclans)];
//   }
//   next();
// });

export const Clan = models.Clan || model<IClan>("Clan", ClanSchema);