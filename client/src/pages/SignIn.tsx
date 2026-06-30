import { useEffect, useState } from "react";
import AuthServices from "../services/auth.service";
import { useNavigate } from "react-router";
import { Eye, EyeClosed, SquareCheck } from "lucide-react";

export default function SignIn() {
    const navigate = useNavigate();
    const { currentUserId, currentRole, setUserError, signIn, userError, userLoading } = AuthServices();
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (currentUserId && !userLoading) {
            if (currentRole === 'admin') navigate('/admin/home');
            else if (currentRole === 'master') navigate('/master/home');
            else if (currentRole === 'student') navigate('/student/home');
            else navigate('/sign-in');
        }
    }, [currentUserId, currentRole, navigate, userLoading]);

    useEffect(() => {
        if (userError) {
            const timer = setTimeout(() => setUserError(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [userError, setUserError]);

    function passwordToggle() {
        setShowPassword(!showPassword);
    }

    async function handleSubmit(event: React.SyntheticEvent) {
        event.preventDefault();
        await signIn.mutateAsync({ password, username });
    }

    return (
        <div className="flex justify-center items-center p-4 h-screen bg-gray-950">
            <form className="border border-blue-300 text-blue-300 font-medium p-4 rounded-2xl w-90 flex flex-col gap-4" onSubmit={handleSubmit}>
                <h3 className="flex justify-center"><SquareCheck size={38}/></h3>
                <div className="relative flex flex-col gap-2">
                    <label htmlFor="username">Username</label>
                    <input 
                        type="text" 
                        className="w-full p-2 border border-blue-300 outline-0 rounded"
                        name="username"
                        id="username"
                        placeholder="your username..."
                        value={username}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="password">Password</label>
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            className="w-full p-2 border border-blue-300 outline-0 rounded pr-10"
                            name="password"
                            id="password"
                            placeholder="your password..."
                            value={password}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                        />
                        <button
                            type="button"
                            onClick={passwordToggle}
                            disabled={userLoading || signIn.isPending}
                            className="text-blue-300 disabled:cursor-not-allowed absolute inset-y-0 right-0 flex cursor-pointer items-center px-3 hover:text-blue-400 transition-colors"
                        >
                            {showPassword ? <EyeClosed/> : <Eye/>}
                        </button>
                    </div>
                </div>
                <button 
                    type="submit" 
                    disabled={userLoading || signIn.isPending}
                    className="bg-blue-300 transition-colors hover:bg-blue-400 cursor-pointer p-2 rounded text-blue-950 disabled:cursor-not-allowed disabled:bg-blue-200 disabled:text-blue-500"
                >
                    {signIn.isPending ? "Signing In..." : "Sign In"}
                </button>
                {userError ? <span className="text-olive-50 font-medium text-center">{userError}</span> : null}
            </form>
        </div>
    );
}