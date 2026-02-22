import { Request, Response } from 'express';
import pool from '../config/db';

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        // In a real app we'd use bcrypt, but for this DBMS project, we check the plaintext hash we seeded
        const [rows]: any = await pool.query(
            'SELECT user_id, username, role FROM users WHERE username = ? AND password_hash = ?',
            [username, password]
        );

        if (rows.length > 0) {
            res.json(rows[0]); // Returns the user data (including their Role)
        } else {
            res.status(401).json({ error: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error during login' });
    }
};