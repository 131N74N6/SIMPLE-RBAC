import mongoose, { Schema, Types } from "mongoose";

export type PresenceIntrf = {
    created_at: string;
    classname: string;
    deadline: string;
    master_id: Types.ObjectId;
    status: string;
    start_time: string;
    student_id: Types.ObjectId;
    student_name: string;
}

const presenceSchema = new Schema<PresenceIntrf>({
    created_at: { type: String, required: true },
    classname: { type: String, required: true },
    deadline: { type: String, required: true },
    master_id: { type: Schema.Types.ObjectId },
    status: { type: String, required: true },
    start_time: { type: String },
    student_id: { type: Schema.Types.ObjectId },
    student_name: { type: String }
});

export const Presence = mongoose.model<PresenceIntrf>("presences", presenceSchema, "presences")