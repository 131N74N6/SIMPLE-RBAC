import { Request, Response } from "express";
import { User } from "../models/user.model";
import { AuthRequest } from "../middleware/auth.middleware";

export async function changeUserData(req: Request, res: Response) {
    try {
        if (!!req.body.email && !req.body.role && !req.body.username) return res.status(400).json({ message: "Please provide role and username" });
        if (!req.body.email) return res.status(400).json({ message: "Please provide username" });
        if (!req.body.role) return res.status(400).json({ message: "Please provide role" });
        if (!req.body.username) return res.status(400).json({ message: "Please provide username" });
        
        await User.updateOne({ _id: req.params.user_id}, {
            $set: {
                created_at: req.body.created_at,
                email: req.body.email,
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
        await User.deleteMany({ role: "user" });
        res.status(200).json({ message: "All users deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export async function deleteUser(req: Request, res: Response) {
    try {
        await User.deleteOne({ _id: req.params.user_id, role: "user" });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export async function getAllUsers(req: Request, res: Response) {
    try {
        const searched = req.query.search as string | undefined;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 16;
        const skip = (page - 1) * limit;

        if (searched === undefined || searched.trim() === "") {
            const users = await User.find().skip(skip).limit(limit).sort({ created_at: 1 });
            res.status(200).json(users);
        } else {
            const users = await User.find({ username: { $regex: new RegExp(searched, 'i') } }).skip(skip).limit(limit).sort({ created_at: 1 });
            res.status(200).json(users);
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export async function getUser(req: AuthRequest, res: Response) {
    try {
        const user = await User.find({ _id: req.user?.user_id }, { password: 0 });
        res.status(200).json({
            created_at: user[0].created_at,
            role: user[0].role,
            user_id: user[0]._id,
            username: user[0].username
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}