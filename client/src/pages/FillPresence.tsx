import { useEffect, useState } from "react";
import PresenceServices from "../services/presence.service";
import StudentNavbar from "../components/StudentNavbar";
import Loading from "../components/Loading";
import PresenceFormList from "../components/PresenceFormList";

export default function FillPresence() {
    const [error, setError] = useState<string | null>(null);
    const [studentStatus, setStudentStatus] = useState<{ [key: string]: string }>({});
    
    useEffect(() =>{
        if (error) {
            const timer = setTimeout(() => setError(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [error, setError]);
    
    const { allAvailablePresenceForms, currentUserId, fillPresenceMt, getData } = PresenceServices({ setMessage: setError });

    return (
        <section className="flex md:flex-row flex-col h-screen relative z-10 font-mono">
            {error ? <div className="text-xl text-red-500 font-medium">{error}</div> : null}
            <div className="flex flex-col gap-3 h-full md:w-3/4 w-full bg-gray-800">
                <div className="text-2xl font-bold text-amber-400 px-2.5 pt-2.5">Available Class Presences</div>
                {allAvailablePresenceForms.isFetchingIsLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : allAvailablePresenceForms.availablePresenceError ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-gray-200 font-medium text-3xl">{allAvailablePresenceForms.availablePresenceError.message}</div>
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