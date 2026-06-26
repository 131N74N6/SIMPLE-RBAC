import PresenceServices from "../services/presence.service";
import MasterNavbar from "../components/MasterNavbar";
import useError from "../hooks/useError";

export default function MakePresence() {
    const { error, setError } = useError();

    const { makeNewPresenceMt, setEditPresenceForm, presenceForm } = PresenceServices({ setMessage: setError });

    const makeNewPresence = (event: React.SyntheticEvent) => {
        event.preventDefault();
        makeNewPresenceMt.mutate();
    }

    return (
        <div className="flex md:flex-row flex-col h-screen relative z-10 font-mono bg-gray-950">
            <form className="flex flex-col gap-3 h-full md:w-3/4 w-full p-2.5" onSubmit={makeNewPresence}>
                <label className="text-blue-300" htmlFor="classname">classname</label>
                <input 
                    type="text" 
                    placeholder="classname"
                    id="classname"
                    name="classname"
                    value={presenceForm.classname}
                    onChange={(event) => setEditPresenceForm("classname", event.target.value)}
                    className="w-full font-mono shadow-blue-300 shadow-[3px_3px_0px_0px] outline-0 border border-blue-300 flex flex-col gap-2.5 text-blue-300 font-medium p-2.5 rounded-[10px]"
                />
                <label className="text-blue-300" htmlFor="start_time">Start Time</label>
                <input 
                    type="datetime-local" 
                    placeholder="start_time"
                    id="start_time"
                    name="start_time"
                    value={presenceForm.start_time}
                    onChange={(event) => setEditPresenceForm("start_time", event.target.value)}
                    className="w-full font-mono shadow-blue-300 shadow-[3px_3px_0px_0px] outline-0 border border-blue-300 flex flex-col gap-2.5 text-blue-300 font-medium p-2.5 rounded-[10px]"
                />
                <label className="text-blue-300" htmlFor="deadline">Deadline</label>
                <input 
                    type="datetime-local" 
                    placeholder="deadline"
                    id="deadline"
                    name="deadline"
                    value={presenceForm.deadline}
                    onChange={(event) => setEditPresenceForm("deadline", event.target.value)}
                    className="w-full font-mono shadow-blue-300 shadow-[3px_3px_0px_0px] outline-0 border border-blue-300 flex flex-col gap-2.5 text-blue-300 font-medium p-2.5 rounded-[10px]"
                />
                <div>
                    <button 
                        type="submit"
                        disabled={makeNewPresenceMt.isPending}
                        className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white font-medium font-mono py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Add Presence
                    </button>
                </div>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>
            {MasterNavbar(makeNewPresenceMt.isPending)}
        </div>
    );
}