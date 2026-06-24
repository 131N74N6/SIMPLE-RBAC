import type { PresencFormListIntrf } from "../models/presence.model";
import Loading from "./Loading";
import PresenceFormItem from "./PresenceFormItem";

export default function PresenceFormList(props: PresencFormListIntrf) {
    return (
        <div className="flex flex-col gap-4 overflow-y-auto px-2.5 pt-2.5">
            <div className="flex flex-col gap-2.5">
                {props.forms.map(form => {
                    const isExpired = new Date().toISOString() > form.deadline;

                    return (
                        <PresenceFormItem
                            currentUserId={props.currentUserId}
                            fillPresenceMt={props.fillPresenceMt}
                            form={form}
                            getData={props.getData}
                            isExpired={isExpired}
                            key={`${form._id}`}
                            setStudentStatus={props.setStudentStatus}
                            studentStatus={props.studentStatus}
                        />
                    )
                })}
            </div>
            <div className="flex justify-center">
                {props.forms.length <= 12 ? (
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
                    <div className="text-white text-center">No more presence to load.</div>
                )}
            </div>
        </div>
    )
}