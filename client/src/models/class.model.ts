import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, UseMutationResult } from "@tanstack/react-query";

export type ClassIntrf = {
    _id: string;
    created_at: string;
    classname: string;
}

export type ClassItemIntrf = {
    class_detail: ClassIntrf;
    classname: string;
    data_error: string | null;
    is_processing: boolean;
    is_selected: boolean;
    on_delete: UseMutationResult<void, Error, string, unknown>;
    on_edit: UseMutationResult<void, Error, string, unknown>;
    on_select: (id: string) => void;
    set_data_error: React.Dispatch<React.SetStateAction<string | null>>;
    set_edit_classname: React.Dispatch<React.SetStateAction<string>>;
}

export type ClassListIntrf = {
    class_data: ClassIntrf[];
    classname: string;
    data_error: string | null;
    fetch_next_page: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    has_next_page: boolean;
    is_fetching_next_page: boolean;
    is_processing: boolean;
    on_delete: UseMutationResult<void, Error, string, unknown>;
    on_edit: UseMutationResult<void, Error, string, unknown>;
    on_select: (id: string) => void;
    selected_id: string | null;
    set_data_error: React.Dispatch<React.SetStateAction<string | null>>;
    set_edit_classname: React.Dispatch<React.SetStateAction<string>>;
}