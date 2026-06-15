import { Router } from "express";
import { changeUserData, deleteAllUsers, deleteUser, getAllUsers, getUser } from "../controllers/user.controller";
import { checkRole, verifyToken } from "../middleware/auth.middleware";

const userRouters = Router();

userRouters.delete('/admin-only/rm/:user_id', verifyToken, checkRole('admin'), deleteUser);
userRouters.delete('/admin-only/rm-all', verifyToken, checkRole('admin'), deleteAllUsers);

userRouters.get('/show-all', verifyToken, checkRole('admin', 'master', 'student'), getAllUsers);
userRouters.get('/show', verifyToken, getUser);

userRouters.put('/admin-only/remake/:user_id', verifyToken, checkRole('admin'), changeUserData);

export default userRouters;