const bcrypt = require('bcryptjs');
const { demoMode, getPool } = require('../config/database');
const demo = require('../data/demo-store');

const levelNames = [
  { min: 0, name: 'Explorador' },
  { min: 100, name: 'Aprendiz lógico' },
  { min: 250, name: 'Constructor de código' },
  { min: 500, name: 'Desarrollador' },
  { min: 900, name: 'Arquitecto digital' }
];

function levelFor(xp) { return [...levelNames].reverse().find((level) => xp >= level.min) || levelNames[0]; }
function safeUser(user) { return user ? { id: user.id, username: user.username, email: user.email, role: user.role, created_at: user.created_at } : null; }
function normalize(value) { return String(value || '').trim().toLowerCase(); }
function normalizeScore(value) { const score = Number(value); return Number.isFinite(score) ? Math.max(0, Math.min(100, score)) : 0; }
function today() { return new Date().toISOString().slice(0, 10); }
function yesterday() { const date = new Date(); date.setDate(date.getDate() - 1); return date.toISOString().slice(0, 10); }

function validateExercise(exercise, answer) {
  const value = String(answer || '').trim();
  const rules = typeof exercise.validation_json === 'string' ? JSON.parse(exercise.validation_json) : exercise.validation_json;
  if (exercise.exercise_type === 'choice' || rules.answer) return normalize(value) === normalize(rules.answer);
  const code = value.replace(/\s+/g, ' ');
  if (rules.kind === 'variable') return new RegExp(`\\b(?:let|const|var)\\s+${rules.name}\\s*=\\s*${rules.value}\\b`).test(code);
  if (rules.kind === 'loop') return /for\s*\(/.test(code) && new RegExp(`\\b${rules.variable}\\b`).test(code) && new RegExp(`(?:<=|<)\\s*${rules.limit}`).test(code);
  if (rules.kind === 'function') return new RegExp(`function\\s+${rules.name}\\s*\\(\\s*${rules.parameter}\\s*\\)`).test(code);
  return false;
}

function updateDemoStats(userId, xpDelta) {
  const current = demo.store.stats.get(userId) || { user_id: userId, total_xp: 0, current_level: 'Explorador', current_streak: 0, last_activity_date: null };
  const date = today();
  if (current.last_activity_date !== date) current.current_streak = current.last_activity_date === yesterday() ? current.current_streak + 1 : 1;
  current.last_activity_date = date;
  current.total_xp += xpDelta;
  current.current_level = levelFor(current.total_xp).name;
  demo.store.stats.set(userId, current);
  return current;
}

async function findUserByEmail(email) {
  if (demoMode) return demo.store.users.find((user) => user.email === normalize(email)) || null;
  const [rows] = await getPool().query('SELECT * FROM users WHERE email = ? LIMIT 1', [normalize(email)]); return rows[0] || null;
}
async function findUserByUsername(username) {
  const value = String(username || '').trim();
  if (demoMode) return demo.store.users.find((user) => user.username.toLowerCase() === value.toLowerCase()) || null;
  const [rows] = await getPool().query('SELECT * FROM users WHERE username = ? LIMIT 1', [value]); return rows[0] || null;
}
async function findUserById(id) {
  if (demoMode) return demo.store.users.find((user) => user.id === Number(id)) || null;
  const [rows] = await getPool().query('SELECT * FROM users WHERE id = ? LIMIT 1', [id]); return rows[0] || null;
}
async function registerUser({ username, email, password }) {
  const passwordHash = await bcrypt.hash(password, 12);
  if (demoMode) {
    const user = { id: demo.store.nextUserId++, username, email: normalize(email), password_hash: passwordHash, role: 'student', created_at: new Date() };
    demo.store.users.push(user); demo.store.stats.set(user.id, { user_id: user.id, total_xp: 0, current_level: 'Explorador', current_streak: 0, last_activity_date: null }); return user;
  }
  const connection = await getPool().getConnection();
  try { await connection.beginTransaction(); const [result] = await connection.query('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', [username, normalize(email), passwordHash]); await connection.query('INSERT INTO user_stats (user_id) VALUES (?)', [result.insertId]); await connection.query('INSERT INTO subscriptions (user_id, plan, status) VALUES (?, \'free\', \'active\')', [result.insertId]); await connection.commit(); return findUserById(result.insertId); } catch (error) { await connection.rollback(); throw error; } finally { connection.release(); }
}
async function verifyPassword(user, password) { return user ? bcrypt.compare(password, user.password_hash) : false; }

async function listCourses() { if (demoMode) return demo.courses; const [rows] = await getPool().query('SELECT id, title, description, difficulty, estimated_minutes, is_premium FROM courses ORDER BY id'); return rows; }
async function getCourse(id) { if (demoMode) return demo.courses.find((course) => course.id === Number(id)) || null; const [rows] = await getPool().query('SELECT id, title, description, difficulty, estimated_minutes, is_premium FROM courses WHERE id = ?', [id]); return rows[0] || null; }
async function listLessons(courseId) { if (demoMode) return demo.lessons.filter((lesson) => lesson.course_id === Number(courseId)); const [rows] = await getPool().query('SELECT id, course_id, title, objective, content, example_code, position, estimated_minutes FROM lessons WHERE course_id = ? ORDER BY position', [courseId]); return rows; }
async function getLesson(id) { if (demoMode) return demo.lessons.find((lesson) => lesson.id === Number(id)) || null; const [rows] = await getPool().query('SELECT * FROM lessons WHERE id = ?', [id]); return rows[0] || null; }
async function getExercise(id) { if (demoMode) return demo.exercises.find((exercise) => exercise.id === Number(id)) || null; const [rows] = await getPool().query('SELECT * FROM exercises WHERE id = ?', [id]); return rows[0] || null; }

async function getExerciseByLesson(lessonId) { if (demoMode) return demo.exercises.filter((exercise) => exercise.lesson_id === Number(lessonId)).sort((a, b) => a.id - b.id)[0] || null; const [rows] = await getPool().query('SELECT * FROM exercises WHERE lesson_id = ? ORDER BY id LIMIT 1', [lessonId]); return rows[0] || null; }

async function getStats(userId) {
  if (demoMode) {
    const stats = demo.store.stats.get(Number(userId)) || { user_id: userId, total_xp: 0, current_level: 'Explorador', current_streak: 0, last_activity_date: null };
    const completedLessons = demo.store.progress.filter((item) => item.user_id === Number(userId) && item.status === 'completed').length;
    const solvedExercises = new Set(demo.store.attempts.filter((item) => item.user_id === Number(userId) && item.is_correct).map((item) => item.exercise_id)).size;
    return { ...stats, completed_lessons: completedLessons, solved_exercises: solvedExercises, level_min_xp: levelFor(stats.total_xp).min };
  }
  const [rows] = await getPool().query(`SELECT s.*, (SELECT COUNT(*) FROM lesson_progress p WHERE p.user_id = s.user_id AND p.status = 'completed') AS completed_lessons, (SELECT COUNT(DISTINCT a.exercise_id) FROM exercise_attempts a WHERE a.user_id = s.user_id AND a.is_correct = 1) AS solved_exercises FROM user_stats s WHERE s.user_id = ?`, [userId]); return rows[0] || { user_id: userId, total_xp: 0, current_level: 'Explorador', current_streak: 0, completed_lessons: 0, solved_exercises: 0 };
}
async function getProgress(userId) {
  if (demoMode) return demo.store.progress.filter((item) => item.user_id === Number(userId));
  const [rows] = await getPool().query('SELECT lesson_id, status, score, completed_at FROM lesson_progress WHERE user_id = ? ORDER BY lesson_id', [userId]); return rows;
}
async function completeLesson(userId, lessonId, score = 100) {
  if (demoMode) {
    let progress = demo.store.progress.find((item) => item.user_id === Number(userId) && item.lesson_id === Number(lessonId));
    if (progress?.status === 'completed') return { progress, stats: await getStats(userId), alreadyCompleted: true };
    const normalizedScore = normalizeScore(score);
    if (!progress) { progress = { user_id: Number(userId), lesson_id: Number(lessonId), status: 'completed', score: normalizedScore, completed_at: new Date() }; demo.store.progress.push(progress); } else Object.assign(progress, { status: 'completed', score: normalizedScore, completed_at: new Date() });
    const stats = updateDemoStats(Number(userId), 20); await updateAchievements(userId); return { progress, stats, alreadyCompleted: false };
  }
  const pool = getPool(); const connection = await pool.getConnection();
  const normalizedScore = normalizeScore(score);
  try { await connection.beginTransaction(); const [existing] = await connection.query("SELECT * FROM lesson_progress WHERE user_id = ? AND lesson_id = ? FOR UPDATE", [userId, lessonId]); if (existing[0]?.status === 'completed') { await connection.rollback(); return { progress: existing[0], stats: await getStats(userId), alreadyCompleted: true }; } await connection.query("INSERT INTO lesson_progress (user_id, lesson_id, status, score, completed_at) VALUES (?, ?, 'completed', ?, NOW()) ON DUPLICATE KEY UPDATE status='completed', score=VALUES(score), completed_at=NOW()", [userId, lessonId, normalizedScore]); const date = today(); await connection.query("UPDATE user_stats SET current_level = CASE WHEN total_xp + 20 >= 900 THEN 'Arquitecto digital' WHEN total_xp + 20 >= 500 THEN 'Desarrollador' WHEN total_xp + 20 >= 250 THEN 'Constructor de código' WHEN total_xp + 20 >= 100 THEN 'Aprendiz lógico' ELSE 'Explorador' END, total_xp = total_xp + 20, current_streak = CASE WHEN last_activity_date = ? THEN current_streak WHEN last_activity_date = DATE_SUB(?, INTERVAL 1 DAY) THEN current_streak + 1 ELSE 1 END, last_activity_date = ? WHERE user_id = ?", [date, date, date, userId]); await connection.commit(); await updateAchievements(userId); return { progress: { user_id: userId, lesson_id: lessonId, status: 'completed', score: normalizedScore }, stats: await getStats(userId), alreadyCompleted: false }; } catch (error) { await connection.rollback(); throw error; } finally { connection.release(); }
}
async function attemptExercise(userId, exerciseId, answer) {
  const exercise = await getExercise(exerciseId); if (!exercise) return null;
  const isCorrect = validateExercise(exercise, answer);
  let alreadyRewarded = false;
  if (demoMode) {
    alreadyRewarded = demo.store.attempts.some((item) => item.user_id === Number(userId) && item.exercise_id === Number(exerciseId) && item.is_correct);
    demo.store.attempts.push({ user_id: Number(userId), exercise_id: Number(exerciseId), is_correct: isCorrect, attempted_at: new Date() });
    if (isCorrect && !alreadyRewarded) updateDemoStats(Number(userId), exercise.xp_reward);
    await updateAchievements(userId);
  } else {
    if (isCorrect) { const [previous] = await getPool().query('SELECT id FROM exercise_attempts WHERE user_id = ? AND exercise_id = ? AND is_correct = 1 LIMIT 1', [userId, exerciseId]); alreadyRewarded = previous.length > 0; }
    await getPool().query('INSERT INTO exercise_attempts (user_id, exercise_id, is_correct) VALUES (?, ?, ?)', [userId, exerciseId, isCorrect]);
    if (isCorrect && !alreadyRewarded) { await getPool().query("UPDATE user_stats SET current_level = CASE WHEN total_xp + ? >= 900 THEN 'Arquitecto digital' WHEN total_xp + ? >= 500 THEN 'Desarrollador' WHEN total_xp + ? >= 250 THEN 'Constructor de código' WHEN total_xp + ? >= 100 THEN 'Aprendiz lógico' ELSE 'Explorador' END, total_xp = total_xp + ? WHERE user_id = ?", [exercise.xp_reward, exercise.xp_reward, exercise.xp_reward, exercise.xp_reward, exercise.xp_reward, userId]); await updateAchievements(userId); }
  }
  return { isCorrect, xpAwarded: isCorrect && !alreadyRewarded ? exercise.xp_reward : 0, alreadyRewarded, feedback: isCorrect ? (alreadyRewarded ? 'Respuesta correcta. La experiencia de este ejercicio ya había sido otorgada.' : exercise.feedback) : 'Todavía no. Revisa la pista y prueba otra vez.', hint: isCorrect ? null : exercise.hint };
}
async function updateAchievements(userId) {
  const stats = await getStats(userId);
  if (demoMode) {
    const unlocked = new Set(demo.store.userAchievements.get(Number(userId)) || []); const ids = []; if (stats.completed_lessons >= 1) ids.push(1); if (stats.solved_exercises >= 10) ids.push(2); if (stats.current_streak >= 3) ids.push(3); for (const id of ids) unlocked.add(id); demo.store.userAchievements.set(Number(userId), [...unlocked]); return;
  }
  const conditions = [[1, stats.completed_lessons >= 1], [2, stats.solved_exercises >= 10], [3, stats.current_streak >= 3]]; for (const [id, ok] of conditions) if (ok) await getPool().query('INSERT IGNORE INTO user_achievements (user_id, achievement_id) VALUES (?, ?)', [userId, id]);
}
async function getAchievements(userId) { if (demoMode) { const unlocked = new Set(demo.store.userAchievements.get(Number(userId)) || []); return demo.achievements.map((item) => ({ ...item, unlocked: unlocked.has(item.id) })); } const [rows] = await getPool().query('SELECT a.*, ua.unlocked_at IS NOT NULL AS unlocked, ua.unlocked_at FROM achievements a LEFT JOIN user_achievements ua ON ua.achievement_id = a.id AND ua.user_id = ? ORDER BY a.id', [userId]); return rows; }
async function getLeaderboard() { if (demoMode) return demo.store.users.filter((user) => user.role !== 'admin').map((user) => ({ username: user.username, ...(demo.store.stats.get(user.id) || { total_xp: 0, current_level: 'Explorador' }), featured_badges: (demo.store.userAchievements.get(user.id) || []).length })).sort((a, b) => b.total_xp - a.total_xp).slice(0, 20); const [rows] = await getPool().query("SELECT u.username, s.total_xp, s.current_level, COUNT(ua.achievement_id) AS featured_badges FROM users u JOIN user_stats s ON s.user_id = u.id LEFT JOIN user_achievements ua ON ua.user_id = u.id WHERE u.role = 'student' GROUP BY u.id, u.username, s.total_xp, s.current_level ORDER BY s.total_xp DESC LIMIT 20"); return rows; }
async function updateProfile(userId, username) { if (demoMode) { const duplicate = await findUserByUsername(username); if (duplicate && duplicate.id !== Number(userId)) { const error = new Error('Ese nombre de usuario ya está ocupado.'); error.code = 'ER_DUP_ENTRY'; throw error; } const user = await findUserById(userId); user.username = username; return user; } await getPool().query('UPDATE users SET username = ? WHERE id = ?', [username, userId]); return findUserById(userId); }
async function adminCreateCourse(data) { if (demoMode) { const id = Math.max(...demo.courses.map((item) => item.id)) + 1; const course = { id, ...data, is_premium: data.is_premium ? 1 : 0 }; demo.courses.push(course); return course; } const [result] = await getPool().query('INSERT INTO courses (title, description, difficulty, estimated_minutes, is_premium) VALUES (?, ?, ?, ?, ?)', [data.title, data.description, data.difficulty, data.estimated_minutes, data.is_premium]); return getCourse(result.insertId); }
async function adminUpdateCourse(id, data) { if (demoMode) { const course = demo.courses.find((item) => item.id === Number(id)); if (!course) return null; Object.assign(course, data, { id: Number(id), is_premium: data.is_premium ? 1 : 0 }); return course; } const [result] = await getPool().query('UPDATE courses SET title = ?, description = ?, difficulty = ?, estimated_minutes = ?, is_premium = ? WHERE id = ?', [data.title, data.description, data.difficulty, data.estimated_minutes, data.is_premium, id]); return result.affectedRows ? getCourse(id) : null; }
async function adminDeleteCourse(id) { if (demoMode) { const hasLessons = demo.lessons.some((lesson) => lesson.course_id === Number(id)); if (hasLessons) return { deleted: false, hasLessons: true }; const index = demo.courses.findIndex((course) => course.id === Number(id)); if (index < 0) return null; demo.courses.splice(index, 1); return { deleted: true }; } const [lessons] = await getPool().query('SELECT id FROM lessons WHERE course_id = ? LIMIT 1', [id]); if (lessons.length) return { deleted: false, hasLessons: true }; const [result] = await getPool().query('DELETE FROM courses WHERE id = ?', [id]); return result.affectedRows ? { deleted: true } : null; }
async function adminCreateLesson(courseId, data) { if (demoMode) { if (!demo.courses.some((course) => course.id === Number(courseId))) return null; const id = Math.max(0, ...demo.lessons.map((item) => item.id)) + 1; const lesson = { id, course_id: Number(courseId), title: data.title, objective: data.objective, content: data.content, example_code: data.example_code || '', position: Number(data.position), estimated_minutes: Number(data.estimated_minutes) }; demo.lessons.push(lesson); return lesson; } const [result] = await getPool().query('INSERT INTO lessons (course_id, title, objective, content, example_code, position, estimated_minutes) VALUES (?, ?, ?, ?, ?, ?, ?)', [courseId, data.title, data.objective, data.content, data.example_code || '', data.position, data.estimated_minutes]); return getLesson(result.insertId); }
async function adminUpdateExercise(id, data) { if (demoMode) { const exercise = demo.exercises.find((item) => item.id === Number(id)); if (!exercise) return null; Object.assign(exercise, data); return exercise; } const [result] = await getPool().query('UPDATE exercises SET title = ?, instructions = ?, hint = ?, feedback = ? WHERE id = ?', [data.title, data.instructions, data.hint, data.feedback, id]); if (!result.affectedRows) return null; return getExercise(id); }
async function adminStats() { if (demoMode) return { users: demo.store.users.length, courses: demo.courses.length, lessons: demo.lessons.length, attempts: demo.store.attempts.length }; const [[users], [courses], [lessons], [attempts]] = await Promise.all(['users', 'courses', 'lessons', 'exercise_attempts'].map((table) => getPool().query(`SELECT COUNT(*) AS total FROM ${table}`))); return { users: users[0].total, courses: courses[0].total, lessons: lessons[0].total, attempts: attempts[0].total }; }

module.exports = { levelNames, safeUser, findUserByEmail, findUserByUsername, findUserById, registerUser, verifyPassword, listCourses, getCourse, listLessons, getLesson, getExercise, getExerciseByLesson, getStats, getProgress, completeLesson, attemptExercise, getAchievements, getLeaderboard, updateProfile, adminCreateCourse, adminUpdateCourse, adminDeleteCourse, adminCreateLesson, adminUpdateExercise, adminStats };
