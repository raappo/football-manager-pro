import { Router } from 'express';
import { getContracts, createContract, deleteContract } from '../controllers/contractController';

const router = Router();

router.get('/', getContracts);
router.post('/', createContract);
router.delete('/:id', deleteContract);

export default router;