import { Request, Response } from 'express';
import { ClassRoom } from '../models/classroom.model';
import { PresenceSlot } from '../models/presence-slot.model';
import { StudentPresence } from "../models/student-presence.model";
import { User } from '../models/user.model';
import { io } from '../services/socket-io.service';

export async function changeClass(req: Request, res: Response) {
    try {
        const targetClass = await ClassRoom.findOne({ _id: req.params.id });
        const presenceSlots = await PresenceSlot.find({ classname: targetClass?.classname });
        const presenceSlotMasterIds = Array.from(new Set(
            presenceSlots.map(presenceSlot => presenceSlot.master_id)
        ));

        const isClassExist = await ClassRoom.findOne({ 
            classname: req.body.classname, 
            _id: { $ne: req.params.id } 
        });
        
        if (isClassExist) return res.status(409).json({ message: "class name already exist" });
        
        await Promise.all([
            User.updateMany({ classname: targetClass?.classname }, {
                $set: { classname: req.body.classname }
            }),
            PresenceSlot.updateMany({ classname: targetClass?.classname }, {
                $set: { classname: req.body.classname }
            }),
            StudentPresence.updateMany({ classname: targetClass?.classname }, {
                $set: { classname: req.body.classname }
            }),
            ClassRoom.updateOne({ _id: req.params.id }, {
                $set: { classname: req.body.classname }
            })
        ]);

        presenceSlotMasterIds.forEach(presenceSlotMasterId => {
            io.to(`master:${presenceSlotMasterId}`)
            .emit("classroom:changed", {
                _id: targetClass?._id,
                classname: req.body.classname
            });
        });

        io.to(`class:${targetClass?.classname}`)
        .to("admin")
        .emit("classroom:changed", {
            _id: targetClass?._id,
            classname: req.body.classname
        });

        return res.status(200).json({ message: 'class changed' });
    } catch (error) {
        res.status(500).json({ message: 'something went wrong' });
    }
}

export async function deleteAllClasses(_: Request, res: Response) {
    try {
        const classes = await ClassRoom.find();
        if (classes.length === 0) return res.status(404).json({ message: 'no class found' });

        const classnames = classes.map(target => target.classname);
        const presenceSlots = await PresenceSlot.find({ classname: { $in: classnames } });

        const payloads = Array.from(new Set(
            presenceSlots.map(presenceSlot => {
                return { 
                    _id: presenceSlot._id,
                    classname: presenceSlot.classname,
                    master_id: presenceSlot.master_id
                }
            })
        ));

        await Promise.all([
            StudentPresence.deleteMany(),
            PresenceSlot.deleteMany(),
            ClassRoom.deleteMany(),
            User.updateMany({ role: "student" }, { $set: { classname: "-" } })
        ]);

        payloads.forEach(payload => {
            io.to("admin")
            .to(`master:${payload.master_id}`)
            .to(`class:${payload.classname}`)
            .emit("classroom:deleted-all", { 
                _id: payload._id, 
                classname: payload.classname,
                presence_slot_id: payload._id 
            });
        });

        return res.status(200).json({ message: 'class deleted' });
    } catch (error) {
        res.status(500).json({ message: 'something went wrong' });
    }
}

export async function deleteOneClass(req: Request, res: Response) {
    try {
        const name = req.params.classname;
        const getClass = await ClassRoom.findOne({ classname: name });
        const presenceSlots = await PresenceSlot.find({ classname: getClass?.classname });

        const payloads = Array.from(new Set(
            presenceSlots.map(presenceSlot => {
                return {
                    _id: presenceSlot._id,
                    classname: presenceSlot.classname,  
                    master_id: presenceSlot.master_id
                }
            })
        ));

        await Promise.all([
            StudentPresence.deleteMany({ classname: getClass?.classname }),
            PresenceSlot.deleteMany({ classname: getClass?.classname }),
            ClassRoom.deleteOne({ classname: getClass?.classname }),
            User.updateMany({ role: "student", classname: getClass?.classname }, { $set: { classname: "-" } })
        ]);

        payloads.forEach(payload => {
            io.to(`master:${payload.master_id}`)
            .emit("classroom:deleted", { _id: payload._id, classname: payload.classname });
        });

        io.to(`class:${getClass?.classname}`)
        .to("admin")
        .emit("classroom:deleted", { _id: getClass?._id, classname: getClass?.classname });

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
            const users = await User
            .find({ classname: req.params.classname })
            .skip(skip)
            .limit(limit);

            res.status(200).json(users);
        } else {
            const users = await User
            .find({ 
                classname: req.params.classname, 
                username: { $regex: new RegExp(searched, 'i') } 
            })
            .skip(skip)
            .limit(limit);

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

        io.to("admin").emit("classroom:created", { 
            _id: newClass._id,
            created_at: newClass.created_at, 
            classname: newClass.classname
        });

        res.status(200).json({ message: 'new classroom created' });
    } catch (error) {
        res.status(500).json({ message: 'something went wrong' });
    }
}