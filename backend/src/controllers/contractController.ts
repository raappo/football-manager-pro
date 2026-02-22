import { Request, Response } from 'express';
import pool from '../config/db';

// VIEW: Get all contracts with Player and Club names
export const getContracts = async (req: Request, res: Response) => {
    try {
        const query = `
            SELECT 
                c.contract_id, 
                DATE_FORMAT(c.start_date, '%Y-%m-%d') as start_date, 
                DATE_FORMAT(c.end_date, '%Y-%m-%d') as end_date, 
                c.salary, 
                p.player_id, CONCAT(p.f_name, ' ', p.l_name) AS player_name, 
                cl.club_id, cl.club_name
            FROM contract c
            INNER JOIN player p ON c.player_id = p.player_id
            INNER JOIN club cl ON c.club_id = cl.club_id
            ORDER BY c.salary DESC;
        `;
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch contracts' });
    }
};

// INSERT: Create a new contract
export const createContract = async (req: Request, res: Response) => {
    const { start_date, end_date, salary, player_id, club_id } = req.body;
    try {
        await pool.query(
            'INSERT INTO contract (start_date, end_date, salary, player_id, club_id) VALUES (?, ?, ?, ?, ?)',
            [start_date, end_date, salary, player_id, club_id]
        );
        res.status(201).json({ message: 'Contract created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create contract' });
    }
};

// DELETE: Cancel a contract
export const deleteContract = async (req: Request, res: Response) => {
    try {
        await pool.query('DELETE FROM contract WHERE contract_id = ?', [req.params.id]);
        res.json({ message: 'Contract deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete contract' });
    }
};