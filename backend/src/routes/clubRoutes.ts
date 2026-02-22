import { Router } from 'express';
import { getClubs, createClub, updateClub, deleteClub } from '../controllers/clubController';

const router = Router();

router.get('/', getClubs);           // GET /api/clubs
router.post('/', createClub);        // POST /api/clubs
router.put('/:id', updateClub);      // PUT /api/clubs/:id
router.delete('/:id', deleteClub);   // DELETE /api/clubs/:id

export default router;