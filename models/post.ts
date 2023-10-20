import { Schema, Document, model, Model } from "mongoose";

const PostSchema = new Schema({
  message: {
    type: String,
  },

  images: [
    {
      type: String,
    },
  ],

  coords: {
    type: String,
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },

  createdAt: {
    type: Date,
    default: new Date(),
  },

  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

interface IPost extends Document {
  message: string;
  images: string[];
  coords: string;
  user: string;
}

export const Post = model("Post", PostSchema);
