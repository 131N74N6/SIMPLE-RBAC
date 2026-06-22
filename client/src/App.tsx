import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Presences from "./pages/Presences";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import AddUser from "./pages/AddUser";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserDetail from "./pages/UserDetail";
import MakePresence from "./pages/MakePresence";
import FillPresence from "./pages/FillPresence";
import Classes from "./pages/Classes";
import Students from "./pages/Students";
import Masters from "./pages/Masters";

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/sign-in" element={<SignIn/>}/>
                    <Route path="/unauthorized" element={<Unauthorized/>}/>
                    <Route path="/admin/students" element={<ProtectedRoute required_roles={['admin']}><Students/></ProtectedRoute>}/>
                    <Route path="/admin/masters" element={<ProtectedRoute required_roles={['admin']}><Masters/></ProtectedRoute>}/>
                    <Route path="/admin/classes" element={<ProtectedRoute required_roles={['admin']}><Classes/></ProtectedRoute>}/>
                    <Route path="/admin/add-user" element={<ProtectedRoute required_roles={['admin']}><AddUser/></ProtectedRoute>}/>
                    <Route path="/master/presences" element={<ProtectedRoute required_roles={['master']}><Presences/></ProtectedRoute>}/>
                    <Route path="/master/make-presence" element={<ProtectedRoute required_roles={['master']}><MakePresence/></ProtectedRoute>}/>
                    <Route path="/student/fill-presence" element={<ProtectedRoute required_roles={['student']}><FillPresence/></ProtectedRoute>}/>
                    <Route path="/profile" element={<ProtectedRoute required_roles={['admin', 'master', 'student']}><UserDetail/></ProtectedRoute>}/>
                    <Route path="*" element={<Navigate to="/sign-in" replace/>}/>
                    <Route path="/" element={<Navigate to="/sign-in" replace/>}/>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}