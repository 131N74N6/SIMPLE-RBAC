import { useMutation, useQueryClient } from "@tanstack/react-query";
import DataServices from "./data.service";
import type { FillPresenceIntrf, MakePresenceIntrf, PresenceIntrf } from "../models/presence.model";
import { useState } from "react";

export default function PresenceServices() {
    const queryClient = useQueryClient();
    const { addData, deleteData, editData, infiniteScroll } = DataServices();

    const [presence, setPresence] = useState<MakePresenceIntrf>({ classname: "", deadline: "", start_time: "" });
    const [studentStatus, setStudentStatus] = useState("");
    const [presenceError, setPresenceError] = useState<string | null>(null);
    
    const fillPresenceMt = useMutation({
        mutationFn: async (id: string) => {
            await editData<FillPresenceIntrf>({
                api_url: `${import.meta.env.VITE_BASE_API_URL}/presences/student/fill/${id}`,
                data: { status: studentStatus || 'Not Present' }
            });
        },
        onError(error) {
            setPresenceError(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-presences'] });
        },
        onSettled: () => {
            setPresence({ classname: "", deadline: "", start_time: "" });
        }
    });

    const makeNewPresenceMt = useMutation({
        mutationFn: async () => {
            await addData<MakePresenceIntrf>({
                api_url: `${import.meta.env.VITE_BASE_API_URL}/presences/make`,
                data: { 
                    start_time: presence.start_time,
                    deadline: presence.deadline,
                    classname: presence.classname.trim(), 
                }
            });
        },
        onError(error) {
            setPresenceError(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-presences'] });
        },
        onSettled: () => {
            setPresence({ classname: "", deadline: "", start_time: "" });
        }
    });

    const makeNewPresence = (event: React.SyntheticEvent) => {
        event.preventDefault();
        makeNewPresenceMt.mutate();
    }
    
    const deleteAllPresencesMt = useMutation({
        mutationFn: async () => {
            await deleteData(`${import.meta.env.VITE_BASE_API_URL}/presences/rm-all`);
        },
        onError(error) {
            setPresenceError(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-presences'] });
        },
        onSettled: () => {
            setPresence({ classname: "", deadline: "", start_time: "" });
        }
    });
    
    const deleteOnePresenceMt = useMutation({
        mutationFn: async (id: string) => {
            await deleteData(`${import.meta.env.VITE_BASE_API_URL}/presences/rm/${id}`);
        },
        onError(error) {
            setPresenceError(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-presences'] });
        },
        onSettled: () => {
            setPresence({ classname: "", deadline: "", start_time: "" });
        }
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPresence(prev => ({ ...prev, [event.target.name]: event.target.value }));
    }

    const { error, fetchNextPage, flatennedData, hasNextPage, isFetchingNextPage, isLoading } = infiniteScroll<PresenceIntrf>({
        api_url: `${import.meta.env.VITE_BASE_API_URL}/presences/show-all`,
        limit: 12,
        query_key: ['all-presences'],
        stale_time: Infinity
    });

    const allPresencesData = { error, fetchNextPage, flatennedData, hasNextPage, isFetchingNextPage, isLoading };
    const makeNewPresenceMtIsProcessing = makeNewPresenceMt.isPending;
    const fillPresenceMtIsProcessing = fillPresenceMt.isPending;
    const deleteAllPresencesMtIsProcessing = deleteAllPresencesMt.isPending;
    const deleteOnePresenceMtIsProcessing = deleteOnePresenceMt.isPending;

    return { 
        makeNewPresence, 
        makeNewPresenceMtIsProcessing, 
        allPresencesData,
        fillPresenceMtIsProcessing,
        deleteAllPresencesMt,
        deleteAllPresencesMtIsProcessing, 
        deleteOnePresenceMt, 
        deleteOnePresenceMtIsProcessing, 
        handleInputChange,
        presenceError, 
        setPresenceError, 
        setStudentStatus
    }
}