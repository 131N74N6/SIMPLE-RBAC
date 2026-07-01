import { PencilIcon, Save, Trash, X } from "lucide-react";
import type { IStudentItem } from "../models/user.model";

export default function StudentItem(props: IStudentItem) {
    const handleSelect = () => {
        const isSelected = !props.is_selected;
        props.on_select(props.user._id);
        
        if (isSelected) {
            props.set_edit_user("classname", props.user.classname!);
            props.set_edit_user("created_at", props.iso_to_local(props.user.created_at));
            props.set_edit_user("email", props.user.email);
            props.set_edit_user("role", props.user.role);
            props.set_edit_user("username", props.user.username);
        } else {
            props.set_edit_user("classname", "");
            props.set_edit_user("created_at", "");
            props.set_edit_user("email", "");
            props.set_edit_user("role", "");
            props.set_edit_user("username", "");
        }
    }
    
    const saveChanges = (event: React.SyntheticEvent) => {
        event.preventDefault();
        props.change_user_data_mt.mutate(props.user._id);
    }

    if (props.is_selected) {
        return (
            <form 
                onSubmit={saveChanges}
                className="bg-gray-800 font-mono shadow-[6px_6px_0px_0px] shadow-violet-300 border border-violet-300 flex flex-col gap-2.5 text-violet-300 font-medium p-2.5 rounded-[10px]"
            >
                <div className="flex gap-2 items-center">
                    <label htmlFor="classname">Classname: </label>
                    <input 
                        type="text"
                        name="classname"
                        id="classname"
                        value={props.edit_user.classname}
                        onChange={(event) => props.set_edit_user("classname", event.target.value)}
                        className="w-full font-mono shadow-[3px_3px_0px_0px] shadow-violet-300 outline-0 border border-violet-300 flex flex-col gap-2.5 text-violet-300 font-medium p-2.5 rounded-[10px]"
                    />
                </div>
                <div className="flex gap-2 items-center">
                    <label htmlFor="created_at">Created at: </label>
                    <input 
                        type="datetime-local"
                        name="created_at"
                        id="created_at"
                        value={props.edit_user.created_at}
                        onChange={(event) => props.set_edit_user("created_at", event.target.value)}
                        className="w-full font-mono shadow-[3px_3px_0px_0px] shadow-violet-300 outline-0 border border-violet-300 flex flex-col gap-2.5 text-violet-300 font-medium p-2.5 rounded-[10px]"
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
                        className="w-full font-mono shadow-[3px_3px_0px_0px] shadow-violet-300 outline-0 border border-violet-300 flex flex-col gap-2.5 text-violet-300 font-medium p-2.5 rounded-[10px]"
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
                        className="w-full font-mono shadow-[3px_3px_0px_0px] shadow-violet-300 border outline-0 border-violet-300 flex flex-col gap-2.5 text-violet-300 font-medium p-2.5 rounded-[10px]"
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
                        className="w-full font-mono shadow-[3px_3px_0px_0px] shadow-violet-300 outline-0 border border-violet-300 flex flex-col gap-2.5 text-violet-300 font-medium p-2.5 rounded-[10px] "
                    />
                </div>
                <div className="flex gap-2 justify-end">
                    <button 
                        type="submit"
                        disabled={props.is_processing}
                        className=" hover:text-red-300 text-red-400 transition-colors duration-300 disabled:cursor-not-allowed cursor-pointer flex justify-center"
                    >
                        <Save/>
                    </button>
                    <button 
                        type="button"
                        onClick={() => props.on_select(props.user._id)}
                        disabled={props.is_processing}
                        className=" hover:text-blue-300 text-blue-400 transition-colors duration-300 disabled:cursor-not-allowed cursor-pointer flex justify-center"
                    >
                        <X/>
                    </button>
                </div>
            </form>
        );
    }

    return (
        <div className="bg-gray-800 font-mono shadow-[6px_6px_0px_0px] shadow-violet-300 border border-violet-300 flex flex-col gap-2.5 text-violet-300 font-medium p-2.5 rounded-[10px] ">
            <div>Created At: {new Date(props.user.created_at).toLocaleString()}</div>
            <div>Email: {props.user.email}</div>
            <div>Role: {props.user.role}</div>
            <div>Username: {props.user.username}</div>
            <div className="flex gap-2 justify-end">
                <button 
                    type="button"
                    disabled={props.is_processing}
                    className="text-red-400 p-1.5 hover:text-red-300 transition-colors duration-300 disabled:cursor-not-allowed cursor-pointer flex justify-center"
                    onClick={() => props.on_delete.mutate(props.user._id)}
                >
                    <Trash/>
                </button>
                <button 
                    type="button"
                    disabled={props.is_processing}
                    className="text-blue-400 p-1.5 hover:text-blue-300 transition-colors duration-300 disabled:cursor-not-allowed cursor-pointer flex justify-center"
                    onClick={handleSelect}
                >
                    <PencilIcon/>
                </button>
            </div>
        </div>
    );
}