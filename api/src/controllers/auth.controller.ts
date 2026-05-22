import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { User } from '../models/user.model';

export async function register(req: Request, res: Response) {
    try {
        const { email, password, role, username } = req.body;
        if (!email && !password && !username && !role) return res.status(400).json({ message: "Please provide email, username, role and password" });
        if (!email) return res.status(400).json({ message: "Please provide email" });
        if (!password) return res.status(400).json({ message: "Please provide password" });
        if (!username) return res.status(400).json({ message: "Please provide username" });
        if (!role) return res.status(400).json({ message: "Please provide role" });

        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(409).json({ message: "User already exists" });

        const existingEmail = await User.findOne({ email });
        if (existingEmail) return res.status(409).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const createDate = new Date().toISOString();
        const newUser = new User({ created_at: createDate, email, password: hashedPassword, role, username });
        await newUser.save();

        res.status(200).json({ message: "User created successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export async function signIn(req: Request, res: Response) {
    try {
        const { password, username } = req.body;
        if (!password && !username) return res.status(400).json({ message: "Please provide username and password" });
        if (!password) return res.status(400).json({ message: "Please provide password" });
        if (!username) return res.status(400).json({ message: "Please provide username" });

        const findUser = await User.findOne({ username });
        if (!findUser) return res.status(404).json({ message: "User not found" });

        const isPasswordMatch = await bcrypt.compare(password, findUser.password);
        if (!isPasswordMatch) return res.status(400).json({ message: "Invalid password" });

        const userToken = jwt.sign(
            { user_id: findUser._id, role: findUser.role }, 
            process.env.JWT_SECRET || 'your_jwt_key', 
        );

        res.status(200).json({ token: userToken, user_id: findUser._id, role: findUser.role });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}