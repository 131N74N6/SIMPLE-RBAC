import { Router } from "express";
import { checkRole, verifyToken } from "../middleware/auth.middleware";
import { changePresenceForm, deleteAllPresencesForMaster, deleteOnePresenceForMaster, getPresenceDetailForMaster, getAllPresencesForMaster, makePresence } from "../controllers/presence-slot.controller";

const presenceSlotRouters = Router();

presenceSlotRouters.delete('/rm-all', verifyToken, checkRole("master"), deleteAllPresencesForMaster);
presenceSlotRouters.delete('/rm/:id', verifyToken, checkRole("master"), deleteOnePresenceForMaster);

presenceSlotRouters.get('/show-all', verifyToken, checkRole("admin", "master"), getAllPresencesForMaster);
presenceSlotRouters.get('/show-detail/:presence_slot_id', verifyToken, checkRole("admin", "master"), getPresenceDetailForMaster);

presenceSlotRouters.post('/make-form', verifyToken, checkRole("master"), makePresence);

presenceSlotRouters.put('/remake-form/:id', verifyToken, checkRole("admin", "master"), changePresenceForm);

export default presenceSlotRouters;