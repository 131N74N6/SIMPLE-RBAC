import { create } from "zustand";
import type { PresenceFormIntrf } from "../models/presence-slot.model";

export type PresenceState = {
    editPresenceForm: PresenceFormIntrf;
    editStudentStatus: { [key: string]: string; };
    presenceForm: PresenceFormIntrf;
    selectedFormId: string | null;
    selectedPresenceStatusId: string | null;
    studentStatus: { [key: string]: string; };

    handleSelectedFormId: (id: string) => void;
    handleSelectedPresenceStatusId: (id: string) => void;
    resetEditPresenceForm: () => void;
    resetPresenceForm: () => void;
    resetPresenceStatus: () => void;
    setEditPresenceForm: (field: 'classname' | 'deadline'| 'start_time', value: string) => void;
    setPresenceForm: (field: 'classname' | 'deadline'| 'start_time', value: string) => void;
    setEditStudentStatus: (key: string, value: string) => void;
    setStudentStatus: (key: string, value: string) => void;
}

export const usePresenceStore = create<PresenceState>((set) => ({
    editStudentStatus: {},
    editPresenceForm: { classname: "", deadline: "", start_time: "" },
    presenceForm: { classname: "", deadline: "", start_time: "" },
    selectedFormId: null,
    selectedPresenceStatusId: null,
    studentStatus: {},

    handleSelectedFormId: (id) => set((state) => ({ selectedFormId: state.selectedFormId === id ? null : id })),
    
    handleSelectedPresenceStatusId: (id) => set((state) => ({ selectedPresenceStatusId: state.selectedPresenceStatusId === id ? null : id })),

    resetEditPresenceForm: () => set({ editPresenceForm: { classname: "", deadline: "", start_time: "" }, selectedFormId: null }),

    resetPresenceForm: () => set({ presenceForm: { classname: "", deadline: "", start_time: "" } }),

    resetPresenceStatus: () => set({ studentStatus: {}, selectedPresenceStatusId: null }),

    setEditPresenceForm: (field, value) => set((state) => ({ editPresenceForm: { ...state.editPresenceForm, [field]: value } })),

    setPresenceForm: (field, value) => set((state) => ({ presenceForm: { ...state.presenceForm, [field]: value } })),

    setEditStudentStatus: (key, value) => set((state) => ({ editStudentStatus: { ...state.editStudentStatus, [key]: value } })),

    setStudentStatus: (key, value) => set((state) => ({ studentStatus: { ...state.studentStatus, [key]: value } }))
}));