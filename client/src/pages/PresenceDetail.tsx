import { useParams } from "react-router-dom";
import PresenceServices from "../services/presence.service";
import MasterNavbar from "../components/MasterNavbar";
import Loading from "../components/Loading";
import PresenceStatList from "../components/PresenceStatList";
import useError from "../hooks/useError";
import Notification from "../components/Notification";

export default function PresenceDetail() {
    const { _id } = useParams();
    const { error, setError } = useError();
    const { 
        allPresenceSlots,
        allAvailablePresenceForms,
        currentUserId,
        deleteAllPresencesMt, 
        deleteOnePresenceMt, 
        editPresenceForm,
        editPresenceFormMt,
        editPresenceStatusMt,
        editStudentStatus,
        fillPresenceMt,
        getData,
        handleSelectedFormId,
        handleSelectedPresenceStatusId,
        makeNewPresenceMt, 
        presenceDetails,
        presenceForm,
        selectedFormId,
        selectedPresenceStatusId,
        setEditPresenceForm,
        setEditStudentStatus,
        setStudentStatus,
        setPresenceForm,
        studentStatus
     } = PresenceServices({ form_id: _id, setMessage: setError });

    return (
        <section className="flex md:flex-row flex-col h-screen relative z-10 font-mono">
            {error ? <Notification message={error}/> : null}
            <div className="flex flex-col gap-3 h-full md:w-3/4 w-full bg-gray-900 p-2.5">
                {presenceDetails.presenceDetailIsLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : presenceDetails.presenceDetailError ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-amber-300 font-bold text-3xl">{presenceDetails.presenceDetailError.message}</div>
                    </div>
                ) : (
                    <PresenceStatList/>
                )}
            </div>
            {MasterNavbar(editPresenceStatusMt.isPending)}
        </section>
    );
}