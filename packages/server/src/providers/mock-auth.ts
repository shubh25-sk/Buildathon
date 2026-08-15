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

export function mockAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Guest access allowed for MVP
    req.user = {
      userId: 'user-guest-msme',
      email: 'exporter@msme-india.org',
      name: 'Guest MSME Exporter',
      role: 'MSME_EXPORTER',
      organizationId: 'org-demo'
    };
    return next();
  }

  const token = authHeader.split(' ')[1];

  // Simulating Cognito JWT token claims
  req.user = {
    userId: `user-cognito-${token.substring(0, 8)}`,
    email: 'verified.exporter@msme-india.org',
    name: 'Verified MSME Exporter',
    role: 'MSME_EXPORTER',
    organizationId: 'org-cognito-1'
  };

  next();
}
