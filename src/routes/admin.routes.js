const express = require('express');
const { requireAdmin } = require('../middleware/auth');
const { adminCreateCourse, adminCreateLesson, adminDeleteCourse, adminStats, adminUpdateCourse, adminUpdateExercise, listCourses } = require('../repositories/platform.repository');

const router = express.Router();
const difficulties = ['Inicial', 'Intermedio', 'Avanzado'];

// Valida y normaliza los datos de un curso; devuelve { error } o { data }.
function parseCourse(body = {}) {
  const title = String(body.title || '').trim();
  const description = String(body.description || '').trim();
  const difficulty = body.difficulty || 'Inicial';
  const minutes = Number(body.estimated_minutes ?? 10);
  if (!title || !description) return { error: 'El título y la descripción son obligatorios.' };
  if (title.length > 160) return { error: 'El título no puede superar los 160 caracteres.' };
  if (!difficulties.includes(difficulty)) return { error: 'La dificultad debe ser Inicial, Intermedio o Avanzado.' };
  if (!Number.isInteger(minutes) || minutes < 1 || minutes > 500) return { error: 'Los minutos estimados deben estar entre 1 y 500.' };
  return { data: { title, description, difficulty, estimated_minutes: minutes, is_premium: body.is_premium === true || body.is_premium === 'true' || body.is_premium === 'on' } };
}

function parseLesson(body = {}) {
  const title = String(body.title || '').trim();
  const objective = String(body.objective || '').trim();
  const content = String(body.content || '').trim();
  const example_code = String(body.example_code || '');
  const position = Number(body.position);
  const estimated_minutes = Number(body.estimated_minutes ?? 10);
  if (!title || !objective || !content) return { error: 'Título, objetivo y contenido son obligatorios.' };
  if (title.length > 160) return { error: 'El título no puede superar los 160 caracteres.' };
  if (!Number.isInteger(position) || position < 1 || position > 1000) return { error: 'La posición debe ser un número entero entre 1 y 1000.' };
  if (!Number.isInteger(estimated_minutes) || estimated_minutes < 1 || estimated_minutes > 500) return { error: 'Los minutos estimados deben estar entre 1 y 500.' };
  return { data: { title, objective, content, example_code, position, estimated_minutes } };
}

router.use(requireAdmin);
router.get('/courses', async (req, res, next) => { try { res.json({ courses: await listCourses() }); } catch (error) { next(error); } });
router.get('/stats', async (req, res, next) => { try { res.json({ stats: await adminStats() }); } catch (error) { next(error); } });

router.post('/courses', async (req, res, next) => {
  try {
    const { error, data } = parseCourse(req.body);
    if (error) return res.status(400).json({ error });
    res.status(201).json({ course: await adminCreateCourse(data) });
  } catch (error) { next(error); }
});

router.patch('/courses/:id', async (req, res, next) => {
  try {
    const { error, data } = parseCourse(req.body);
    if (error) return res.status(400).json({ error });
    const course = await adminUpdateCourse(req.params.id, data);
    if (!course) return res.status(404).json({ error: 'Curso no encontrado.' });
    res.json({ course });
  } catch (error) { next(error); }
});

router.delete('/courses/:id', async (req, res, next) => {
  try {
    const result = await adminDeleteCourse(req.params.id);
    if (!result) return res.status(404).json({ error: 'Curso no encontrado.' });
    if (result.hasLessons) return res.status(409).json({ error: 'No se puede eliminar un curso que todavía tiene lecciones.' });
    res.json(result);
  } catch (error) { next(error); }
});

router.post('/courses/:id/lessons', async (req, res, next) => {
  try {
    const { error, data } = parseLesson(req.body);
    if (error) return res.status(400).json({ error });
    const lesson = await adminCreateLesson(req.params.id, data);
    if (!lesson) return res.status(404).json({ error: 'Curso no encontrado.' });
    res.status(201).json({ lesson });
  } catch (error) { next(error); }
});

router.patch('/exercises/:id', async (req, res, next) => {
  try {
    const { title, instructions, hint, feedback } = req.body || {};
    if (!title || !instructions || !hint || !feedback) return res.status(400).json({ error: 'Todos los campos del ejercicio son obligatorios.' });
    const exercise = await adminUpdateExercise(req.params.id, { title, instructions, hint, feedback });
    if (!exercise) return res.status(404).json({ error: 'Ejercicio no encontrado.' });
    const safeExercise = { ...exercise };
    delete safeExercise.validation_json;
    res.json({ exercise: safeExercise });
  } catch (error) { next(error); }
});

module.exports = router;
