import { Query, useMutation, useQueryClient } from "@tanstack/react-query";
import DataServices from "./data.service";
import type { ClassIntrf, ClassServiceIntrf } from "../models/class.model";
import useSearch from "../hooks/useSearch";
import { useClassStore } from "../stores/class.store";
import AuthServices from "../services/auth.service";

export default function ClassServices(props?: ClassServiceIntrf) {
    const queryClient = useQueryClient();
    const { addData, deleteData, editData, infiniteScroll } = DataServices();
    const { debouncedSearch, search, setSearch } = useSearch();
    const { currentUserId } = AuthServices();
    
    const editClassName = useClassStore((state) => state.editClassName);
    const handleSelectedId = useClassStore((state) => state.handleSelectedId);
    const newClassName = useClassStore((state) => state.newClassName);
    const openForm = useClassStore((state) => state.openForm);
    const resetEditClassName = useClassStore((state) => state.resetEditClassName);
    const selectedId = useClassStore((state) => state.selectedId);
    const setEditClassName = useClassStore((state) => state.setEditClassName);
    const setNewClassName = useClassStore((state) => state.setNewClassName);
    const setOpenForm = useClassStore((state) => state.setOpenForm);
    
    const addNewClassMt = useMutation({
        mutationFn: async () => {
            await addData<Pick<ClassIntrf, 'classname'>>({
                api_url: `${import.meta.env.VITE_BASE_API_URL}/classes/admin/make`,
                data: { classname: newClassName.trim() }
            });
        },
        onError(error) {
            props?.setMessage!(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-classes'] });
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length !== 0 && typeof queryKey[0] === "string") {
                        return queryKey[0].startsWith('all-classes');
                    }
                    return false;
                }
            });
            setNewClassName("");
            setOpenForm(false);
        }
    });

    const addNewClass = (event: React.SyntheticEvent) => {
        event.preventDefault();
        addNewClassMt.mutate();
    }
    
    const changeClassMt = useMutation({
        mutationFn: async (id: string) => {
            await editData<Pick<ClassIntrf, 'classname'>>({
                api_url: `${import.meta.env.VITE_BASE_API_URL}/classes/admin/remake/${id}`,
                data: { classname: editClassName.trim() }
            });
        },
        onError(error) {
            props?.setMessage!(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length !== 0 && typeof queryKey[0] === "string") {
                        return queryKey[0].startsWith('all-classes') || 
                        queryKey[0].startsWith('all-students')|| 
                        queryKey[0].startsWith('all-students-class');
                    }
                    return false;
                }
            });
            resetEditClassName();
        }
    });
    
    const deleteAllClassesMt = useMutation({
        mutationFn: async () => {
            await deleteData(`${import.meta.env.VITE_BASE_API_URL}/classes/admin/rm-all`);
        },
        onError(error) {
            props?.setMessage!(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length !== 0 && typeof queryKey[0] === "string") {
                        return queryKey[0].startsWith('all-classes') || 
                        queryKey[0].startsWith('all-students')|| 
                        queryKey[0].startsWith('all-students-class');
                    }
                    return false;
                }
            });
            setNewClassName("");
            resetEditClassName();
        }
    });
    
    const deleteOneClassMt = useMutation({
        mutationFn: async (className: string) => {
            await deleteData(`${import.meta.env.VITE_BASE_API_URL}/classes/admin/rm/${className}`);
        },
        onError(error) {
            props?.setMessage!(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length !== 0 && typeof queryKey[0] === "string") {
                        return queryKey[0].startsWith('all-classes') || 
                        queryKey[0].startsWith('all-students')|| 
                        queryKey[0].startsWith('all-students-class');
                    }
                    return false;
                }
            });
            setNewClassName("");
            resetEditClassName();
        }
    });

    const handleForm = () => setOpenForm(!openForm);

    const { 
        error: classError, 
        fetchNextPage: classFetchNextPage, 
        flatennedData: classFlattendedData, 
        hasNextPage: classHasNextPage, 
        isFetchingNextPage: classIsFetchingNextPage, 
        isLoading: classIsLoading 
    } = infiniteScroll<ClassIntrf>({
        api_url: `${import.meta.env.VITE_BASE_API_URL}/classes/admin/show-all`,
        limit: 12,
        query_key: ['all-classes'],
        stale_time: Infinity
    });

    const allClassData = { 
        classError, classFetchNextPage, classFlattendedData, classHasNextPage, 
        classIsFetchingNextPage, classIsLoading 
    };

    const { 
        error: studentClassError, 
        fetchNextPage: studentClassFetchNextPage, 
        flatennedData: studentClassFlatennedData, 
        hasNextPage: studentClassHasNextPage, 
        isFetchingNextPage: studentClassIsFetchingNextPage, 
        isLoading: studentClassIsLoading 
    } = infiniteScroll<ClassIntrf>({
        api_url: `${import.meta.env.VITE_BASE_API_URL}/classes/students`,
        limit: 12,
        query_key: debouncedSearch ? ['all-students-class'] : [`all-students-class-${debouncedSearch}`],
        searched: debouncedSearch,
        stale_time: Infinity
    });

    const allStudentsInClass = { 
        studentClassError, studentClassFetchNextPage, studentClassFlatennedData, 
        studentClassHasNextPage, studentClassIsFetchingNextPage, studentClassIsLoading 
    };

    const isProcessing = addNewClassMt.isPending || 
    changeClassMt.isPending || 
    deleteOneClassMt.isPending || 
    deleteAllClassesMt.isPending;

    return { 
        addNewClass, 
        allClassData,
        allStudentsInClass,
        currentUserId,
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
        setNewClassName,
        setEditClassName,
        setSearch
    }
}
