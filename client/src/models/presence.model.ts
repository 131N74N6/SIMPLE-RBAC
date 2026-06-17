export type FillPresenceIntrf = {
    presence_slot_id: string;
    student_status: string;
}

export type MakePresenceIntrf = {
    classname: string;
    deadline: string;
    start_time: string;
}

export type PresenceSlotIntrf = {
    _id: string;
    created_at: string;
    classname: string;
    deadline: string;
    start_time: string;
    master_id: String;
}