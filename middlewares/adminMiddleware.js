const { protect } = require('./authMiddleware');

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Acceso prohibido: Administrador solamente' });
    }
};

module.exports = { admin };
