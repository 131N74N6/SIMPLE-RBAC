import mongoose, { Schema } from "mongoose";

export type ClassRoomIntrf = {
    created_at: string;
    classname: string;
}

const classRoomSchema = new Schema<ClassRoomIntrf>({
    created_at: { type: String },
    classname: { type: String, required: true }
});

export const ClassRoom = mongoose.model("classrooms", classRoomSchema, "classrooms");