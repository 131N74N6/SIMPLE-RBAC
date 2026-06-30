import { Request, Response } from "express";
import { User } from "../models/user.model";
import { AuthRequest } from "../middleware/auth.middleware";
import { StudentPresence } from "../models/student-presence.model";
import { PresenceSlot } from "../models/presence-slot.model";
import { io } from "../services/socket-io.service";

export async function changeStudentData(req: Request, res: Response) {
    try {
        if (!!req.body.email && !req.body.role && !req.body.username) return res.status(400).json({ message: "Please provide role and username" });
        if (!req.body.email) return res.status(400).json({ message: "Please provide username" });
        if (!req.body.role) return res.status(400).json({ message: "Please provide role" });
        if (!req.body.username) return res.status(400).json({ message: "Please provide username" });

        await Promise.all([
            StudentPresence.updateMany({ student_id: req.params.user_id }, {
                $set: { student_name: req.body.username }
            }),
            User.updateOne({ _id: req.params.user_id, role: "student" }, {
                $set: {
                    classname: req.body.classname,
                    created_at: req.body.created_at,
                    email: req.body.email,
                    role: req.body.role,
                    username: req.body.username
                }
            })
        ]);

        io.to(`class:${req.body.classname}`).to("admin").emit("user:student-changed", {  
            classname: req.body.classname,
            created_at: req.body.created_at,
            email: req.body.email,
            role: req.body.role,
            username: req.body.username
        });
        
        res.status(200).json({ message: "User data updated successfully" });
    } catch (error: any) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export async function changeMasterData(req: Request, res: Response) {
    try {
        if (!!req.body.email && !req.body.role && !req.body.username) return res.status(400).json({ message: "Please provide role and username" });
        if (!req.body.email) return res.status(400).json({ message: "Please provide username" });
        if (!req.body.role) return res.status(400).json({ message: "Please provide role" });
        if (!req.body.username) return res.status(400).json({ message: "Please provide username" });

        const presenceSlots = await PresenceSlot.find({ master_id: req.params.user_id });
        const presenceSlotIds = presenceSlots.map(presenceSlot => presenceSlot._id);

        await Promise.all([
            StudentPresence.updateMany({ presence_slot_id: { $in: presenceSlotIds } }, {
                $set: { presence_creator: req.body.username }
            }),
            PresenceSlot.updateMany({ master_id: req.params.user_id }, {
                $set: { master_name: req.body.username }
            }),
            User.updateOne({ _id: req.params.user_id, role: "master" }, {
                $set: {
                    created_at: req.body.created_at,
                    email: req.body.email,
                    role: req.body.role,
                    username: req.body.username
                }
            })
        ]);

        io.to(`master:${req.params.user_id}`).to("admin").emit("user:master-changed", {
            created_at: req.body.created_at,
            email: req.body.email,
            role: req.body.role,
            username: req.body.username
        });
        
        res.status(200).json({ message: "User data updated successfully" });
    } catch (error: any) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export async function deleteAllStudents(_: Request, res: Response) {
    try {
        const getStudents = await User.find({ role: 'student' });
        if (getStudents.length === 0) return res.status(404).json({ message: "Student not found" });

        const getStudentClasses = Array.from(new Set(getStudents.map(student => student.classname)));

        await Promise.all([
            StudentPresence.deleteMany(),
            User.deleteMany({ role: "student" })
        ]);

        getStudentClasses.forEach(getStudentClass => {
            io.to(`class:${getStudentClass}`).to("admin").emit("user:all-student-deleted", { classname: getStudentClass });
        });

        res.status(200).json({ message: "All users deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export async function deleteAllStudentByClass(req: Request, res: Response) {
    try {
        const getStudents = await User.find({ role: 'student', classname: req.params.classname });
        if (getStudents.length === 0) return res.status(404).json({ message: "Student not found" });

        await Promise.all([
            StudentPresence.deleteMany({ classname: getStudents[0].classname }),
            User.deleteMany({ classname: getStudents[0].classname, role: "student" })
        ]);

        io.to(`class:${req.params.classname}`).to("admin").emit("user:all-student-in-class-deleted", { classname: req.params.classname });

        res.status(200).json({ message: "All users deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export async function deleteStudent(req: Request, res: Response) {
    try {
        const getStudents = await User.find({ role: 'student', _id: req.params.id });

        await Promise.all([
            StudentPresence.deleteMany({ student_id: req.params.id }),
            User.deleteOne({ _id: req.params.id, role: "student" })
        ]);

        io.to(`class:${getStudents[0].classname}`).to("admin").emit("user:student-deleted", { classname: getStudents[0].classname });

        res.status(200).json({ message: "All users deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export async function deleteAllMasters(_: Request, res: Response) {
    try {
        const getMasters = await User.find({ role: 'master' });
        const presenceSlots = await PresenceSlot.find({ master_id: getMasters[0]._id });
        if (getMasters.length === 0) return res.status(404).json({ message: "Master not found" });

        const presenceSlotsClassNames = Array.from(new Set(presenceSlots.map(presenceSlot => presenceSlot.classname)));

        await Promise.all([
            StudentPresence.deleteMany(),
            PresenceSlot.deleteMany(),
            User.deleteMany({ role: "master" })
        ]);

        presenceSlotsClassNames.forEach(presenceSlotsClassName => {
            io.to(`class:${presenceSlotsClassName}`).to("admin").emit("user:all-master-deleted", { classname: presenceSlotsClassName });
        });

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export async function deleteMaster(req: Request, res: Response) {
    try {
        const presenceSlots = await PresenceSlot.find({ master_id: req.params.id });
        const presenceSlotsIds = presenceSlots.map((presenceSlot) => presenceSlot._id);
        const presenceSlotsClassNames = Array.from(new Set(presenceSlots.map(presenceSlot => presenceSlot.classname)));
        
        await Promise.all([
            StudentPresence.deleteMany({ presence_slot_id: { $in: presenceSlotsIds } }),
            PresenceSlot.deleteMany({ master_id: req.params.id }),
            User.deleteOne({ _id: req.params.id })
        ]);

        presenceSlotsClassNames.forEach(presenceSlotsClassName => {
            io.to(`class:${presenceSlotsClassName}`).to("admin").emit("user:master-deleted", { classname: presenceSlotsClassName });
        });

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export async function getAllMasters(req: Request, res: Response) {
    try {
        const searched = req.query.search as string | undefined;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 16;
        const skip = (page - 1) * limit;

        if (searched === undefined || searched.trim() === "") {
            const users = await User.find({ role: "master" }).skip(skip).limit(limit).sort({ created_at: 1 });
            res.status(200).json(users);
        } else {
            const users = await User.find({ role: "master", username: { $regex: new RegExp(searched, 'i') } }).skip(skip).limit(limit).sort({ created_at: 1 });
            res.status(200).json(users);
        }
    } catch (error: any) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export async function getAllStudents(req: Request, res: Response) {
    try {
        const searched = req.query.search as string | undefined;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 16;
        const skip = (page - 1) * limit;

        if (searched === undefined || searched.trim() === "") {
            const users = await User.find({ role: "student" }).skip(skip).limit(limit).sort({ created_at: 1 });
            res.status(200).json(users);
        } else {
            const users = await User.find({ role: "student", username: { $regex: new RegExp(searched, 'i') } }).skip(skip).limit(limit).sort({ created_at: 1 });
            res.status(200).json(users);
        }
    } catch (error: any) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export async function getUser(req: AuthRequest, res: Response) {
    try {
        const user = await User.findOne({ _id: req.user?.user_id }, { password: 0 });
        if (!user) return res.status(404).json({ message: "user not found" });

        res.status(200).json({
            clasname: user.classname,
            created_at: user.created_at,
            role: user.role,
            user_id: user._id,
            username: user.username
        });
    } catch (error: any) {
        res.status(500).json({ message: "Something went wrong" });
    }
}