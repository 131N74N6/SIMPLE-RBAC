import AuthServices from '../services/auth.service';

export default function AdminPage() {
    const { quit } = AuthServices();
    
    return (
        <div className="flex justify-center items-center h-screen">
            <button type="button" onClick={quit}>Sign Out</button>
            <span className="text-black font-medium text-2xl">PRABOWO KONTOL</span>
        </div>
    );
}
