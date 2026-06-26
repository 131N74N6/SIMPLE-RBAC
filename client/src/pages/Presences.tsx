import MasterNavbar from '../components/MasterNavbar';
import PresenceServices from "../services/presence.service";
import Loading from '../components/Loading';
import useError from '../hooks/useError';
import PresenceSlotList from '../components/PresenceSlotList';

export default function Presences() {
    const { error, setError } = useError();

    const { 
        allPresenceSlots, 
        deleteAllPresencesMt, 
        deleteOnePresenceMt, 
        editPresenceForm,
        editPresenceFormMt,
        handleSelectedFormId,
        selectedFormId,
        setEditPresenceForm,
    } = PresenceServices({ setMessage: setError });
    
    const isProcessing = allPresenceSlots.isLoading || deleteAllPresencesMt.isPending || deleteOnePresenceMt.isPending;
    
    return (
        <section className="flex md:flex-row flex-col h-screen relative z-10 font-mono">
            {error ? <div>{error}</div> : null}
            <div className="flex flex-col gap-3 h-full md:w-3/4 w-full bg-gray-950 p-2.5">
                <div className='flex gap-2.5'>
                    <button 
                        type='button' 
                        onClick={() => deleteAllPresencesMt.mutate()} 
                        className='shadow-[6px_6px_0px_0px_amber-400] w-[10%] cursor-pointer disabled:cursor-not-allowed font-medium p-1.5 text-base border border-amber-400 outline-0 font-mono text-amber-400'
                    >
                        <span>Delete All</span>
                    </button>
                </div>
                {allPresenceSlots.error ? (
                    <div className="flex justify-center items-center h-full">
                        <div>{allPresenceSlots.error.message}</div>
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