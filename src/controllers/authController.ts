import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { ApiError } from '../utils/ApiError';
import { catchAsync } from '../utils/catchAsync';
import * as authService from '../services/authService';

const register = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const user = await authService.registerUser(name, email, password);
  res.status(httpStatus.CREATED).send({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.loginWithEmailAndPassword(email, password);
  const tokens = await authService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const updatePassword = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;
  await authService.updatePassword(userId, currentPassword, newPassword);
  res.status(httpStatus.NO_CONTENT).send();
});

const getProfile = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.getUserProfile(req.user.id);
  res.send(user);
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.query;
  await authService.verifyEmail(token as string);
  res.status(httpStatus.NO_CONTENT).send();
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  await authService.forgotPassword(email);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  await authService.resetPassword(token, newPassword);
  res.status(httpStatus.NO_CONTENT).send();
});

export {
  register,
  login,
  updatePassword,
  getProfile,
  verifyEmail,
  forgotPassword,
  resetPassword,
};