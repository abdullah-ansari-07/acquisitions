import express from 'express';
import { fetchAllUsers, getUser, updateUser, deleteUser } from "#controllers/users.controller.js";
import authMiddleware from '#middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authMiddleware, fetchAllUsers);

router.get('/me', authMiddleware, (req, res) => {
    res.json(req.user);
});

router.get('/:id', authMiddleware, getUser);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

export default router;