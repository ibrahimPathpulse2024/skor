// models/User.ts
import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Invalid email address",
      ],
    },
    name: { type: String, required: true, trim: true },
    image: { type: String, default: "/default-avatar.png" },
    gamerId: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.index({ email: 1 }, { unique: true });

export const User = models.User || model("User", userSchema);
