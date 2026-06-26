import mongoose, { Schema, Types } from "mongoose";

export type PresenceSlotIntrf = {
    _id: Types.ObjectId;
    created_at: string;
    classname: string;
    deadline: string;
    start_time: string;
    master_id: Types.ObjectId;
    master_name: string;
}

const presenceSlotSchema = new Schema<PresenceSlotIntrf>({
    created_at: { type: String, required: true },
    classname: { type: String, required: true },
    deadline: { type: String, required: true },
    start_time: { type: String, required: true },
    master_id: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
    master_name: { type: String, required: true },
});

export const PresenceSlot = mongoose.model<PresenceSlotIntrf>("presence-slots", presenceSlotSchema, "presence-slots");