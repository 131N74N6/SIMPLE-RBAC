import mongoose, { Schema, Types } from "mongoose";

export type PresenceSlotIntrf = {
    _id: Types.ObjectId;
    created_at: string;
    classname: string;
    deadline: string;
    start_time: string;
    master_id: Types.ObjectId;
}

const presenceSlotSchema = new Schema<PresenceSlotIntrf>({
    created_at: { type: String, required: true },
    classname: { type: String, required: true },
    deadline: { type: String, required: true },
    start_time: { type: String, required: true },
    master_id: { type: Schema.Types.ObjectId, required: true, ref: 'users' }
});

export type StudentPresenceIntrf = {
    presence_slot_id: Types.ObjectId;
    student_id: Types.ObjectId;
    student_name: string;
    classname: string;
    status: string;
    filled_at: string;
}

const studentPresenceSchema = new Schema<StudentPresenceIntrf>({
    presence_slot_id: { type: Schema.Types.ObjectId, required: true, ref: 'presence-slots' },
    student_id: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
    student_name: { type: String, required: true },
    classname: { type: String, required: true },
    status: { type: String, required: true },
    filled_at: { type: String, required: true }
});

export const PresenceSlot = mongoose.model<PresenceSlotIntrf>("presence-slots", presenceSlotSchema, "presence-slots");
export const StudentAttendance = mongoose.model<StudentPresenceIntrf>("student-presences", studentPresenceSchema, "student-presences");