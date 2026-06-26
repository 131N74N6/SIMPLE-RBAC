import { Pen, Save, Trash, X } from "lucide-react";
import type { IStudentPresenceItem } from "../models/student-presence.model";

export default function PresenceStatItem(props: IStudentPresenceItem) {
    const handleSelect = () => {
        props.on_select(props.student_status._id)
        const selected = !props.is_selected;

        if (selected) {
            props.set_edit_status(props.student_status.presence_slot_id, props.student_status.status);
        } else {
            props.set_edit_status(props.student_status.presence_slot_id, "");
        }
    }

    const saveEdit = (event: React.SyntheticEvent) => {
        event.preventDefault();
        props.on_edit.mutate(props.student_status._id);
    }

    if (props.is_selected) {
        return (
            <div className="bg-gray-800 text-violet-300 font-medium flex flex-col gap-2 font-mono p-2 rounded-md border border-violet-300">
                <select 
                    disabled={props.is_processing}
                    value={props.status[props.student_status.presence_slot_id]}
                    onChange={(event: React.ChangeEvent<HTMLSelectElement, HTMLSelectElement>) => props.set_edit_status(props.student_status.presence_slot_id, event.target.value)}
                    className="bg-gray-800 text-violet-300 border border-gray-600 p-2 rounded outline-none"
                >
                    <option value="">-- Choose Status --</option>
                    <option value="Present">Present</option> 
                    <option value="Excused">Excused</option>
                    <option value="Unexcused">Unexcused</option>
                    <option value="Sick">Sick</option>
                </select>

                <button
                    type="submit"
                    disabled={props.is_processing}
                    onClick={saveEdit}
                    className="text-orange-300 font-medium text-lg cursor-pointer hover:text-orange-200 transition-colors disabled:cursor-not-allowed"
                >
                    <Save/>
                </button>

                <button
                    type="submit"
                    disabled={props.is_processing}
                    onClick={() => props.on_select(props.student_status._id)}
                    className="text-blue-300 font-medium text-lg cursor-pointer hover:text-blue-200 transition-colors disabled:cursor-not-allowed"
                >
                    <X/>
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 text-violet-300 font-medium flex flex-col gap-2 font-mono p-2 rounded-md border border-violet-300">
            <div>{props.student_status.student_name}</div>
            <div>{props.student_status.classname}</div>
            <div>{props.student_status.status}</div>
            <div>{new Date(props.student_status.filled_at).toLocaleString()}</div>
            <div>{props.student_status.presence_creator}</div>
            <div className="flex gap-2.5">
                <button
                    type="button"
                    disabled={props.is_processing}
                    onClick={() => props.on_delete.mutate(props.student_status._id)}
                    className="text-orange-300 font-medium text-lg cursor-pointer hover:text-orange-200 transition-colors disabled:cursor-not-allowed"
                >
                    <Trash/>
                </button>
                <button
                    type="button"
                    disabled={props.is_processing}
                    onClick={handleSelect}
                    className="text-blue-300 font-medium text-lg cursor-pointer hover:text-blue-200 transition-colors disabled:cursor-not-allowed"
                >
                    <Pen/>
                </button>
            </div>
        </div>
    );
}