import { useMutation, useQueryClient } from "@tanstack/react-query";
import DataServices from "./data.service";
import type { FillPresenceIntrf, MakePresenceIntrf, PresenceSlotIntrf } from "../models/presence.model";
import { useState } from "react";

export default function PresenceServices() {
    const queryClient = useQueryClient();
    const { addData, deleteData, infiniteScroll } = DataServices();

    const [presence, setPresence] = useState<MakePresenceIntrf>({ classname: "", deadline: "", start_time: "" });
    const [presenceError, setPresenceError] = useState<string | null>(null);
    
    const fillPresenceMt = useMutation({
        mutationFn: async (props: FillPresenceIntrf) => {
            await addData<FillPresenceIntrf>({
                api_url: `${import.meta.env.VITE_BASE_API_URL}/presences/student/fill`,
                data: { 
                    presence_slot_id: props.presence_slot_id,
                    student_status: props.student_status.trim()
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

    const makeNewPresenceMt = useMutation({
        mutationFn: async () => {
            await addData<MakePresenceIntrf>({
                api_url: `${import.meta.env.VITE_BASE_API_URL}/presences/master/make`,
                data: { 
                    start_time: new Date(presence.start_time).toLocaleString(),
                    deadline: new Date(presence.deadline).toLocaleString(),
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
    
    const deleteAllPresencesMt = useMutation({
        mutationFn: async () => {
            await deleteData(`${import.meta.env.VITE_BASE_API_URL}/presences/master/rm-all`);
        },
        onError(error) {
            setPresenceError(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-presences'] });
            queryClient.invalidateQueries({ queryKey: ['all-presences-form'] });
        },
        onSettled: () => {
            setPresence({ classname: "", deadline: "", start_time: "" });
        }
    });
    
    const deleteOnePresenceMt = useMutation({
        mutationFn: async (id: string) => {
            await deleteData(`${import.meta.env.VITE_BASE_API_URL}/presences/master/rm/${id}`);
        },
        onError(error) {
            setPresenceError(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-presences'] });
            queryClient.invalidateQueries({ queryKey: ['all-presences-form'] });
        },
        onSettled: () => {
            setPresence({ classname: "", deadline: "", start_time: "" });
        }
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPresence(prev => ({ ...prev, [event.target.name]: event.target.value }));
    }

    const { 
        error, 
        fetchNextPage, 
        flatennedData, 
        hasNextPage, 
        isFetchingNextPage, 
        isLoading 
    } = infiniteScroll<PresenceSlotIntrf>({
        api_url: `${import.meta.env.VITE_BASE_API_URL}/presences/master/show-all`,
        limit: 12,
        query_key: ['all-presences'],
        stale_time: Infinity
    });

    const allPresencesData = { error, fetchNextPage, flatennedData, hasNextPage, isFetchingNextPage, isLoading };

    const { 
        error: availablePresenceError, 
        fetchNextPage: availablePresenceNextPage, 
        flatennedData: availableFlatennedData, 
        hasNextPage: availablePresenceHasNextPage, 
        isFetchingNextPage: availablePresenceIsFetchingNextPage, 
        isLoading: isFetchingIsLoading 
    } = infiniteScroll<PresenceSlotIntrf>({
        api_url: `${import.meta.env.VITE_BASE_API_URL}/presences/student/show-all`,
        limit: 12,
        query_key: ['all-presences-form'],
        stale_time: Infinity
    });

    const allAvailablePresences = { availablePresenceError, availablePresenceNextPage, availableFlatennedData, availablePresenceHasNextPage, availablePresenceIsFetchingNextPage, isFetchingIsLoading };

    return { 
        makeNewPresenceMt, 
        allPresencesData,
        allAvailablePresences,
        deleteAllPresencesMt, 
        deleteOnePresenceMt, 
        fillPresenceMt,
        handleInputChange,
        presence,
        presenceError, 
        setPresence,
        setPresenceError
    }
}