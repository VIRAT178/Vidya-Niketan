import express from 'express';
import { login, logout, purchased, signup } from '../Controllers/users_controller.js';
import userMiddleware from '../middleware/user_mid.js';


const router = express.Router();
router.post('/signup', signup);
router.post('/login',login)
router.get('/logout', logout)
router.get('/purchased',userMiddleware,purchased)

export default router;