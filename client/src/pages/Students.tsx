import { Trash2 } from "lucide-react";
import AdminNavbar from "../components/AdminNavbar";
import Loading from "../components/Loading";
import UserServices from "../services/user.service";
import useError from "../hooks/useError";
import Notification from "../components/Notification";
import StudentList from "../components/StudentList";
import useSocketIo from "../hooks/useSocketIo";

export default function Students() {
    const { error, setError } = useError();

    const { 
        changeStudentDataMt, 
        currentUserId,
        editUser, 
        deleteAllStudentsMt, 
        deleteStudentMt, 
        isProcessing,
        paginatedStudentsData, 
        search, 
        handleSelectedId, 
        selectedId, 
        setSearch, 
        setEditUser, 
        isoToLocalDateTime
    } = UserServices({ setMessage: setError });

    useSocketIo({
        user_id: currentUserId!,
        role: ["admin"]
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
                        className='shadow-[6px_6px_0px_0px] w-[90%] font-medium p-1.5 text-base border border-amber-300 outline-0 font-mono text-amber-300'
                    />
                    <button
                        type='button'
                        disabled={isProcessing}
                        onClick={() => deleteAllStudentsMt.mutate()}
                        className='shadow-[6px_6px_0px_0px] shadow-amber-300 cursor-pointer disabled:cursor-not-allowed font-medium p-1.5 text-base border border-amber-300 outline-0 font-mono text-amber-300 w-[10%]'
                    >
                        <div className='flex justify-center'><Trash2/></div>
                    </button>
                </div>
                {paginatedStudentsData.studentError ? (
                    <div className='flex justify-center items-center h-full'>
                        <div className='font-mono text-amber-400 text-center font-medium text-3xl'>{paginatedStudentsData.studentError.message}</div>
                    </div>
                ) : paginatedStudentsData.isStudentsLoading ? (
                    <div className='flex justify-center items-center h-full'>
                        <Loading/>
                    </div>
                ) : (
                    <StudentList 
                        change_user_data_mt={changeStudentDataMt}
                        edit_user={editUser}
                        fetch_next_page={paginatedStudentsData.fetchNextStudentsData}
                        has_next_page={paginatedStudentsData.stuentHasNextPage}
                        is_fetching_next_page={paginatedStudentsData.iStudentFetchingNextPage}
                        iso_to_local={isoToLocalDateTime}
                        is_processing={isProcessing}
                        on_delete={deleteStudentMt}
                        on_select={handleSelectedId}
                        selected_id={selectedId}
                        set_edit_user={setEditUser}
                        users={paginatedStudentsData.flatennedStudentsData}
                    />
                )}
            </div>
            {AdminNavbar(isProcessing)}
        </section>
    );
}