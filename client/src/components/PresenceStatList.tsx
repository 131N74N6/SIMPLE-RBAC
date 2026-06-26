import type { IStudentPresenceList } from "../models/student-presence.model";
import Loading from "./Loading";
import PresenceStatItem from "./PresenceStatItem";

export default function PresenceStatList(props: IStudentPresenceList) {
    if (props.student_statuses.length === 0) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="text-orange-300 font-medium text-3xl">Data not found...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 overflow-y-auto px-2.5 pt-2.5">
            <div className="flex flex-col gap-2.5">
                {props.student_statuses.map(status => (
                    <PresenceStatItem
                        is_processing={props.is_processing}
                        is_selected={props.selected_id === status._id}
                        key={status._id}
                        on_delete={props.on_delete}
                        on_edit={props.on_edit}
                        on_select={props.on_select}
                        student_status={status}
                        set_edit_status={props.set_edit_status}
                        status={props.status}
                    />
                ))}
            </div>
            <div className="flex justify-center">
                {props.student_statuses.length <= 12 ? (
                    <></>
                ) : props.is_fetching_next_page ? (
                    <div className="flex justify-center"><Loading/></div>
                ) : props.has_next_page ? (
                    <button 
                        type="button" 
                        className="shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] cursor-pointer flex flex-col gap-2.5 text-black font-medium p-2.5 rounded-[10px] bg-white"
                        onClick={() => props.fetch_next_page()}
                    >
                        Load More
                    </button>
                ) : (
                    <div className="text-white text-center">No data to load...</div>
                )}
            </div>
        </div>
    );
}