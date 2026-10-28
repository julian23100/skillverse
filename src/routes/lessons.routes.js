const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { completeLesson, getExercise, getLesson } = require('../repositories/platform.repository');

const router = express.Router();
router.get('/:id', async (req, res, next) => { try { const lesson = await getLesson(req.params.id); if (!lesson) return res.status(404).json({ error: 'Lección no encontrada.' }); const exercise = await getExercise(Number(req.params.id)); const safeExercise = exercise ? { ...exercise } : null; if (safeExercise) delete safeExercise.validation_json; res.json({ lesson, exercise: safeExercise }); } catch (error) { next(error); } });
router.post('/:id/complete', requireAuth, async (req, res, next) => { try { const lesson = await getLesson(req.params.id); if (!lesson) return res.status(404).json({ error: 'Lección no encontrada.' }); res.json(await completeLesson(req.session.userId, req.params.id, req.body?.score)); } catch (error) { next(error); } });
module.exports = router;
