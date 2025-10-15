// backend/src/routes/auth.ts
import {Router, Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { authMiddleware } from '../middleware/auth';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'a-very-secret-key';

router.post('/register', async (req, res) => {
    try {
        const {username, email, password} = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({message: '请填写所有必填项'});
        }
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: '该邮箱已被注册'});
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const newUser = new User({username, email, passwordHash});
        await newUser.save();
        const token = jwt.sign({userId: newUser._id}, JWT_SECRET, {expiresIn: '7d'});
        res.status(201).json({token, user: {_id: newUser._id, username: newUser.username, email: newUser.email}});
    } catch (error) {
        res.status(500).json({message: '服务器错误'});
    }
});

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({message: '邮箱或密码错误'});
        }
        if (!user.passwordHash) {
            return res.status(400).json({message: '用户未设置密码'});
        }
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({message: '邮箱或密码错误'});
        }
        const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: '7d'});
        res.json({token, user: {_id: user._id, username: user.username, email: user.email}});
    } catch (error) {
        res.status(500).json({message: '服务器错误'});
    }
});

router.get('/me', authMiddleware, (req: Request, res: Response) => {
    res.json(req.user);
});

export default router;