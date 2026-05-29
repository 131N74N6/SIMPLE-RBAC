import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AddUserIntrf, EditUserIntrf, UserItemIntrf } from "../models/user-model";
import DataServices from "./data.service";
import { useState } from "react";
import useDebounce from "../hooks/useDebounce";

export default function UserServices() {
    const queryClient = useQueryClient();
    const { addData, dataError, deleteData, editData, infiniteScroll, setDataError } = DataServices();

    const [searchedUser, setSearchedUser] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [newUser, setNewUser] = useState<AddUserIntrf>({ username: "", email: "", password: "", role: "" });
    const [editUser, setEditUser] = useState<EditUserIntrf>({ created_at: '', email: '', role: '', username: '' });
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const deboundedSearchUser = useDebounce<string>(searchedUser, 500);

    function isoToLocalDateTime(isoString: string): string {
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    const { error, flatennedData, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = infiniteScroll<UserItemIntrf>({
        api_url: `${import.meta.env.VITE_BASE_API_URL}/users/admin-only/show`,
        limit: 16,
        searched: deboundedSearchUser,
        stale_time: 1800000,
        query_key: deboundedSearchUser ? [`all-users-${deboundedSearchUser}`] : ['all-users']
    });
    
    const paginatedUsersData = { error, flatennedData, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading };

    function handleSelectedId(id: string) {
        setSelectedId(prev => prev === id ? null : id);
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewUser(prev => ({ ...prev, [event.target.name]: event.target.value }));
    }

    const addUserMt = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async () => {
            await addData<AddUserIntrf>({
                api_url: `${import.meta.env.VITE_BASE_API_URL}/auth/register`,
                data: {
                    username: newUser.username.trim(),
                    email: newUser.email.trim(),
                    password: newUser.password.trim(),
                    role: newUser.role.trim()
                }
            });
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-users'] });
            queryClient.invalidateQueries({ queryKey: [`all-users-${deboundedSearchUser}`] });
            setNewUser({ username: "", email: "", password: "", role: "" });
        },
        onSettled: () => setIsProcessing(false)
    });

    const changeUserDataMt = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async (id: string) => {
            await editData<UserItemIntrf>({
                api_url: `${import.meta.env.VITE_BASE_API_URL}/users/admin-only/change/${id}`,
                data: {
                    created_at: new Date(editUser.created_at!).toISOString(),
                    email: editUser.email?.trim(),
                    username: editUser.username?.trim(),
                    role: editUser.role?.trim()
                }
            });
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-users'] });
            queryClient.invalidateQueries({ queryKey: [`all-users-${deboundedSearchUser}`] });
        },
        onSettled: () => {
            setIsProcessing(false);
            setSelectedId(null);
        }
    });

    const deleteAllUsersMt = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async () => {
            await deleteData(`${import.meta.env.VITE_BASE_API_URL}/users/admin-only/rm-all`);
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-users'] });
            queryClient.invalidateQueries({ queryKey: [`all-users-${deboundedSearchUser}`] });
        },
        onSettled: () => setIsProcessing(false)
    });

    const deleteUserMt = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async (id: string) => {
            await deleteData(`${import.meta.env.VITE_BASE_API_URL}/users/admin-only/rm/${id}`);
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-users'] });
            queryClient.invalidateQueries({ queryKey: [`all-users-${deboundedSearchUser}`] });
        },
        onSettled: () => setIsProcessing(false)
    });

    return { 
        addUserMt, changeUserDataMt, dataError, deleteAllUsersMt, deleteUserMt, editUser, handleInputChange, handleSelectedId,
        isoToLocalDateTime, isProcessing, newUser, paginatedUsersData, searchedUser, selectedId, setSelectedId, setDataError, 
        setEditUser, setNewUser, setSearchedUser 
    };
}