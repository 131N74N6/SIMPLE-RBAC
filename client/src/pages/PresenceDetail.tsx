import { useParams } from "react-router-dom";
import PresenceServices from "../services/presence.service";
import MasterNavbar from "../components/MasterNavbar";
import Loading from "../components/Loading";
import PresenceStatList from "../components/PresenceStatList";
import useError from "../hooks/useError";
import Notification from "../components/Notification";
import { Trash2 } from "lucide-react";

export default function PresenceDetail() {
    const { _id } = useParams();
    const { error, setError } = useError();
    
    const { 
        deleteAllStatusesesMt,
        deleteOneStatusMt,
        editPresenceStatusMt,
        editStudentStatus,
        handleSelectedPresenceStatusId,
        presenceDetails,
        search,
        selectedPresenceStatusId,
        setEditStudentStatus,
        setSearch
    } = PresenceServices({ form_id: _id, setMessage: setError });

    return (
        <section className="flex md:flex-row flex-col h-screen relative z-10 font-mono">
            {error ? <Notification message={error}/> : null}
            <div className="flex flex-col gap-3 h-full md:w-3/4 w-full bg-gray-950 p-2.5">
                <div className="flex gap-1.5">
                    <input
                        type="text"
                        value={search}
                        disabled={editPresenceStatusMt.isPending || deleteAllStatusesesMt.isPending}
                        onChange={(event) => setSearch(event.target.value)}
                        className="text-violet-400 font-medium disabled:cursor-not-allowed border-violet-400 p-2 text-[14px] rounded-md outline-0"
                    />
                    <button
                        type="button"
                        disabled={editPresenceStatusMt.isPending || deleteAllStatusesesMt.isPending}
                        onClick={() => deleteAllStatusesesMt.mutate()}
                        className="text-violet-400 font-medium cursor-pointer hover:text-violet-300 transition-colors disabled:cursor-not-allowed"
                    >
                        <Trash2/>
                    </button>
                </div>
                {presenceDetails.presenceDetailIsLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : presenceDetails.presenceDetailError ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-amber-300 font-bold text-3xl">{presenceDetails.presenceDetailError.message}</div>
                    </div>
                ) : (
                    <PresenceStatList
                        fetch_next_page={presenceDetails.presenceDetailNextPage}
                        has_next_page={presenceDetails.presenceDetailHasNextage}
                        is_fetching_next_page={presenceDetails.presenceDetailIsFetchingNextPage}
                        is_processing={editPresenceStatusMt.isPending || deleteAllStatusesesMt.isPending}
                        on_delete={deleteOneStatusMt}
                        on_edit={editPresenceStatusMt}
                        on_select={handleSelectedPresenceStatusId}
                        selected_id={selectedPresenceStatusId}
                        set_edit_status={setEditStudentStatus}
                        status={editStudentStatus}
                        student_statuses={presenceDetails.presenceDetailData}
                    />
                )}
            </div>
            {MasterNavbar(editPresenceStatusMt.isPending || deleteAllStatusesesMt.isPending)}
        </section>
    );
}