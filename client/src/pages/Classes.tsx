import { Plus, Trash2 } from "lucide-react";
import AdminNavbar from "../components/AdminNavbar";
import ClassList from "../components/ClassList";
import Loading from "../components/Loading";
import ClassServices from "../services/class.service";
import AddClass from "../components/AddClass";
import useError from "../hooks/useError";

export default function Classes() {
    const { error, setError } = useError();
    
    const { 
        addNewClass, 
        allClassData,
        newClassName, 
        editClassName,
        changeClassMt,
        deleteAllClassesMt,
        deleteOneClassMt, 
        handleForm,
        handleSelectedId,
        isProcessing,
        openForm,
        search,
        selectedId,
        setEditClassName,
        setNewClassName,
        setSearch
    } = ClassServices({ setMessage: setError });

    return (
        <section className="flex md:flex-row flex-col h-screen relative z-10 bg-gray-950">
            {openForm ? (
                <AddClass addNewClass={addNewClass} error={error} handleForm={handleForm} newClassName={newClassName} setNewClassName={setNewClassName}/>
            ) : null}
            <div className="flex flex-col h-full w-full md:w-3/4 gap-3 p-2.5">
                <div className='flex gap-2.5'>
                    <input
                        type='text'
                        value={search}
                        name='search_class'
                        onChange={(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => setSearch(event.target.value)}
                        placeholder='find username here...'
                        className='shadow-[6px_6px_0px_0px] shadow-cyan-300 w-[90%] font-medium p-1.5 text-base border border-cyan-300 outline-0 font-mono text-cyan-300'
                    />
                    <button
                        type='button'
                        disabled={isProcessing}
                        onClick={() => deleteAllClassesMt.mutate()}
                        className='shadow-[6px_6px_0px_0px] shadow-cyan-300 w-[10%] cursor-pointer disabled:cursor-not-allowed font-medium p-1.5 text-base border border-cyan-300 outline-0 font-mono text-cyan-300'
                    >
                        <div className='flex justify-center'><Trash2/></div>
                    </button>
                    <button
                        type='button'
                        disabled={isProcessing}
                        onClick={handleForm}
                        className='shadow-[6px_6px_0px_0px] shadow-cyan-300 w-[10%] cursor-pointer disabled:cursor-not-allowed font-medium p-1.5 text-base border border-cyan-300 outline-0 font-mono text-cyan-300'
                    >
                        <div className='flex justify-center'><Plus/></div>
                    </button>
                </div>
                {allClassData.classError ? (
                    <div className='flex justify-center items-center h-full'>
                        <div className='font-mono font-medium text-2xl'>{allClassData.classError.message}</div>
                    </div>
                ) : allClassData.classIsLoading ? (
                    <div className='flex justify-center items-center h-full'>
                        <Loading/>
                    </div>
                ) : (
                    <ClassList 
                        class_data={allClassData.classFlattendedData}
                        fetch_next_page={allClassData.classFetchNextPage}
                        edit_classname={editClassName}
                        has_next_page={allClassData.classHasNextPage}
                        is_fetching_next_page={allClassData.classIsFetchingNextPage}
                        is_processing={isProcessing}
                        on_delete={deleteOneClassMt}
                        on_edit={changeClassMt}
                        on_select={handleSelectedId}
                        set_edit_classname={setEditClassName}
                        selected_id={selectedId}
                    />
                )}
            </div>
            {AdminNavbar(changeClassMt.isPending || deleteAllClassesMt.isPending || deleteOneClassMt.isPending)}
        </section>
    );
}