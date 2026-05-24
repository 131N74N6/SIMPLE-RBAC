import { useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import UserServices from "../services/user.service";

export default function EditUser() {
    const { addUserMt, dataError, handleInputChange, isProcessing, newUser, setDataError } = UserServices();

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
        <div className="flex md:flex-row flex-col h-screen relative z-10">
            <form className="flex flex-col gap-2.5 h-full md:w-3/4 w-full bg-white p-2.5" onSubmit={handleSubmit}>
                <label htmlFor="Username">Username</label>
                <input 
                    type="text" 
                    placeholder="Username"
                    id="Username"
                    name="username"
                    value={newUser.username}
                    onChange={handleInputChange}
                    className="border-gray-500 p-2.5 text-lg text-black font-medium outline-0 border"
                />
                <label htmlFor="Email">Email</label>
                <input 
                    type="email" 
                    placeholder="Email"
                    id="Email"
                    name="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    className="border-gray-500 p-2.5 text-lg text-black font-medium outline-0 border"
                />
                <label htmlFor="Password">Password</label>
                <input 
                    type="password" 
                    placeholder="Password"
                    id="Password"
                    name="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    className="border-gray-500 p-2.5 text-lg text-black font-medium outline-0 border"
                />
                <label htmlFor="Role">Role</label>
                <input 
                    type="text" 
                    placeholder="Role"
                    id="Role"
                    name="role"
                    value={newUser.role}
                    onChange={handleInputChange}
                    className="border-gray-500 p-2.5 text-lg text-black font-medium outline-0 border"
                />
                <div>
                    <button 
                        type="submit"
                        disabled={isProcessing}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Add User
                    </button>
                </div>
                {dataError && <p className="text-red-500 mt-2">{dataError}</p>}
            </form>
            {AdminNavbar()}
        </div>
    )
}