const jwt = require('jsonwebtoken');

const authenticationMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ error: 'No authentication header' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { _id: payload.userId }; // Attach as req.user object for consistency with other parts of app if needed, or just req.userId
        req.userId = payload.userId;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Authentication invalid' });
    }
};

module.exports = authenticationMiddleware;
