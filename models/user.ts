import { Document, Schema, model } from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
  },
  avatar: {
    type: String,
    default: "https://ionicframework.com/docs/img/demos/avatar.svg",
  },
  createdAt: {
    type: String,
    default: new Date().toISOString(),
  },  
  updatedAt: {
    type: String,
    default: new Date().toISOString(),
  },
});

userSchema.method("comparePassword", function (password: string = ""): boolean {
  return (bcrypt.compareSync(password, this.password));
});

export interface IUser extends Document {
  
  _id: string;
  username: string;
  password: string;
  email: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;

  // Methods
  comparePassword(password: string): boolean;
}

export const User = model<IUser>("User", userSchema);
