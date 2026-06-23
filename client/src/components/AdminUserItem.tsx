import { PencilIcon, Save, Trash, X } from "lucide-react";
import type { UserItemIntrf } from "../models/user.model";
import { useEffect } from "react";

export default function AdminUserItem(props: UserItemIntrf) {
    useEffect(() => {
        if (props.data_error) {
            const x = setTimeout(() => props.set_data_error(null), 3000);
            return () => clearTimeout(x);
        }
    }, [props.data_error]);
    
    useEffect(() => {
        if (props.is_selected) {
            props.set_edit_user("created_at", props.iso_to_local(props.user.created_at));
            props.set_edit_user("email", props.user.email);
            props.set_edit_user("role", props.user.role);
            props.set_edit_user("username", props.user.username);
        } else {
            props.set_edit_user("created_at", "");
            props.set_edit_user("email", "");
            props.set_edit_user("role", "");
            props.set_edit_user("username", "");
        }
    }, [props.is_selected, props.user._id, props.user]);
    
    function saveChanges(event: React.SyntheticEvent) {
        event.preventDefault();
        props.change_user_data_mt.mutate(props.user._id);
    }
    
    const cancelEdit = () => props.on_select(props.user._id);

    if (props.is_selected) {
        return (
            <form 
                onSubmit={saveChanges}
                className="font-mono shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] border border-black flex flex-col gap-2.5 text-black font-medium p-2.5 rounded-[10px] bg-white"
            >
                <div className="flex gap-2 items-center">
                    <label htmlFor="created_at">Created at: </label>
                    <input 
                        type="datetime-local"
                        name="created_at"
                        id="created_at"
                        value={props.edit_user.created_at}
                        onChange={(event) => props.set_edit_user("created_at", event.target.value)}
                        className="w-full font-mono shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] outline-0 border border-black flex flex-col gap-2.5 text-black font-medium p-2.5 rounded-[10px] bg-white"
                    />
                </div>
                <div className="flex gap-2 items-center">
                    <label htmlFor="email">Email: </label>
                    <input 
                        type="text"
                        name="email"
                        id="email"
                        value={props.edit_user.email}
                        onChange={(event) => props.set_edit_user("email", event.target.value)}
                        className="w-full font-mono shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] outline-0 border border-black flex flex-col gap-2.5 text-black font-medium p-2.5 rounded-[10px] bg-white"
                    />
                </div>
                <div className="flex gap-2 items-center">
                    <label htmlFor="role">Role: </label>
                    <input 
                        type="text"
                        name="role"
                        id="role"
                        value={props.edit_user.role}
                        onChange={(event) => props.set_edit_user("role", event.target.value)}
                        className="w-full font-mono shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] border outline-0 border-black flex flex-col gap-2.5 text-black font-medium p-2.5 rounded-[10px] bg-white"
                    />
                </div>
                <div className="flex gap-2 items-center">
                    <label htmlFor="username">Username: </label>
                    <input 
                        type="text"
                        name="username"
                        id="username"
                        value={props.edit_user.username}
                        onChange={(event) => props.set_edit_user("username", event.target.value)}
                        className="w-full font-mono shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] outline-0 border border-black flex flex-col gap-2.5 text-black font-medium p-2.5 rounded-[10px] bg-white"
                    />
                </div>
                <div className="flex gap-3 justify-end">
                    <button 
                        type="submit"
                        disabled={props.is_processing}
                        className="bg-white border border-black rounded-[10px] p-1.5 hover:bg-red-500 hover:text-white transition-colors duration-300 disabled:cursor-not-allowed w-20 cursor-pointer flex justify-center"
                    >
                        <Save/>
                    </button>
                    <button 
                        type="button"
                        onClick={cancelEdit}
                        disabled={props.is_processing}
                        className="bg-white border border-black rounded-[10px] p-1.5 hover:bg-red-500 hover:text-white transition-colors duration-300 disabled:cursor-not-allowed w-20 cursor-pointer flex justify-center"
                    >
                        <X/>
                    </button>
                </div>
                {props.data_error ? <div className="text-center text-red-500 font-medium">{props.data_error}</div> : null}
            </form>
        );
    }

    return (
        <div className="font-mono shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] border border-black flex flex-col gap-2.5 text-black font-medium p-2.5 rounded-[10px] bg-white">
            {props.user.classname && props.user.classname !== "-" ? (
                <div>Class: {props.user.classname}</div>
            ) : null}
            <div>Created At: {props.user.created_at}</div>
            <div>Email: {props.user.email}</div>
            <div>Role: {props.user.role}</div>
            <div>Username: {props.user.username}</div>
            <div className="flex gap-3 justify-end">
                <button 
                    type="button"
                    disabled={props.is_processing}
                    className="bg-white border border-black rounded-[10px] p-1.5 hover:bg-red-500 hover:text-white transition-colors duration-300 disabled:cursor-not-allowed w-20 cursor-pointer flex justify-center"
                    onClick={() => props.on_delete.mutate(props.user._id)}
                >
                    <Trash/>
                </button>
                <button 
                    type="button"
                    disabled={props.is_processing}
                    className="bg-white border border-black rounded-[10px] p-1.5 hover:bg-red-500 hover:text-white transition-colors duration-300 disabled:cursor-not-allowed w-20 cursor-pointer flex justify-center"
                    onClick={() => props.on_select(props.user._id)}
                >
                    <PencilIcon/>
                </button>
            </div>
        </div>
    );
}