import { Router } from "express";
import { checkRole, verifyToken } from "../middleware/auth.middleware";
import { changePresence, deleteAllPresences, deleteOnePresence, fillPresenceForStudent, getAllPresences, getAllPresencesForStudent, makePresence } from "../controllers/presence.controller";

const presenceRouters = Router();

presenceRouters.delete('/rm-all', verifyToken, checkRole("admin", "master"), deleteAllPresences);
presenceRouters.delete('/rm-all/:id', verifyToken, checkRole("admin", "master"), deleteOnePresence);

presenceRouters.get('/show-all', verifyToken, checkRole("admin", "master"), getAllPresences);
presenceRouters.get('/student/show-all', verifyToken, checkRole("student"), getAllPresencesForStudent);

presenceRouters.post('/make', verifyToken, checkRole("master"), makePresence);

presenceRouters.put('/remake', verifyToken, checkRole("admin", "master"), changePresence);
presenceRouters.put('/student/fill', verifyToken, checkRole("student"), fillPresenceForStudent);

export default presenceRouters;