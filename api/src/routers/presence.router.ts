import { Router } from "express";
import { checkRole, verifyToken } from "../middleware/auth.middleware";
import { changePresence, deleteAllPresencesForMaster, deleteOnePresenceForMaster, fillPresenceForStudent, getPresenceDetailForMaster, getAllPresencesForMaster, makePresence, getAvailablePresencesForStudent } from "../controllers/presence.controller";

const presenceRouters = Router();

presenceRouters.delete('/master/rm-all', verifyToken, checkRole("master"), deleteAllPresencesForMaster);
presenceRouters.delete('/master/rm/:id', verifyToken, checkRole("master"), deleteOnePresenceForMaster);

presenceRouters.get('/master/show-all', verifyToken, checkRole("master"), getAllPresencesForMaster);
presenceRouters.get('/master/show/:presence_slot_id', verifyToken, checkRole("master"), getPresenceDetailForMaster);
presenceRouters.get('/student/show-all', verifyToken, checkRole("student"), getAvailablePresencesForStudent);

presenceRouters.post('/master/make', verifyToken, checkRole("master"), makePresence);
presenceRouters.post('/student/fill', verifyToken, checkRole("student"), fillPresenceForStudent);

presenceRouters.put('/remake', verifyToken, checkRole("admin", "master"), changePresence);

export default presenceRouters;