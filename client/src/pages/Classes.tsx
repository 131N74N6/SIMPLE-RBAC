import { Trash2, UserPlus } from "lucide-react";
import AdminNavbar from "../components/AdminNavbar";
import ClassList from "../components/ClassList";
import Loading from "../components/Loading";
import ClassServices from "../services/class.service";

export default function Classes() {
    const { 
        addNewClass, 
        allClassData,
        classname, 
        classnameError,
        changeClassMt,
        deleteAllClassesMt,
        deleteOneClassMt, 
        handleForm,
        handleSelectedId,
        isProcessing,
        openForm,
        search,
        selectedId,
        setClassname,
        setClassnameError,
        setSearch
    } = ClassServices();

    return (
        <section className="flex md:flex-row flex-col h-screen relative z-10">
            {openForm ? (
                <form onSubmit={addNewClass}></form>
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
                        <div className='flex justify-center'><UserPlus/></div>
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
                        classname={classname}
                        data_error={classnameError}
                        fetch_next_page={allClassData.classFetchNextPage}
                        has_next_page={allClassData.classHasNextPage}
                        is_fetching_next_page={allClassData.classIsFetchingNextPage}
                        is_processing={isProcessing}
                        on_delete={deleteOneClassMt}
                        on_edit={changeClassMt}
                        on_select={handleSelectedId}
                        set_data_error={setClassnameError}
                        set_edit_classname={setClassname}
                        selected_id={selectedId}
                    />
                )}
            </div>
            {AdminNavbar(changeClassMt.isPending || deleteAllClassesMt.isPending || deleteOneClassMt.isPending)}
        </section>
    );
}