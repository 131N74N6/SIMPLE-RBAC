import AdminNavbar from "../components/AdminNavbar";
import { useParams } from "react-router-dom";
import UserServices from "../services/user.service";
import Loading from "../components/Loading";
import { Trash2 } from "lucide-react";
import useError from "../hooks/useError";
import Notification from "../components/Notification";
import StudentList from "../components/StudentList";
import useSocketIo from "../hooks/useSocketIo";

export default function ClassDetail() {
    const { classname } = useParams();
    const { error, setError } = useError();

    const { 
        changeStudentDataMt, 
        currentUserId,
        editUser, 
        deleteAllStudentsByClassMt, 
        deleteStudentMt, 
        getAllStudentsByClass, 
        isProcessing,
        search, 
        handleSelectedId, 
        selectedId, 
        setSearch, 
        setEditUser, 
        isoToLocalDateTime
    } = UserServices({ classname: classname, setMessage: setError });

    useSocketIo({
        user_id: currentUserId!,
        role: ["admin"]
    });

    return (
        <section className="flex md:flex-row flex-col h-screen relative bg-gray-950 z-10">
            {error ? <Notification message={error}/> : null}
            <div className="flex flex-col h-full w-full md:w-3/4 gap-3 p-2.5">
                <div className='flex gap-2.5'>
                    <input
                        type='text'
                        value={search}
                        name='search_user'
                        onChange={(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => setSearch(event.target.value)}
                        placeholder='find username here...'
                        className='shadow-[6px_6px_0px_0px] shadow-violet-300 w-[90%] font-medium p-1.5 text-base border border-violet-300 outline-0 font-mono text-violet-300'
                    />
                    <button
                        type='button'
                        disabled={isProcessing}
                        onClick={() => deleteAllStudentsByClassMt.mutate()}
                        className='shadow-[6px_6px_0px_0px] shadow-violet-300 w-[10%] cursor-pointer disabled:cursor-not-allowed font-medium p-1.5 text-base border border-violet-300 outline-0 font-mono text-violet-300'
                    >
                        <div className='flex justify-center'><Trash2/></div>
                    </button>
                </div>
                {getAllStudentsByClass.studentError2 ? (
                    <div className='flex justify-center items-center h-full'>
                        <div className='font-mono font-medium text-3xl text-amber-400 text-center'>{getAllStudentsByClass.studentError2.message}</div>
                    </div>
                ) : getAllStudentsByClass.isStudentsLoading2 ? (
                    <div className='flex justify-center items-center h-full'>
                        <Loading/>
                    </div>
                ) : (
                    <StudentList 
                        change_user_data_mt={changeStudentDataMt}
                        edit_user={editUser}
                        fetch_next_page={getAllStudentsByClass.fetchNextStudentsData2}
                        has_next_page={getAllStudentsByClass.stuentHasNextPage2}
                        is_fetching_next_page={getAllStudentsByClass.iStudentFetchingNextPage2}
                        iso_to_local={isoToLocalDateTime}
                        is_processing={isProcessing}
                        on_delete={deleteStudentMt}
                        on_select={handleSelectedId}
                        selected_id={selectedId}
                        set_edit_user={setEditUser}
                        users={getAllStudentsByClass.flatennedStudentsData2}
                    />
                )}
            </div>
            {AdminNavbar(isProcessing)}
        </section>
    );
}