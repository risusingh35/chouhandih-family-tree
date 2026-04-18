import mongoose, { Schema, model, models } from "mongoose";
export interface IVansh extends Document {
  slug: string;
  name: string;
  groupId: mongoose.Types.ObjectId;
  color: {
    bg: string;
    text: string;
    border: string;
  };
}

const VanshSchema = new Schema<IVansh>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },

    groupId: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: true,
      index: true
    },

    color: {
      bg: String,
      text: String,
      border: String
    }
  },
  { timestamps: true }
);

export const Vansh = models.Vansh || model("Vansh", VanshSchema);