import { AuthRequest } from "../middleware/auth.middleware";
import { Request, Response } from 'express';
import { StudentPresence } from "../models/student-presence.model";
import { PresenceSlot } from "../models/presence-slot.model";
import { io } from "../services/socket-io.service";

export async function changeStudentPresence(req: Request, res: Response) {
    try {
        const presenceStatuses = await StudentPresence.find({ _id: req.params._id });

        await StudentPresence.updateOne({ _id: req.params.id }, {
            $set: { status: req.body.status }
        });

        io.to(`class: ${presenceStatuses[0].classname}`).emit("presence-status:changed", {
            status: req.body.status
        });

        res.status(200).json({ message: "Presence status changed" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export async function deleteAllStatuses(req: Request, res: Response) {
    try {
        const presenceSlotId = req.params.presence_slot_id;
        const presenceStatuses = await StudentPresence.find({ presence_slot_id: presenceSlotId });
        if (presenceStatuses.length === 0) return res.status(404).json({ message: "data not found" });

        const presenceStatusClasses = presenceStatuses.map(presenceStatus => presenceStatus.classname);

        await StudentPresence.deleteMany({ presence_slot_id: req.params.presence_slot_id });

        presenceStatusClasses.forEach(presenceStatus => {
            io.to(`class: ${presenceStatus}`).emit("presence-status:all-deleted", { presence_slot_id: presenceSlotId });
        });

        res.status(200).json({ message: "all presence status deleted" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}
export async function deleteStatus(req: Request, res: Response) {
    try {
        const presenceStatuses = await StudentPresence.find({ _id: req.params._id });

        await StudentPresence.deleteOne({ _id: presenceStatuses[0]._id });

        io.to(`class: ${presenceStatuses[0].classname}`).emit("presence-status:deleted", { _id: req.params._id });

        res.status(200).json({ message: "1 presence status deleted" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function fillPresenceForStudent(req: AuthRequest, res: Response) {
    try {
        const { presence_creator, presence_slot_id, status } = req.body;
        const student_id = req.user?.user_id;
        const student_name = req.user?.username;
        const classname = req.user?.classname;

        if (!presence_slot_id || !status) return res.status(400).json({ message: "Slot ID and Status are required" });

        const targetSlot = await PresenceSlot.find({ _id: presence_slot_id });
        if (targetSlot.length === 0) return res.status(404).json({ message: "Presence form not found" });

        // const now = new Date().toISOString();
        // const deadlineTime = targetSlot[0].deadline;

        const newAttendance = new StudentPresence({
            presence_creator,
            presence_slot_id,
            student_id,
            student_name,
            classname,
            status: status,
            filled_at: new Date().toISOString()
        });

        io.to(`master: ${targetSlot[0].master_id.toString()}`).emit("presence:filled", {
            presence_creator,
            presence_slot_id,
            student_id,
            student_name,
            classname,
            status: status,
            filled_at: new Date().toISOString()
        });

        await newAttendance.save();
        res.status(200).json({ message: "Presence successfully recorded!" });
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

        const totalAvailableSlots = await PresenceSlot.find(
            { classname: req.user?.classname }
        ).sort({ created_at: -1 }).countDocuments();
        
        if (totalAvailableSlots === 0) return res.status(404).json({ message: "No presence forms available for your class" });

        const availableSlots = await PresenceSlot.find(
            { classname: req.user?.classname }, 
            { master_id: 0 }
        ).sort({ created_at: -1 }).limit(dataLimit).skip(skip);

        res.status(200).json(availableSlots);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export async function isPresenceFilled(req: AuthRequest, res: Response) {
    try {
        const { presence_slot_id } = req.params;
        const student_id = req.user?.user_id;

        const alreadyFilled = await StudentPresence.findOne({ presence_slot_id, student_id: student_id });
        res.status(200).json({ status: alreadyFilled?.status });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}