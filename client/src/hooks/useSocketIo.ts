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
        newUserAdded,
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
        const queryNamesForAuthUser = ['auth-user'];
        const queryNamesForMaster = ['all-masters'];

        const queryNamesForPresences = [
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
            newUserAdded(() => invalidations([
                ...queryNamesForMaster, ...queryNamesForStudent, ...queryNamesForAuthUser
            ]));

            onClassChanged(() => invalidations([
                ...queryNamesForClass, 
                ...queryNamesForStudent, 
                ...queryNamesForPresences, 
                ...queryNamesForAuthUser
            ]));
            onClassCreated(() => invalidations([
                ...queryNamesForClass, 
                ...queryNamesForStudent, 
                ...queryNamesForPresences, 
                ...queryNamesForAuthUser
            ]));
            onDeletedAllClasses(() => invalidations([
                ...queryNamesForClass, 
                ...queryNamesForStudent, 
                ...queryNamesForPresences, 
                ...queryNamesForAuthUser
            ]));
            onDeleteClass(() => invalidations([
                ...queryNamesForClass, 
                ...queryNamesForStudent, 
                ...queryNamesForPresences, 
                ...queryNamesForAuthUser
            ]));

            onMasterChanged(() => invalidations([
                ...queryNamesForMaster, ...queryNamesForPresences, ...queryNamesForAuthUser
            ]));
            onDeleteAllMasters(() => invalidations([
                ...queryNamesForMaster, ...queryNamesForPresences, ...queryNamesForAuthUser
            ]));
            onDeleteMaster(() => invalidations([
                ...queryNamesForMaster, ...queryNamesForPresences, ...queryNamesForAuthUser
            ]));

            onPresenceCreated(() => invalidations(queryNamesForPresences));
            onPresenceChanged(() => invalidations(queryNamesForPresences));
            onPresenceDeletedAll(() => invalidations(queryNamesForPresences));
            onPresenceDeleted(() => invalidations(queryNamesForPresences));
            onPresenceFilled(() => invalidations(queryNamesForPresences));

            onPresenceStatusChanged(() => invalidations(queryNamesForPresences));
            onPresenceStatusDeletedAll(() => invalidations(queryNamesForPresences));
            onPresenceStatusDeleted(() => invalidations(queryNamesForPresences));

            onStudentChanged(() => invalidations([
                ...queryNamesForStudent, ...queryNamesForPresences, ...queryNamesForAuthUser
            ]));
            onDeleteAllStudentByClass(() => invalidations([
                ...queryNamesForStudent, ...queryNamesForPresences, ...queryNamesForAuthUser
            ]));
            onDeleteAllStudents(() => invalidations([
                ...queryNamesForStudent, ...queryNamesForPresences, ...queryNamesForAuthUser
            ]));
            onDeleteStudent(() => invalidations([
                ...queryNamesForStudent, ...queryNamesForPresences, ...queryNamesForAuthUser
            ]));
        }

        if (props.role.includes("master")) {
            onClassChanged(() => invalidations([
                ...queryNamesForClass, 
                ...queryNamesForStudent, 
                ...queryNamesForPresences, 
                ...queryNamesForAuthUser
            ]));
            onDeletedAllClasses(() => invalidations([
                ...queryNamesForClass, 
                ...queryNamesForStudent, 
                ...queryNamesForPresences, 
                ...queryNamesForAuthUser
            ]));
            onDeleteClass(() => invalidations([
                ...queryNamesForClass, 
                ...queryNamesForStudent, 
                ...queryNamesForPresences, 
                ...queryNamesForAuthUser
            ]));


            onMasterChanged(() => invalidations(queryNamesForMaster));
            onDeleteAllMasters(() => invalidations(queryNamesForMaster));
            onDeleteMaster(() => invalidations(queryNamesForMaster));

            onPresenceChanged(() => invalidations(queryNamesForPresences));
            onPresenceDeletedAll(() => invalidations(queryNamesForPresences));
            onPresenceDeleted(() => invalidations(queryNamesForPresences));
            onPresenceFilled(() => invalidations(queryNamesForPresences));

            onPresenceStatusChanged(() => invalidations(queryNamesForPresences));
            onPresenceStatusDeletedAll(() => invalidations(queryNamesForPresences));
            onPresenceStatusDeleted(() => invalidations(queryNamesForPresences));

            onStudentChanged(() => invalidations([
                ...queryNamesForStudent, ...queryNamesForPresences, ...queryNamesForAuthUser
            ]));
            onDeleteAllStudentByClass(() => invalidations([
                ...queryNamesForStudent, ...queryNamesForPresences, ...queryNamesForAuthUser
            ]));
            onDeleteAllStudents(() => invalidations([
                ...queryNamesForStudent, ...queryNamesForPresences, ...queryNamesForAuthUser
            ]));
            onDeleteStudent(() => invalidations([
                ...queryNamesForStudent, ...queryNamesForPresences, ...queryNamesForAuthUser
            ]));
        }

        if (props.role.includes("student")) {
            onClassChanged(() => invalidations([
                ...queryNamesForClass, 
                ...queryNamesForStudent, 
                ...queryNamesForPresences, 
                ...queryNamesForAuthUser
            ]));
            onDeletedAllClasses(() => invalidations([
                ...queryNamesForClass, 
                ...queryNamesForStudent, 
                ...queryNamesForPresences, 
                ...queryNamesForAuthUser
            ]));
            onDeleteClass(() => invalidations([
                ...queryNamesForClass, 
                ...queryNamesForStudent, 
                ...queryNamesForPresences, 
                ...queryNamesForAuthUser
            ]));

            onPresenceCreated(() => invalidations(queryNamesForPresences));
            onPresenceChanged(() => invalidations(queryNamesForPresences));

            onPresenceDeletedAll(() => invalidations(queryNamesForPresences));
            onPresenceDeleted(() => invalidations(queryNamesForPresences));

            onPresenceStatusChanged(() => invalidations(queryNamesForPresences));
            onPresenceStatusDeletedAll(() => invalidations(queryNamesForPresences));
            onPresenceStatusDeleted(() => invalidations(queryNamesForPresences));
            
            onStudentChanged(() => invalidations([
                ...queryNamesForStudent, ...queryNamesForPresences, ...queryNamesForAuthUser
            ]));
            onDeleteAllStudentByClass(() => invalidations([
                ...queryNamesForStudent, ...queryNamesForPresences, ...queryNamesForAuthUser
            ]));
            onDeleteAllStudents(() => invalidations([
                ...queryNamesForStudent, ...queryNamesForPresences, ...queryNamesForAuthUser
            ]));
            onDeleteStudent(() => invalidations([
                ...queryNamesForStudent, ...queryNamesForPresences, ...queryNamesForAuthUser
            ]));
        }

        return () => removeAllListeners();

    }, [props.identifier, props.role, props.user_id, queryClient]);
}