import { useState } from "react";
import type { SignInIntrf, UserInfoIntrf } from "../models/user-model";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function AuthServices() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [userError, setUserError] = useState<string | null>(null);
    
    const { data: currentUserData, isLoading: userLoading } = useQuery<UserInfoIntrf | null>({
        queryKey: ['auth-user'],
        queryFn: async () => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/users/show`, {
                    credentials: 'include', // 🔑 CRITICAL: Agar browser mau mengirim HttpOnly Cookie
                    method: 'GET',
                });

                if (!request.ok) return null;
                else return await request.json();
            } catch (err) {
                return null;
            }
        },
        staleTime: 1800000, // Data auth dianggap segar selama 30 menit tanpa re-fetch berlebih
        retry: false       // Jangan lakukan retry jika user memang belum login
    });

    const currentUserId = currentUserData ? currentUserData.user_id : null;
    const currentUserName = currentUserData ? currentUserData.username : null;
    const currentRole = currentUserData ? currentUserData.role : null;

    console.log(currentRole, currentUserName, currentUserId);

    async function signIn(props: SignInIntrf) {
        setUserError(null);

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
                setUserError(errorMessage);
            } else {
                await queryClient.invalidateQueries({ queryKey: ['auth-user'] });

                if (response.role === 'admin') {
                    navigate('/admin/page');
                } else if (response.role === 'user') {
                    navigate('/user/page');
                } else {
                    navigate('/sign-in');
                }
            }
        } catch (error: any) {
            setUserError(error.message || 'something went wrong. try again later');
            navigate('/sign-in');
        }
    }

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
            navigate('/sign-in');
        }
    }

    return { currentRole, currentUserData, currentUserName, currentUserId, quit, setUserError, signIn, userLoading, userError }
}