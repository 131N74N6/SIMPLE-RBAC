import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AddUserIntrf, UserItemIntrf } from "../models/user-model";
import DataServices from "./data.service";
import { useState } from "react";

export default function UserServices() {
    const queryClient = useQueryClient();
    const { addData, dataError, deleteData, editData, infiniteScroll, setDataError } = DataServices();
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [newUser, setNewUser] = useState({ username: "", email: "", password: "", role: "" });

    const { error, flatennedData, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = infiniteScroll<UserItemIntrf>({
        api_url: `${import.meta.env.VITE_BASE_API_URL}/users/admin-only/show`,
        limit: 10,
        stale_time: 1800000,
        query_key: ['all-users']
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const paginatedUsersData = { error, flatennedData, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading }

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
                    username: newUser.username.trim(),
                    role: newUser.role.trim()
                }
            });
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-users'] });
            setNewUser({ username: "", email: "", password: "", role: "" });
        },
        onSettled: () => setIsProcessing(false)
    });

    const deleteAllUsersMt = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async () => {
            await deleteData(`${import.meta.env.VITE_BASE_API_URL}/users/admin-only/rm-all`);
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-users'] });
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
        },
        onSettled: () => setIsProcessing(false)
    });

    return { addUserMt, changeUserDataMt, dataError, deleteAllUsersMt, deleteUserMt, handleInputChange, isProcessing, newUser, paginatedUsersData, setDataError };
}