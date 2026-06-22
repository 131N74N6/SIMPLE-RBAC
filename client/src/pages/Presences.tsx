import { useEffect } from 'react';
import MasterNavbar from '../components/MasterNavbar';
import PresenceServices from "../services/presence.service";

export default function Presences() {
    const { 
        allPresencesData, 
        deleteAllPresencesMt,
        deleteOnePresenceMt,
        presenceError,
        setPresenceError
    } = PresenceServices();

    console.log(allPresencesData);

    useEffect(() => {
        if (presenceError) {
            const x = setTimeout(() => setPresenceError(null), 2000);
            return () => clearTimeout(x);
        }
    }, [presenceError]);
    
    return (
        <section className="flex md:flex-row flex-col h-screen relative z-10 font-mono">
            <div className="flex flex-col gap-3 h-full md:w-3/4 w-full bg-white p-2.5">
                //
            </div>
            {MasterNavbar(allPresencesData.isLoading || deleteAllPresencesMt.isPending || deleteOnePresenceMt.isPending)}
        </section>
    );
}
