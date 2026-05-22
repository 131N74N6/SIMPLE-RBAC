import { Router } from "express";
import { register, signIn } from "../controllers/auth.controller";
import { checkRole, verifyToken } from "../middleware/auth.middleware";

const authRouters = Router();

authRouters.post('/register', verifyToken, checkRole('admin'), register);
authRouters.post('/signin', signIn);

export default authRouters;