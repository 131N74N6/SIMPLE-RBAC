import MasterNavbar from '../components/MasterNavbar';
import PresenceServices from "../services/presence.service";
import Loading from '../components/Loading';
import useError from '../hooks/useError';
import PresenceSlotList from '../components/PresenceSlotList';
import useSocketIo from '../hooks/useSocketIo';
import { Trash2 } from 'lucide-react';

export default function PresenceByMaster() {
    const { error, setError } = useError();

    const { 
        allPresenceSlots, 
        currentUserId,
        deleteAllPresencesMt, 
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
        role: ["master"],
        identifier: currentUserId!
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
                        placeholder='find classname here...'
                        className='shadow-[6px_6px_0px_0px] shadow-violet-300 w-[90%] font-medium p-1.5 text-base border border-violet-300 outline-0 font-mono text-violet-300'
                    />
                    <button 
                        type='button' 
                        onClick={() => deleteAllPresencesMt.mutate()} 
                        className='shadow-[6px_6px_0px_0px] flex justify-center shadow-violet-300 w-[10%] cursor-pointer disabled:cursor-not-allowed font-medium p-1.5 text-base border border-violet-300 outline-0 font-mono text-violet-300'
                    >
                        <Trash2 size={22}/>
                    </button>
                </div>
                {allPresenceSlots.error ? (
                    <div className="flex justify-center items-center h-full">
                        <div className='text-amber-400 text-center text-3xl'>{allPresenceSlots.error.message}</div>
                    </div>
                ): allPresenceSlots.isLoading ? (
                    <div className='flex justify-center items-center h-full'>
                        <Loading/>
                    </div>
                ) : (
                    <PresenceSlotList
                        edit_form={editPresenceForm}
                        fetch_next_page={allPresenceSlots.fetchNextPage}
                        has_next_page={allPresenceSlots.hasNextPage}
                        is_fetching_next_page={allPresenceSlots.isFetchingNextPage}
                        is_processing={isProcessing}
                        on_delete={deleteOnePresenceMt}
                        on_edit={editPresenceFormMt}
                        on_select={handleSelectedFormId}
                        slots={allPresenceSlots.flatennedData}
                        selected_id={selectedFormId}
                        set_edit_form={setEditPresenceForm}
                    />
                )}
            </div>
            {MasterNavbar(isProcessing)}
        </section>
    );
}