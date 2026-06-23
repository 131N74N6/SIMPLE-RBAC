import { create } from "zustand";
import type { MakePresenceIntrf } from "../models/presence.model";

export type PresenceState = {
    presence: MakePresenceIntrf;
    resetPresence: () => void;
    setPresence: (field: 'classname' | 'deadline'| 'start_time', value: string) => void;
}

export const usePresenceStore = create<PresenceState>((set) => ({
    presence: { classname: "", deadline: "", start_time: "" },
    resetPresence: () => set({ presence: { classname: "", deadline: "", start_time: "" } }),
    setPresence: (field, value) => set((state) => ({ presence: { ...state.presence, [field]: value } }))
}));