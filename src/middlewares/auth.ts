import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { ApiError } from '../utils/ApiError';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }

  try {
    const payload = jwt.verify(token, config.jwt.secret) as any;
    if (payload.type !== 'access') {
      throw new Error('Invalid token type');
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'User not found'));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token'));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(httpStatus.FORBIDDEN, 'Forbidden resource'));
    }
    next();
  };
};