import { create } from "zustand";
import type { AddUserIntrf, EditUserIntrf } from "../models/user.model";

export type UserState = {
    editUser: EditUserIntrf;
    newUser: AddUserIntrf;
    selectedId: string | null;
    
    handleSelectedId: (id: string) => void;
    resetEditUser: () => void;
    resetNewUser: () => void;
    setEditUser: (field: 'classname' | 'username' | 'email' | 'created_at' | 'role', value: string) => void;
    setNewUser: (field: 'classname' | 'username' | 'email' | 'password' | 'role', value: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
    newUser: {
        classname: "" as string,
        email: "" as string,
        password: "" as string,
        role: "" as string,
        username: "" as string,
    },

    editUser: {
        classname: "" as string,
        created_at: "" as string,
        email: "" as string,
        role: "" as string,
        username: "" as string,
    },

    selectedId: null as string | null,

    handleSelectedId: (id) => set((state) => ({ selectedId: state.selectedId === id ? null : id })),
    resetEditUser: () => set({ 
        editUser: { classname: "", created_at: "", email: "", role: "", username: "" }, 
        selectedId: null
    }),
    resetNewUser: () => set({ newUser: { classname: "", email: "", password: "", role: "", username: "" } }),
    setEditUser: (field, value) => set((state) => ({ editUser: { ...state.editUser, [field]: value } })),
    setNewUser: (field, value) => set((state) => ({ newUser: { ...state.newUser, [field]: value } })),
}));