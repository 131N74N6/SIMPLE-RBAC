import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, UseMutationResult } from "@tanstack/react-query";

export type StudentPresenceIntrf = {
    _id: string;
    creator_name: string;
    presence_slot_id: string;
    student_id: string;
    student_name: string;
    classname: string;
    status: string;
    filled_at: string;
}

export type IStudentPresenceItem = {
    is_selected: boolean;
    is_processing: boolean;
    on_edit: UseMutationResult<void, Error, { id: string; presence_slot_id: string; }, unknown>;
    on_select: (id: string) => void;
    on_delete: UseMutationResult<void, Error, string, unknown>;
    set_edit_status: (key: string, value: string) => void;
    status: { [key: string]: string; };
    student_status: StudentPresenceIntrf;
}

export type IStudentPresenceList = {
    fetch_next_page: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    has_next_page: boolean;
    is_fetching_next_page: boolean;
    is_processing: boolean;
    on_edit: UseMutationResult<void, Error, { id: string; presence_slot_id: string; }, unknown>;
    on_select: (id: string) => void;
    on_delete: UseMutationResult<void, Error, string, unknown>;
    selected_id: string | null;
    set_edit_status: (key: string, value: string) => void;
    status: { [key: string]: string; };
    student_statuses: StudentPresenceIntrf[];
}