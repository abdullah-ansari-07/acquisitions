import logger from '#config/logger.js';
import { cookies } from '#utils/cookies.js';
import { jwttoken } from '#utils/jwt.js';

const authMiddleware = (req, res, next) => {
    try {
        const token = cookies.get(req, 'token');

        if (!token) {
            return res.status(401).json({
                error: 'Authentication required',
            });
        }

        const payload = jwttoken.verify(token);

        req.user = payload;

        next();
    } catch (e) {
        logger.error('Authentication failed', e);

        return res.status(401).json({
            error: 'Invalid or expired token',
        });
    }
};

export default authMiddleware;