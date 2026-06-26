import AdminNavbar from "../components/AdminNavbar";
import { useParams } from "react-router-dom";
import UserServices from "../services/user.service";
import AdminUserList from "../components/AdminUserList";
import Loading from "../components/Loading";
import { Trash2 } from "lucide-react";
import useError from "../hooks/useError";

export default function ClassDetail() {
    const { classname } = useParams();
    const { error, setError } = useError();

    const { 
        changeUserDataMt, 
        editUser, 
        deleteAllStudentsMt, 
        deleteStudentMt, 
        getAllStudentsByClass, 
        search, 
        handleSelectedId, 
        selectedId, 
        setSearch, 
        setEditUser, 
        isoToLocalDateTime
    } = UserServices({ classname: classname, setMessage: setError });

    return (
        <section className="flex md:flex-row flex-col h-screen relative z-10">
            <div className="flex flex-col h-full w-full md:w-3/4 gap-3 p-2.5">
                <div className='flex gap-2.5'>
                    <input
                        type='text'
                        value={search}
                        name='search_user'
                        onChange={(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => setSearch(event.target.value)}
                        placeholder='find username here...'
                        className='shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] w-[90%] font-medium p-1.5 text-base border border-black outline-0 font-mono text-black'
                    />
                    <button
                        type='button'
                        disabled={changeUserDataMt.isPending || deleteStudentMt.isPending}
                        onClick={() => deleteAllStudentsMt.mutate()}
                        className='shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] w-[10%] cursor-pointer disabled:cursor-not-allowed font-medium p-1.5 text-base border border-black outline-0 font-mono text-black'
                    >
                        <div className='flex justify-center'><Trash2/></div>
                    </button>
                </div>
                {getAllStudentsByClass.studentError2 ? (
                    <div className='flex justify-center items-center h-full'>
                        <div className='font-mono font-medium text-2xl'>{getAllStudentsByClass.studentError2.message}</div>
                    </div>
                ) : getAllStudentsByClass.isStudentsLoading2 ? (
                    <div className='flex justify-center bg-white items-center h-full'>
                        <Loading/>
                    </div>
                ) : (
                    <AdminUserList 
                        change_user_data_mt={changeUserDataMt}
                        data_error={error}
                        edit_user={editUser}
                        fetch_next_page={getAllStudentsByClass.fetchNextStudentsData2}
                        has_next_page={getAllStudentsByClass.stuentHasNextPage2}
                        is_fetching_next_page={getAllStudentsByClass.iStudentFetchingNextPage2}
                        iso_to_local={isoToLocalDateTime}
                        is_processing={changeUserDataMt.isPending}
                        on_delete={deleteStudentMt}
                        on_select={handleSelectedId}
                        selected_id={selectedId}
                        set_data_error={setError}
                        set_edit_user={setEditUser}
                        users={getAllStudentsByClass.flatennedStudentsData2}
                    />
                )}
            </div>
            {AdminNavbar(changeUserDataMt.isPending || deleteAllStudentsMt.isPending || deleteStudentMt.isPending)}
        </section>
    );
}