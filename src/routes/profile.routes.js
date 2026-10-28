const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { findUserById, safeUser, updateProfile } = require('../repositories/platform.repository');

const router = express.Router();
router.get('/', requireAuth, async (req, res, next) => { try { const user = await findUserById(req.session.userId); res.json({ user: safeUser(user) }); } catch (error) { next(error); } });
router.patch('/', requireAuth, async (req, res, next) => { try { const username = String(req.body?.username || '').trim(); if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ _-]{3,40}$/.test(username)) return res.status(400).json({ error: 'El nombre debe tener entre 3 y 40 caracteres.' }); const user = await updateProfile(req.session.userId, username); res.json({ user: safeUser(user) }); } catch (error) { if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Ese nombre de usuario ya está ocupado.' }); next(error); } });
module.exports = router;
