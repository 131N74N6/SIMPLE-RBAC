import { useEffect, useState } from "react";
import type { SignInIntrf, UserInfoIntrf } from "../models/user.model";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SocketServices from "./socket-io.service";

export default function AuthServices() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [userError, setUserError] = useState<string | null>(null);
    
    const { data: currentUserData, isLoading: userLoading } = useQuery<UserInfoIntrf | null>({
        queryKey: ['auth-user'],
        queryFn: async () => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/users/show`, {
                    credentials: 'include', 
                    method: 'GET',
                });

                if (!request.ok) return null;
                else return await request.json();
            } catch (err) {
                return null;
            }
        },
        staleTime: Infinity,
        retry: false
    });

    const currentUserId = currentUserData ? currentUserData.user_id : null;
    const currentUserName = currentUserData ? currentUserData.username : null;
    const currentRole = currentUserData ? currentUserData.role : null;

    useEffect(() => {
        if (currentUserId) {
            SocketServices().connect(currentUserId);
        }
    }, [currentUserId]);

    const signIn = useMutation({
        mutationFn: async (props: SignInIntrf) => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/auth/signin`, {
                    credentials: 'include',
                    body: JSON.stringify({
                        username: props.username.trim(),
                        password: props.password.trim()
                    }),
                    headers: { "Content-Type": "application/json" },
                    method: 'POST'
                });

                const response = await request.json();

                if (!request.ok) {
                    const errorMessage = response.error || response.message || 'Failed to sign in. Try again later';
                    throw new Error(errorMessage);
                } else {
                    return response
                }
            } catch (error: any) {
                throw error;
            }
        },
        onError: (error) => {
            setUserError(error.message || 'something went wrong. try again later');
            navigate('/sign-in');
        },
        onSuccess: async (response) => {
            await queryClient.invalidateQueries({ queryKey: ['auth-user'] });

            if (response.role === 'admin') {
                navigate('/admin/home');
            } else if (response.role === 'master') {
                navigate('/master/home');
            } else if (response.role === 'student') {
                navigate('/student/home');
            } else {
                navigate('/sign-in');
            }
        }
    });

    async function quit() {
        setUserError(null);
        try {
            await fetch(`${import.meta.env.VITE_BASE_API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error: any) {
            // Tetap lanjutkan proses logout di frontend meskipun request API logout gagal
        } finally {
            queryClient.setQueryData(['auth-user'], null);
            queryClient.clear();
            SocketServices().disconnect();
            navigate('/sign-in');
        }
    }

    return { currentRole, currentUserData, currentUserName, currentUserId, quit, setUserError, signIn, userLoading, userError }
}