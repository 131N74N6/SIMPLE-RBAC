import { useNavigate } from "react-router-dom"
import AuthServices from "../services/auth.service";

export default function AdminNavbar() {
    const navigate = useNavigate();
    const { quit } = AuthServices();

    return (
        <nav className="p-2.5 flex md:flex-col gap-2.5 md:w-1/4 w-full flex-row bg-blue-800 text-white font-medium">
            <button 
                type="button"
                className="text-center md:text-left w-full cursor-pointer disabled:cursor-not-allowed font-medium p-1.5 rounded-md hover:bg-blue-200 hover:text-blue-800"
                onClick={() => navigate("/admin/add-user")}
            >
                Add User
            </button>
            <button 
                type="button"
                className="text-center md:text-left w-full cursor-pointer disabled:cursor-not-allowed font-medium p-1.5 rounded-md hover:bg-blue-200 hover:text-blue-800"
                onClick={() => navigate("/admin/page")}
            >
                Users
            </button>
            <button 
                type="button"
                className="text-center md:text-left w-full cursor-pointer disabled:cursor-not-allowed font-medium p-1.5 rounded-md hover:bg-blue-200 hover:text-blue-800"
                onClick={quit}
            >
                Sign Out
            </button>
        </nav>
    );
}