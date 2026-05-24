import { Trash2 } from 'lucide-react';
import AdminNavbar from '../components/AdminNavbar';
import AdminUserList from '../components/AdminUserList';
import UserServices from '../services/user.service';

export default function AdminPage() {
    const { deleteAllUsersMt, deleteUserMt, paginatedUsersData, searchedUser, setSearchedUser } = UserServices();

    return (
        <section className="flex md:flex-row flex-col h-screen relative z-10">
            <div className="flex flex-col h-full w-full md:w-3/4 gap-3 p-2.5">
                <div className='flex gap-2.5'>
                    <input
                        type='text'
                        value={searchedUser}
                        name='search_user'
                        onChange={(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => setSearchedUser(event.target.value)}
                        placeholder='find username here...'
                        className='shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] w-[90%] font-medium p-1.5 text-base border border-black outline-0 font-mono text-black'
                    />
                    <button
                        type='button'
                        onClick={() => deleteAllUsersMt.mutate()}
                        className='shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] w-[10%] cursor-pointer font-medium p-1.5 text-base border border-black outline-0 font-mono text-black'
                    >
                        <div className='flex justify-center'><Trash2/></div>
                    </button>
                </div>
                <AdminUserList 
                    fetch_next_page={paginatedUsersData.fetchNextPage}
                    has_next_page={paginatedUsersData.hasNextPage}
                    is_fetching_next_page={paginatedUsersData.isFetchingNextPage}
                    users={paginatedUsersData.flatennedData}
                    on_delete={deleteUserMt}
                />
            </div>
            {AdminNavbar()}
        </section>
    );
}