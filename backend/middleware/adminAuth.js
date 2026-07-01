module.exports = function adminAuth(req, res, next) {
  const secret = process.env.ADMIN_SECRET || 'admin123';
  const provided = req.headers['x-admin-secret'] || req.headers['x-admin-token'];
  if (!provided || provided !== secret) {
    return res.status(403).json({ error: 'Admin authorization required' });
  }
  next();
};
