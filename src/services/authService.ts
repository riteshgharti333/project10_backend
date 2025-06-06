import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';
import { sendEmail } from '../utils/email';
import { ApiError } from '../utils/ApiError';

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

// Generate tokens
const generateToken = (userId: string, expires: Date, type: 'access' | 'refresh') => {
  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(expires.getTime() / 1000),
    type,
  };
  return jwt.sign(payload, config.jwt.secret);
};

// Generate auth tokens
export const generateAuthTokens = async (user: any) => {
  const accessTokenExpires = new Date(Date.now() + config.jwt.accessExpirationMinutes * 60 * 1000);
  const accessToken = generateToken(user.id, accessTokenExpires, 'access');

  const refreshTokenExpires = new Date(Date.now() + config.jwt.refreshExpirationDays * 24 * 60 * 60 * 1000);
  const refreshToken = generateToken(user.id, refreshTokenExpires, 'refresh');

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires,
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires,
    },
  };
};

// Register user
export const registerUser = async (name: string, email: string, password: string) => {
  if (await prisma.user.findUnique({ where: { email })) {
    throw new ApiError(400, 'Email already taken');
  }

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const passwordHash = await bcrypt.hash(password, salt);
  const verificationToken = uuidv4();

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      salt,
      verificationToken,
    },
  });

  // Send verification email
  const verifyEmailUrl = `${config.clientUrl}/verify-email?token=${verificationToken}`;
  await sendEmail({
    to: email,
    subject: 'Email Verification',
    html: `Please click <a href="${verifyEmailUrl}">here</a> to verify your email.`,
  });

  return user;
};

// Login with email and password
export const loginWithEmailAndPassword = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new ApiError(401, 'Incorrect email or password');
  }
  if (!user.isVerified) {
    throw new ApiError(401, 'Please verify your email');
  }
  return user;
};

// Update password
export const updatePassword = async (userId: string, currentPassword: string, newPassword: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (!(await bcrypt.compare(currentPassword, user.passwordHash))) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const passwordHash = await bcrypt.hash(newPassword, salt);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash, salt },
  });
};

// Get user profile
export const getUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user;
};

// Verify email
export const verifyEmail = async (token: string) => {
  const user = await prisma.user.findFirst({ where: { verificationToken: token } });
  if (!user) {
    throw new ApiError(400, 'Email verification failed');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationToken: null,
    },
  });
};

// Forgot password
export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(404, 'Email not found');
  }

  const resetToken = uuidv4();
  const resetTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExpires },
  });

  const resetUrl = `${config.clientUrl}/reset-password?token=${resetToken}`;
  await sendEmail({
    to: email,
    subject: 'Password Reset',
    html: `Please click <a href="${resetUrl}">here</a> to reset your password.`,
  });
};

// Reset password
export const resetPassword = async (token: string, newPassword: string) => {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpires: { gt: new Date() },
    },
  });

  if (!user) {
    throw new ApiError(400, 'Password reset token is invalid or has expired');
  }

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const passwordHash = await bcrypt.hash(newPassword, salt);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      salt,
      resetToken: null,
      resetTokenExpires: null,
    },
  });
};