import express from 'express';
import * as authController from '../controllers/authController';
import * as authValidation from '../validations/authValidation';
import validate from '../middlewares/validate';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);

router.use(authenticate);

router.get('/profile', authController.getProfile);
router.patch('/update-password', validate(authValidation.updatePassword), authController.updatePassword);
router.get('/verify-email', authController.verifyEmail);

export default router;