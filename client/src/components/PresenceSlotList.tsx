import type { PresenceListIntrf } from "../models/presence-slot.model";
import Loading from "./Loading";
import PresenceItem from "./PresenceSlotItem";

export default function PresenceSlotList(props: PresenceListIntrf) {
    if (props.slots.length === 0) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="font-medium text-2xl text-blue-300">No presence form added...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2.5 overflow-y-auto">
            <div className="flex flex-col gap-2.5">
                {props.slots.map(slot => (
                    <PresenceItem
                        edit_form={props.edit_form}
                        is_selected={props.selected_id === slot._id}
                        is_processing={props.is_processing}
                        key={slot._id}
                        on_delete={props.on_delete}
                        on_edit={props.on_edit}
                        on_select={props.on_select}
                        set_edit_form={props.set_edit_form}
                        slot={slot}
                    />
                ))}
            </div>

            <div className="flex justify-center">
                {props.is_fetching_next_page ? (
                    <div className="flex justify-center">
                        <Loading/>
                    </div>
                ) : props.slots.length <= 12 ? (
                    <></>
                ) : props.has_next_page ? (
                    <button 
                        type="button"
                        onClick={() => props.fetch_next_page()}
                        disabled={props.is_processing}
                        className="font-medium cursor-pointer text-[12px] text-blue-400 hover:text-blue-300 transition-colors disabled:cursor-not-allowed"
                    >
                        <div>Load More</div>
                    </button>
                ) : (
                    <div className="flex justify-center">
                        <div className="font-medium text-[12px] text-blue-400">...</div>
                    </div>
                )}
            </div>
        </div>
    );
}