import { useEffect, useState } from 'react';
import MasterNavbar from '../components/MasterNavbar';
import PresenceServices from "../services/presence.service";

export default function Presences() {
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() =>{
        if (error) {
            const timer = setTimeout(() => setError(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [error, setError]);

    const { allPresenceSlots, deleteAllPresencesMt, deleteOnePresenceMt } = PresenceServices({ setMessage: setError });
    const isProcessing = allPresenceSlots.isLoading || deleteAllPresencesMt.isPending || deleteOnePresenceMt.isPending;

    console.log(allPresenceSlots);
    
    return (
        <section className="flex md:flex-row flex-col h-screen relative z-10 font-mono">
            <div className="flex flex-col gap-3 h-full md:w-3/4 w-full bg-white p-2.5">
                <div className='flex gap-2.5'>
                    <button 
                        type='button' 
                        onClick={() => deleteAllPresencesMt.mutate()} 
                        className='shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] w-[10%] cursor-pointer disabled:cursor-not-allowed font-medium p-1.5 text-base border border-black outline-0 font-mono text-black'
                    >
                        <span>Delete All</span>
                    </button>
                </div>
                {}
            </div>
            {MasterNavbar(isProcessing)}
        </section>
    );
}