import { PencilIcon, Save, Trash, X } from "lucide-react";
import type { ClassItemIntrf } from "../models/class.model";
import { useNavigate } from "react-router-dom";

export default function ClassItem(props: ClassItemIntrf) {
    const navigate = useNavigate();

    const handleSelect = () => {
        const isSelected = !props.is_selected;
        props.on_select(props.class_detail._id);
        
        if (isSelected) {
            props.set_edit_classname(props.class_detail.classname);
        } else {
            props.set_edit_classname("");
        }
    };
    
    const saveChanges = (event: React.SyntheticEvent) => {
        event.preventDefault();
        props.on_edit.mutate(props.class_detail._id);
    }

    if (props.is_selected) {
        return (
            <form 
                onSubmit={saveChanges}
                className="font-mono shadow-[6px_6px_0px_0px] shadow-cyan-300 border border-cyan-300 flex flex-col gap-2.5 text-cyan-300 font-medium p-2.5 rounded-[10px]"
            >
                <div className="flex gap-2 items-center">
                    <label htmlFor="classname">Classname: </label>
                    <input 
                        type="text"
                        name="classname"
                        id="classname"
                        value={props.edit_classname}
                        onChange={(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => props.set_edit_classname(event.target.value)}
                        className="w-full font-mono shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] outline-0 border border-cyan-300 flex flex-col gap-2.5 text-cyan-300 font-medium p-2.5 rounded-[10px]"
                    />
                </div>
                <div className="flex gap-2 justify-end">
                    <button 
                        type="submit"
                        disabled={props.is_processing}
                        className="text-cyan-300 hover:text-cyan-400 transition-colors duration-300 disabled:cursor-not-allowed cursor-pointer flex justify-center"
                    >
                        <Save/>
                    </button>
                    <button 
                        type="button"
                        onClick={() => props.on_select(props.class_detail._id)}
                        disabled={props.is_processing}
                        className="text-cyan-300 hover:text-cyan-400 transition-colors duration-300 disabled:cursor-not-allowed cursor-pointer flex justify-center"
                    >
                        <X/>
                    </button>
                </div>
            </form>
        );
    }

    return (
        <div className="font-mono shadow-[6px_6px_0px_0px] shadow-cyan-300 border border-cyan-300 flex flex-col gap-2.5 text-cyan-300 font-medium p-2.5 rounded-[10px]">
            <div>Created At: {new Date(props.class_detail.created_at).toLocaleString()}</div>
            <button type="button" className="text-left cursor-pointer" onClick={() => navigate(`/admin/class/${props.class_detail.classname}`)}>
                <div>Classname: {props.class_detail.classname}</div>
            </button>
            <div className="flex gap-2 justify-end">
                <button 
                    type="button"
                    disabled={props.is_processing}
                    className="hover:text-cyan-400 text-cyan-300 transition-colors duration-300 disabled:cursor-not-allowed cursor-pointer flex justify-center"
                    onClick={() => props.on_delete.mutate(props.class_detail.classname)}
                >
                    <Trash/>
                </button>
                <button 
                    type="button"
                    disabled={props.is_processing}
                    className="hover:text-cyan-400 text-cyan-300 transition-colors duration-300 disabled:cursor-not-allowed cursor-pointer flex justify-center"
                    onClick={handleSelect}
                >
                    <PencilIcon/>
                </button>
            </div>
        </div>
    );
}