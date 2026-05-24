import { Router } from "express";
import { changeUserData, deleteAllUsers, deleteUser, getAllUsers, getUser } from "../controllers/user.controller";
import { checkRole, verifyToken } from "../middleware/auth.middleware";

const userRouters = Router();

userRouters.delete('/admin-only/rm/:user_id', verifyToken, checkRole('admin'), deleteUser);
userRouters.delete('/admin-only/rm-all', verifyToken, checkRole('admin'), deleteAllUsers);

userRouters.get('/admin-only/show', getAllUsers);
userRouters.get('/show/:user_id', verifyToken, getUser);

userRouters.put('/admin-only/change/:user_id', verifyToken, checkRole('admin'), changeUserData);

export default userRouters;