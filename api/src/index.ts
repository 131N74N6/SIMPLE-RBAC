import dotenv from 'dotenv';
import dns from 'node:dns/promises';

dotenv.config();

if (process.env.NODE_ENV !== 'production') {
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
    console.log('DNS servers set to Cloudflare (1.1.1.1) and Google (8.8.8.8)');
}

import express from "express";
import cors from "cors";
import db from "./database/mongodb";
import authRouters from "./routers/auth.router";
import userRouters from "./routers/user.router";

const app = express();

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: ['http://localhost:1999', 'http://localhost:5173']
}));
app.use('/api/auth', authRouters);
app.use('/api/users', userRouters);

if (process.env.NODE_ENV !== 'production') {
    db.then(() => {
        app.listen(1999, () => console.log('api running at http://localhost:1999'))
    });
}

export default app;