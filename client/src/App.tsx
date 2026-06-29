import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import PresenceByMaster from "./pages/PresenceByMaster";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import AddUser from "./pages/AddUser";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MakePresence from "./pages/MakePresence";
import FillPresence from "./pages/FillPresence";
import Classes from "./pages/Classes";
import Students from "./pages/Students";
import Masters from "./pages/Masters";
import ClassDetail from "./pages/ClassDetail";
import PresenceDetail from "./pages/PresenceDetail";
import StudentHome from "./pages/StudentHome";
import MasterHome from "./pages/MasterHome";
import AdminHome from "./pages/AdminHome";
import PresenceForAdmin from "./pages/PresenceForAdmin";

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/sign-in" element={<SignIn/>}/>
                    <Route path="/unauthorized" element={<Unauthorized/>}/>

                    <Route path="/admin/home" element={<ProtectedRoute required_roles={['admin']}><AdminHome/></ProtectedRoute>}/>
                    <Route path="/admin/students" element={<ProtectedRoute required_roles={['admin']}><Students/></ProtectedRoute>}/>
                    <Route path="/admin/masters" element={<ProtectedRoute required_roles={['admin']}><Masters/></ProtectedRoute>}/>
                    <Route path="/admin/class/:classname" element={<ProtectedRoute required_roles={['admin']}><ClassDetail/></ProtectedRoute>}/>
                    <Route path="/admin/classes" element={<ProtectedRoute required_roles={['admin']}><Classes/></ProtectedRoute>}/>
                    <Route path="/admin/add-user" element={<ProtectedRoute required_roles={['admin']}><AddUser/></ProtectedRoute>}/>
                    <Route path="/admin/students" element={<ProtectedRoute required_roles={['admin']}><Students/></ProtectedRoute>}/>
                    <Route path="/admin/all-presences" element={<ProtectedRoute required_roles={['admin']}><PresenceForAdmin/></ProtectedRoute>}/>

                    <Route path="/master/home" element={<ProtectedRoute required_roles={['master']}><MasterHome/></ProtectedRoute>}/>
                    <Route path="/master/presences" element={<ProtectedRoute required_roles={['master']}><PresenceByMaster/></ProtectedRoute>}/>
                    <Route path="/master/make-presence" element={<ProtectedRoute required_roles={['master']}><MakePresence/></ProtectedRoute>}/>

                    <Route path="/student/fill-presence" element={<ProtectedRoute required_roles={['student']}><FillPresence/></ProtectedRoute>}/>
                    <Route path="/student/home" element={<ProtectedRoute required_roles={['student']}><StudentHome/></ProtectedRoute>}/>
                    
                    <Route path="/status-detail/:_id" element={<ProtectedRoute required_roles={['admin', 'master']}><PresenceDetail/></ProtectedRoute>}/>
                    <Route path="*" element={<Navigate to="/sign-in" replace/>}/>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}