import { useNavigate } from "react-router-dom";
import AuthServices from "../services/auth.service";

export default function StudentNavbar(is_processing: boolean) {
    const navigate = useNavigate();
    const { currentUserName, quit } = AuthServices();

    return (
        <nav className="p-2.5 flex md:flex-col gap-2.5 md:w-1/4 w-full flex-row font-mono bg-gray-700 text-white font-medium">
            <div className="p-1.5 md:flex hidden">Hello, {currentUserName}</div>
            <button 
                type="button"
                disabled={is_processing}
                className="text-center md:text-left w-full cursor-pointer disabled:cursor-not-allowed font-medium p-1.5 rounded-md hover:bg-blue-200 hover:text-blue-800"
                onClick={() => navigate("/student/fill-presence")}
            >
                Presence
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
    )
}