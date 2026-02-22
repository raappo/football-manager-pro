import { Router } from 'express';
import { getPlayers, createPlayer, deletePlayer, getPlayerById, updatePlayer } from '../controllers/playerController';

const router = Router();

router.get('/', getPlayers);
router.get('/:id', getPlayerById);       // <-- NEW: Fetch single player
router.post('/', createPlayer);
router.put('/:id', updatePlayer);        // <-- NEW: Update player
router.delete('/:id', deletePlayer);

export default router;