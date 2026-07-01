import { Query, useMutation, useQueryClient } from "@tanstack/react-query";
import DataServices from "./data.service";
import type { FillPresenceIntrf, PresenceFormIntrf, PresenceSericeIntrf, PresenceSlotIntrf } from "../models/presence-slot.model";
import { usePresenceStore } from "../stores/presence.store";
import AuthServices from "./auth.service";
import type { IEditStudentPresence, StudentPresenceIntrf } from "../models/student-presence.model";
import useSearch from "../hooks/useSearch";

export default function PresenceServices(props?: PresenceSericeIntrf) {
    const queryClient = useQueryClient();
    const { currentUserId, currentClassName, currentRole } = AuthServices();
    const { addData, deleteData, editData, getData, infiniteScroll } = DataServices();
    const { search, setSearch, debouncedSearch } = useSearch();
    
    const editStudentStatus = usePresenceStore((state) => state.editStudentStatus);
    const editPresenceForm = usePresenceStore((state) => state.editPresenceForm);

    const presenceForm = usePresenceStore((state) => state.presenceForm);
    const studentStatus = usePresenceStore((state) => state.studentStatus);

    const selectedFormId = usePresenceStore((state) => state.selectedFormId);
    const selectedPresenceStatusId = usePresenceStore((state) => state.selectedPresenceStatusId);

    const handleSelectedFormId = usePresenceStore((state) => state.handleSelectedFormId);
    const handleSelectedPresenceStatusId = usePresenceStore((state) => state.handleSelectedPresenceStatusId);

    const resetEditPresenceForm = usePresenceStore((state) => state.resetEditPresenceForm);
    const resetPresenceForm = usePresenceStore((state) => state.resetPresenceForm);
    const resetEditPresenceStatus = usePresenceStore((state) => state.resetEditPresenceStatus);

    const setEditPresenceForm = usePresenceStore((state) => state.setEditPresenceForm);
    const setEditStudentStatus = usePresenceStore((state) => state.setEditStudentStatus);

    const setPresenceForm = usePresenceStore((state) => state.setPresenceForm);
    const setStudentStatus = usePresenceStore((state) => state.setStudentStatus);
    
    const deleteAllPresencesMt = useMutation({
        mutationFn: async () => {
            await deleteData(`${import.meta.env.VITE_BASE_API_URL}/presence-forms/rm-all`);
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
                        queryKey[0].startsWith(`all-presences-form-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-presences-for-admin-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-presences-for-master-${currentUserId}`) ||
                        queryKey[0].startsWith(`presence-details-${currentUserId}-${props?.form_id}`);
                    }
                    return false;
                }
            });
            resetEditPresenceForm();
        }
    });

    const deleteAllPresencesForAdminMt = useMutation({
        mutationFn: async () => {
            await deleteData(`${import.meta.env.VITE_BASE_API_URL}/presence-forms/admin/rm-all`);
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
                        queryKey[0].startsWith(`all-presences-form-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-presences-for-admin-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-presences-for-master-${currentUserId}`) ||
                        queryKey[0].startsWith(`presence-details-${currentUserId}-${props?.form_id}`);
                    }
                    return false;
                }
            });
            resetEditPresenceForm();
        }
    });
    
    const deleteOnePresenceMt = useMutation({
        mutationFn: async (id: string) => {
            await deleteData(`${import.meta.env.VITE_BASE_API_URL}/presence-forms/rm/${id}`);
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
                        queryKey[0].startsWith(`all-presences-for-admin-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-presences-for-master-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-presences-form-${currentUserId}`) ||
                        queryKey[0].startsWith(`presence-details-${currentUserId}-${props?.form_id}`);
                    }
                    return false;
                }
            });
            resetEditPresenceForm();
        }
    });
    
    const deleteAllStatusesesMt = useMutation({
        mutationFn: async () => {
            await deleteData(`${import.meta.env.VITE_BASE_API_URL}/student-presences/rm-all/${props?.form_id}`);
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
                        queryKey[0].startsWith(`all-presences-for-admin-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-presences-for-master-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-presences-form-${currentUserId}`) ||
                        queryKey[0].startsWith(`presence-details-${currentUserId}-${props?.form_id}`);
                    }
                    return false;
                }
            });
            resetEditPresenceForm();
        }
    });
    
    const deleteOneStatusMt = useMutation({
        mutationFn: async (id: string) => {
            await deleteData(`${import.meta.env.VITE_BASE_API_URL}/student-presences/rm/${id}`);
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
                        queryKey[0].startsWith(`all-presences-for-admin-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-presences-for-master-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-presences-form-${currentUserId}`) ||
                        queryKey[0].startsWith(`presence-details-${currentUserId}-${props?.form_id}`);
                    }
                    return false;
                }
            });
            resetEditPresenceForm();
        }
    });

    const editPresenceFormMt = useMutation({
        mutationFn: async (id: string) => {
            await editData<PresenceSlotIntrf>({
                api_url: `${import.meta.env.VITE_BASE_API_URL}/presence-forms/remake-form/${id}`,
                data: {
                    classname: editPresenceForm.classname.trim(),
                    deadline: new Date(editPresenceForm.deadline).toISOString(),
                    start_time: new Date(editPresenceForm.start_time).toISOString()
                }
            });
        },
        onError: (error) => {
            props?.setMessage!(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`all-presences-for-admin-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-presences-for-master-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-presences-form-${currentUserId}`);
                    }
                    return false;
                }
            });
            resetEditPresenceForm();
        }
    });

    const editPresenceStatusMt = useMutation({
        mutationFn: async (props: IEditStudentPresence) => {
            await editData<FillPresenceIntrf>({
                api_url: `${import.meta.env.VITE_BASE_API_URL}/student-presences/remake-status/${props._id}`,
                data: { status: props.status.trim() }
            });
        },
        onError: (error) => {
            props?.setMessage!(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`is-filled-${currentUserId}-`) ||
                        queryKey[0].startsWith(`all-presences-for-admin-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-presences-for-master-${currentUserId}`) ||
                        queryKey[0].startsWith(`presence-details-${currentUserId}-${props?.form_id}`);
                    }
                    return false;
                }
            });
            resetEditPresenceStatus();
        }
    });
    
    const fillPresenceMt = useMutation({
        mutationFn: async (props: FillPresenceIntrf) => {
            await addData<FillPresenceIntrf>({
                api_url: `${import.meta.env.VITE_BASE_API_URL}/student-presences/fill`,
                data: { 
                    presence_creator_id: props.presence_creator_id,
                    presence_creator: props.presence_creator,
                    presence_slot_id: props.presence_slot_id,
                    status: props.status.trim()
                }
            });
        },
        onError: (error) => {
            props?.setMessage!(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`is-filled-${currentUserId}-`) ||
                        queryKey[0].startsWith(`all-presences-form-${currentUserId}`) ||
                        queryKey[0].startsWith(`presence-details-${currentUserId}-${props?.form_id}`);
                    }
                    return false;
                }
            });
        }
    });

    const makeNewPresenceMt = useMutation({
        mutationFn: async () => {
            await addData<PresenceFormIntrf>({
                api_url: `${import.meta.env.VITE_BASE_API_URL}/presence-forms/make-form`,
                data: { 
                    start_time: new Date(presenceForm.start_time).toISOString(),
                    deadline: new Date(presenceForm.deadline).toISOString(),
                    classname: presenceForm.classname.trim(), 
                }
            });
        },
        onError: (error) => {
            props?.setMessage!(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`all-presences-form-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-presences-for-admin-${currentUserId}`) ||
                        queryKey[0].startsWith(`all-presences-for-master-${currentUserId}`);
                    }
                    return false;
                }
            });
            resetPresenceForm();
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
        api_url: `${import.meta.env.VITE_BASE_API_URL}/presence-forms/master/show-all`,
        enabled: !!currentUserId && currentRole === "master",
        limit: 12,
        query_key: debouncedSearch ? [`all-presences-for-master-${currentUserId}-${debouncedSearch}`] : [`all-presences-for-master-${currentUserId}`],
        searched: debouncedSearch,
        stale_time: Infinity
    });

    const allPresenceSlots = { error, fetchNextPage, flatennedData, hasNextPage, isFetchingNextPage, isLoading };

    const { 
        error: error2, 
        fetchNextPage: fetchNextPage2, 
        flatennedData: flatennedData2, 
        hasNextPage: hasNextPage2, 
        isFetchingNextPage: isFetchingNextPage2, 
        isLoading: isLoading2
    } = infiniteScroll<PresenceSlotIntrf>({
        api_url: `${import.meta.env.VITE_BASE_API_URL}/presence-forms/admin/show-all`,
        enabled: !!currentUserId && currentRole === "admin",
        limit: 12,
        query_key: debouncedSearch ? [`all-presences-for-admin-${currentUserId}-${debouncedSearch}`] : [`all-presences-for-admin-${currentUserId}`],
        searched: debouncedSearch,
        stale_time: Infinity
    });

    const allPresencesForAdmin = { error2, fetchNextPage2, flatennedData2, hasNextPage2, isFetchingNextPage2, isLoading2 };

    const { 
        error: availablePresenceError, 
        fetchNextPage: availablePresenceNextPage, 
        flatennedData: availableFlatennedData, 
        hasNextPage: availablePresenceHasNextPage, 
        isFetchingNextPage: availablePresenceIsFetchingNextPage, 
        isLoading: isFetchingIsLoading 
    } = infiniteScroll<PresenceSlotIntrf>({
        api_url: `${import.meta.env.VITE_BASE_API_URL}/student-presences/show-all`,
        enabled: !!currentUserId && currentRole === "student",
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
    
    const { 
        error: presenceDetailError, 
        fetchNextPage: presenceDetailNextPage, 
        flatennedData: presenceDetailData, 
        hasNextPage: presenceDetailHasNextage, 
        isFetchingNextPage: presenceDetailIsFetchingNextPage, 
        isLoading: presenceDetailIsLoading 
    } = infiniteScroll<StudentPresenceIntrf>({
        api_url: `${import.meta.env.VITE_BASE_API_URL}/presence-forms/show-detail/${props?.form_id}`,
        enabled: !!currentUserId && !!props?.form_id && (currentRole === "master" || currentRole === "admin"),
        limit: 12,
        query_key: debouncedSearch ? 
        [`presence-details-${currentUserId}-${props?.form_id}-${debouncedSearch}`] : 
        [`presence-details-${currentUserId}-${props?.form_id}`],
        searched: debouncedSearch,
        stale_time: Infinity
    });

    const presenceDetails = { 
        presenceDetailError, 
        presenceDetailNextPage, 
        presenceDetailData, 
        presenceDetailHasNextage, 
        presenceDetailIsFetchingNextPage, 
        presenceDetailIsLoading
    };

    const isProcessing = allPresenceSlots.isLoading || 
    allPresencesForAdmin.isLoading2 ||
    allAvailablePresenceForms.isFetchingIsLoading ||
    editPresenceFormMt.isPending ||
    editPresenceStatusMt.isPending ||
    deleteAllPresencesMt.isPending || 
    deleteOnePresenceMt.isPending || 
    deleteAllPresencesForAdminMt.isPending ||
    deleteAllStatusesesMt.isPending ||
    deleteOneStatusMt.isPending ||
    fillPresenceMt.isPending ||
    presenceDetails.presenceDetailIsLoading ||
    makeNewPresenceMt.isPending;

    return { 
        allPresencesForAdmin,
        allPresenceSlots,
        allAvailablePresenceForms,
        currentClassName,
        currentRole,
        currentUserId,
        deleteAllPresencesMt, 
        deleteAllPresencesForAdminMt,
        deleteAllStatusesesMt,
        deleteOnePresenceMt, 
        editPresenceForm,
        deleteOneStatusMt,
        editPresenceFormMt,
        editPresenceStatusMt,
        editStudentStatus,
        fillPresenceMt,
        getData,
        handleSelectedFormId,
        handleSelectedPresenceStatusId,
        isProcessing,
        makeNewPresenceMt, 
        presenceDetails,
        presenceForm,
        search,
        selectedFormId,
        selectedPresenceStatusId,
        setEditPresenceForm,
        setEditStudentStatus,
        setPresenceForm,
        setSearch,
        setStudentStatus,
        studentStatus
    }
}