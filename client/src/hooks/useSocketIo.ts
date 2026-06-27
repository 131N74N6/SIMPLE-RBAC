import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import SocketServices from "../services/socket-io.service";

type UsePresenceSocketProps = {
    token: string;
    role: "master" | "student";
    identifier: string;
}

export default function useSocketIo(props: UsePresenceSocketProps) {
    const queryClient = useQueryClient();
    const { 
        connect, 
        joinClass, 
        joinMaster, 
        onPresenceChanged, 
        onPresenceCreated, 
        onPresenceDeleted, 
        onPresenceDeletedAll, 
        onPresenceFilled, 
        removeAllListeners 
    } = SocketServices();

    useEffect(() => {
        if (!props.token || !props.identifier) return;
        connect(props.token);

        if (props.role === "master") {
            joinMaster(props.identifier);
        } else {
            joinClass(props.identifier);
        }

        if (props.role === "student") {
            onPresenceCreated(() => {
                queryClient.invalidateQueries({
                    predicate: (query) => {
                        const key = query.queryKey;
                        return Array.isArray(key) && typeof key[0] === "string" && key[0].startsWith("all-presences");
                    }
                });
            });

            onPresenceDeleted(() => {
                queryClient.invalidateQueries({
                    predicate: (query) => {
                        const key = query.queryKey;
                        return Array.isArray(key) && typeof key[0] === "string" && key[0].startsWith("all-presences");
                    }
                });
            });

            onPresenceDeletedAll(() => {
                queryClient.invalidateQueries({
                    predicate: (query) => {
                        const key = query.queryKey;
                        return Array.isArray(key) && typeof key[0] === "string" && key[0].startsWith("all-presences");
                    }
                });
            });
        }

        if (props.role === "master") {
            onPresenceFilled(() => {
                queryClient.invalidateQueries({
                    predicate: (query) => {
                        const key = query.queryKey;
                        return Array.isArray(key) && typeof key[0] === "string" && 
                            (key[0].startsWith("presence-detail") || key[0].startsWith("all-presences"));
                    }
                });
            });

            onPresenceChanged(() => {
                queryClient.invalidateQueries({
                    predicate: (query) => {
                        const key = query.queryKey;
                        return Array.isArray(key) && typeof key[0] === "string" && 
                            (key[0].startsWith("presence-detail") || key[0].startsWith("all-presences"));
                    }
                });
            });
        }

        return () => removeAllListeners();

    }, [props.identifier, props.role, props.token, queryClient]);
}
