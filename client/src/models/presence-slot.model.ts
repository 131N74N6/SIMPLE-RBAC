import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, UseMutationResult } from "@tanstack/react-query";
import type { GetDataIntrf } from "./data.model";

export type FillPresenceIntrf = {
    creator_name: string;
    presence_slot_id: string;
    status: string;
}

export type PresenceFormIntrf = {
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
    creator_name: string;
}

export type PresencFormListIntrf = {
    currentUserId: string | null;
    fetch_next_page: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    fillPresenceMt: UseMutationResult<void, Error, FillPresenceIntrf, unknown>;
    forms: PresenceSlotIntrf[];
    getData: <X>(props: GetDataIntrf) => { data: X | undefined; error: Error | null; isLoading: boolean };
    has_next_page: boolean;
    is_fetching_next_page: boolean;
    setStudentStatus: (key: string, value: string) => void;
    studentStatus: { [key: string]: string; };
}

export type PresencFormItemIntrf = {
    currentUserId: string | null;
    fillPresenceMt: UseMutationResult<void, Error, FillPresenceIntrf, unknown>;
    form: PresenceSlotIntrf;
    getData: <X>(props: GetDataIntrf) => { data: X | undefined; error: Error | null; isLoading: boolean };
    isExpired: boolean;
    setStudentStatus: (key: string, value: string) => void;
    studentStatus: { [key: string]: string; };
}

export type PresenceStatusIntrf = {
    status: string;
}

export type PresenceItemIntrf = {
    edit_form: PresenceFormIntrf;
    is_selected: boolean;
    is_processing: boolean;
    on_edit: UseMutationResult<void, Error, string, unknown>;
    on_select: (id: string) => void;
    on_delete: UseMutationResult<void, Error, string, unknown>;
    set_edit_form: (field: "classname" | "deadline" | "start_time", value: string) => void;
    slot: PresenceSlotIntrf;
}

export type PresenceListIntrf = {
    edit_form: PresenceFormIntrf;
    fetch_next_page: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    has_next_page: boolean;
    is_fetching_next_page: boolean;
    is_processing: boolean;
    on_edit: UseMutationResult<void, Error, string, unknown>;
    on_select: (id: string) => void;
    on_delete: UseMutationResult<void, Error, string, unknown>;
    selected_id: string | null;
    set_edit_form: (field: "classname" | "deadline" | "start_time", value: string) => void;
    slots: PresenceSlotIntrf[];
}

export type PresenceSericeIntrf = {
    setMessage?: React.Dispatch<React.SetStateAction<string | null>>;
    form_id?: string;
}