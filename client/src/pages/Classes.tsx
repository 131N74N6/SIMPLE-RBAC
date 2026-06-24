import { Plus, Trash2 } from "lucide-react";
import AdminNavbar from "../components/AdminNavbar";
import ClassList from "../components/ClassList";
import Loading from "../components/Loading";
import ClassServices from "../services/class.service";
import { useEffect, useState } from "react";

export default function Classes() {
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() =>{
        if (error) {
            const timer = setTimeout(() => setError(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [error, setError]);
    
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
        <section className="flex md:flex-row flex-col h-screen relative z-10">
            {openForm ? (
                <div className="flex justify-center items-center z-20 inset-0 fixed">
                    <form onSubmit={addNewClass} className="flex flex-col gap-2.5 p-2.5">
                        <input
                            type="text"
                            id="classname"
                            value={newClassName}
                            onChange={(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => setNewClassName(event.target.value)}
                        />
                        <div className="grid grid-cols-2 gap-2.5">
                            <button type="submit" className="cursor-pointer">Add</button>
                            <button type="button" className="cursor-pointer" onClick={handleForm}>Close</button>
                        </div>
                    </form>
                </div>
            ) : null}
            <div className="flex flex-col h-full w-full md:w-3/4 gap-3 p-2.5">
                <div className='flex gap-2.5'>
                    <input
                        type='text'
                        value={search}
                        name='search_class'
                        onChange={(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => setSearch(event.target.value)}
                        placeholder='find username here...'
                        className='shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] w-[90%] font-medium p-1.5 text-base border border-black outline-0 font-mono text-black'
                    />
                    <button
                        type='button'
                        disabled={isProcessing}
                        onClick={() => deleteAllClassesMt.mutate()}
                        className='shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] w-[10%] cursor-pointer disabled:cursor-not-allowed font-medium p-1.5 text-base border border-black outline-0 font-mono text-black'
                    >
                        <div className='flex justify-center'><Trash2/></div>
                    </button>
                    <button
                        type='button'
                        disabled={isProcessing}
                        onClick={handleForm}
                        className='shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] w-[10%] cursor-pointer disabled:cursor-not-allowed font-medium p-1.5 text-base border border-black outline-0 font-mono text-black'
                    >
                        <div className='flex justify-center'><Plus/></div>
                    </button>
                </div>
                {allClassData.classError ? (
                    <div className='flex justify-center items-center h-full'>
                        <div className='font-mono font-medium text-2xl'>{allClassData.classError.message}</div>
                    </div>
                ) : allClassData.classIsLoading ? (
                    <div className='flex justify-center bg-white items-center h-full'>
                        <Loading/>
                    </div>
                ) : (
                    <ClassList 
                        class_data={allClassData.classFlattendedData}
                        data_error={error}
                        fetch_next_page={allClassData.classFetchNextPage}
                        edit_classname={editClassName}
                        has_next_page={allClassData.classHasNextPage}
                        is_fetching_next_page={allClassData.classIsFetchingNextPage}
                        is_processing={isProcessing}
                        on_delete={deleteOneClassMt}
                        on_edit={changeClassMt}
                        on_select={handleSelectedId}
                        set_data_error={setError}
                        set_edit_classname={setEditClassName}
                        selected_id={selectedId}
                    />
                )}
            </div>
            {AdminNavbar(changeClassMt.isPending || deleteAllClassesMt.isPending || deleteOneClassMt.isPending)}
        </section>
    );
}