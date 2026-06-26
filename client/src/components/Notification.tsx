type NotificationIntrf = {
    message: string;
}

export default function Notification(props: NotificationIntrf) {
    return (
        <div className="fixed top-6 left-1/2 -translate-x-0.5 w-full flex justify-center z-50 pointer-events-none bg-[rgba(0,0,0,0.8)]">
            <div className="bg-gray-800 text-2xl font-medium text-amber-300">{props.message}</div>
        </div>
    );
}