import { Request, Response } from 'express';
import { StudentPresence } from "../models/student-presence.model";
import { PresenceSlot } from "../models/presence-slot.model";
import { AuthRequest } from '../middleware/auth.middleware';
import { io } from '../services/socket-io.service';

export async function changePresenceForm(req: Request, res: Response) {
    try {
        const updatedForm = await PresenceSlot.findOneAndUpdate({ _id: req.params.id }, {
            $set: { 
                classname: req.body.classname,
                deadline: req.body.deadline,
                start_time: req.body.start_time 
            }
        });

        io.to(`class:${updatedForm?.classname}`)
        .to(`master:${updatedForm?.master_id}`)
        .to("admin")
        .emit("presence:edited", {
            _id: updatedForm?._id,
            classname: updatedForm?.classname,
            deadline: updatedForm?.deadline,
            start_time: updatedForm?.start_time 
        });

        res.status(200).json({ message: "Presence form changed" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export async function deleteAllPresencesForAdmin(req: AuthRequest, res: Response) {
    try {
        const presenceSlots = await PresenceSlot.find();
        if (presenceSlots.length === 0) return res.status(404).json({ message: "Presence not found" });

        const presenceSlotClasses = Array.from(new Set(
            presenceSlots.map(presenceSlot => presenceSlot.classname)
        ));

        const presenceSlotMasterIds = Array.from(new Set(
            presenceSlots.map(presenceSlot => presenceSlot.master_id)
        ));

        await Promise.all([
            StudentPresence.deleteMany(),
            PresenceSlot.deleteMany()
        ]);

        presenceSlotMasterIds.forEach(presenceSlotMasterId => {
            io.to(`master:${presenceSlotMasterId}`)
            .emit("presence:all-deleted", presenceSlotMasterId);
        });

        presenceSlotClasses.forEach(presenceSlotClass => {
            io.to(`class:${presenceSlotClass}`)
            .to("admin")
            .emit("presence:all-deleted", presenceSlotClass);
        });

        res.status(200).json({ message: "All presences deleted" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export async function deleteAllPresencesForMaster(req: AuthRequest, res: Response) {
    try {
        const presenceSlot = await PresenceSlot.find({ master_id: req.user?.user_id });
        if (presenceSlot.length === 0) return res.status(404).json({ message: "Presence not found" });

        const presenceSlotIds = presenceSlot.map((slot) => slot._id);
        const presenceSlotClasses = Array.from(new Set(presenceSlot.map((slot) => slot.classname)));

        await Promise.all([
            StudentPresence.deleteMany({ presence_slot_id: { $in: presenceSlotIds } }),
            PresenceSlot.deleteMany({ master_id: req.user?.user_id })
        ]);

        io.to(`master:${presenceSlot[0].master_id}`)
        .emit("presence:all-deleted", { master_id: req.user?.user_id });

        presenceSlotClasses.forEach(presenceSlotClass => {
            io.to(`class:${presenceSlotClass}`)
            .to("admin")
            .emit("presence:all-deleted", presenceSlotClass);
        });

        res.status(200).json({ message: "All presences deleted" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export async function deleteOnePresence(req: Request, res: Response) {
    try {
        const presenceSlot = await PresenceSlot.find({ _id: req.params.id });

        await Promise.all([
            StudentPresence.deleteMany({ presence_slot_id: req.params.id }),
            PresenceSlot.deleteOne({ _id: req.params.id })
        ]);

        io.to(`class:${presenceSlot[0].classname}`)
        .to(`master:${presenceSlot[0].master_id}`)
        .to("admin")
        .emit("presence:deleted", { presence_slot_id: req.params.id });

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

        const searched = req.query.search as string | undefined;
        const presenceTotal = await PresenceSlot.find({ master_id: req.user?.user_id }).countDocuments();
        if (presenceTotal === 0) return res.status(404).json({ message: "Presence not found" });

        if (searched === undefined) {
            const presenceData = await PresenceSlot.find({ master_id: req.user?.user_id }).limit(limit).skip(skip);
            
            res.status(200).json(presenceData);
        } else {
            const presenceData = await PresenceSlot.find({
                $or: [
                    { classname: { $regex: new RegExp(searched, 'i') } },
                    { created_at: { $regex: new RegExp(searched, 'i') } },
                ],
                master_id: req.user?.user_id
            }).limit(limit).skip(skip);

            res.status(200).json(presenceData);
        }
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export async function getAllPresencesForAdmin(req: Request, res: Response) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;
        const skip = (page - 1) * limit;

        let presenceData;
        const searched = req.query.search as string | undefined;
        const presenceTotal = await PresenceSlot.find().countDocuments();
        if (presenceTotal === 0) return res.status(404).json({ message: "Presence not found" });

        if (searched !== undefined) {
            presenceData = await PresenceSlot.find({ 
                $or: [
                    { classname: { $regex: new RegExp(searched, 'i') } },
                    { master_name: { $regex: new RegExp(searched, 'i') } }
                ] 
            }).limit(limit).skip(skip);
        } else {
            presenceData = await PresenceSlot.find().limit(limit).skip(skip);
        }

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

        io.to(`class:${classname}`).to("admin").emit("presence:created", {
            _id: newSlot._id,
            classname: newSlot.classname,
            created_at: new Date().toISOString(),
            deadline: newSlot.deadline,
            master_id: newSlot.master_id,
            master_name: newSlot.master_name,
            start_time: newSlot.start_time
        });

        res.status(200).json({ message: "Presence form successfully created for " + classname });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}