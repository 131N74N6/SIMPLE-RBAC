import { Query, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import SocketServices from "../services/socket-io.service";

type UsePresenceSocketProps = {
    user_id: string;
    role: string[];
    identifier?: string;
}

export default function useSocketIo(props: UsePresenceSocketProps) {
    const queryClient = useQueryClient();
    const { 
        connect, 
        joinAdmin,
        joinClass, 
        joinMaster, 
        onClassChanged,
        onClassCreated,
        onDeletedAllClasses,
        onDeleteClass,
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
        if (!props.user_id) return;
        connect(props.user_id);

        if (props.role.includes("master")) {
            joinMaster(props.identifier!);
        } else if (props.role.includes("admin")) {
            joinAdmin();
        } else {
            joinClass(props.identifier!);
        }

        const queryNamesForClass = ['all-classes'];

        const queryNamesForMaster = ['all-masters'];

        const queryNamesForPresenceForm = [
            'is-filled',
            'all-presences-for-admin',
            'all-presences-for-master',
            'all-presences-form',
            'presence-details'
        ];

        const queryNamesForPresenceStatus = [
            'is-filled',
            'all-presences-for-admin',
            'all-presences-for-master',
            'all-presences-form',
            'presence-details'
        ];
        const queryNamesForStudent = ['all-students', 'all-students-class'];

        function invalidations(queryNames: string[]) {
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryNames.some(queryName => queryKey[0].startsWith(queryName));
                    }
                    return false;
                }
            });
        }

        if (props.role.includes("admin")) {
            onClassChanged(() => invalidations([...queryNamesForClass, ...queryNamesForStudent]));
            onClassCreated(() => invalidations([...queryNamesForClass, ...queryNamesForStudent]));
            onDeletedAllClasses(() => invalidations([...queryNamesForClass, ...queryNamesForStudent]));
            onDeleteClass(() => invalidations([...queryNamesForClass, ...queryNamesForStudent]));

            onMasterChanged(() => invalidations(queryNamesForMaster));
            onDeleteAllMasters(() => invalidations(queryNamesForMaster));
            onDeleteMaster(() => invalidations(queryNamesForMaster));

            onPresenceCreated(() => invalidations(queryNamesForPresenceForm));
            onPresenceChanged(() => invalidations(queryNamesForPresenceForm));
            onPresenceDeletedAll(() => invalidations(queryNamesForPresenceForm));
            onPresenceDeleted(() => invalidations(queryNamesForPresenceForm));
            onPresenceFilled(() => invalidations(queryNamesForPresenceForm));

            onPresenceStatusChanged(() => invalidations(queryNamesForPresenceStatus));
            onPresenceStatusDeletedAll(() => invalidations(queryNamesForPresenceStatus));
            onPresenceStatusDeleted(() => invalidations(queryNamesForPresenceStatus));

            onStudentChanged(() => invalidations(queryNamesForStudent));
            onDeleteAllStudentByClass(() => invalidations(queryNamesForStudent));
            onDeleteAllStudents(() => invalidations(queryNamesForStudent));
            onDeleteStudent(() => invalidations(queryNamesForStudent));
        }

        if (props.role.includes("master")) {
            onClassChanged(() => invalidations([...queryNamesForClass, ...queryNamesForStudent]));
            onDeletedAllClasses(() => invalidations([...queryNamesForClass, ...queryNamesForStudent]));
            onDeleteClass(() => invalidations([...queryNamesForClass, ...queryNamesForStudent]));

            onMasterChanged(() => invalidations(queryNamesForMaster));
            onDeleteAllMasters(() => invalidations(queryNamesForMaster));
            onDeleteMaster(() => invalidations(queryNamesForMaster));

            onPresenceChanged(() => invalidations(queryNamesForPresenceForm));
            onPresenceDeletedAll(() => invalidations(queryNamesForPresenceForm));
            onPresenceDeleted(() => invalidations(queryNamesForPresenceForm));
            onPresenceFilled(() => invalidations(queryNamesForPresenceForm));

            onPresenceStatusChanged(() => invalidations(queryNamesForPresenceStatus));
            onPresenceStatusDeletedAll(() => invalidations(queryNamesForPresenceStatus));
            onPresenceStatusDeleted(() => invalidations(queryNamesForPresenceStatus));

            onStudentChanged(() => invalidations(queryNamesForStudent));
            onDeleteAllStudentByClass(() => invalidations(queryNamesForStudent));
            onDeleteAllStudents(() => invalidations(queryNamesForStudent));
            onDeleteStudent(() => invalidations(queryNamesForStudent));
        }

        if (props.role.includes("student")) {
            onClassChanged(() => invalidations([...queryNamesForClass, ...queryNamesForStudent]));
            onDeletedAllClasses(() => invalidations([...queryNamesForClass, ...queryNamesForStudent]));
            onDeleteClass(() => invalidations([...queryNamesForClass, ...queryNamesForStudent]));

            onPresenceCreated(() => invalidations(queryNamesForPresenceForm));
            onPresenceChanged(() => invalidations(queryNamesForPresenceForm));

            onPresenceDeletedAll(() => invalidations(queryNamesForPresenceForm));
            onPresenceDeleted(() => invalidations(queryNamesForPresenceForm));

            onPresenceStatusChanged(() => invalidations(queryNamesForPresenceStatus));
            onPresenceStatusDeletedAll(() => invalidations(queryNamesForPresenceStatus));
            onPresenceStatusDeleted(() => invalidations(queryNamesForPresenceStatus));
            
            onStudentChanged(() => invalidations(queryNamesForStudent));
            onDeleteAllStudentByClass(() => invalidations(queryNamesForStudent));
            onDeleteAllStudents(() => invalidations(queryNamesForStudent));
            onDeleteStudent(() => invalidations(queryNamesForStudent));
        }

        return () => removeAllListeners();

    }, [props.identifier, props.role, props.user_id, queryClient]);
}