import { useMutation, useQueryClient } from "@tanstack/react-query";
import DataServices from "./data.service";
import type { ClassIntrf } from "../models/class.model";
import { useState } from "react";

export default function ClassService() {
    const queryClient = useQueryClient();
    const { addData, deleteData, editData, infiniteScroll } = DataServices();
    const [classname, setClassname] = useState<string>("");
    const [classError, setClassError] = useState<string | null>(null);
    
    const addNewClassMt = useMutation({
        mutationFn: async () => {
            await addData<Pick<ClassIntrf, 'classname'>>({
                api_url: `${import.meta.env.VITE_BASE_API_URL}/classes/admin-only/make`,
                data: { classname: classname.trim() }
            });
        },
        onError(error) {
            setClassError(error.message);
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
                api_url: `${import.meta.env.VITE_BASE_API_URL}/classes/admin-only/remake/${className}`,
                data: { classname: classname.trim() }
            });
        },
        onError(error) {
            setClassError(error.message);
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
            await deleteData(`${import.meta.env.VITE_BASE_API_URL}/classes/admin-only/rm-all`);
        },
        onError(error) {
            setClassError(error.message);
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
            await deleteData(`${import.meta.env.VITE_BASE_API_URL}/classes/admin-only/rm/${className}`);
        },
        onError(error) {
            setClassError(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-classes'] });
        },
        onSettled: () => {
            setClassname("");
        }
    });

    const { error, fetchNextPage, flatennedData, hasNextPage, isFetchingNextPage, isLoading } = infiniteScroll<ClassIntrf>({
        api_url: `${import.meta.env.VITE_BASE_API_URL}/classes/admin-only/show-all`,
        limit: 12,
        query_key: ['all-classes'],
        stale_time: Infinity
    });

    const allClassData = { error, fetchNextPage, flatennedData, hasNextPage, isFetchingNextPage, isLoading };
    const addNewClassMtIsProcessing = addNewClassMt.isPending;
    const changeClassMtIsProcessing = changeClassMt.isPending;
    const deleteAllClassesMtIsProcessing = deleteAllClassesMt.isPending;
    const deleteOneClassMtIsProcessing = deleteOneClassMt.isPending;

    return { 
        addNewClass, 
        addNewClassMtIsProcessing, 
        allClassData,
        classError, 
        changeClassMt,
        changeClassMtIsProcessing,
        deleteAllClassesMt,
        deleteAllClassesMtIsProcessing, 
        deleteOneClassMt, 
        deleteOneClassMtIsProcessing, 
        setClassError 
    }
}
