require('dotenv').config();
const crypto = require('node:crypto');
const path = require('node:path');
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { connectDatabase, demoMode } = require('./config/database');

const authRoutes = require('./routes/auth.routes');
const coursesRoutes = require('./routes/courses.routes');
const lessonsRoutes = require('./routes/lessons.routes');
const exercisesRoutes = require('./routes/exercises.routes');
const progressRoutes = require('./routes/progress.routes');
const profileRoutes = require('./routes/profile.routes');
const platformRoutes = require('./routes/platform.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();
app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: { directives: { ...helmet.contentSecurityPolicy.getDefaultDirectives(), 'script-src': ["'self'"], 'style-src': ["'self'"], 'img-src': ["'self'", 'data:'] } } }));
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: false, limit: '20kb' }));
const sessionStore = demoMode ? undefined : new MySQLStore({ host: process.env.MYSQL_HOST, port: Number(process.env.MYSQL_PORT || 3306), database: process.env.MYSQL_DATABASE, user: process.env.MYSQL_USER, password: process.env.MYSQL_PASSWORD, createDatabaseTable: true });
app.use(session({ ...(sessionStore ? { store: sessionStore } : {}), secret: process.env.SESSION_SECRET || 'dev-only-change-this-secret', resave: false, saveUninitialized: false, cookie: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 1000 * 60 * 60 * 24 * 7 } }));
app.use((req, res, next) => {
  if (!req.session.csrfToken) req.session.csrfToken = crypto.randomBytes(24).toString('hex');
  const mutating = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
  const publicAuth = req.path === '/login' || req.path === '/register';
  if (mutating && req.session.userId && !publicAuth && req.get('x-csrf-token') !== req.session.csrfToken) return res.status(403).json({ error: 'La sesión no pudo verificarse. Recarga la página e inténtalo de nuevo.' });
  next();
});
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 50, standardHeaders: 'draft-8', legacyHeaders: false }), authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/lessons', lessonsRoutes);
app.use('/api/exercises', exercisesRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api', platformRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', (req, res) => res.status(404).json({ error: 'Ruta API no encontrada.' }));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'index.html')));
app.use((error, req, res, next) => { console.error(error); if (res.headersSent) return next(error); if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Ese dato ya está registrado.' }); res.status(500).json({ error: 'Ocurrió un error inesperado. Intenta de nuevo.' }); });

const port = Number(process.env.PORT || 3000);
if (require.main === module) connectDatabase().then(() => app.listen(port, () => console.log(`SkillVerse disponible en http://localhost:${port} (${demoMode ? 'modo demo' : 'MySQL'})`))).catch((error) => { console.error('No se pudo conectar a MySQL:', error.message); process.exit(1); });
module.exports = app;
