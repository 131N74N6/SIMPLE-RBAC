import PresenceServices from "../services/presence.service";
import Loading from '../components/Loading';
import useError from '../hooks/useError';
import PresenceSlotList from '../components/PresenceSlotList';
import AdminNavbar from '../components/AdminNavbar';
import { Trash2 } from "lucide-react";
import useSocketIo from "../hooks/useSocketIo";

export default function PresenceForAdmin() {
  const { error, setError } = useError();
  
    const { 
        allPresencesForAdmin, 
        currentUserId,
        deleteAllPresencesForAdminMt, 
        deleteOnePresenceMt, 
        editPresenceForm,
        editPresenceFormMt,
        handleSelectedFormId,
        isProcessing,
        search,
        selectedFormId,
        setEditPresenceForm,
        setSearch
    } = PresenceServices({ setMessage: setError });
    
    useSocketIo({
        user_id: currentUserId!,
        role: "admin"
    });
      
    return (
        <section className="flex md:flex-row flex-col h-screen relative z-10 font-mono">
            {error ? <div>{error}</div> : null}
            <div className="flex flex-col gap-3 h-full md:w-3/4 w-full bg-gray-950 p-2.5">
                <div className='flex items-center gap-2.5 pb-2.5'>
                    <input
                        type='text'
                        value={search}
                        name='search_user'
                        onChange={(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => setSearch(event.target.value)}
                        placeholder='find master name / classname here...'
                        className='shadow-[6px_6px_0px_0px] shadow-violet-300 w-[90%] font-medium p-1.5 text-base border border-violet-300 outline-0 font-mono text-violet-300'
                    />
                    <button 
                        type='button' 
                        onClick={() => deleteAllPresencesForAdminMt.mutate()} 
                        className='shadow-[6px_6px_0px_0px] shadow-violet-300 flex justify-center w-[10%] cursor-pointer disabled:cursor-not-allowed font-medium p-1.5 text-base border border-violet-400 outline-0 font-mono text-violet-400'
                    >
                        <Trash2 size={22}/>
                    </button>
                </div>
                {allPresencesForAdmin.error2 ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-3xl font-medium text-amber-400 text-center">{allPresencesForAdmin.error2.message}</div>
                    </div>
                ): allPresencesForAdmin.isLoading2 ? (
                    <div className='flex justify-center items-center h-full'>
                        <Loading/>
                    </div>
                ) : (
                    <PresenceSlotList
                        edit_form={editPresenceForm}
                        fetch_next_page={allPresencesForAdmin.fetchNextPage2}
                        has_next_page={allPresencesForAdmin.hasNextPage2}
                        is_fetching_next_page={allPresencesForAdmin.isFetchingNextPage2}
                        is_processing={isProcessing}
                        on_delete={deleteOnePresenceMt}
                        on_edit={editPresenceFormMt}
                        on_select={handleSelectedFormId}
                        slots={allPresencesForAdmin.flatennedData2}
                        selected_id={selectedFormId}
                        set_edit_form={setEditPresenceForm}
                    />
                )}
            </div>
            {AdminNavbar(isProcessing)}
        </section>
    )
}
