import { Request, Response } from 'express';
import pool from '../config/db';

// VIEW: Get all players (Using our Complex View!)
export const getPlayers = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query('SELECT * FROM player_roster_view');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch players' });
    }
};

// INSERT: Add a new player
export const createPlayer = async (req: Request, res: Response) => {
    const { f_name, l_name, dob, position, city, state, pincode, club_id } = req.body;
    try {
        const [result]: any = await pool.query(
            'INSERT INTO player (f_name, l_name, dob, position, city, state, pincode, club_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [f_name, l_name, dob, position, city, state, pincode, club_id]
        );
        res.status(201).json({ message: 'Player created successfully', player_id: result.insertId });
    } catch (error: any) {
        // This will catch the error if they are under 15 (Trigger validation)
        res.status(400).json({ error: error.message || 'Failed to create player' });
    }
};

// DELETE: Remove a player (This will fire the AFTER DELETE Trigger we wrote)
export const deletePlayer = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM player WHERE player_id = ?', [id]);
        res.json({ message: 'Player deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete player' });
    }
};

// VIEW SINGLE: Get raw player data for the Edit form
export const getPlayerById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        // We use DATE_FORMAT so the date string fits perfectly into the HTML <input type="date">
        const query = `
            SELECT player_id, f_name, l_name, DATE_FORMAT(dob, '%Y-%m-%d') as dob, 
                   position, city, state, pincode, club_id 
            FROM player WHERE player_id = ?
        `;
        const [rows]: any = await pool.query(query, [id]);

        if (rows.length === 0) return res.status(404).json({ error: 'Player not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch player details' });
    }
};

// UPDATE: Modify an existing player
export const updatePlayer = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { f_name, l_name, dob, position, city, state, pincode, club_id } = req.body;
    try {
        // Handle empty club string if they set the player to Free Agent
        const validClubId = club_id === '' ? null : club_id;

        await pool.query(
            'UPDATE player SET f_name=?, l_name=?, dob=?, position=?, city=?, state=?, pincode=?, club_id=? WHERE player_id=?',
            [f_name, l_name, dob, position, city, state, pincode, validClubId, id]
        );
        res.json({ message: 'Player updated successfully' });
    } catch (error: any) {
        res.status(400).json({ error: error.message || 'Failed to update player' });
    }
};