import { Router } from "express";
import { register, signIn } from "../controllers/auth.controller";
import { checkRole, verifyToken } from "../middleware/auth.middleware";

const authRouter = Router();

authRouter.post('/register', verifyToken, checkRole('admin'), register);
authRouter.post('/signin', signIn);

export default authRouter;