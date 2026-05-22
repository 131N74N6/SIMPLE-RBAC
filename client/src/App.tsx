import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import AdminPage from "./pages/AdminPage";
import UserPage from "./pages/UserPage";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import AddUser from "./pages/AddUser";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/sign-in" element={<SignIn/>}/>
                    <Route path="/admin/page" element={<ProtectedRoute required_roles={['admin']}><AdminPage/></ProtectedRoute>}/>
                    <Route path="/admin/add-user" element={<ProtectedRoute required_roles={['admin']}><AddUser/></ProtectedRoute>}/>
                    <Route path="/unauthorized" element={<Unauthorized/>}/>
                    <Route path="/user/page" element={<ProtectedRoute required_roles={['user']}><UserPage/></ProtectedRoute>}/>
                    <Route path="*" element={<Navigate to="/sign-in" replace/>}/>
                    <Route path="/" element={<Navigate to="/sign-in" replace/>}/>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}