const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const encabezadoAuth = req.headers.authorization;

  if (!encabezadoAuth || typeof encabezadoAuth !== 'string' || !encabezadoAuth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const token = encabezadoAuth.slice(7).trim();
  if (!token) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload || !payload.id) {
      return res.status(401).json({ error: 'No autorizado' });
    }
    req.usuarioId = payload.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'No autorizado' });
  }
}

module.exports = authMiddleware;
