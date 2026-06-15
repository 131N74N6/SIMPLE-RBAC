import { Router } from "express";
import { changeClass, deleteAllClasses, deleteOneClass, getAllClasses, makeClass } from "../controllers/classroom.controller";
import { checkRole, verifyToken } from "../middleware/auth.middleware";

const classRouters = Router();

classRouters.delete('/admin/rm-all', verifyToken, checkRole("admin"), deleteAllClasses);
classRouters.delete('/admin/rm/:id', verifyToken, checkRole("admin"), deleteOneClass);

classRouters.get('/admin/show-all', verifyToken, checkRole("admin"), getAllClasses)

classRouters.post('/admin/make', verifyToken, checkRole("admin"), makeClass);

classRouters.put('/admin/remake', verifyToken, checkRole("admin"), changeClass);

export default classRouters;