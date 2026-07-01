import PresenceServices from "../services/presence.service";
import StudentNavbar from "../components/StudentNavbar";
import Loading from "../components/Loading";
import PresenceFormList from "../components/PresenceFormList";
import useError from "../hooks/useError";
import useSocketIo from "../hooks/useSocketIo";

export default function FillPresence() {
    const { error, setError } = useError();
    
    const { 
        allAvailablePresenceForms, 
        currentUserId, 
        currentClassName,
        fillPresenceMt, 
        getData, 
        studentStatus, 
        setStudentStatus 
    } = PresenceServices({ setMessage: setError });
    
    useSocketIo({
        user_id: currentUserId!,
        role: ["student"],
        identifier: currentClassName!
    });

    return (
        <section className="flex md:flex-row flex-col h-screen relative z-10 font-mono">
            {error ? <div className="text-xl text-red-500 font-medium">{error}</div> : null}
            <div className="flex flex-col gap-3 h-full md:w-3/4 w-full bg-gray-800">
                {allAvailablePresenceForms.isFetchingIsLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : allAvailablePresenceForms.availablePresenceError ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-amber-400 text-center font-medium text-3xl">{allAvailablePresenceForms.availablePresenceError.message}</div>
                    </div>
                ) : (
                    <PresenceFormList
                        currentUserId={currentUserId}
                        fetch_next_page={allAvailablePresenceForms.availablePresenceNextPage}
                        fillPresenceMt={fillPresenceMt}
                        forms={allAvailablePresenceForms.availableFlatennedData}
                        getData={getData}
                        has_next_page={allAvailablePresenceForms.availablePresenceHasNextPage}
                        is_fetching_next_page={allAvailablePresenceForms.availablePresenceIsFetchingNextPage}
                        setStudentStatus={setStudentStatus}
                        studentStatus={studentStatus}
                    />
                )}
            </div>
            {StudentNavbar(fillPresenceMt.isPending)}
        </section>
    );
}