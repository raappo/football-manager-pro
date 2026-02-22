import { Request, Response } from 'express';
import pool from '../config/db';

// VIEW: Get all clubs
export const getClubs = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query('SELECT * FROM club ORDER BY club_name ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch clubs' });
    }
};

// INSERT: Add a new club
export const createClub = async (req: Request, res: Response) => {
    const { club_name, founded_year, owner_name, club_email } = req.body;
    try {
        const [result]: any = await pool.query(
            'INSERT INTO club (club_name, founded_year, owner_name, club_email) VALUES (?, ?, ?, ?)',
            [club_name, founded_year, owner_name, club_email]
        );
        res.status(201).json({ message: 'Club created successfully', club_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create club' });
    }
};

// UPDATE: Modify an existing club
export const updateClub = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { club_name, founded_year, owner_name, club_email } = req.body;
    try {
        await pool.query(
            'UPDATE club SET club_name = ?, founded_year = ?, owner_name = ?, club_email = ? WHERE club_id = ?',
            [club_name, founded_year, owner_name, club_email, id]
        );
        res.json({ message: 'Club updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update club' });
    }
};

// DELETE: Remove a club
export const deleteClub = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM club WHERE club_id = ?', [id]);
        res.json({ message: 'Club deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete club' });
    }
};