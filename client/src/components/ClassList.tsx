import type { ClassListIntrf } from "../models/class.model";
import ClassItem from "./ClassItem";
import Loading from "./Loading";

export default function ClassList(props: ClassListIntrf) {
    if (props.class_data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <h2 className="text-2xl text-gray-500">No class found.</h2>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col gap-4 overflow-y-auto px-2.5 pt-2.5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {props.class_data.map((each_class) => (
                    <ClassItem 
                        class_detail={each_class}
                        classname={props.classname}
                        data_error={props.data_error}
                        is_processing={props.is_processing}
                        is_selected={each_class._id === props.selected_id}
                        key={`${each_class._id}`}
                        on_delete={props.on_delete}
                        on_edit={props.on_edit}
                        on_select={props.on_select}
                        set_data_error={props.set_data_error}
                        set_edit_classname={props.set_edit_classname}
                    />
                ))}
            </div>
            <div className="flex justify-center">
                {props.is_fetching_next_page ? (
                    <div className="flex justify-center"><Loading/></div>
                ) : props.class_data.length <= 12 ? (
                    <></>
                ) : props.has_next_page ? (
                    <button 
                        type="button" 
                        className="shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] cursor-pointer flex flex-col gap-2.5 text-black font-medium p-2.5 rounded-[10px] bg-white"
                        onClick={() => props.fetch_next_page()}
                    >
                        Load More
                    </button>
                ) : (
                    <div className="text-gray-500 text-center">No more class to load.</div>
                )}
            </div>
        </div>
    );
}