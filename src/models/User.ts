import mongoose, { Schema, Document } from "mongoose";

// MESSAGE SCHEMA
export interface Message extends Document {
  _id: string;
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// USER SCHEMA
export interface User extends Document {
  username: string;
  email: string;
  password: string;
  isAcceptingMessage: boolean;
  message: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "username is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "please use a valid email address"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  isAcceptingMessage: {
    type: Boolean,
    required: [true, "is accepting message is required"],
  },
  message: {
    type: [MessageSchema],
    default: [],
    required: [true, "message is required"],
  },
});

// USER MODEL EXPORT
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
