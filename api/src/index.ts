import dotenv from 'dotenv';
import dns from 'node:dns/promises';

dotenv.config();

if (process.env.NODE_ENV !== 'production') {
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
    console.log('DNS servers set to Cloudflare (1.1.1.1) and Google (8.8.8.8)');
}

import express from "express";
import cors from "cors";
import http from "http";
import { Server } from 'socket.io';
import db from "./database/mongodb";
import authRouters from "./routers/auth.router";
import userRouters from "./routers/user.router";
import cookieParser from 'cookie-parser';
import classRouters from './routers/classroom.router';
import presenceSlotRouters from './routers/presence-slot.router';
import studentPresenceRouters from './routers/student-presence.router';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: ["http://localhost:5173"] }
});

io.on("connection", (socket) => {
    console.log("user connected");

    socket.on("join:class", (classname: string) => {
        socket.join(`class: ${classname}`);
        console.log(`class: ${classname}`);
    });

    socket.on("join:master", (master_id: string) => {
        socket.join(`master id: ${master_id}`);
        console.log(`master id: ${master_id}`);
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: ['http://localhost:1999', 'http://localhost:5173']
}));
app.use('/api/auth', authRouters);
app.use('/api/classes', classRouters);
app.use('/api/presence-forms', presenceSlotRouters);
app.use('/api/student-presences', studentPresenceRouters);
app.use('/api/users', userRouters);

if (process.env.NODE_ENV !== 'production') {
    db.then(() => {
        server.listen(1999, () => console.log('api running at http://localhost:1999'))
    });
}

export default app;