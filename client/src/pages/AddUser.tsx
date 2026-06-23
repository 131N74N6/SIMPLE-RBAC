import { useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import UserServices from "../services/user.service";

export default function AddUser() {
    const { addUserMt, dataError, setNewUser, newUser, setDataError } = UserServices();

    useEffect(() =>{
        if (dataError) {
            const timer = setTimeout(() => setDataError(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [dataError, setDataError]);

    function handleSubmit(event: React.SyntheticEvent) {
        event.preventDefault();
        addUserMt.mutate();
    }

    return (
        <div className="flex md:flex-row flex-col h-screen relative z-10 font-mono">
            <form className="flex flex-col gap-3 h-full md:w-3/4 w-full bg-white p-2.5" onSubmit={handleSubmit}>
                <label htmlFor="Username">Username</label>
                <input 
                    type="text" 
                    placeholder="Username"
                    id="Username"
                    name="username"
                    value={newUser.username}
                    onChange={(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => setNewUser("username", event.target.value)}
                    className="w-full font-mono shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] outline-0 border border-black flex flex-col gap-2.5 text-black font-medium p-2.5 rounded-[10px] bg-white"
                />
                <label htmlFor="Classname">Class</label>
                <input 
                    type="text" 
                    placeholder="Classname"
                    id="Classname"
                    name="classname"
                    value={newUser.classname}
                    onChange={(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => setNewUser("classname", event.target.value)}
                    className="w-full font-mono shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] outline-0 border border-black flex flex-col gap-2.5 text-black font-medium p-2.5 rounded-[10px] bg-white"
                />
                <label htmlFor="Email">Email</label>
                <input 
                    type="email" 
                    placeholder="Email"
                    id="Email"
                    name="email"
                    value={newUser.email}
                    onChange={(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => setNewUser("email", event.target.value)}
                    className="w-full font-mono shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] outline-0 border border-black flex flex-col gap-2.5 text-black font-medium p-2.5 rounded-[10px] bg-white"
                />
                <label htmlFor="Password">Password</label>
                <input 
                    type="password" 
                    placeholder="Password"
                    id="Password"
                    name="password"
                    value={newUser.password}
                    onChange={(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => setNewUser("password", event.target.value)}
                    className="w-full font-mono shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] outline-0 border border-black flex flex-col gap-2.5 text-black font-medium p-2.5 rounded-[10px] bg-white"
                />
                <label htmlFor="Role">Role</label>
                <input 
                    type="text" 
                    placeholder="Role"
                    id="Role"
                    name="role"
                    value={newUser.role}
                    onChange={(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => setNewUser("role", event.target.value)}
                    className="w-full font-mono shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] outline-0 border border-black flex flex-col gap-2.5 text-black font-medium p-2.5 rounded-[10px] bg-white"
                />
                <div>
                    <button 
                        type="submit"
                        disabled={addUserMt.isPending}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium font-mono py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Add User
                    </button>
                </div>
                {dataError && <p className="text-red-500 mt-2">{dataError}</p>}
            </form>
            {AdminNavbar(addUserMt.isPending)}
        </div>
    )
}