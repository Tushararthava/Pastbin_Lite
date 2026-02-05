import { db } from '../config/database.js';
import type { User, CreateUserDto, LoginDto, AuthResponse } from '../types/auth.types.js';
import { AppError } from '../types/common.types.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { randomUUID } from 'crypto';
import { logger } from '../utils/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-env';

export class AuthService {
    async register(data: CreateUserDto): Promise<AuthResponse> {
        const { username, password } = data;

        // Check if user exists
        const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
        if (existingUser) {
            throw new AppError('Username already exists', 409);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const id = randomUUID();

        // Create user
        const stmt = db.prepare('INSERT INTO users (id, username, password) VALUES (?, ?, ?)');

        try {
            stmt.run(id, username, hashedPassword);

            const token = this.generateToken(id, username);

            return {
                token,
                user: { id, username }
            };
        } catch (error) {
            logger.error('Error creating user:', error);
            throw new AppError('Registration failed', 500);
        }
    }

    async login(data: LoginDto): Promise<AuthResponse> {
        const { username, password } = data;

        // Find user
        const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as User;

        if (!user) {
            throw new AppError('Invalid credentials', 401);
        }

        // Check password
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

    private generateToken(userId: string, username: string): string {
        return jwt.sign(
            { id: userId, username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
    }
}
