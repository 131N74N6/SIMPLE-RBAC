import { io, type Socket } from "socket.io-client"

export default function SocketServices() {
    let socket: Socket | null = null;

    function connect(token: string) {
        if (socket?.connected) return;

        socket = io(import.meta.env.VITE_BASE_API_URL, {
            auth: { token },
            transports: ["websocket"]
        });

        socket.on("connected", () => {
            console.log(`socket connected: ${socket?.id}`);
        });

        socket.on("disconnected", () => {
            console.log(`socket disconnected: ${socket?.id}`);
        });

        socket.on("connection error", (error) => {
            console.log(`socket connection error: ${error.message}`);
        });
    }

    function joinClass(classname: string) {
        socket?.emit("join:class", classname);
    }

    function joinMaster(master_id: string) {
        socket?.emit("join:master", master_id);
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

    function removeAllListeners() {
        socket?.removeAllListeners();
    }

    function disconnect() {
        socket?.disconnect();
        socket = null;
    }

    return { connect, 
        disconnect, 
        joinClass, 
        joinMaster, 
        onPresenceChanged, 
        onPresenceCreated, 
        onPresenceDeleted, 
        onPresenceDeletedAll, 
        onPresenceStatusChanged,
        onPresenceFilled, 
        removeAllListeners, 
        socket 
    }
}