import { useMutation, useQueryClient } from "@tanstack/react-query";
import DataServices from "./data.service";
import type { ClassIntrf } from "../models/class.model";
import { useState } from "react";
import useSearch from "../hooks/useSearch";

export default function ClassService() {
    const queryClient = useQueryClient();
    const { addData, deleteData, editData, infiniteScroll } = DataServices();
    const { debouncedSearch, search, setSearch } = useSearch();
    const [classname, setClassname] = useState<string>("");
    const [classnameError, setClassnameError] = useState<string | null>(null);
    
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
        mutationFn: async (className: string) => {
            await editData<Pick<ClassIntrf, 'classname'>>({
                api_url: `${import.meta.env.VITE_BASE_API_URL}/classes/admin/remake/${className}`,
                data: { classname: classname.trim() }
            });
        },
        onError(error) {
            setClassnameError(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-classes'] });
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
            queryClient.invalidateQueries({ queryKey: ['all-classes'] });
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
            queryClient.invalidateQueries({ queryKey: ['all-classes'] });
        },
        onSettled: () => {
            setClassname("");
        }
    });

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

    return { 
        addNewClass, 
        allClassData,
        allStudentsInClass,
        classnameError, 
        changeClassMt,
        deleteAllClassesMt,
        deleteOneClassMt, 
        search,
        setClassnameError,
        setSearch
    }
}
