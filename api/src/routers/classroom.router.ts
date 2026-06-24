import { Router } from "express";
import { changeClass, deleteAllClasses, deleteOneClass, getAllClasses, getAllStudentsInClass, makeClass } from "../controllers/classroom.controller";
import { checkRole, verifyToken } from "../middleware/auth.middleware";

const classRouters = Router();

classRouters.delete('/admin/rm-all', verifyToken, checkRole("admin"), deleteAllClasses);
classRouters.delete('/admin/rm/:classname', verifyToken, checkRole("admin"), deleteOneClass);

classRouters.get('/admin/show-all', verifyToken, checkRole("admin"), getAllClasses);
classRouters.get('/students/:classname', verifyToken, checkRole("admin", "master", "student"), getAllStudentsInClass);

classRouters.post('/admin/make', verifyToken, checkRole("admin"), makeClass);

classRouters.put('/admin/remake/:id', verifyToken, checkRole("admin"), changeClass);

export default classRouters;