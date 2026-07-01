import mongoose, { Schema, Types } from "mongoose";

export type StudentPresenceIntrf = {
    presence_creator: string;
    presence_creator_id: Types.ObjectId;
    presence_slot_id: Types.ObjectId;
    student_id: Types.ObjectId;
    student_name: string;
    classname: string;
    status: string;
    filled_at: string;
}

const studentPresenceSchema = new Schema<StudentPresenceIntrf>({
    presence_creator: { type: String, required: true },
    presence_creator_id: { type: Schema.Types.ObjectId, required: true },
    presence_slot_id: { type: Schema.Types.ObjectId, required: true, ref: 'presence-slots' },
    student_id: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
    student_name: { type: String, required: true },
    classname: { type: String, required: true },
    status: { type: String, required: true },
    filled_at: { type: String, required: true }
});

export const StudentPresence = mongoose.model<StudentPresenceIntrf>("student-presences", studentPresenceSchema, "student-presences");