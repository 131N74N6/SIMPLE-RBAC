import { Query, useMutation, useQueryClient } from "@tanstack/react-query";
import DataServices from "./data.service";
import type { ClassIntrf } from "../models/class.model";
import { useState } from "react";
import useSearch from "../hooks/useSearch";

export default function ClassServices() {
    const queryClient = useQueryClient();
    const { addData, deleteData, editData, infiniteScroll } = DataServices();
    const { debouncedSearch, search, setSearch } = useSearch();

    const [openForm, setOpenForm] = useState<boolean>(false);
    const [classname, setClassname] = useState<string>("");
    const [classnameError, setClassnameError] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    
    const addNewClassMt = useMutation({
        mutationFn: async () => {
            await addData<Pick<ClassIntrf, 'classname'>>({
                api_url: `${import.meta.env.VITE_BASE_API_URL}/classes/admin/make`,
                data: { classname: classname.trim() }
            });
        },
        onError(error) {
            setClassnameError(error.message);
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
        },
        onSettled: () => {
            setClassname("");
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
                data: { classname: classname.trim() }
            });
        },
        onError(error) {
            setClassnameError(error.message);
        },
        onSuccess: () => {
            setSelectedId(null);
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
        },
        onSettled: () => {
            setClassname("");
        }
    });
    
    const deleteAllClassesMt = useMutation({
        mutationFn: async () => {
            await deleteData(`${import.meta.env.VITE_BASE_API_URL}/classes/admin/rm-all`);
        },
        onError(error) {
            setClassnameError(error.message);
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
        },
        onSettled: () => {
            setClassname("");
        }
    });
    
    const deleteOneClassMt = useMutation({
        mutationFn: async (className: string) => {
            await deleteData(`${import.meta.env.VITE_BASE_API_URL}/classes/admin/rm/${className}`);
        },
        onError(error) {
            setClassnameError(error.message);
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
        },
        onSettled: () => {
            setClassname("");
        }
    });

    const handleSelectedId = (id: string) => setSelectedId(prev => prev === id ? null : id);
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

    const isProcessing = addNewClassMt.isPending || changeClassMt.isPending || deleteOneClassMt.isPending || deleteAllClassesMt.isPending;

    return { 
        addNewClass, 
        allClassData,
        allStudentsInClass,
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
    }
}
