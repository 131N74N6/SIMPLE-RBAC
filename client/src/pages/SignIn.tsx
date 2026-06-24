import { useEffect, useState } from "react";
import AuthServices from "../services/auth.service";
import { useNavigate } from "react-router";

export default function SignIn() {
    const navigate = useNavigate();
    const { currentUserId, currentRole, setUserError, signIn, userError, userLoading } = AuthServices();
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (currentUserId && !userLoading) {
            if (currentRole === 'admin') navigate('/admin/students');
            else if (currentRole === 'master') navigate('/master/presences');
            else if (currentRole === 'student') navigate('/student/fill-presence');
            else navigate('/sign-in');
        }
    }, [currentUserId, currentRole, navigate, userLoading]);

    useEffect(() => {
        if (userError) {
            const timer = setTimeout(() => setUserError(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [userError, setUserError]);

    async function handleSubmit(event: React.SyntheticEvent) {
        event.preventDefault();
        await signIn.mutateAsync({ password, username });
    }

    return (
        <div className="flex justify-center items-center p-4 h-screen bg-blue-950">
            <form className="border border-blue-300 text-blue-300 font-medium p-4 rounded-2xl w-90 flex flex-col gap-4" onSubmit={handleSubmit}>
                <h3 className="text-2xl text-center">Hello</h3>
                <div className="relative flex flex-col gap-2">
                    <label htmlFor="username">Username</label>
                    <input 
                        type="text" 
                        className="p-2 border border-blue-300 outline-0 rounded"
                        name="username"
                        id="username"
                        value={username}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)}
                    />
                </div>
                <div className="relative flex flex-col gap-2">
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        className="p-2 border border-blue-300 outline-0 rounded"
                        name="password"
                        id="password"
                        value={password}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={userLoading || signIn.isPending}
                    className="bg-blue-300 hover:bg-blue-400 cursor-pointer p-2 rounded text-blue-950 disabled:cursor-not-allowed disabled:bg-blue-200 disabled:text-blue-500"
                >
                    {signIn.isPending ? "Signing In..." : "Sign In"}
                </button>
                {userError ? <span className="text-olive-50 font-medium text-center">{userError}</span> : null}
            </form>
        </div>
    );
}