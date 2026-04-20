import express from 'express';
import { login, me, logout, checkUser } from './auth.controller.js';
import { authMiddleware } from '../../middleware/auth.js';
import { validateFields } from '../../middleware/validation.js';

const router = express.Router();

router.post('/login', validateFields({
  username: 'required|string|min:3',
  password: 'required|string|min:5'
}), login);

router.get('/me', authMiddleware, me);

router.post('/logout', authMiddleware, logout);

router.get('/check-user', checkUser);

export default router;
