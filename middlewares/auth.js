const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Permitir todas las peticiones GET (no proteger endpoints tipo get)
    if (req.method === 'GET') {
        return next();
    }

    // Rutas públicas que no requieren token a pesar de ser POST
    if (req.path === '/login') {
        return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acceso no autorizado: Token no proporcionado.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Guardar los datos del usuario en la petición
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Acceso no autorizado: Token inválido o expirado.' });
    }
};

module.exports = authMiddleware;
