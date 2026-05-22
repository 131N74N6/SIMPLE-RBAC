import AdminNavbar from '../components/AdminNavbar';
import UserServices from '../services/user.service';

export default function AdminPage() {
    const { paginatedUsersData } = UserServices();
    console.log(paginatedUsersData);

    return (
        <section className="flex md:flex-row flex-col h-screen relative z-10">
            <div className="flex justify-center items-center gap-2.5 p-2.5 h-full w-full md:w-3/4">User</div>
            {AdminNavbar()}
        </section>
    );
}