import { PencilIcon, Save, Trash, X } from "lucide-react";
import type { ClassItemIntrf } from "../models/class.model";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ClassItem(props: ClassItemIntrf) {
    const navigate = useNavigate();

    useEffect(() => {
        if (props.data_error) {
            const x = setTimeout(() => props.set_data_error(null), 3000);
            return () => clearTimeout(x);
        }
    }, [props.data_error]);

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
    
    const cancelEdit = () => props.on_select(props.class_detail._id);

    if (props.is_selected) {
        return (
            <form 
                onSubmit={saveChanges}
                className="font-mono shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] border border-black flex flex-col gap-2.5 text-black font-medium p-2.5 rounded-[10px] bg-white"
            >
                <div className="flex gap-2 items-center">
                    <label htmlFor="classname">Classname: </label>
                    <input 
                        type="text"
                        name="classname"
                        id="classname"
                        value={props.edit_classname}
                        onChange={(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => props.set_edit_classname(event.target.value)}
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
            <div>Created At: {new Date(props.class_detail.created_at).toLocaleString()}</div>
            <button type="button" className="text-left cursor-pointer" onClick={() => navigate(`/admin/class/${props.class_detail.classname}`)}>
                <div>Classname: {props.class_detail.classname}</div>
            </button>
            <div className="flex gap-3 justify-end">
                <button 
                    type="button"
                    disabled={props.is_processing}
                    className="bg-white border border-black rounded-[10px] p-1.5 hover:bg-red-500 hover:text-white transition-colors duration-300 disabled:cursor-not-allowed w-20 cursor-pointer flex justify-center"
                    onClick={() => props.on_delete.mutate(props.class_detail.classname)}
                >
                    <Trash/>
                </button>
                <button 
                    type="button"
                    disabled={props.is_processing}
                    className="bg-white border border-black rounded-[10px] p-1.5 hover:bg-red-500 hover:text-white transition-colors duration-300 disabled:cursor-not-allowed w-20 cursor-pointer flex justify-center"
                    onClick={handleSelect}
                >
                    <PencilIcon/>
                </button>
            </div>
        </div>
    );
}