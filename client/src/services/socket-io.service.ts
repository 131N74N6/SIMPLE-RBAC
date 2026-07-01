import { io, type Socket } from "socket.io-client"

export default function SocketServices() {
    let socket: Socket | null = null;

    function connect(currentUserId: string) {
        if (socket?.connected) return;

        socket = io(new URL(import.meta.env.VITE_BASE_API_URL).origin, {
            auth: { currentUserId },
            transports: ["websocket"]
        });

        socket.on("connect", () => {
            console.log(`socket connected: ${socket?.id}`);
        });

        socket.on("disconnect", () => {
            console.log(`socket disconnected: ${socket?.id}`);
        });

        socket.on("connect_error", (error) => {
            console.log(`socket connection error: ${error.message}`);
        });
    }

    function joinClass(classname: string) {
        socket?.emit("join:class", classname);
    }

    function joinMaster(master_id: string) {
        socket?.emit("join:master", master_id);
    }

    function joinAdmin() {
        socket?.emit("join:admin");
    }

    function onClassCreated(callback: (data: any) => void) {
        socket?.on("classroom:created", callback);
    }

    function onClassChanged(callback: (data: any) => void) {
        socket?.on("classroom:changed", callback);
    }

    function onDeletedAllClasses(callback: (data: any) => void) {
        socket?.on("classroom:deleted-all", callback);
    }

    function onDeleteClass(callback: (data: any) => void) {
        socket?.on("classroom:deleted", callback);
    }

    function onPresenceCreated(callback: (data: any) => void) {
        socket?.on("presence:created", callback);
    }

    function onPresenceChanged(callback: (data: any) => void) {
        socket?.on("presence:changed", callback);
    }

    function onPresenceDeleted(callback: (data: any) => void) {
        socket?.on("presence:deleted", callback);
    }

    function onPresenceDeletedAll(callback: (data: any) => void) {
        socket?.on("presence:deleted-all", callback);
    }

    function onPresenceFilled(callback: (data: any) => void) {
        socket?.on("presence:filled", callback);
    }

    function onPresenceStatusChanged(callback: (data: any) => void) {
        socket?.on("presence-status:changed", callback);
    }

    function onPresenceStatusDeletedAll(callback: (data: any) => void) {
        socket?.on("presence-status:all-deleted", callback);
    }

    function onPresenceStatusDeleted(callback: (data: any) => void) {
        socket?.on("presence-status:deleted", callback);
    }

    function onMasterChanged(callback: (data: any) => void) {
        socket?.on("user:master-changed", callback);
    }

    function onDeleteAllMasters(callback: (data: any) => void) {
        socket?.on("user:all-master-deleted", callback);
    }

    function onDeleteMaster(callback: (data: any) => void) {
        socket?.on("user:master-deleted", callback);
    }

    function onStudentChanged(callback: (data: any) => void) {
        socket?.on("user:student-changed", callback);
    }

    function onDeleteAllStudents(callback: (data: any) => void) {
        socket?.on("user:all-student-deleted", callback);
    }

    function onDeleteStudent(callback: (data: any) => void) {
        socket?.on("user:student-deleted", callback);
    }

    function onDeleteAllStudentByClass(callback: (data: any) => void) {
        socket?.on("user:all-student-in-class-deleted", callback);
    }

    function removeAllListeners() {
        socket?.removeAllListeners();
    }

    function disconnect() {
        socket?.disconnect();
        socket = null;
    }

    function getSocket() {
        return socket;
    }

    return { connect, 
        disconnect,
        getSocket, 
        joinAdmin, 
        joinClass, 
        joinMaster, 
        onClassChanged,
        onClassCreated,
        onDeletedAllClasses,
        onDeleteClass,
        onPresenceChanged, 
        onPresenceCreated, 
        onPresenceDeleted, 
        onPresenceDeletedAll, 
        onPresenceFilled, 
        onPresenceStatusChanged,
        onPresenceStatusDeletedAll,
        onPresenceStatusDeleted,
        onMasterChanged,
        onDeleteAllMasters,
        onDeleteMaster,
        onStudentChanged,
        onDeleteAllStudents,
        onDeleteAllStudentByClass,
        onDeleteStudent,
        removeAllListeners
    }
}