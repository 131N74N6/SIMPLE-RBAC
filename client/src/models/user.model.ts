import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, UseMutationResult } from "@tanstack/react-query";

export type IStudent = {
    _id: string;
    created_at: string;
    classname: string;
    email: string;
    role: string;
    user_id: string;
    username: string;
}

export type IMaster = Omit<IStudent, 'classname'>;

export type SignInIntrf = {
    password: string;
    username: string;
}

export type IStudentList = {
    change_user_data_mt: UseMutationResult<void, Error, string, unknown>;
    edit_user: EditUserIntrf;
    fetch_next_page: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    has_next_page: boolean;
    is_fetching_next_page: boolean;
    is_processing: boolean;
    iso_to_local: (isoString: string) => string;
    on_delete: UseMutationResult<void, Error, string, unknown>;
    on_select: (id: string) => void;
    selected_id: string | null;
    set_edit_user: (field: "classname" | "email" | "role" | "username" | "created_at", value: string) => void;
    users: IStudent[];
}

export type IStudentItem = {
    change_user_data_mt: UseMutationResult<void, Error, string, unknown>;
    edit_user: EditUserIntrf;
    is_processing: boolean;
    is_selected: boolean;
    iso_to_local: (isoString: string) => string;
    on_delete: UseMutationResult<void, Error, string, unknown>;
    on_select: (id: string) => void;
    set_edit_user: (field: "classname" | "email" | "role" | "username" | "created_at", value: string) => void;
    user: IStudent;
}

export type IMasterList = {
    change_user_data_mt: UseMutationResult<void, Error, string, unknown>;
    edit_user: EditUserIntrf;
    fetch_next_page: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    has_next_page: boolean;
    is_fetching_next_page: boolean;
    is_processing: boolean;
    iso_to_local: (isoString: string) => string;
    on_delete: UseMutationResult<void, Error, string, unknown>;
    on_select: (id: string) => void;
    selected_id: string | null;
    set_edit_user: (field: "classname" | "email" | "role" | "username" | "created_at", value: string) => void;
    users: IMaster[];
}

export type IMasterItem = {
    change_user_data_mt: UseMutationResult<void, Error, string, unknown>;
    edit_user: EditUserIntrf;
    is_processing: boolean;
    is_selected: boolean;
    iso_to_local: (isoString: string) => string;
    on_delete: UseMutationResult<void, Error, string, unknown>;
    on_select: (id: string) => void;
    set_edit_user: (field: "classname" | "email" | "role" | "username" | "created_at", value: string) => void;
    user: IMaster;
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

export type UserServiceIntrf = {
    classname?: string;
    setMessage?: React.Dispatch<React.SetStateAction<string | null>>;
}