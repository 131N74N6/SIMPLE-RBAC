import { Router } from "express";
import { checkRole, verifyToken } from "../middleware/auth.middleware";
import { changeStudentPresence, deleteAllStatuses, deleteStatus, fillPresenceForStudent, getAvailablePresencesForStudent, isPresenceFilled } from "../controllers/student-presence.controller";

const studentPresenceRouters = Router();

studentPresenceRouters.delete('/rm-all/:presence_slot_id', verifyToken, checkRole("admin", "master"), deleteAllStatuses);
studentPresenceRouters.delete('/rm/:_id', verifyToken, checkRole("admin", "master"), deleteStatus);

studentPresenceRouters.get('/show-all', verifyToken, checkRole("student"), getAvailablePresencesForStudent);
studentPresenceRouters.get('/is-filled/:presence_slot_id', verifyToken, checkRole("student"), isPresenceFilled);

studentPresenceRouters.post('/fill', verifyToken, checkRole("student"), fillPresenceForStudent);

studentPresenceRouters.put('/remake-status/:_id', verifyToken, checkRole("admin", "master"), changeStudentPresence);

export default studentPresenceRouters;