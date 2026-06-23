import { Link } from "react-router-dom";

export default function Unauthorized() {
    return (
        <div className="bg-black flex justify-center items-center h-screen">
            <div className="flex flex-col gap-2.5">
                <span className="text-center text-white font-medium text-4xl">You Don't Have Permission to Access</span>
                <Link to={'/sign-in'} className="text-center text-blue-400 cursor-pointer font-medium text-xl">Back to sign in page</Link>
            </div>
        </div>
    );
}