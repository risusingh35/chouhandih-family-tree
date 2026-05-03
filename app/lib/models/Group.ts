import { Document, Schema, model, models } from "mongoose";

export interface IGroup extends Document {
  slug: string;
  name: string;
  nameHindi: string;
  tagline: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const GroupSchema = new Schema<IGroup>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    nameHindi: { type: String },
    tagline: { type: String },
    description: { type: String }
  },
  { timestamps: true }
);



export const Group = models.Group || model("Group", GroupSchema);