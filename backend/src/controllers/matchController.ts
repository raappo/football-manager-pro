import { Request, Response } from 'express';
import pool from '../config/db';

// VIEW ALL: Complex Join query
export const getMatches = async (req: Request, res: Response) => {
    try {
        const query = `
            SELECT 
                m.match_id, m.match_type, DATE_FORMAT(m.match_date, '%Y-%m-%d') as match_date,
                h.club_name AS home_team, a.club_name AS away_team, 
                m.home_score, m.away_score, s.stadium_name
            FROM matches m
            INNER JOIN club h ON m.home_club_id = h.club_id
            INNER JOIN club a ON m.away_club_id = a.club_id
            INNER JOIN stadium s ON m.stadium_id = s.stadium_id
            ORDER BY m.match_date DESC;
        `;
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch matches' });
    }
};

// VIEW SINGLE: For the Edit Form
export const getMatchById = async (req: Request, res: Response) => {
    try {
        const [rows]: any = await pool.query(
            `SELECT match_id, match_type, DATE_FORMAT(match_date, '%Y-%m-%d') as match_date, 
             home_club_id, away_club_id, home_score, away_score, stadium_id 
             FROM matches WHERE match_id = ?`, [req.params.id]
        );
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch match details' });
    }
};

// INSERT
export const createMatch = async (req: Request, res: Response) => {
    const { match_type, match_date, home_club_id, away_club_id, home_score, away_score, stadium_id } = req.body;
    try {
        if (home_club_id === away_club_id) return res.status(400).json({ error: 'Home and Away teams must be different.' });
        await pool.query(
            'INSERT INTO matches (match_type, match_date, home_club_id, away_club_id, home_score, away_score, stadium_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [match_type, match_date, home_club_id, away_club_id, home_score || 0, away_score || 0, stadium_id]
        );
        res.status(201).json({ message: 'Match created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create match' });
    }
};

// UPDATE
export const updateMatch = async (req: Request, res: Response) => {
    const { match_type, match_date, home_club_id, away_club_id, home_score, away_score, stadium_id } = req.body;
    try {
        if (home_club_id === away_club_id) return res.status(400).json({ error: 'Home and Away teams must be different.' });
        await pool.query(
            'UPDATE matches SET match_type=?, match_date=?, home_club_id=?, away_club_id=?, home_score=?, away_score=?, stadium_id=? WHERE match_id=?',
            [match_type, match_date, home_club_id, away_club_id, home_score, away_score, stadium_id, req.params.id]
        );
        res.json({ message: 'Match updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update match' });
    }
};

// DELETE
export const deleteMatch = async (req: Request, res: Response) => {
    try {
        await pool.query('DELETE FROM matches WHERE match_id = ?', [req.params.id]);
        res.json({ message: 'Match deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete match' });
    }
};

// GET STADIUMS (Quick helper for the dropdown)
export const getStadiums = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query('SELECT * FROM stadium');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stadiums' });
    }
};