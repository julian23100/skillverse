const test = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const app = require('../src/server');
const { store } = require('../src/data/demo-store');

let server;
let baseUrl;
let cookie;
let csrfToken;

test.before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => new Promise((resolve) => server.close(resolve)));

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (cookie) headers.Cookie = cookie;
  if (csrfToken && options.method && options.method !== 'GET') headers['X-CSRF-Token'] = csrfToken;
  const response = await fetch(`${baseUrl}${path}`, { ...options, headers });
  const setCookie = response.headers.get('set-cookie');
  if (setCookie) cookie = setCookie.split(';')[0];
  const payload = await response.json();
  if (payload.csrfToken) csrfToken = payload.csrfToken;
  return { response, payload };
}

test('un visitante puede consultar cursos públicos', async () => {
  const { response, payload } = await request('/api/courses');
  assert.equal(response.status, 200);
  assert.ok(payload.courses.length >= 8);
});

test('cada ruta pública tiene contenido de aprendizaje', async () => {
  const { payload } = await request('/api/courses');
  for (const course of payload.courses) {
    const lessons = await request(`/api/courses/${course.id}/lessons`);
    assert.equal(lessons.response.status, 200);
    assert.ok(lessons.payload.lessons.length >= 3, `El curso ${course.id} no tiene suficientes lecciones.`);
  }
});

test('registro crea una cuenta con hash y protege los endpoints privados', async () => {
  const email = `${randomUUID()}@example.test`;
  const { response, payload } = await request('/api/auth/register', { method: 'POST', body: JSON.stringify({ username: 'tester', email, password: 'una-clave-segura', confirmPassword: 'una-clave-segura' }) });
  assert.equal(response.status, 201);
  assert.equal(payload.user.email, email);
  const user = store.users.find((item) => item.email === email);
  assert.ok(user.password_hash.startsWith('$2')); 
  const duplicateUsername = await request('/api/auth/register', { method: 'POST', body: JSON.stringify({ username: 'tester', email: `${randomUUID()}@example.test`, password: 'una-clave-segura', confirmPassword: 'una-clave-segura' }) });
  assert.equal(duplicateUsername.response.status, 409);
  const stats = await request('/api/stats');
  assert.equal(stats.response.status, 200);
});

test('un ejercicio acepta una solución válida y entrega XP una sola vez por lección', async () => {
  const attempt = await request('/api/exercises/3/attempt', { method: 'POST', body: JSON.stringify({ answer: 'const edad = 18;' }) });
  assert.equal(attempt.response.status, 200);
  assert.equal(attempt.payload.isCorrect, true);
  assert.equal(attempt.payload.xpAwarded, 20);
  const repeatedAttempt = await request('/api/exercises/3/attempt', { method: 'POST', body: JSON.stringify({ answer: 'let edad = 18;' }) });
  assert.equal(repeatedAttempt.payload.isCorrect, true);
  assert.equal(repeatedAttempt.payload.xpAwarded, 0);
  const complete = await request('/api/lessons/3/complete', { method: 'POST', body: JSON.stringify({ score: 100 }) });
  assert.equal(complete.response.status, 200);
  const repeat = await request('/api/lessons/3/complete', { method: 'POST', body: JSON.stringify({ score: 100 }) });
  assert.equal(repeat.payload.alreadyCompleted, true);
  const clamped = await request('/api/lessons/4/complete', { method: 'POST', body: JSON.stringify({ score: 999 }) });
  assert.equal(clamped.payload.progress.score, 100);
});
