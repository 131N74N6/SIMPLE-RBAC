import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, UseMutationResult } from "@tanstack/react-query";

export type UserInfoIntrf = {
    _id: string;
    created_at: string;
    classname?: string;
    email: string;
    role: string;
    user_id: string;
    username: string;
}

export type SignInIntrf = {
    password: string;
    username: string;
}

export type UserListIntrf = {
    change_user_data_mt: UseMutationResult<void, Error, string, unknown>;
    data_error: string | null;
    edit_user: EditUserIntrf;
    fetch_next_page: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    has_next_page: boolean;
    is_fetching_next_page: boolean;
    is_processing: boolean;
    iso_to_local: (isoString: string) => string;
    on_delete: UseMutationResult<void, Error, string, unknown>;
    on_select: (id: string) => void;
    selected_id: string | null;
    set_data_error: React.Dispatch<React.SetStateAction<string | null>>;
    set_edit_user: (field: "email" | "role" | "username" | "created_at", value: string) => void;
    users: UserInfoIntrf[];
}

export type UserItemIntrf = {
    change_user_data_mt: UseMutationResult<void, Error, string, unknown>;
    data_error: string | null;
    edit_user: EditUserIntrf;
    is_processing: boolean;
    is_selected: boolean;
    iso_to_local: (isoString: string) => string;
    on_delete: UseMutationResult<void, Error, string, unknown>;
    on_select: (id: string) => void;
    set_data_error: React.Dispatch<React.SetStateAction<string | null>>;
    set_edit_user: (field: "email" | "role" | "username" | "created_at", value: string) => void;
    user: UserInfoIntrf;
}

export type AddUserIntrf = {
    email: string; 
    classname: string;
    password: string; 
    role: string;
    username: string;
}

export type EditUserIntrf = {
    created_at: string;
    classname: string;
    email: string; 
    role: string;
    username: string;
}