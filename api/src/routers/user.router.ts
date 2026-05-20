import { Router } from "express";
import { changeUserData, deleteUser } from "../controllers/user.controller";
import { checkRole, verifyToken } from "../middleware/auth.middleware";

const userRouters = Router();

userRouters.put('/change/:user_id', verifyToken, checkRole('admin'), changeUserData);
userRouters.delete('/remove/:user_id', verifyToken, checkRole('admin'), deleteUser);

export default userRouters;