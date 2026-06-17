import { useEffect } from "react";
import PresenceServices from "../services/presence.service";
import MasterNavbar from "../components/MasterNavbar";

export default function MakePresence() {
    const { 
        makeNewPresenceMt, 
        handleInputChange,
        presence,
        presenceError,
        setPresenceError
    } = PresenceServices();

    useEffect(() => {
        if (presenceError) {
            const x = setTimeout(() => setPresenceError(null), 2000);
            return () => clearTimeout(x);
        }
    }, [presenceError]);

    const makeNewPresence = (event: React.SyntheticEvent) => {
        event.preventDefault();
        makeNewPresenceMt.mutate();
    }

    return (
        <div className="flex md:flex-row flex-col h-screen relative z-10 font-mono">
            <form className="flex flex-col gap-3 h-full md:w-3/4 w-full bg-white p-2.5" onSubmit={makeNewPresence}>
                <label htmlFor="classname">classname</label>
                <input 
                    type="text" 
                    placeholder="classname"
                    id="classname"
                    name="classname"
                    value={presence.classname}
                    onChange={handleInputChange}
                    className="w-full font-mono shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] outline-0 border border-black flex flex-col gap-2.5 text-black font-medium p-2.5 rounded-[10px] bg-white"
                />
                <label htmlFor="start_time">Start Time</label>
                <input 
                    type="datetime-local" 
                    placeholder="start_time"
                    id="start_time"
                    name="start_time"
                    value={presence.start_time}
                    onChange={handleInputChange}
                    className="w-full font-mono shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] outline-0 border border-black flex flex-col gap-2.5 text-black font-medium p-2.5 rounded-[10px] bg-white"
                />
                <label htmlFor="deadline">Deadline</label>
                <input 
                    type="datetime-local" 
                    placeholder="deadline"
                    id="deadline"
                    name="deadline"
                    value={presence.deadline}
                    onChange={handleInputChange}
                    className="w-full font-mono shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] outline-0 border border-black flex flex-col gap-2.5 text-black font-medium p-2.5 rounded-[10px] bg-white"
                />
                <div>
                    <button 
                        type="submit"
                        disabled={makeNewPresenceMt.isPending}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium font-mono py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Add Presence
                    </button>
                </div>
                {presenceError && <p className="text-red-500 mt-2">{presenceError}</p>}
            </form>
            {MasterNavbar(makeNewPresenceMt.isPending)}
        </div>
    );
}