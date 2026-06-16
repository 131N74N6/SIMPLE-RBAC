import { Request, Response } from 'express';
import { PresenceSlot, StudentAttendance } from '../models/presence.model';
import { AuthRequest } from '../middleware/auth.middleware';

export async function changePresence(req: Request, res: Response) {
    try {
        await StudentAttendance.updateOne({ _id: req.params.id }, {
            $set: { status: req.body.status }
        });
        res.status(200).json({ message: "Presence changed" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export async function deleteAllPresences(_: Request, res: Response) {
    try {
        const presenceTotal = await PresenceSlot.find().countDocuments();
        if (presenceTotal === 0) return res.status(404).json({ message: "Presence not found" });

        await Promise.all([
            StudentAttendance.deleteMany(),
            PresenceSlot.deleteMany()
        ]);
        res.status(200).json({ message: "All presences deleted" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export async function deleteOnePresence(req: Request, res: Response) {
    try {
        await Promise.all([
            StudentAttendance.deleteMany({ presence_slot_id: req.params.id }),
            PresenceSlot.deleteOne({ _id: req.params.id })
        ]);
        res.status(200).json({ message: "Presence deleted" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export async function fillPresenceForStudent(req: AuthRequest, res: Response) {
    try {
        const { presence_slot_id, status } = req.body;
        const student_id = req.user?.user_id;
        const student_name = req.user?.username;
        const classname = req.user?.classname;

        if (!presence_slot_id || !status) {
            return res.status(400).json({ message: "Slot ID and Status are required" });
        }

        const targetSlot = await PresenceSlot.find({ _id: presence_slot_id });
        if (targetSlot.length === 0) return res.status(404).json({ message: "Presence form not found" });

        const alreadyFilled = await StudentAttendance.findOne({ presence_slot_id, student_id: student_id });
        if (alreadyFilled) return res.status(400).json({ message: "You have already filled this presence form!" });

        const now = new Date();
        const deadlineTime = new Date(targetSlot[0].deadline);
        if (now > deadlineTime) {
            return res.status(400).json({ message: "Oops! The deadline for this presence has passed" });
        }

        const newAttendance = new StudentAttendance({
            presence_slot_id,
            student_id,
            student_name,
            classname,
            status: now > deadlineTime ? 'Not Here' : status,
            filled_at: new Date().toISOString()
        });

        await newAttendance.save();
        res.status(200).json({ message: "Presence successfully recorded!" });
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
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;
        const skip = (page - 1) * limit;

        const presenceTotal = await StudentAttendance.find({ presence_slot_id: req.params.presence_slot_id }).countDocuments();
        if (presenceTotal === 0) return res.status(404).json({ message: "Student not found" });

        const studentList = await StudentAttendance.find({ presence_slot_id: req.params.presence_slot_id }).limit(limit).skip(skip);
        res.status(200).json(studentList);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export async function getAvailablePresencesForStudent(req: AuthRequest, res: Response) {
    try {
        const { limit, page } = req.query;
        const dataLimit = parseInt(limit as string) || 12;
        const dataEachPage = parseInt(page as string) || 1;
        const skip = (dataEachPage - 1) * dataLimit;

        const totalAvailableSlots = await PresenceSlot.find({ classname: req.user?.classname }).sort({ created_at: -1 }).countDocuments();
        if (totalAvailableSlots === 0) return res.status(404).json({ message: "No presence forms available for your class" });

        const availableSlots = await PresenceSlot.find({ classname: req.user?.classname }).sort({ created_at: -1 }).limit(dataLimit).skip(skip);
        res.status(200).json(availableSlots);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export async function getPresenceSlotForStudent(req: AuthRequest, res: Response) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;
        const skip = (page - 1) * limit;

        const presenceTotal = await StudentAttendance.find({ classname: req.user?.classname }).countDocuments();
        if (presenceTotal === 0) return res.status(404).json({ message: "Student not found" });
        
        const presenceList = await StudentAttendance.find({ classname: req.user?.classname }).limit(limit).skip(skip);
        res.status(200).json(presenceList);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export async function makePresence(req: AuthRequest, res: Response) {
    try {
        const { classname, deadline, start_time } = req.body;
        const master_id = req.user?.user_id;

        if (!classname || !deadline || !start_time) return res.status(400).json({ message: "All fields are required" });

        const newSlot = new PresenceSlot({
            classname,
            created_at: new Date().toISOString(),
            deadline,
            master_id,
            start_time
        });
        
        await newSlot.save();
        res.status(201).json({ message: "Presence form successfully created for " + classname });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}