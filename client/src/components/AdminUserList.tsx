import type { UserListIntrf } from "../models/user-model";
import AdminUserItem from "./AdminUserItem";
import Loading from "./Loading";

export default function AdminUserList(props: UserListIntrf) {
    if (props.users.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <h2 className="text-2xl text-gray-500">No users found.</h2>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col gap-4 overflow-y-auto px-2.5 pt-2.5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {props.users.map((user) => (
                    <AdminUserItem key={`user-${user._id}`} {...user}/>
                ))}
            </div>
            <div className="flex justify-center">
                {props.is_fetching_next_page ? (
                    <div className="flex justify-center"><Loading/></div>
                ) : props.users.length <=16 ? (
                    <></>
                ) : props.has_next_page ? (
                    <button 
                        type="button" 
                        className="shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] cursor-pointer flex flex-col gap-2.5 text-black font-medium p-2.5 rounded-[10px] bg-white"
                        onClick={() => props.fetch_next_page()}
                    >
                        Load More
                    </button>
                ) : (
                    <div className="text-gray-500 text-center">No more users to load.</div>
                )}
            </div>
        </div>
    )
}