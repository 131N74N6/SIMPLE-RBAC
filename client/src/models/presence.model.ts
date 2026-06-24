import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, UseMutationResult } from "@tanstack/react-query";
import type { GetDataIntrf } from "./data.model";

export type FillPresenceIntrf = {
    presence_slot_id: string;
    status: string;
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

export type PresencFormListIntrf = {
    currentUserId: string | null;
    fetch_next_page: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    fillPresenceMt: UseMutationResult<void, Error, FillPresenceIntrf, unknown>;
    forms: PresenceSlotIntrf[];
    getData: <X>(props: GetDataIntrf) => { data: X | undefined; error: Error | null; isLoading: boolean };
    has_next_page: boolean;
    is_fetching_next_page: boolean;
    setStudentStatus: React.Dispatch<React.SetStateAction<{ [key: string]: string; }>>;
    studentStatus: { [key: string]: string; };
}

export type PresencFormItemIntrf = {
    currentUserId: string | null;
    fillPresenceMt: UseMutationResult<void, Error, FillPresenceIntrf, unknown>;
    form: PresenceSlotIntrf;
    getData: <X>(props: GetDataIntrf) => { data: X | undefined; error: Error | null; isLoading: boolean };
    isExpired: boolean;
    setStudentStatus: React.Dispatch<React.SetStateAction<{ [key: string]: string; }>>;
    studentStatus: { [key: string]: string; };
}

export type PresenceStatusIntrf = {
    status: string;
}

export type PresenceSericeIntrf = {
    setMessage?: React.Dispatch<React.SetStateAction<string | null>>;
}