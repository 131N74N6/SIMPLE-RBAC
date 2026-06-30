import { Query, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import SocketServices from "../services/socket-io.service";

type UsePresenceSocketProps = {
    user_id: string;
    role: string;
    identifier: string;
}

export default function useSocketIo(props: UsePresenceSocketProps) {
    const queryClient = useQueryClient();
    const { 
        connect, 
        joinAdmin,
        joinClass, 
        joinMaster, 
        onMasterChanged,
        onDeleteAllMasters,
        onDeleteMaster,
        onPresenceChanged, 
        onPresenceStatusChanged,
        onPresenceStatusDeletedAll,
        onPresenceStatusDeleted,
        onPresenceCreated, 
        onPresenceDeleted, 
        onPresenceDeletedAll, 
        onPresenceFilled, 
        onStudentChanged,
        onDeleteAllStudents,
        onDeleteAllStudentByClass,
        onDeleteStudent,
        removeAllListeners 
    } = SocketServices();

    useEffect(() => {
        if (!props.user_id || !props.identifier) return;
        connect(props.user_id);

        if (props.role === "master") {
            joinMaster(props.identifier);
        } else if (props.role === "admin") {
            joinAdmin();
        } else {
            joinClass(props.identifier);
        }

        if (props.role === "admin") {
            onPresenceFilled(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                            return queryKey[0].startsWith(`is-filled`) ||
                            queryKey[0].startsWith(`all-presences-form`) ||
                            queryKey[0].startsWith(`presence-details`);
                        }
                        return false;
                    }
                });
            });

            onPresenceChanged(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                            return queryKey[0].startsWith(`all-presences-for-admin`) ||
                            queryKey[0].startsWith(`all-presences-for-master`) ||
                            queryKey[0].startsWith(`all-presences-form`);
                        }
                        return false;
                    }
                });
            });

            onPresenceStatusChanged(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                            return queryKey[0].startsWith(`is-filled`) ||
                            queryKey[0].startsWith(`all-presences-for-admin`) ||
                            queryKey[0].startsWith(`all-presences-for-master`) ||
                            queryKey[0].startsWith(`presence-details`);
                        }
                        return false;
                    }
                });
            });

            onPresenceCreated(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                            return queryKey[0].startsWith(`all-presences-form`) ||
                            queryKey[0].startsWith(`all-presences-for-admin`) ||
                            queryKey[0].startsWith(`all-presences-for-master`);
                        }
                        return false;
                    }
                });
            });

            onPresenceStatusDeletedAll(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                            return queryKey[0].startsWith(`is-filled`) ||
                            queryKey[0].startsWith(`all-presences-for-admin`) ||
                            queryKey[0].startsWith(`all-presences-for-master`) ||
                            queryKey[0].startsWith(`all-presences-form`) ||
                            queryKey[0].startsWith(`presence-details`);
                        }
                        return false;
                    }
                });
            });

            onPresenceStatusDeleted(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                            return queryKey[0].startsWith(`is-filled`) ||
                            queryKey[0].startsWith(`all-presences-for-admin`) ||
                            queryKey[0].startsWith(`all-presences-for-master`) ||
                            queryKey[0].startsWith(`all-presences-form`) ||
                            queryKey[0].startsWith(`presence-details`);
                        }
                        return false;
                    }
                });
            });

            onPresenceDeleted(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                            return queryKey[0].startsWith(`is-filled`) ||
                            queryKey[0].startsWith(`all-presences-form`) ||
                            queryKey[0].startsWith(`all-presences-for-admin`) ||
                            queryKey[0].startsWith(`all-presences-for-master`) ||
                            queryKey[0].startsWith(`presence-details`);
                        }
                        return false;
                    }
                });
            });

            onPresenceDeletedAll(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                            return queryKey[0].startsWith(`is-filled`) ||
                            queryKey[0].startsWith(`all-presences-form`) ||
                            queryKey[0].startsWith(`all-presences-for-admin`) ||
                            queryKey[0].startsWith(`all-presences-for-master`) ||
                            queryKey[0].startsWith(`presence-details`);
                        }
                        return false;
                    }
                });
            });

            onStudentChanged(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length !== 0 && typeof queryKey[0] === "string") {
                            return queryKey[0].startsWith('all-students') || 
                            queryKey[0].startsWith('all-students-class');
                        }
                        return false;
                    }
                });
            });
            
            onDeleteAllStudentByClass(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length !== 0 && typeof queryKey[0] === "string") {
                            return queryKey[0].startsWith('all-students') || 
                            queryKey[0].startsWith('all-students-class');
                        }
                        return false;
                    }
                });
            });

            onDeleteAllStudents(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length !== 0 && typeof queryKey[0] === "string") {
                            return queryKey[0].startsWith('all-students') || 
                            queryKey[0].startsWith('all-students-class');
                        }
                        return false;
                    }
                });
            });

            onDeleteStudent(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length !== 0 && typeof queryKey[0] === "string") {
                            return queryKey[0].startsWith('all-students') || 
                            queryKey[0].startsWith('all-students-class');
                        }
                        return false;
                    }
                });
            });

            onMasterChanged(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length !== 0 && typeof queryKey[0] === "string") {
                            return queryKey[0].startsWith('all-masters');
                        }
                        return false;
                    }
                });
            });

            onDeleteAllMasters(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length !== 0 && typeof queryKey[0] === "string") {
                            return queryKey[0].startsWith('all-masters');
                        }
                        return false;
                    }
                });
            });

            onDeleteMaster(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length !== 0 && typeof queryKey[0] === "string") {
                            return queryKey[0].startsWith('all-masters');
                        }
                        return false;
                    }
                });
            });
        }

        if (props.role === "master") {
            onPresenceFilled(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                            return queryKey[0].startsWith(`is-filled`) ||
                            queryKey[0].startsWith(`all-presences-form`) ||
                            queryKey[0].startsWith(`presence-details`);
                        }
                        return false;
                    }
                });
            });

            onPresenceChanged(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                            return queryKey[0].startsWith(`all-presences-for-admin`) ||
                            queryKey[0].startsWith(`all-presences-for-master`) ||
                            queryKey[0].startsWith(`all-presences-form`);
                        }
                        return false;
                    }
                });
            });

            onPresenceStatusChanged(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                            return queryKey[0].startsWith(`is-filled`) ||
                            queryKey[0].startsWith(`all-presences-for-admin`) ||
                            queryKey[0].startsWith(`all-presences-for-master`) ||
                            queryKey[0].startsWith(`presence-details`);
                        }
                        return false;
                    }
                });
            });

            onPresenceStatusDeletedAll(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                            return queryKey[0].startsWith(`is-filled`) ||
                            queryKey[0].startsWith(`all-presences-for-admin`) ||
                            queryKey[0].startsWith(`all-presences-for-master`) ||
                            queryKey[0].startsWith(`all-presences-form`) ||
                            queryKey[0].startsWith(`presence-details`);
                        }
                        return false;
                    }
                });
            });

            onPresenceStatusDeleted(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                            return queryKey[0].startsWith(`is-filled`) ||
                            queryKey[0].startsWith(`all-presences-for-admin`) ||
                            queryKey[0].startsWith(`all-presences-for-master`) ||
                            queryKey[0].startsWith(`all-presences-form`) ||
                            queryKey[0].startsWith(`presence-details`);
                        }
                        return false;
                    }
                });
            });

            onPresenceDeleted(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                            return queryKey[0].startsWith(`is-filled`) ||
                            queryKey[0].startsWith(`all-presences-form`) ||
                            queryKey[0].startsWith(`all-presences-for-admin`) ||
                            queryKey[0].startsWith(`all-presences-for-master`) ||
                            queryKey[0].startsWith(`presence-details`);
                        }
                        return false;
                    }
                });
            });

            onPresenceDeletedAll(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                            return queryKey[0].startsWith(`is-filled`) ||
                            queryKey[0].startsWith(`all-presences-form`) ||
                            queryKey[0].startsWith(`all-presences-for-admin`) ||
                            queryKey[0].startsWith(`all-presences-for-master`) ||
                            queryKey[0].startsWith(`presence-details`);
                        }
                        return false;
                    }
                });
            });
            
            onMasterChanged(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length !== 0 && typeof queryKey[0] === "string") {
                            return queryKey[0].startsWith('all-masters');
                        }
                        return false;
                    }
                });
            });

            onDeleteAllMasters(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length !== 0 && typeof queryKey[0] === "string") {
                            return queryKey[0].startsWith('all-masters');
                        }
                        return false;
                    }
                });
            });

            onDeleteMaster(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length !== 0 && typeof queryKey[0] === "string") {
                            return queryKey[0].startsWith('all-masters');
                        }
                        return false;
                    }
                });
            });

            onDeleteAllStudentByClass(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length !== 0 && typeof queryKey[0] === "string") {
                            return queryKey[0].startsWith('all-students') || 
                            queryKey[0].startsWith('all-students-class');
                        }
                        return false;
                    }
                });
            });

            onDeleteAllStudents(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length !== 0 && typeof queryKey[0] === "string") {
                            return queryKey[0].startsWith('all-students') || 
                            queryKey[0].startsWith('all-students-class');
                        }
                        return false;
                    }
                });
            });

            onDeleteStudent(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length !== 0 && typeof queryKey[0] === "string") {
                            return queryKey[0].startsWith('all-students') || 
                            queryKey[0].startsWith('all-students-class');
                        }
                        return false;
                    }
                });
            });

            onMasterChanged(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length !== 0 && typeof queryKey[0] === "string") {
                            return queryKey[0].startsWith('all-masters');
                        }
                        return false;
                    }
                });
            });
        }

        if (props.role === "student") {
            onPresenceCreated(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                            return queryKey[0].startsWith(`all-presences-form`) ||
                            queryKey[0].startsWith(`all-presences-for-admin`) ||
                            queryKey[0].startsWith(`all-presences-for-master`);
                        }
                        return false;
                    }
                });
            });

            onPresenceChanged(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                            return queryKey[0].startsWith(`all-presences-for-admin`) ||
                            queryKey[0].startsWith(`all-presences-for-master`) ||
                            queryKey[0].startsWith(`all-presences-form`);
                        }
                        return false;
                    }
                });
            });

            onPresenceStatusChanged(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                            return queryKey[0].startsWith(`is-filled`) ||
                            queryKey[0].startsWith(`all-presences-for-admin`) ||
                            queryKey[0].startsWith(`all-presences-for-master`) ||
                            queryKey[0].startsWith(`presence-details`);
                        }
                        return false;
                    }
                });
            });

            onPresenceStatusDeletedAll(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                            return queryKey[0].startsWith(`is-filled`) ||
                            queryKey[0].startsWith(`all-presences-for-admin`) ||
                            queryKey[0].startsWith(`all-presences-for-master`) ||
                            queryKey[0].startsWith(`all-presences-form`) ||
                            queryKey[0].startsWith(`presence-details`);
                        }
                        return false;
                    }
                });
            });

            onPresenceStatusDeleted(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                            return queryKey[0].startsWith(`is-filled`) ||
                            queryKey[0].startsWith(`all-presences-for-admin`) ||
                            queryKey[0].startsWith(`all-presences-for-master`) ||
                            queryKey[0].startsWith(`all-presences-form`) ||
                            queryKey[0].startsWith(`presence-details`);
                        }
                        return false;
                    }
                });
            });

            onPresenceDeleted(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                            return queryKey[0].startsWith(`is-filled`) ||
                            queryKey[0].startsWith(`all-presences-form`) ||
                            queryKey[0].startsWith(`all-presences-for-admin`) ||
                            queryKey[0].startsWith(`all-presences-for-master`) ||
                            queryKey[0].startsWith(`presence-details`);
                        }
                        return false;
                    }
                });
            });

            onPresenceDeletedAll(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                            return queryKey[0].startsWith(`is-filled`) ||
                            queryKey[0].startsWith(`all-presences-form`) ||
                            queryKey[0].startsWith(`all-presences-for-admin`) ||
                            queryKey[0].startsWith(`all-presences-for-master`) ||
                            queryKey[0].startsWith(`presence-details`);
                        }
                        return false;
                    }
                });
            });
            
            onDeleteAllStudentByClass(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length !== 0 && typeof queryKey[0] === "string") {
                            return queryKey[0].startsWith('all-students') || 
                            queryKey[0].startsWith('all-students-class');
                        }
                        return false;
                    }
                });
            });

            onDeleteAllStudents(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length !== 0 && typeof queryKey[0] === "string") {
                            return queryKey[0].startsWith('all-students') || 
                            queryKey[0].startsWith('all-students-class');
                        }
                        return false;
                    }
                });
            });

            onDeleteStudent(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length !== 0 && typeof queryKey[0] === "string") {
                            return queryKey[0].startsWith('all-students') || 
                            queryKey[0].startsWith('all-students-class');
                        }
                        return false;
                    }
                });
            });

            onStudentChanged(() => {
                queryClient.invalidateQueries({
                    predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey) && queryKey.length !== 0 && typeof queryKey[0] === "string") {
                            return queryKey[0].startsWith('all-students') || 
                            queryKey[0].startsWith('all-students-class');
                        }
                        return false;
                    }
                });
            });
        }

        return () => removeAllListeners();

    }, [props.identifier, props.role, props.user_id, queryClient]);
}
