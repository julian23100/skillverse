const express = require('express');
const { findUserByEmail, findUserById, registerUser, safeUser, verifyPassword } = require('../repositories/platform.repository');

const router = express.Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword } = req.body || {};
    if (!username || !/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ _-]{3,40}$/.test(username.trim())) return res.status(400).json({ error: 'El nombre debe tener entre 3 y 40 caracteres.' });
    if (!emailPattern.test(String(email || '').trim())) return res.status(400).json({ error: 'Escribe un correo electrónico válido.' });
    if (String(password || '').length < 8) return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
    if (password !== confirmPassword) return res.status(400).json({ error: 'Las contraseñas no coinciden.' });
    const existingEmail = await findUserByEmail(email);
    if (existingEmail) return res.status(409).json({ error: 'Ese correo ya está registrado.' });
    const user = await registerUser({ username: username.trim(), email: email.trim(), password });
    req.session.userId = user.id; req.session.role = user.role;
    res.status(201).json({ user: safeUser(user), csrfToken: req.session.csrfToken });
  } catch (error) { if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'El nombre de usuario o correo ya está en uso.' }); next(error); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Completa tu correo y contraseña.' });
    const user = await findUserByEmail(email);
    if (!user || !(await verifyPassword(user, password))) return res.status(401).json({ error: 'El correo o la contraseña no son correctos.' });
    req.session.regenerate((sessionError) => {
      if (sessionError) return next(sessionError);
      req.session.userId = user.id; req.session.role = user.role; req.session.csrfToken = require('node:crypto').randomBytes(24).toString('hex');
      res.json({ user: safeUser(user), csrfToken: req.session.csrfToken });
    });
  } catch (error) { next(error); }
});

router.post('/logout', (req, res, next) => req.session.destroy((error) => error ? next(error) : res.json({ ok: true })));

router.get('/me', async (req, res, next) => {
  try { const user = req.session.userId ? await findUserById(req.session.userId) : null; res.json({ user: safeUser(user), csrfToken: req.session.csrfToken }); } catch (error) { next(error); }
});

module.exports = router;
