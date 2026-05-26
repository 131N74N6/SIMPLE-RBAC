import { PencilIcon, Save, Trash, X } from "lucide-react";
import type { UserItemIntrf } from "../models/user-model";
import { useEffect } from "react";
import UserServices from "../services/user.service";
import AuthServices from "../services/auth.service";

export default function AdminUserItem(props: UserItemIntrf) {
    const { changeUserDataMt, dataError, editUser, isProcessing, setDataError, setEditUser, isoToLocalDateTime } = UserServices();
    const { currentUserId } = AuthServices();
    
    useEffect(() => {
        if (dataError) {
            const x = setTimeout(() => setDataError(null), 3000);
            return () => clearTimeout(x);
        }
    }, [dataError]);
    
    useEffect(() => {
        if (props.is_selected) {
            setEditUser({ created_at: isoToLocalDateTime(props.created_at), email: props.email, role: props.role, username: props.username });
        } else {
            setEditUser({ created_at: '', email: '', role: '', username: '' });
        }
    }, [props.is_selected, props._id]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
    
    function saveChanges(event: React.SyntheticEvent) {
        event.preventDefault();
        changeUserDataMt.mutate(props._id, {
            onSuccess: () => props.on_select(props._id)
        });
    }
    
    const cancelEdit = () => props.on_select(props._id);

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
                        value={editUser.created_at}
                        onChange={handleInputChange}
                        className="w-full font-mono shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] outline-0 border border-black flex flex-col gap-2.5 text-black font-medium p-2.5 rounded-[10px] bg-white"
                    />
                </div>
                <div className="flex gap-2 items-center">
                    <label htmlFor="email">Email: </label>
                    <input 
                        type="text"
                        name="email"
                        id="email"
                        value={editUser.email}
                        onChange={handleInputChange}
                        className="w-full font-mono shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] outline-0 border border-black flex flex-col gap-2.5 text-black font-medium p-2.5 rounded-[10px] bg-white"
                    />
                </div>
                <div className="flex gap-2 items-center">
                    <label htmlFor="role">Role: </label>
                    <input 
                        type="text"
                        name="role"
                        id="role"
                        value={editUser.role}
                        onChange={handleInputChange}
                        className="w-full font-mono shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] border outline-0 border-black flex flex-col gap-2.5 text-black font-medium p-2.5 rounded-[10px] bg-white"
                    />
                </div>
                <div className="flex gap-2 items-center">
                    <label htmlFor="username">Username: </label>
                    <input 
                        type="text"
                        name="username"
                        id="username"
                        value={editUser.username}
                        onChange={handleInputChange}
                        className="w-full font-mono shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] outline-0 border border-black flex flex-col gap-2.5 text-black font-medium p-2.5 rounded-[10px] bg-white"
                    />
                </div>
                <div className="flex gap-3 justify-end">
                    <button 
                        type="submit"
                        disabled={isProcessing}
                        className="bg-white border border-black rounded-[10px] p-1.5 hover:bg-red-500 hover:text-white transition-colors duration-300 disabled:cursor-not-allowed w-20 cursor-pointer flex justify-center"
                    >
                        <Save/>
                    </button>
                    <button 
                        type="button"
                        onClick={cancelEdit}
                        disabled={isProcessing}
                        className="bg-white border border-black rounded-[10px] p-1.5 hover:bg-red-500 hover:text-white transition-colors duration-300 disabled:cursor-not-allowed w-20 cursor-pointer flex justify-center"
                    >
                        <X/>
                    </button>
                </div>
                {dataError ? <div className="text-center text-red-500 font-medium">{dataError}</div> : null}
            </form>
        );
    }

    return (
        <div className="font-mono shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] border border-black flex flex-col gap-2.5 text-black font-medium p-2.5 rounded-[10px] bg-white">
            <div>Created At: {props.created_at}</div>
            <div>Email: {props.email}</div>
            <div>Role: {props.role}</div>
            <div>Username: {props.username}</div>
            <div className="flex gap-3 justify-end">
                {props._id !== currentUserId && props.role === "user" ? (
                    <button 
                        type="button"
                        disabled={isProcessing}
                        className="bg-white border border-black rounded-[10px] p-1.5 hover:bg-red-500 hover:text-white transition-colors duration-300 disabled:cursor-not-allowed w-20 cursor-pointer flex justify-center"
                        onClick={() => props.on_delete.mutate(props._id)}
                    >
                        <Trash/>
                    </button>
                ) : null}
                <button 
                    type="button"
                    disabled={isProcessing}
                    className="bg-white border border-black rounded-[10px] p-1.5 hover:bg-red-500 hover:text-white transition-colors duration-300 disabled:cursor-not-allowed w-20 cursor-pointer flex justify-center"
                    onClick={() => props.on_select(props._id)}
                >
                    <PencilIcon/>
                </button>
            </div>
        </div>
    );
}