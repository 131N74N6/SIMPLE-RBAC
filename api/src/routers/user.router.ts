import { Router } from "express";
import { changeMasterData, changeStudentData, deleteAllMasters, deleteAllStudents, deleteMaster, deleteStudent, getAllMasters, getAllStudents, getUser } from "../controllers/user.controller";
import { checkRole, verifyToken } from "../middleware/auth.middleware";
import { makeClass } from "../controllers/classroom.controller";

const userRouters = Router();

userRouters.delete('/admin/rm-master/id', verifyToken, checkRole('admin'), deleteMaster);
userRouters.delete('/admin/rm-all-masters', verifyToken, checkRole('admin'), deleteAllMasters);
userRouters.delete('/admin/rm-student/id', verifyToken, checkRole('admin'), deleteStudent);
userRouters.delete('/admin/rm-all-students', verifyToken, checkRole('admin'), deleteAllStudents);

userRouters.get('/show-all-students', verifyToken, checkRole('admin'), getAllStudents);
userRouters.get('/show-all-masters', verifyToken, checkRole('admin'), getAllMasters);
userRouters.get('/show', verifyToken, checkRole('admin', 'master', 'student'), getUser);

userRouters.post('/admin/make', verifyToken, checkRole('admin'), makeClass);

userRouters.put('/admin/remake-master/:user_id', verifyToken, checkRole('admin'), changeMasterData);
userRouters.put('/admin/remake-student/:user_id', verifyToken, checkRole('admin'), changeStudentData);

export default userRouters;