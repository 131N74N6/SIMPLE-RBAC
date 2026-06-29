import AuthServices from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

export default function MasterNavbar(is_processing?: boolean) {
    const navigate = useNavigate();
    const { currentUserName, quit } = AuthServices();

    return (
        <nav className="p-2.5 flex md:flex-col gap-2.5 md:w-1/4 w-full flex-row font-mono bg-gray-900 text-white font-medium">
            <div className="p-1.5 md:flex hidden">Hello, {currentUserName}</div>
            <button 
                type="button"
                disabled={is_processing}
                className="text-center md:text-left w-full cursor-pointer disabled:cursor-not-allowed font-medium p-1.5 rounded-md hover:bg-blue-200 hover:text-blue-800"
                onClick={() => navigate("/master/home")}
            >
                Home
            </button>
            <button 
                type="button"
                disabled={is_processing}
                className="text-center md:text-left w-full cursor-pointer disabled:cursor-not-allowed font-medium p-1.5 rounded-md hover:bg-blue-200 hover:text-blue-800"
                onClick={() => navigate("/master/presences")}
            >
                All Presences
            </button>
            <button 
                type="button"
                disabled={is_processing}
                className="text-center md:text-left w-full cursor-pointer disabled:cursor-not-allowed font-medium p-1.5 rounded-md hover:bg-blue-200 hover:text-blue-800"
                onClick={() => navigate("/master/make-presence")}
            >
                Make Presence
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