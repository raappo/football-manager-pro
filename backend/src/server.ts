import express from 'express';
import cors from 'cors';
import pool from './config/db';
import clubRoutes from './routes/clubRoutes';
import playerRoutes from './routes/playerRoutes'; 
import matchRoutes from './routes/matchRoutes';   
import dashboardRoutes from './routes/dashboardRoutes';
import contractRoutes from './routes/contractRoutes';
import authRoutes from './routes/authRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS solution');
        res.json({ status: 'success', message: 'Backend is connected!', db_test: rows });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'DB connection failed' });
    }
});

// Mount Routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/matches', matchRoutes); 
app.use('/api/contracts', contractRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});