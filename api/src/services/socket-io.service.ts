import { Server } from "socket.io";
import http from "http";
import express from "express";

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

    socket.on("join:admin", () => {
        socket.join(`admin`);
        console.log(`admin`);
    });

    socket.on("join:master", (master_id: string) => {
        socket.join(`master: ${master_id}`);
        console.log(`master: ${master_id}`);
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

export { app, io, server }