import { NextFunction, Request, Response } from 'express';
export interface UserContext {
    userId: string;
    email: string;
    name: string;
    role: 'MSME_EXPORTER' | 'LOGISTICS_PARTNER' | 'ADMIN';
    organizationId: string;
}
declare global {
    namespace Express {
        interface Request {
            user?: UserContext;
        }
    }
}
export declare function mockAuthMiddleware(req: Request, res: Response, next: NextFunction): void;
