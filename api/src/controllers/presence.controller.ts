import { Request, Response } from 'express';
import { Presence } from '../models/presence.model';
import { AuthRequest } from '../middleware/auth.middleware';

export async function changePresence(req: Request, res: Response) {
    try {
        await Presence.updateOne({ _id: req.params.id }, {
            $set: {
                classname: req.body.classname,
                deadline: req.body.deadline,
                start_time: req.body.start_time,
                status: req.body.status
            }
        });
        res.status(200).json({ message: "Presence changed" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export async function deleteAllPresences(req: Request, res: Response) {
    try {
        const presenceTotal = await Presence.find().countDocuments();
        if (presenceTotal === 0) return res.status(404).json({ message: "Presence not found" });

        await Presence.deleteMany();
        res.status(200).json({ message: "All presences deleted" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export async function deleteOnePresence(req: Request, res: Response) {
    try {
        await Presence.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: "Presence deleted" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export async function fillPresenceForStudent(req: AuthRequest, res: Response) {
    try {
        await Presence.updateOne({ _id: req.params.id }, {
            $set: {
                classname: req.user?.classname,
                status: req.body.status,
                student_id: req.user?.user_id,
                student_name: req.user?.username
            }
        });
        res.status(200).json({ message: "Presence saved" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export async function getAllPresences(req: Request, res: Response) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;
        const skip = (page - 1) * limit;

        const presenceTotal = await Presence.find().countDocuments();
        if (presenceTotal === 0) return res.status(404).json({ message: "Presence not found" });

        const presenceData = await Presence.find().limit(limit).skip(skip);
        res.status(200).json(presenceData);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export async function getAllPresencesForStudent(req: AuthRequest, res: Response) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;
        const skip = (page - 1) * limit;

        const presenceTotal = await Presence.find({ classname: req.user?.classname, student_id: req.user?.user_id }).countDocuments();
        if (presenceTotal === 0) return res.status(404).json({ message: "Presence not found" });

        const presenceData = await Presence.find({ classname: req.user?.classname, student_id: req.user?.user_id }).limit(limit).skip(skip);
        res.status(200).json(presenceData);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export async function makePresence(req: AuthRequest, res: Response) {
    try {
        const created_at = new Date().toISOString();
        const { classname, deadline, start_time } = req.body;
        const master_id = req.user?.user_id;
        const status = "";

        if (!deadline && !start_time) return res.status(400).json({ message: "All field required" });
        if (!deadline) return res.status(400).json({ message: "Please provide deadline" });
        if (!start_time) return res.status(400).json({ message: "Please provide start time" });

        const newPresence = new Presence({ classname, created_at, deadline, master_id, start_time, status });
        await newPresence.save();

        res.status(200).json({ message: "Presence added" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}