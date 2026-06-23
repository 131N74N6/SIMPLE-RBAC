import { Query, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AddUserIntrf, EditUserIntrf, UserInfoIntrf } from "../models/user.model";
import DataServices from "./data.service";
import useSearch from "../hooks/useSearch";
import { useUserStore } from "../stores/user.store";

export default function UserServices() {
    const queryClient = useQueryClient();
    const { addData, dataError, deleteData, editData, infiniteScroll, setDataError } = DataServices();
    const { debouncedSearch, search, setSearch } = useSearch();
    const { editUser, newUser, resetNewUser, selectedId, setEditUser, setNewUser, setSelectedId } = useUserStore();

    function isoToLocalDateTime(isoString: string): string {
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    const { 
        error: masterError, 
        flatennedData: flatennedMasterData, 
        fetchNextPage: fetchNextMasterData, 
        hasNextPage: masterHasNextPage, 
        isFetchingNextPage: isMasterFetchingNextPage, 
        isLoading: isMasterLoading 
    } = infiniteScroll<UserInfoIntrf>({
        api_url: `${import.meta.env.VITE_BASE_API_URL}/users/show-all-masters`,
        limit: 16,
        searched: debouncedSearch,
        stale_time: Infinity,
        query_key: debouncedSearch ? [`all-users-${debouncedSearch}`] : ['all-masters']
    });
    
    const paginatedMastersData = { 
        masterError, flatennedMasterData, fetchNextMasterData, 
        masterHasNextPage, isMasterFetchingNextPage, isMasterLoading 
    };

    const { 
        error: studentError, 
        flatennedData: flatennedStudentsData, 
        fetchNextPage: fetchNextStudentsData, 
        hasNextPage: stuentHasNextPage, 
        isFetchingNextPage: iStudentFetchingNextPage, 
        isLoading: isStudentsLoading 
    } = infiniteScroll<UserInfoIntrf>({
        api_url: `${import.meta.env.VITE_BASE_API_URL}/users/show-all-students`,
        limit: 16,
        searched: debouncedSearch,
        stale_time: Infinity,
        query_key: debouncedSearch ? [`all-users-${debouncedSearch}`] : ['all-students']
    });
    
    const paginatedStudentsData = { 
        studentError, flatennedStudentsData, fetchNextStudentsData, 
        stuentHasNextPage, iStudentFetchingNextPage, isStudentsLoading 
    };

    function handleSelectedId(id: string) {
        setSelectedId(prev => prev === id ? null : id);
    }

    const addUserMt = useMutation({
        mutationFn: async () => {
            await addData<AddUserIntrf>({
                api_url: `${import.meta.env.VITE_BASE_API_URL}/auth/register`,
                data: {
                    classname: newUser.classname.trim() || "-",
                    email: newUser.email.trim(),
                    password: newUser.password.trim(),
                    role: newUser.role.trim(),
                    username: newUser.username.trim()
                }
            });
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length !== 0 && typeof queryKey[0] === "string") {
                        return queryKey[0].startsWith('all-masters') || 
                        queryKey[0].startsWith('all-students') || 
                        queryKey[0].startsWith('all-students-class');
                    }
                    return false;
                }
            });
            
        }
    });

    const changeUserDataMt = useMutation({
        mutationFn: async (id: string) => {
            await editData<EditUserIntrf>({
                api_url: `${import.meta.env.VITE_BASE_API_URL}/users/admin/remake/${id}`,
                data: {
                    classname: newUser.classname.trim() || "-",
                    created_at: new Date(editUser.created_at!).toISOString(),
                    email: editUser.email?.trim(),
                    username: editUser.username?.trim(),
                    role: editUser.role?.trim()
                }
            });
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length !== 0 && typeof queryKey[0] === "string") {
                        return queryKey[0].startsWith('all-masters') || 
                        queryKey[0].startsWith('all-students') || 
                        queryKey[0].startsWith('all-students-class');
                    }
                    return false;
                }
            });
            resetNewUser();
        },
        onSettled: () => {
            setSelectedId(null);
        }
    });

    const deleteAllMastersMt = useMutation({
        mutationFn: async () => {
            await deleteData(`${import.meta.env.VITE_BASE_API_URL}/users/admin/rm-all-masters`);
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length !== 0 && typeof queryKey[0] === "string") {
                        return queryKey[0].startsWith('all-masters');
                    }
                    return false;
                }
            });
        }
    });

    const deleteMasterMt = useMutation({
        mutationFn: async (id: string) => {
            await deleteData(`${import.meta.env.VITE_BASE_API_URL}/users/admin/rm-master/${id}`);
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length !== 0 && typeof queryKey[0] === "string") {
                        return queryKey[0].startsWith('all-masters');
                    }
                    return false;
                }
            });
        }
    });

    const deleteAllStudentsMt = useMutation({
        mutationFn: async () => {
            await deleteData(`${import.meta.env.VITE_BASE_API_URL}/users/admin/rm-all-students`);
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length !== 0 && typeof queryKey[0] === "string") {
                        return queryKey[0].startsWith('all-students') || 
                        queryKey[0].startsWith('all-students-class');
                    }
                    return false;
                }
            });
        }
    });

    const deleteStudentMt = useMutation({
        mutationFn: async (id: string) => {
            await deleteData(`${import.meta.env.VITE_BASE_API_URL}/users/admin/rm-student/${id}`);
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length !== 0 && typeof queryKey[0] === "string") {
                        return queryKey[0].startsWith('all-students') || 
                        queryKey[0].startsWith('all-students-class');
                    }
                    return false;
                }
            });
        }
    });

    const isProcessing = addUserMt.isPending || 
    changeUserDataMt.isPending || 
    deleteAllMastersMt.isPending || 
    deleteAllStudentsMt.isPending ||
    deleteMasterMt.isPending || 
    deleteStudentMt.isPending

    return { 
        addUserMt, 
        changeUserDataMt, 
        dataError, 
        deleteAllMastersMt, 
        deleteMasterMt, 
        deleteAllStudentsMt, 
        deleteStudentMt, 
        editUser, 
        handleSelectedId,
        isProcessing,
        isoToLocalDateTime, 
        newUser, 
        paginatedMastersData, 
        paginatedStudentsData, 
        search, 
        selectedId, 
        setSelectedId, 
        setDataError, 
        setEditUser, 
        setNewUser, 
        setSearch 
    };
}