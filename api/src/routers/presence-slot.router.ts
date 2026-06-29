import { Router } from "express";
import { checkRole, verifyToken } from "../middleware/auth.middleware";
import { changePresenceForm, deleteAllPresencesForMaster, deleteOnePresence, getPresenceDetailForMaster, getAllPresencesForMaster, makePresence, getAllPresencesForAdmin, deleteAllPresencesForAdmin } from "../controllers/presence-slot.controller";

const presenceSlotRouters = Router();

presenceSlotRouters.delete('/admin/rm-all', verifyToken, checkRole("admin"), deleteAllPresencesForAdmin);
presenceSlotRouters.delete('/rm-all', verifyToken, checkRole("admin", "master"), deleteAllPresencesForMaster);
presenceSlotRouters.delete('/rm/:id', verifyToken, checkRole("admin", "master"), deleteOnePresence);

presenceSlotRouters.get('/master/show-all', verifyToken, checkRole("master"), getAllPresencesForMaster);
presenceSlotRouters.get('/admin/show-all', verifyToken, checkRole("admin"), getAllPresencesForAdmin);
presenceSlotRouters.get('/show-detail/:presence_slot_id', verifyToken, checkRole("admin", "master"), getPresenceDetailForMaster);

presenceSlotRouters.post('/make-form', verifyToken, checkRole("master"), makePresence);

presenceSlotRouters.put('/remake-form/:id', verifyToken, checkRole("admin", "master"), changePresenceForm);

export default presenceSlotRouters;