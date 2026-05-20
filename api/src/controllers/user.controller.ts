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

export async function deleteUser(req: Request, res: Response) {
    try {
        await User.deleteOne({ _id: req.params.user_id });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}