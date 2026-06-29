import { Trash2 } from "lucide-react";
import AdminNavbar from "../components/AdminNavbar";
import Loading from "../components/Loading";
import UserServices from "../services/user.service";
import useError from "../hooks/useError";
import Notification from "../components/Notification";
import MasterList from "../components/MasterList";
import useSocketIo from "../hooks/useSocketIo";

export default function Masters() {
    const { error, setError } = useError();
    
    const { 
        changeMasterDataMt,
        currentUserId,
        editUser,
        deleteAllMastersMt,
        deleteMasterMt,
        isProcessing,
        paginatedMastersData,
        search,
        handleSelectedId,
        selectedId,
        setSearch,
        setEditUser, 
        isoToLocalDateTime
    } = UserServices({ setMessage: setError });
    
    useSocketIo({
        user_id: currentUserId,
        role: "admin",
        identifier: ""
    });

    return (
        <section className="flex md:flex-row flex-col h-screen relative z-10 bg-gray-950">
            {error ? <Notification message={error}/> : null}
            <div className="flex flex-col h-full w-full md:w-3/4 gap-3 p-2.5">
                <div className='flex gap-2.5'>
                    <input
                        type='text'
                        value={search}
                        name='search_user'
                        onChange={(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => setSearch(event.target.value)}
                        placeholder='find username here...'
                        className='shadow-[6px_6px_0px_0px] shadow-red-300 w-[90%] font-medium p-1.5 text-base border border-red-300 outline-0 font-mono text-red-300'
                    />
                    <button
                        type='button'
                        disabled={isProcessing}
                        onClick={() => deleteAllMastersMt.mutate()}
                        className='shadow-[6px_6px_0px_0px] shadow-red-300 cursor-pointer disabled:cursor-not-allowed font-medium p-1.5 text-base border border-red-300 outline-0 font-mono text-red-300 w-[10%]'
                    >
                        <div className='flex justify-center'><Trash2/></div>
                    </button>
                </div>
                {paginatedMastersData.masterError ? (
                    <div className='flex justify-center items-center h-full'>
                        <div className='font-mono font-medium text-3xl text-amber-400 text-center'>{paginatedMastersData.masterError.message}</div>
                    </div>
                ) : paginatedMastersData.isMasterLoading ? (
                    <div className='flex justify-center items-center h-full'>
                        <Loading/>
                    </div>
                ) : (
                    <MasterList 
                        change_user_data_mt={changeMasterDataMt}
                        edit_user={editUser}
                        fetch_next_page={paginatedMastersData.fetchNextMasterData}
                        has_next_page={paginatedMastersData.masterHasNextPage}
                        is_fetching_next_page={paginatedMastersData.isMasterFetchingNextPage}
                        iso_to_local={isoToLocalDateTime}
                        is_processing={isProcessing}
                        on_delete={deleteMasterMt}
                        on_select={handleSelectedId}
                        selected_id={selectedId}
                        set_edit_user={setEditUser}
                        users={paginatedMastersData.flatennedMasterData}
                    />
                )}
            </div>
            {AdminNavbar(isProcessing)}
        </section>
    );
}