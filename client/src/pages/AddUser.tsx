import AdminNavbar from "../components/AdminNavbar";
import UserServices from "../services/user.service";
import useError from "../hooks/useError";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

export default function AddUser() {
    const { error, setError } = useError();
    const { addUserMt, setNewUser, newUser } = UserServices({ setMessage: setError });
    const [showPassword, setShowPassword] = useState(false);

    function passwordToggle() {
        setShowPassword(!showPassword);
    }

    function handleSubmit(event: React.SyntheticEvent) {
        event.preventDefault();
        addUserMt.mutate();
    }

    return (
        <section className="flex md:flex-row flex-col h-screen relative z-10 font-mono">
            <form className="flex flex-col gap-3 h-full md:w-3/4 w-full bg-gray-950 p-2.5" onSubmit={handleSubmit}>
                <label className="text-blue-300" htmlFor="Username">Username</label>
                <input 
                    type="text" 
                    placeholder="Username"
                    id="Username"
                    name="username"
                    value={newUser.username}
                    onChange={(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => setNewUser("username", event.target.value)}
                    className="w-full font-mono shadow-[3px_3px_0px_0px] shadow-blue-300 outline-0 border border-blue-300 flex flex-col gap-2.5 text-blue-300 font-medium p-2.5 rounded-[10px]"
                />
                <label className="text-blue-300" htmlFor="Classname">Class</label>
                <input 
                    type="text" 
                    placeholder="Classname"
                    id="Classname"
                    name="classname"
                    value={newUser.classname}
                    onChange={(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => setNewUser("classname", event.target.value)}
                    className="w-full font-mono shadow-[3px_3px_0px_0px] shadow-blue-300 outline-0 border border-blue-300 flex flex-col gap-2.5 text-blue-300 font-medium p-2.5 rounded-[10px]"
                />
                <label className="text-blue-300" htmlFor="Email">Email</label>
                <input 
                    type="email" 
                    placeholder="Email"
                    id="Email"
                    name="email"
                    value={newUser.email}
                    onChange={(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => setNewUser("email", event.target.value)}
                    className="w-full font-mono shadow-[3px_3px_0px_0px] shadow-blue-300 outline-0 border border-blue-300 flex flex-col gap-2.5 text-blue-300 font-medium p-2.5 rounded-[10px]"
                />
                <label className="text-blue-300" htmlFor="Password">Password</label>
                <div className="relative">
                    <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Password"
                        id="Password"
                        name="password"
                        value={newUser.password}
                        onChange={(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => setNewUser("password", event.target.value)}
                        className="w-full font-mono shadow-[3px_3px_0px_0px] shadow-blue-300 outline-0 border border-blue-300 flex flex-col gap-2.5 text-blue-300 font-medium p-2.5 rounded-[10px]"
                    />
                    <button
                        type="button"
                        onClick={passwordToggle}
                        disabled={addUserMt.isPending}
                        className="text-blue-300 disabled:cursor-not-allowed absolute inset-y-0 right-0 flex cursor-pointer items-center px-3 hover:text-blue-400 transition-colors"
                    >
                        {showPassword ? <EyeClosed/> : <Eye/>}
                    </button>
                </div>
                <label className="text-blue-300" htmlFor="Role">Role</label>
                <input 
                    type="text" 
                    placeholder="Role"
                    id="Role"
                    name="role"
                    value={newUser.role}
                    onChange={(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => setNewUser("role", event.target.value)}
                    className="w-full font-mono shadow-[3px_3px_0px_0px] shadow-blue-300 outline-0 border border-blue-300 flex flex-col gap-2.5 text-blue-300 font-medium p-2.5 rounded-[10px]"
                />
                <div>
                    <button 
                        type="submit"
                        disabled={addUserMt.isPending}
                        className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white font-medium font-mono py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Add User
                    </button>
                </div>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>
            {AdminNavbar(addUserMt.isPending)}
        </section>
    )
}