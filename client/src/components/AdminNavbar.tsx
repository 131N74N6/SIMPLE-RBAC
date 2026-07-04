import { useNavigate } from "react-router-dom"
import AuthServices from "../services/auth.service";
import { useState } from "react";
import { Menu } from "lucide-react";

export default function AdminNavbar(is_processing?: boolean) {
    const navigate = useNavigate();
    const { quit } = AuthServices();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);


    return (
        <>
            <nav className="p-2.5 md:flex md:flex-col hidden gap-2.5 md:w-1/4 w-full font-mono bg-gray-900 text-white font-medium">
                <button 
                    type="button"
                    disabled={is_processing}
                    className="text-center md:text-left w-full cursor-pointer disabled:cursor-not-allowed font-medium p-1.5 rounded-md hover:bg-blue-200 hover:text-blue-800"
                    onClick={() => navigate("/admin/home")}
                >
                    Home
                </button>
                <button 
                    type="button"
                    disabled={is_processing}
                    className="text-center md:text-left w-full cursor-pointer disabled:cursor-not-allowed font-medium p-1.5 rounded-md hover:bg-blue-200 hover:text-blue-800"
                    onClick={() => navigate("/admin/add-user")}
                >
                    Add User
                </button>
                <button 
                    type="button"
                    disabled={is_processing}
                    className="text-center md:text-left w-full cursor-pointer disabled:cursor-not-allowed font-medium p-1.5 rounded-md hover:bg-blue-200 hover:text-blue-800"
                    onClick={() => navigate("/admin/students")}
                >
                    Students
                </button>
                <button 
                    type="button"
                    disabled={is_processing}
                    className="text-center md:text-left w-full cursor-pointer disabled:cursor-not-allowed font-medium p-1.5 rounded-md hover:bg-blue-200 hover:text-blue-800"
                    onClick={() => navigate("/admin/masters")}
                >
                    Masters
                </button>
                <button 
                    type="button"
                    disabled={is_processing}
                    className="text-center md:text-left w-full cursor-pointer disabled:cursor-not-allowed font-medium p-1.5 rounded-md hover:bg-blue-200 hover:text-blue-800"
                    onClick={() => navigate("/admin/classes")}
                >
                    Classes
                </button>
                <button 
                    type="button"
                    disabled={is_processing}
                    className="text-center md:text-left w-full cursor-pointer disabled:cursor-not-allowed font-medium p-1.5 rounded-md hover:bg-blue-200 hover:text-blue-800"
                    onClick={() => navigate("/admin/all-presences")}
                >
                    Presences
                </button>
                <button 
                    type="button"
                    disabled={is_processing}
                    className="text-center md:text-left w-full cursor-pointer disabled:cursor-not-allowed font-medium p-1.5 rounded-md hover:bg-blue-200 hover:text-blue-800"
                    onClick={quit}
                >
                    Sign Out
                </button>
            </nav>

            <nav className="md:hidden bg-gray-900 backdrop-blur-lg border flex items-center p-4">
                <button onClick={toggleSidebar} className="cursor-pointer text-blue-400 font-medium">
                    <Menu size={24} />
                </button>
            </nav>

            {sidebarOpen && (
                <div
                    className="fixed inset-0 opacity-75 z-40"
                    onClick={toggleSidebar}
                ></div>
            )}

            <aside
                className={`
                text-white fixed top-0 right-0 h-full w-4/5 max-w-sm bg-gray-800 z-50 transform transition-transform 
                duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col gap-4 p-4
            `}>
                <button 
                    type="button"
                    disabled={is_processing}
                    className="text-left w-full cursor-pointer disabled:cursor-not-allowed font-medium p-1.5 rounded-md hover:bg-blue-200 hover:text-blue-800"
                    onClick={() => navigate("/admin/home")}
                >
                    Home
                </button>
                <button 
                    type="button"
                    disabled={is_processing}
                    className="text-left w-full cursor-pointer disabled:cursor-not-allowed font-medium p-1.5 rounded-md hover:bg-blue-200 hover:text-blue-800"
                    onClick={() => navigate("/admin/add-user")}
                >
                    Add User
                </button>
                <button 
                    type="button"
                    disabled={is_processing}
                    className="text-left w-full cursor-pointer disabled:cursor-not-allowed font-medium p-1.5 rounded-md hover:bg-blue-200 hover:text-blue-800"
                    onClick={() => navigate("/admin/students")}
                >
                    Students
                </button>
                <button 
                    type="button"
                    disabled={is_processing}
                    className="text-left w-full cursor-pointer disabled:cursor-not-allowed font-medium p-1.5 rounded-md hover:bg-blue-200 hover:text-blue-800"
                    onClick={() => navigate("/admin/masters")}
                >
                    Masters
                </button>
                <button 
                    type="button"
                    disabled={is_processing}
                    className="text-left w-full cursor-pointer disabled:cursor-not-allowed font-medium p-1.5 rounded-md hover:bg-blue-200 hover:text-blue-800"
                    onClick={() => navigate("/admin/classes")}
                >
                    Classes
                </button>
                <button 
                    type="button"
                    disabled={is_processing}
                    className="text-left w-full cursor-pointer disabled:cursor-not-allowed font-medium p-1.5 rounded-md hover:bg-blue-200 hover:text-blue-800"
                    onClick={() => navigate("/admin/all-presences")}
                >
                    Presences
                </button>
                <button 
                    type="button"
                    disabled={is_processing}
                    className="text-left w-full cursor-pointer disabled:cursor-not-allowed font-medium p-1.5 rounded-md hover:bg-blue-200 hover:text-blue-800"
                    onClick={quit}
                >
                    Sign Out
                </button>
            </aside>
        </>
    );
}