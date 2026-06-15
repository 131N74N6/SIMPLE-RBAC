import mongoose, { Schema, Types } from "mongoose";

export type UserIntrf = {
    created_at: string;
    classname: string;
    email: string;
    password: string;
    role: string;
    username: string;
}

const userSchema = new Schema<UserIntrf>({
    created_at: { type: String, required: true },
    classname: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    username: { type: String, required: true }
});

export const User = mongoose.model<UserIntrf>("users", userSchema, "users");