import { Request, Response } from 'express';
import { ClassRoom } from '../models/classroom.model';
import { PresenceSlot, StudentAttendance } from '../models/presence.model';

export async function changeClass(req: Request, res: Response) {
    try {
        await ClassRoom.updateOne({ _id: req.params.id }, {
            $set: { classname: req.body.classname }
        });

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
            StudentAttendance.deleteMany(),
            PresenceSlot.deleteMany(),
            ClassRoom.deleteMany()
        ]);

        return res.status(200).json({ message: 'class deleted' });
    } catch (error) {
        res.status(500).json({ message: 'something went wrong' });
    }
}

export async function deleteOneClass(req: Request, res: Response) {
    try {
        await Promise.all([
            StudentAttendance.deleteMany({ classname: req.params.classname }),
            PresenceSlot.deleteMany({ classname: req.params.classname }),
            ClassRoom.deleteOne({ classname: req.params.classname })
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