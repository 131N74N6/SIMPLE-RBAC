import StudentNavbar from "../components/StudentNavbar";
import useSocketIo from "../hooks/useSocketIo";
import AuthServices from "../services/auth.service";
import PresenceServices from "../services/presence.service";

export default function StudentHome() {
    const { currentClassName, currentUserId } = PresenceServices();
    
    useSocketIo({
        role: ["student"],
        user_id: currentUserId!,
        identifier: currentClassName!
    });

    const { currentUserName } = AuthServices();
    const now = new Date().getHours();
        
    return (
        <section className="flex md:flex-row font-mono flex-col h-screen relative z-10 bg-gray-950">
            <div className="flex flex-col h-full w-full md:w-3/4 gap-3 p-2.5">
                {now >= 3 && now < 12 ? (
                    <div className="bg-gray-800 p-2 rounded-tr-lg text-violet-400 font-medium">🌅 Good morning, {currentUserName}</div>
                ) : now >= 12 && now < 15 ? (
                    <div className="bg-gray-800 p-2 rounded-tr-lg text-violet-400 font-medium">☀️ Good afternoon, {currentUserName}</div>
                ) : now >= 15 && now < 19 ? (
                    <div className="bg-gray-800 p-2 rounded-tr-lg text-violet-400 font-medium">🌆 Good evening, {currentUserName}</div>
                ): (
                    <div className="bg-gray-800 p-2 rounded-tr-lg text-violet-400 font-medium">🌃 Good night, {currentUserName}</div>
                )}
            </div>
            {StudentNavbar()}
        </section>
    );
}