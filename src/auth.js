function requireAuth(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ error: 'Necesitas iniciar sesión para continuar.' });
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ error: 'Necesitas iniciar sesión para continuar.' });
  if (req.session.role !== 'admin') return res.status(403).json({ error: 'Esta sección es exclusiva para administradores.' });
  next();
}

module.exports = { requireAuth, requireAdmin };
