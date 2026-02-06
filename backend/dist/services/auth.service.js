import { db } from '../config/database.js';
import { AppError } from '../types/common.types.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { logger } from '../utils/logger.js';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-env';
export class AuthService {
    async register(data) {
        const { username, password } = data;
        const existingUser = await db.get('SELECT id FROM users WHERE username = ?', [username]);
        if (existingUser) {
            throw new AppError('Username already exists', 409);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const id = randomUUID();
        try {
            await db.run('INSERT INTO users (id, username, password) VALUES (?, ?, ?)', [id, username, hashedPassword]);
            const token = this.generateToken(id, username);
            return {
                token,
                user: { id, username }
            };
        }
        catch (error) {
            logger.error('Error creating user:', error);
            throw new AppError('Registration failed', 500);
        }
    }
    async login(data) {
        const { username, password } = data;
        const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
        if (!user) {
            throw new AppError('Invalid credentials', 401);
        }
        const isMatch = await bcrypt.compare(password, String(user.password));
        if (!isMatch) {
            throw new AppError('Invalid credentials', 401);
        }
        const token = this.generateToken(user.id, user.username);
        return {
            token,
            user: { id: user.id, username: user.username }
        };
    }
    generateToken(userId, username) {
        return jwt.sign({ id: userId, username }, JWT_SECRET, { expiresIn: '7d' });
    }
}
//# sourceMappingURL=auth.service.js.map