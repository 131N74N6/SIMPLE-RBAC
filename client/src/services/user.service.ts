import { Query, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AddUserIntrf, IMaster, IStudent, UserServiceIntrf } from "../models/user.model";
import DataServices from "./data.service";
import useSearch from "../hooks/useSearch";
import { useUserStore } from "../stores/user.store";
import AuthServices from "./auth.service";

export default function UserServices(props?: UserServiceIntrf) {
    const queryClient = useQueryClient();
    const { currentUserId } = AuthServices();
    const { addData, deleteData, editData, infiniteScroll } = DataServices();
    const { debouncedSearch, search, setSearch } = useSearch();

    const handleSelectedId = useUserStore((state) => state.handleSelectedId);
    const editUser = useUserStore((state) => state.editUser);
    const newUser = useUserStore((state) => state.newUser);
    const resetEditUser = useUserStore((state) => state.resetEditUser);
    const resetNewUser = useUserStore((state) => state.resetNewUser);
    const setEditUser = useUserStore((state) => state.setEditUser);
    const selectedId = useUserStore((state) => state.selectedId);
    const setNewUser = useUserStore((state) => state.setNewUser);

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
    } = infiniteScroll<IMaster>({
        api_url: `${import.meta.env.VITE_BASE_API_URL}/users/show-all-masters`,
        limit: 16,
        searched: debouncedSearch,
        stale_time: Infinity,
        query_key: debouncedSearch ? [`all-masters-${debouncedSearch}`] : ['all-masters']
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
    } = infiniteScroll<IStudent>({
        api_url: `${import.meta.env.VITE_BASE_API_URL}/users/show-all-students`,
        limit: 16,
        searched: debouncedSearch,
        stale_time: Infinity,
        query_key: debouncedSearch ? [`all-students-${debouncedSearch}`] : ['all-students']
    });
    
    const paginatedStudentsData = { 
        studentError, flatennedStudentsData, fetchNextStudentsData, 
        stuentHasNextPage, iStudentFetchingNextPage, isStudentsLoading 
    };

    const { 
        error: studentError2, 
        flatennedData: flatennedStudentsData2, 
        fetchNextPage: fetchNextStudentsData2, 
        hasNextPage: stuentHasNextPage2, 
        isFetchingNextPage: iStudentFetchingNextPage2, 
        isLoading: isStudentsLoading2 
    } = infiniteScroll<IStudent>({
        api_url: `${import.meta.env.VITE_BASE_API_URL}/classes/students/${props?.classname}`,
        enabled: !!props?.classname,
        limit: 16,
        searched: debouncedSearch,
        stale_time: Infinity,
        query_key: debouncedSearch ? [`all-students-class-${props?.classname}-${debouncedSearch}`] : [`all-students-class-${props?.classname}`]
    });
    
    const getAllStudentsByClass = { 
        studentError2, flatennedStudentsData2, fetchNextStudentsData2, 
        stuentHasNextPage2, iStudentFetchingNextPage2, isStudentsLoading2 
    };

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
        onError: (error) => {
            props?.setMessage!(error.message);
        },
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
        },
        onSettled: () => {
            resetNewUser();
        }
    });

    const changeMasterDataMt = useMutation({
        mutationFn: async (id: string) => {
            await editData<IMaster>({
                api_url: `${import.meta.env.VITE_BASE_API_URL}/users/admin/remake-master/${id}`,
                data: {
                    created_at: new Date(editUser.created_at!).toISOString(),
                    email: editUser.email?.trim(),
                    username: editUser.username?.trim(),
                    role: editUser.role?.trim()
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
                    if (Array.isArray(queryKey) && queryKey.length !== 0 && typeof queryKey[0] === "string") {
                        return queryKey[0].startsWith('all-masters');
                    }
                    return false;
                }
            });
            resetEditUser();
        }
    });

    const changeStudentDataMt = useMutation({
        mutationFn: async (id: string) => {
            await editData<IStudent>({
                api_url: `${import.meta.env.VITE_BASE_API_URL}/users/admin/remake-student/${id}`,
                data: {
                    classname: editUser.classname.trim(),
                    created_at: new Date(editUser.created_at!).toISOString(),
                    email: editUser.email?.trim(),
                    username: editUser.username?.trim(),
                    role: editUser.role?.trim()
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
                    if (Array.isArray(queryKey) && queryKey.length !== 0 && typeof queryKey[0] === "string") {
                        return queryKey[0].startsWith('all-students') || 
                        queryKey[0].startsWith('all-students-class');
                    }
                    return false;
                }
            });
            resetEditUser();
        }
    });

    const deleteAllMastersMt = useMutation({
        mutationFn: async () => {
            await deleteData(`${import.meta.env.VITE_BASE_API_URL}/users/admin/rm-all-masters`);
        },
        onError: (error) => {
            props?.setMessage!(error.message);
        },
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
        onError: (error) => {
            props?.setMessage!(error.message);
        },
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
        onError: (error) => {
            props?.setMessage!(error.message);
        },
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

    const deleteAllStudentsByClassMt = useMutation({
        mutationFn: async () => {
            await deleteData(`${import.meta.env.VITE_BASE_API_URL}/users/admin/rm-students-by-class`);
        },
        onError: (error) => {
            props?.setMessage!(error.message);
        },
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
        onError: (error) => {
            props?.setMessage!(error.message);
        },
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
    changeMasterDataMt.isPending ||
    changeStudentDataMt.isPending || 
    deleteAllMastersMt.isPending || 
    deleteAllStudentsMt.isPending ||
    deleteMasterMt.isPending || 
    deleteStudentMt.isPending

    return { 
        addUserMt, 
        changeMasterDataMt,
        changeStudentDataMt, 
        currentUserId,
        deleteAllMastersMt, 
        deleteMasterMt, 
        deleteAllStudentsMt, 
        deleteAllStudentsByClassMt,
        deleteStudentMt, 
        editUser, 
        getAllStudentsByClass,
        handleSelectedId,
        isProcessing,
        isoToLocalDateTime, 
        newUser, 
        paginatedMastersData, 
        paginatedStudentsData, 
        search, 
        selectedId, 
        setEditUser, 
        setNewUser, 
        setSearch 
    };
}