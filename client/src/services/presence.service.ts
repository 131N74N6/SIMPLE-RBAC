import { Query, useMutation, useQueryClient } from "@tanstack/react-query";
import DataServices from "./data.service";
import type { FillPresenceIntrf, MakePresenceIntrf, PresenceSericeIntrf, PresenceSlotIntrf } from "../models/presence.model";
import { usePresenceStore } from "../stores/presence.store";
import AuthServices from "./auth.service";

export default function PresenceServices(props?: PresenceSericeIntrf) {
    const queryClient = useQueryClient();
    const { currentUserId } = AuthServices();
    const { addData, deleteData, getData, infiniteScroll } = DataServices();
    
    const presence = usePresenceStore((state) => state.presence);
    const resetPresence = usePresenceStore((state) => state.resetPresence);
    const setPresence = usePresenceStore((state) => state.setPresence);
    
    const fillPresenceMt = useMutation({
        mutationFn: async (props: FillPresenceIntrf) => {
            await addData<FillPresenceIntrf>({
                api_url: `${import.meta.env.VITE_BASE_API_URL}/presences/student/fill`,
                data: { 
                    presence_slot_id: props.presence_slot_id,
                    status: props.status.trim()
                }
            });
        },
        onError(error) {
            props?.setMessage!(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`is-filled-${currentUserId}-`) ||
                        queryKey[0].startsWith(`all-presences-form-${currentUserId}`);
                    }
                    return false;
                }
            });
        },
        onSettled: () => {
            resetPresence();
        }
    });

    const makeNewPresenceMt = useMutation({
        mutationFn: async () => {
            await addData<MakePresenceIntrf>({
                api_url: `${import.meta.env.VITE_BASE_API_URL}/presences/master/make`,
                data: { 
                    start_time: new Date(presence.start_time).toISOString(),
                    deadline: new Date(presence.deadline).toISOString(),
                    classname: presence.classname.trim(), 
                }
            });
        },
        onError(error) {
            props?.setMessage!(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`all-presences-${currentUserId}`] });
        },
        onSettled: () => {
            resetPresence();
        }
    });
    
    const deleteAllPresencesMt = useMutation({
        mutationFn: async () => {
            await deleteData(`${import.meta.env.VITE_BASE_API_URL}/presences/master/rm-all`);
        },
        onError(error) {
            props?.setMessage!(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`is-filled-${currentUserId}-`) ||
                        queryKey[0].startsWith(`all-presences-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-presences-form-${currentUserId}`);
                    }
                    return false;
                }
            });
        },
        onSettled: () => {
            resetPresence();
        }
    });
    
    const deleteOnePresenceMt = useMutation({
        mutationFn: async (id: string) => {
            await deleteData(`${import.meta.env.VITE_BASE_API_URL}/presences/master/rm/${id}`);
        },
        onError(error) {
            props?.setMessage!(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`is-filled-${currentUserId}-`) ||
                        queryKey[0].startsWith(`all-presences-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-presences-form-${currentUserId}`);
                    }
                    return false;
                }
            });
        },
        onSettled: () => {
            resetPresence();
        }
    });

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
        query_key: [`all-presences-${currentUserId}`],
        stale_time: Infinity
    });

    const allPresenceSlots = { error, fetchNextPage, flatennedData, hasNextPage, isFetchingNextPage, isLoading };

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
        query_key: [`all-presences-form-${currentUserId}`],
        stale_time: Infinity
    });

    const allAvailablePresenceForms = { 
        availablePresenceError, 
        availablePresenceNextPage, 
        availableFlatennedData, 
        availablePresenceHasNextPage, 
        availablePresenceIsFetchingNextPage, 
        isFetchingIsLoading
    };

    return { 
        makeNewPresenceMt, 
        allPresenceSlots,
        allAvailablePresenceForms,
        currentUserId,
        deleteAllPresencesMt, 
        deleteOnePresenceMt, 
        fillPresenceMt,
        getData,
        presence,
        setPresence,
    }
}