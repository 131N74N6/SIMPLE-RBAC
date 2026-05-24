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
}

export type UserItemIntrf = {
    _id: string;
    created_at: string;
    email: string;
    password: string;
    role: string;
    username: string;
    on_delete: UseMutationResult<void, Error, string, void>
}

export type AddUserIntrf = Omit<UserItemIntrf, "_id" | "created_at" | 'on_delete'>;