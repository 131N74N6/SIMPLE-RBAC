import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, UseMutationResult } from "@tanstack/react-query";

export type ClassServiceIntrf = {
    setMessage?: React.Dispatch<React.SetStateAction<string | null>>;
}

export type ClassIntrf = {
    _id: string;
    created_at: string;
    classname: string;
}

export type ClassItemIntrf = {
    class_detail: ClassIntrf;
    edit_classname: string;
    is_processing: boolean;
    is_selected: boolean;
    on_delete: UseMutationResult<void, Error, string, unknown>;
    on_edit: UseMutationResult<void, Error, string, unknown>;
    on_select: (id: string) => void;
    set_edit_classname: (editClassName: string) => void;
}

export type ClassListIntrf = {
    class_data: ClassIntrf[];
    edit_classname: string;
    fetch_next_page: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    has_next_page: boolean;
    is_fetching_next_page: boolean;
    is_processing: boolean;
    on_delete: UseMutationResult<void, Error, string, unknown>;
    on_edit: UseMutationResult<void, Error, string, unknown>;
    on_select: (id: string) => void;
    selected_id: string | null;
    set_edit_classname: (editClassName: string) => void;
}