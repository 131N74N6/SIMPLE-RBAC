import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthRequest extends Request {
    user?: {
        role: string;
        token: string;
        user_id: string;
    } 
}

interface CustomJwtPayload extends JwtPayload {
    role: string;
    token: string;
    user_id: string;
}

export function verifyToken(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access token is missing' });

    jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_key', (error, decoded) => {

        if (error) return res.status(403).json({ message: 'Invalid access token' });

        const payload = decoded as CustomJwtPayload;

        req.user = {
            role: payload.role,
            token: payload.token,
            user_id: payload.user_id
        }
        
        next();
    });
}

export function checkOwnership(req: AuthRequest, res: Response, next: NextFunction) {
    if (!req.user) return res.status(401).json({ message: 'Authentication required before checking ownership' });

    const requestedId = req.params.user_id;

    if (!requestedId) return res.status(400).json({ message: 'Resource id parameter required' });
    if (req.user.user_id !== requestedId) return res.status(403).json({ message: 'You do not have permission to access this resource' });

    next();
}

export function checkRole(...allowedRoles: string[]) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) return res.status(401).json({ message: 'Authentication required' });

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: `Access denied. Required roles: ${allowedRoles.join(', ')}` });
        }

        next();
    };
}