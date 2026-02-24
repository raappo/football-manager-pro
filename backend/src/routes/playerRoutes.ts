import { Router } from 'express';
import { getPlayers, getPlayerById, createPlayer, updatePlayer, deletePlayer, searchPlayers } from '../controllers/playerController';

const router = Router();

router.get('/', getPlayers);

// MUST BE ABOVE /:id ROUTE
router.get('/search', searchPlayers);

router.get('/:id', getPlayerById);
router.post('/', createPlayer);
router.put('/:id', updatePlayer);
router.delete('/:id', deletePlayer);

export default router;