export type UserInfoIntrf = {
    token: string;
    user_id: string;
    role: string;
}

export type SignInIntrf = {
    password: string;
    username: string;
}

export type AddUserIntrf = Omit<UserItemIntrf, "_id" | "created_at">;

export type UserItemIntrf = {
    _id: string;
    created_at: string;
    email: string;
    password: string;
    role: string;
    username: string;
}