import MasterNavbar from "../components/MasterNavbar";
import AuthServices from "../services/auth.service";

export default function MasterHome() {
    const { currentUserName } = AuthServices();
            
    return (
        <section className="flex md:flex-row font-mono flex-col h-screen relative z-10 bg-gray-950">
            <div className="flex flex-col h-full w-full md:w-3/4 gap-3 p-2.5">
                <div className="bg-gray-900 p-2 rounded-tr-lg text-violet-400 font-medium">Hello, {currentUserName}</div>
            </div>
            {MasterNavbar()}
        </section>
    );
}