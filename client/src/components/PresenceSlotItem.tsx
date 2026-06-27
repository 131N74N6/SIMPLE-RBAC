import { Eye, Pen, Save, Trash, X } from "lucide-react";
import type { PresenceItemIntrf } from "../models/presence-slot.model";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function PresenceSlotItem(props: PresenceItemIntrf) {
    const navigate = useNavigate();

    const isoToLocalDateTime = (isoString: string): string => {
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    useEffect(() => {
        if (props.is_selected) {
            props.set_edit_form("classname", props.slot.classname);
            props.set_edit_form("deadline", isoToLocalDateTime(props.slot.deadline));
            props.set_edit_form("start_time", isoToLocalDateTime(props.slot.start_time));
        } else {
            props.set_edit_form("classname", "");
            props.set_edit_form("deadline", "");
            props.set_edit_form("start_time", "");
        }
    }, [props.is_selected, props.slot._id]);

    const editPresenceForm = (event: React.SyntheticEvent) => {
        event.preventDefault();
        props.on_edit.mutate(props.slot._id);
    }

    if (props.is_selected) {
        return (
            <form className="bg-gray-800 font-mono border-blue-300 flex flex-col gap-2.5 p-2.5 rounded-[10px]" onSubmit={editPresenceForm}>
                <label className="text-blue-300" htmlFor="classname">classname</label>
                <input 
                    type="text" 
                    placeholder="classname"
                    id="classname"
                    name="classname"
                    value={props.edit_form.classname}
                    onChange={(event) => props.set_edit_form("classname", event.target.value)}
                    className="w-full font-mono shadow-[3px_3px_0px_0px] shadow-blue-300 outline-0 border border-blue-300 flex flex-col gap-2.5 text-blue-300 font-medium p-2.5 rounded-[10px]"
                />
                <label className="text-blue-300" htmlFor="start_time">Start Time</label>
                <input 
                    type="datetime-local" 
                    placeholder="start_time"
                    id="start_time"
                    name="start_time"
                    value={props.edit_form.start_time}
                    onChange={(event) => props.set_edit_form("start_time", event.target.value)}
                    className="w-full font-mono shadow-[3px_3px_0px_0px] shadow-blue-300 outline-0 border border-blue-300 flex flex-col gap-2.5 text-blue-300 font-medium p-2.5 rounded-[10px]"
                />
                <label className="text-blue-300" htmlFor="deadline">Deadline</label>
                <input 
                    type="datetime-local" 
                    placeholder="deadline"
                    id="deadline"
                    name="deadline"
                    value={props.edit_form.deadline}
                    onChange={(event) => props.set_edit_form("deadline", event.target.value)}
                    className="w-full font-mono shadow-[3px_3px_0px_0px] shadow-blue-300 outline-0 border border-blue-300 flex flex-col gap-2.5 text-blue-300 font-medium p-2.5 rounded-[10px]"
                />
                <div className="flex gap-3">
                    <button 
                        type="submit"
                        disabled={props.on_edit.isPending}
                        className="text-blue-300 cursor-pointer font-medium font-mono rounded hover:text-blue-200 transition-colors disabled:cursor-not-allowed"
                    >
                        <Save/>
                    </button>
                    <button 
                        type="button"
                        onClick={() => props.on_select(props.slot._id)}
                        disabled={props.on_edit.isPending}
                        className="text-blue-300 cursor-pointer font-medium font-mono rounded hover:text-blue-200 transition-colors disabled:cursor-not-allowed"
                    >
                        <X/>
                    </button>
                </div>
            </form>
        );
    }

    return (
        <div className="bg-gray-800 font-mono border-blue-300 flex flex-col gap-2.5 p-2.5 rounded-[10px]">
            <div className="font-medium text-blue-300">Class: {props.slot.classname}</div>
            <div className="text-blue-300">Created At: {new Date(props.slot.created_at).toLocaleString()}</div>
            <div className="text-blue-300">Start Time: {new Date(props.slot.start_time).toLocaleString()}</div>
            <div className="text-blue-300">Deadline: {new Date(props.slot.deadline).toLocaleString()}</div>
            <div className="flex gap-3">
                <button 
                    type="button"
                    onClick={() => props.on_select(props.slot._id)}
                    className="font-medium cursor-pointer text-[12px] text-blue-400 hover:text-blue-300 transition-colors disabled:cursor-not-allowed"
                >
                    <Pen/>
                </button>
                <button 
                    type="button"
                    onClick={() => props.on_delete.mutate(props.slot._id)}
                    className="font-medium cursor-pointer text-[12px] text-blue-400 hover:text-blue-300 transition-colors disabled:cursor-not-allowed"
                >
                    <Trash/>
                </button>
                <button 
                    type="button"
                    onClick={() => navigate(`/status-detail/${props.slot._id}`)}
                    className="font-medium cursor-pointer text-[12px] text-blue-400 hover:text-blue-300 transition-colors disabled:cursor-not-allowed"
                >
                    <Eye/>
                </button>
            </div>
        </div>
    );
}