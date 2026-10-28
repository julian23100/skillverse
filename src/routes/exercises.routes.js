const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { attemptExercise, getExercise } = require('../repositories/platform.repository');

const router = express.Router();
router.get('/:id', async (req, res, next) => { try { const exercise = await getExercise(req.params.id); if (!exercise) return res.status(404).json({ error: 'Ejercicio no encontrado.' }); const safeExercise = { ...exercise }; delete safeExercise.validation_json; res.json({ exercise: safeExercise }); } catch (error) { next(error); } });
router.post('/:id/attempt', requireAuth, async (req, res, next) => { try { if (typeof req.body?.answer !== 'string' || req.body.answer.length > 10000) return res.status(400).json({ error: 'La respuesta no es válida.' }); const result = await attemptExercise(req.session.userId, req.params.id, req.body.answer); if (!result) return res.status(404).json({ error: 'Ejercicio no encontrado.' }); res.json(result); } catch (error) { next(error); } });
module.exports = router;
