import { Router } from "express";
import { checkRole, verifyToken } from "../middleware/auth.middleware";
import { changePresence, deleteAllPresences, deleteOnePresence, fillPresenceForStudent, getPresenceDetailForMaster, getAllPresencesForMaster, makePresence, getAvailablePresencesForStudent } from "../controllers/presence.controller";

const presenceRouters = Router();

presenceRouters.delete('/admin/rm-all', verifyToken, checkRole("admin"), deleteAllPresences);
presenceRouters.delete('/rm/:id', verifyToken, checkRole("admin", "master"), deleteOnePresence);

presenceRouters.get('/master/show-all', verifyToken, checkRole("master"), getAllPresencesForMaster);
presenceRouters.get('/master/show/:presence_slot_id', verifyToken, checkRole("master"), getPresenceDetailForMaster);
presenceRouters.get('/student/show-all', verifyToken, checkRole("student"), getAvailablePresencesForStudent);

presenceRouters.post('/master/make', verifyToken, checkRole("master"), makePresence);
presenceRouters.post('/student/fill', verifyToken, checkRole("student"), fillPresenceForStudent);

presenceRouters.put('/remake', verifyToken, checkRole("admin", "master"), changePresence);

export default presenceRouters;