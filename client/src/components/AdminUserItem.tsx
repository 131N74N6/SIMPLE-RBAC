import { PencilIcon, Trash } from "lucide-react";
import type { UserItemIntrf } from "../models/user-model";

export default function AdminUserItem(props: UserItemIntrf) {
    return (
        <div className="font-mono shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] border border-black flex flex-col gap-2.5 text-black font-medium p-2.5 rounded-[10px] bg-white">
            <div>Created At: {props.created_at}</div>
            <div>Username: {props.username}</div>
            <div>Email: {props.email}</div>
            <div>Role: {props.role}</div>
            <div className="flex gap-3 justify-end">
                <button 
                    type="button"
                    className="bg-white border border-black rounded-[10px] p-1.5 hover:bg-red-500 hover:text-white transition-colors duration-300"
                    onClick={() => props.on_delete.mutate(props._id)}
                >
                    <Trash/>
                </button>
                <button 
                    type="button"
                    className="bg-white border border-black rounded-[10px] p-1.5 hover:bg-red-500 hover:text-white transition-colors duration-300"
                >
                    <PencilIcon/>
                </button>
            </div>
        </div>
    );
}