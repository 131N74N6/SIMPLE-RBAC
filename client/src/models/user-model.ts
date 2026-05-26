import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, UseMutationResult } from "@tanstack/react-query";

export type UserInfoIntrf = {
    token: string;
    user_id: string;
    role: string;
}

export type SignInIntrf = {
    password: string;
    username: string;
}

export type UserListIntrf = {
    users: UserItemIntrf[];
    fetch_next_page: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    has_next_page: boolean;
    is_fetching_next_page: boolean;
    on_delete: UseMutationResult<void, Error, string, void>;
    on_select: (id: string) => void;
    selected_id: string | null;
}

export type UserItemIntrf = {
    _id: string;
    created_at: string;
    email: string;
    is_selected: boolean;
    password: string;
    role: string;
    on_delete: UseMutationResult<void, Error, string, void>;
    on_select: (id: string) => void;
    username: string;
}

export type AddUserIntrf = Omit<UserItemIntrf, "_id" | "created_at" | "on_delete"  | "is_selected" | "on_select" | "selected_id">;

export type EditUserIntrf = Partial<Omit<UserItemIntrf, "_id" | "on_delete" | "is_selected" | "on_select" | "selected_id">>;