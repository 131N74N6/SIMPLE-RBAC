import { Request, Response } from 'express';
import { ClassRoom } from '../models/classroom.model';
import { PresenceSlot, StudentPresence } from '../models/presence-slot.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { User } from '../models/user.model';

export async function changeClass(req: Request, res: Response) {
    try {
        const targetClass = await ClassRoom.findOne({ _id: req.params.id });

        const isClassExist = await ClassRoom.findOne({ classname: req.body.classname });
        if (isClassExist) return res.status(409).json({ message: "class name already exist" });
        
        await Promise.all([
            User.updateMany({ classname: targetClass?.classname }, {
                $set: { classname: req.body.classname }
            }),
            ClassRoom.updateOne({ _id: req.params.id }, {
                $set: { classname: req.body.classname }
            })
        ]);

        return res.status(200).json({ message: 'class changed' });
    } catch (error) {
        res.status(500).json({ message: 'something went wrong' });
    }
}

export async function deleteAllClasses(_: Request, res: Response) {
    try {
        const totalClass = await ClassRoom.find().countDocuments();
        if (totalClass === 0) return res.status(404).json({ message: 'no class found' });

        await Promise.all([
            StudentPresence.deleteMany(),
            PresenceSlot.deleteMany(),
            ClassRoom.deleteMany(),
            User.updateMany({ role: "student" }, { $set: { classname: "-" } })
        ]);

        return res.status(200).json({ message: 'class deleted' });
    } catch (error) {
        res.status(500).json({ message: 'something went wrong' });
    }
}

export async function deleteOneClass(req: Request, res: Response) {
    const getClassName = req.params.classname;
    try {
        await Promise.all([
            StudentPresence.deleteMany({ classname: getClassName }),
            PresenceSlot.deleteMany({ classname: getClassName }),
            ClassRoom.deleteOne({ classname: getClassName }),
            User.updateMany({ role: "student", classname: getClassName }, { $set: { classname: "-" } })
        ]);

        return res.status(200).json({ message: 'class deleted' });
    } catch (error) {
        res.status(500).json({ message: 'something went wrong' });
    }
}

export async function getAllClasses(req: Request, res: Response) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;
        const skip = (page - 1) * limit;

        const allClasses = await ClassRoom.find().limit(limit).skip(skip);
        res.status(200).json(allClasses);
    } catch (error) {
        res.status(500).json({ message: 'something went wrong' });
    }
}

export async function getAllStudentsInClass(req: Request, res: Response) {
    try {
        const searched = req.query.search as string | undefined;
        const limit = parseInt(req.query.limit as string) || 1;
        const page = parseInt(req.query.page as string) || 12;
        const skip = (page - 1) * limit;

        if (searched === undefined || searched.trim() === "") {
            const users = await User.find({ classname: req.params.classname }).skip(skip).limit(limit);
            res.status(200).json(users);
        } else {
            const users = await User.find({ classname: req.params.classname, username: { $regex: new RegExp(searched, 'i') } }).skip(skip).limit(limit);
            res.status(200).json(users);
        }
    } catch (error) {
        res.status(500).json({ message: 'something went wrong' });
    }
}

export async function makeClass(req: Request, res: Response) {
    try {
        const { classname } = req.body;
        const created_at = new Date().toISOString();
        if (!classname) return res.status(400).json({ message: 'all fields required' });

        const newClass = new ClassRoom({ created_at, classname });
        await newClass.save();
        res.status(200).json({ message: 'new classroom created' });
    } catch (error) {
        res.status(500).json({ message: 'something went wrong' });
    }
}