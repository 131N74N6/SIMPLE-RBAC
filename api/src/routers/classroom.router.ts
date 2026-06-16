import { Router } from "express";
import { changeClass, deleteAllClasses, deleteOneClass, getAllClasses, makeClass } from "../controllers/classroom.controller";
import { checkRole, verifyToken } from "../middleware/auth.middleware";

const classRouters = Router();

classRouters.delete('/admin-only/rm-all', verifyToken, checkRole("admin"), deleteAllClasses);
classRouters.delete('/admin-only/rm/:classname', verifyToken, checkRole("admin"), deleteOneClass);

classRouters.get('/admin-only/show-all', verifyToken, checkRole("admin"), getAllClasses)

classRouters.post('/admin-only/make', verifyToken, checkRole("admin"), makeClass);

classRouters.put('/admin-only/remake', verifyToken, checkRole("admin"), changeClass);

export default classRouters;