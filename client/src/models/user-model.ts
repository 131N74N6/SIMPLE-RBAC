import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, UseMutationResult } from "@tanstack/react-query";

export type UserInfoIntrf = {
    created_at: string;
    role: string;
    user_id: string;
    username: string;
}

export type SignInIntrf = {
    password: string;
    username: string;
}

export type UserListIntrf = {
    change_user_data: UseMutationResult<void, Error, string, void>;
    current_user_id: string | null;
    data_error: string | null;
    edit_user: EditUserIntrf;
    fetch_next_page: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    has_next_page: boolean;
    is_fetching_next_page: boolean;
    is_processing: boolean;
    iso_to_local: (isoString: string) => string;
    on_delete: UseMutationResult<void, Error, string, void>;
    on_select: (id: string) => void;
    selected_id: string | null;
    set_data_error: React.Dispatch<React.SetStateAction<string | null>>;
    set_edit_user: React.Dispatch<React.SetStateAction<EditUserIntrf>>;
    users: UserItemIntrf[];
}

export type UserItemIntrf = {
    _id: string;
    change_user_data: UseMutationResult<void, Error, string, void>;
    current_user_id: string | null;
    created_at: string;
    data_error: string | null;
    edit_user: EditUserIntrf;
    email: string;
    is_processing: boolean;
    is_selected: boolean;
    iso_to_local: (isoString: string) => string;
    on_delete: UseMutationResult<void, Error, string, void>;
    on_select: (id: string) => void;
    password: string;
    role: string;
    set_data_error: React.Dispatch<React.SetStateAction<string | null>>;
    set_edit_user: React.Dispatch<React.SetStateAction<EditUserIntrf>>;
    username: string;
}

export type AddUserIntrf = {
    email: string; 
    password: string; 
    role: string;
    username: string;
}

export type EditUserIntrf = {
    created_at: string;
    email: string; 
    role: string;
    username: string;
}