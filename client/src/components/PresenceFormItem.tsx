import type { PresenceStatusIntrf, PresencFormItemIntrf } from "../models/presence-slot.model";
import Loading from "./Loading";

export default function PresenceFormItem(props: PresencFormItemIntrf) {
    const { data, isLoading, error } = props.getData<PresenceStatusIntrf>({
        api_url: `${import.meta.env.VITE_BASE_API_URL}/student-presences/is-filled/${props.form._id}`,
        enabled: !!props.form._id && !!props.currentUserId,
        query_key: [`is-filled-${props.currentUserId}-${props.form._id}`],
        stale_time: Infinity
    });

    return (
        <div className="p-4 border border-gray-600 rounded-lg bg-gray-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h3 className="font-semibold text-lg text-blue-400">{props.form.classname}</h3>
                <p className="text-sm text-gray-400">Opened: {new Date(props.form.start_time).toLocaleString()}</p>
                <p className="text-sm text-red-400 font-medium">Deadline: {new Date(props.form.deadline).toLocaleString()}</p>
            </div>

            <div className="flex items-center gap-3">
                {isLoading ? (
                    <div className="flex justify-center items-center">
                        <Loading/>
                    </div>
                ) : data ? (
                    data.status ? (
                        <div className="text-blue-400">{data.status}</div>
                    ) : (
                        <>
                            <select 
                                disabled={props.isExpired || props.fillPresenceMt.isPending}
                                value={props.studentStatus[props.form._id] || ""}
                                onChange={(event: React.ChangeEvent<HTMLSelectElement, HTMLSelectElement>) => props.setStudentStatus(props.form._id, event.target.value)}
                                className="bg-gray-800 text-white border border-gray-600 p-2 rounded outline-none"
                            >
                                <option value="">-- Choose Status --</option>
                                <option value="Present">Present</option> 
                                <option value="Excused">Excused</option>
                                <option value="Unexcused">Unexcused</option>
                                <option value="Sick">Sick</option>
                            </select>

                            <button
                                type="submit"
                                disabled={props.isExpired || !props.studentStatus[props.form._id] || props.fillPresenceMt.isPending}
                                onClick={() => props.fillPresenceMt.mutate({
                                    creator_name: props.form.creator_name,
                                    presence_slot_id: props.form._id,
                                    status: props.studentStatus[props.form._id]
                                })}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded text-sm font-semibold transition-colors text-white cursor-pointer"
                            >
                                {props.isExpired ? "Closed" : "Submit Absent"}
                            </button>
                        </>
                    )
                ) : error ? (
                    <div className="flex justify-center items-center">
                        <div className="text-white font-medium text-base">{error.message}</div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}