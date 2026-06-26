import { Request, Response } from 'express';
import { StudentPresence } from "../models/student-presence.model";
import { PresenceSlot } from "../models/presence-slot.model";
import { AuthRequest } from '../middleware/auth.middleware';

export async function changePresenceForm(req: Request, res: Response) {
    try {
        await PresenceSlot.updateOne({ _id: req.params.id }, {
            $set: { 
                classname: req.body.classname,
                deadline: req.body.deadline,
                start_time: req.body.start_time 
            }
        });
        res.status(200).json({ message: "Presence form changed" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export async function deleteAllPresencesForMaster(req: AuthRequest, res: Response) {
    try {
        const presenceSlot = await PresenceSlot.find({ master_id: req.user?.user_id });
        if (presenceSlot.length === 0) return res.status(404).json({ message: "Presence not found" });

        const presenceSlotIds = presenceSlot.map((slot) => slot._id);

        await Promise.all([
            StudentPresence.deleteMany({ presence_slot_id: { $in: presenceSlotIds } }),
            PresenceSlot.deleteMany({ master_id: req.user?.user_id })
        ]);
        res.status(200).json({ message: "All presences deleted" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export async function deleteOnePresenceForMaster(req: Request, res: Response) {
    try {
        await Promise.all([
            StudentPresence.deleteMany({ presence_slot_id: req.params.id }),
            PresenceSlot.deleteOne({ _id: req.params.id })
        ]);
        res.status(200).json({ message: "Presence deleted" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export async function getAllPresencesForMaster(req: AuthRequest, res: Response) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;
        const skip = (page - 1) * limit;

        const presenceTotal = await PresenceSlot.find({ master_id: req.user?.user_id }).countDocuments();
        if (presenceTotal === 0) return res.status(404).json({ message: "Presence not found" });

        const presenceData = await PresenceSlot.find({ master_id: req.user?.user_id }).limit(limit).skip(skip);
        res.status(200).json(presenceData);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export async function getPresenceDetailForMaster(req: Request, res: Response) {
    try {
        let studentList;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;
        const skip = (page - 1) * limit;
        
        const searched = req.query.search as string | undefined;
        const presenceTotal = await StudentPresence.find({ presence_slot_id: req.params.presence_slot_id }).countDocuments();
        if (presenceTotal === 0) return res.status(404).json({ message: "Student not found" });

        if (searched === undefined || searched === "") {
            studentList = await StudentPresence.find({ presence_slot_id: req.params.presence_slot_id }).limit(limit).skip(skip);
        } else {
            studentList = await StudentPresence.find({ 
                student_name: { $regex: new RegExp(searched, 'i') }, 
                presence_slot_id: req.params.presence_slot_id 
            }).limit(limit).skip(skip);
        }
        res.status(200).json(studentList);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export async function makePresence(req: AuthRequest, res: Response) {
    try {
        const { classname, deadline, start_time } = req.body;
        const master_id = req.user?.user_id;
        const master_name = req.user?.username;

        if (!classname || !deadline || !start_time) return res.status(400).json({ message: "All fields are required" });

        const newSlot = new PresenceSlot({
            classname,
            created_at: new Date().toISOString(),
            deadline,
            master_id,
            master_name,
            start_time
        });
        
        await newSlot.save();
        res.status(200).json({ message: "Presence form successfully created for " + classname });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}