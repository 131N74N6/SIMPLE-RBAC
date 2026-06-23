import { create } from "zustand";

export type ClassState = {
    editClassName: string;
    newClassName: string;
    openForm: boolean;
    selectedId: string | null;

    handleSelectedId: (id: string) => void;
    setEditClassName: (editClassName: string) => void;
    setNewClassName: (newClassName: string) => void;
    setOpenForm: (status: boolean) => void;
    setSelectedId: (id: string | null | ((prev: string | null) => string | null)) => void;
}

export const useClassStore = create<ClassState>((set) => ({
    editClassName: "" as string,
    newClassName: "" as string,
    openForm: false as boolean,
    selectedId: null as string | null,

    handleSelectedId: (id: string) => set((state) => ({ selectedId: state.selectedId === id ? null : id })),
    setEditClassName: (editClassName: string) => set({ editClassName }),
    setNewClassName: (newClassName: string) => set({ newClassName }),
    setOpenForm: (status: boolean) => set({ openForm: status }),
    setSelectedId: (id) => set((state) => ({ selectedId: typeof id === 'function' ? id(state.selectedId) : id }))
}));