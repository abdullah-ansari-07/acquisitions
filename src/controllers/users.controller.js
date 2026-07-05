import logger from '#config/logger.js';
import {
    getAllUsers,
    getUserById,
    updateUser as updateUserService,
    deleteUser as deleteUserService,
} from '#services/users.services.js';
import {
    userIdSchema,
    updateUserSchema,
} from '#validations/users.validation.js';

export const fetchAllUsers = async (req, res, next) => {
    try {
        logger.info('Getting users...');

        // Only admins can list all users
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'Forbidden',
            });
        }

        const allUsers = await getAllUsers();

        res.json({
            message: 'Successfully retrieved users.',
            users: allUsers,
            count: allUsers.length,
        });
    } catch (e) {
        logger.error(e);
        next(e);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const { id } = userIdSchema.parse(req.params);

        // Only allow users to view their own profile unless they're an admin
        if (req.user.id !== id && req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'Forbidden',
            });
        }

        const user = await getUserById(id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        res.json(user);
    } catch (e) {
        logger.error(e);
        next(e);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const { id } = userIdSchema.parse(req.params);

        if (req.user.id !== id && req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'Forbidden',
            });
        }

        if (req.body.role && req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'Only admins can change roles',
            });
        }

        const updates = updateUserSchema.parse(req.body);

        const updatedUser = await updateUserService(id, updates);

        if (!updatedUser) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        res.json({
            message: 'User updated successfully',
            user: updatedUser,
        });
    } catch (e) {
        logger.error(e);
        next(e);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const { id } = userIdSchema.parse(req.params);

        if (req.user.id !== id && req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'Forbidden',
            });
        }

        const deletedUser = await deleteUserService(id);

        if (!deletedUser) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        res.json({
            message: 'User deleted successfully',
        });
    } catch (e) {
        logger.error(e);
        next(e);
    }
};