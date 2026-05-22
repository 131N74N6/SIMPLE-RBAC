import { Request, Response } from "express";
import { User } from "../models/user.model";

export async function changeUserData(req: Request, res: Response) {
    try {
        if (!req.body.role && !req.body.username) return res.status(400).json({ message: "Please provide role and username" });
        if (!req.body.role) return res.status(400).json({ message: "Please provide role" });
        if (!req.body.username) return res.status(400).json({ message: "Please provide username" });
        
        await User.updateOne({ _id: req.params.user_id}, {
            $set : {
                role: req.body.role,
                username: req.body.username
            }
        });
        res.status(200).json({ message: "User data updated successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export async function deleteAllUsers(_: Request, res: Response) {
    try {
        await User.deleteMany({});
        res.status(200).json({ message: "All users deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export async function deleteUser(req: Request, res: Response) {
    try {
        await User.deleteOne({ _id: req.params.user_id });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export async function getAllUsers(req: Request, res: Response) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 16;
        const skip = (page - 1) * limit;
        const users = await User.find().skip(skip).limit(limit);
        
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export async function getUser(req: Request, res: Response) {
    try {
        const user = await User.find({ _id: req.params.user_id });
        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}