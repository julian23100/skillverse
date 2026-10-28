const express = require('express');
const { getCourse, listCourses, listLessons } = require('../repositories/platform.repository');

const router = express.Router();
router.get('/', async (req, res, next) => { try { res.json({ courses: await listCourses() }); } catch (error) { next(error); } });
router.get('/:id/lessons', async (req, res, next) => { try { const course = await getCourse(req.params.id); if (!course) return res.status(404).json({ error: 'Curso no encontrado.' }); res.json({ course, lessons: await listLessons(req.params.id) }); } catch (error) { next(error); } });
router.get('/:id', async (req, res, next) => { try { const course = await getCourse(req.params.id); if (!course) return res.status(404).json({ error: 'Curso no encontrado.' }); res.json({ course }); } catch (error) { next(error); } });
module.exports = router;
