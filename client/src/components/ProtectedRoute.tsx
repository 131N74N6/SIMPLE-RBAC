import type { ReactNode } from "react";
import AuthServices from "../services/auth.service"
import { Navigate } from "react-router-dom";
import Loading from "./Loading";

type ProtectIntrf = {
    children: ReactNode;
    required_roles?: string[];
}

export default function ProtectedRoute(props: ProtectIntrf) {
    const { currentRole, currentUserId, userLoading } = AuthServices();

    if (userLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#1a1a1a]">
                <Loading/>
            </div>
        );
    }

    if (props.required_roles && !props.required_roles.includes(currentRole!)) {
        return <Navigate to={'/unauthorized'}/>;
    }

    return (
        <>{currentUserId ? <>{props.children}</> : <Navigate to={'/sign-in'}/>}</>
    )
}