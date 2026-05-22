import { Trash } from "lucide-react";
import type { UserItemIntrf } from "../models/user-model";

export default function AdminUserItem(props: UserItemIntrf) {
    return (
        <div className="shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] flex flex-col gap-2.5 text-black font-medium p-2.5 rounded-[10px] bg-white">
            <div>Created At: {props.created_at}</div>
            <div>Username: {props.username}</div>
            <div>Email: {props.email}</div>
            <div>Role: {props.role}</div>
            <div>
                <button><Trash/></button>
            </div>
        </div>
    );
}