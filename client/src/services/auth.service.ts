import { useEffect, useState } from "react";
import type { SignInIntrf, UserInfoIntrf } from "../models/user-model";
import { useNavigate } from "react-router-dom";

export default function AuthServices() {
    const [user, setUser] = useState<UserInfoIntrf | null>(null);
    const [userLoading, setUserLoading] = useState<boolean>(true);
    const [userError, setUserError] = useState<string | null>(null);

    const currentUserId = user && user.user_id;
    const currentUserToken = user && user.token;
    const currentRole = user && user.role;

    const navigate = useNavigate();

    useEffect(() => {
        function initAuth() {
            try {
                const userExist = localStorage.getItem('user');
                if (userExist) {
                    const parsedUser = JSON.parse(userExist);
                    setUser(parsedUser);
                }
            } catch (err: any) {
                localStorage.removeItem('user');
                setUser(null);
                setUserError(err.message || 'Failed to retrieve user data. Please sign in again.');
            } finally {
                setUserLoading(false); 
            }
        };

        initAuth();
    }, []);

    async function signIn(props: SignInIntrf) {
        setUserLoading(true);
        setUserError(null);

        try {
            const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/auth/signin`, {
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: props.username.trim(),
                    password: props.password.trim()
                }),
                method: 'POST'
            });

            const response = await request.json();

            if (!request.ok) {
                const errorMessage = response.error || response.message || 'Failed to sign in. Try again later';
                setUserError(errorMessage);
            } else {
                const userInfo: UserInfoIntrf = {
                    role: response.role,
                    token: response.token,
                    user_id: response.user_id
                }
                localStorage.setItem('user', JSON.stringify(userInfo));
                setUser(userInfo);
            }
        } catch (error: any) {
            setUserError(error.message || 'something went wrong. try again later');
            setUser(null);
        } finally {
            setUserLoading(false);
        }
    }

    function quit() {
        setUserLoading(true);
        setUserError(null);

        try {
            localStorage.removeItem('user');
            setUser(null);
            navigate('/sign-in');
        } catch (error: any) {
            setUserError(error.message || 'something went wrong. try again later');
        } finally {
            setUserLoading(false);
        }
    }

    return { currentRole, currentUserToken, currentUserId, quit, setUserError, signIn, userLoading, userError }
}