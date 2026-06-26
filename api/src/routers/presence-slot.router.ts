import { Router } from "express";
import { checkRole, verifyToken } from "../middleware/auth.middleware";
import { changePresenceForm, deleteAllPresencesForMaster, deleteOnePresenceForMaster, getPresenceDetailForMaster, getAllPresencesForMaster, makePresence } from "../controllers/presence-slot.controller";

const presenceSlotRouters = Router();

presenceSlotRouters.delete('/master/rm-all', verifyToken, checkRole("master"), deleteAllPresencesForMaster);
presenceSlotRouters.delete('/master/rm/:id', verifyToken, checkRole("master"), deleteOnePresenceForMaster);

presenceSlotRouters.get('/master/show-all', verifyToken, checkRole("master"), getAllPresencesForMaster);
presenceSlotRouters.get('/master/show/:presence_slot_id', verifyToken, checkRole("master"), getPresenceDetailForMaster);

presenceSlotRouters.post('/master/make', verifyToken, checkRole("master"), makePresence);

presenceSlotRouters.put('/remake-form/:id', verifyToken, checkRole("admin", "master"), changePresenceForm);

export default presenceSlotRouters;