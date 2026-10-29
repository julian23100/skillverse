const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const appSource = fs.readFileSync(path.join(__dirname, '..', 'public', 'js', 'app.js'), 'utf8');
const indexSource = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');

test('la interfaz no conserva referencias a Metodología', () => {
  assert.equal(/metodolog/i.test(appSource), false);
  assert.equal(/\.steps|class="step"/.test(appSource), false);
});

test('las secciones de aprendizaje comparten retos navegables', () => {
  assert.match(appSource, /function challengePreview/);
  assert.match(appSource, /Practica por tema/);
  assert.match(appSource, /Después de esta lección/);
  assert.match(appSource, /Simuladores del laboratorio/);
  assert.match(appSource, /function challengeProgressPanel/);
});

test('las lecciones y retos ofrecen continuar y salir al completar', () => {
  assert.match(appSource, /data-lesson-completion/);
  assert.match(appSource, /Continuar a la siguiente lección/);
  assert.match(appSource, /function challengeCompletionActions/);
  assert.match(appSource, /data-challenge-completion/);
  assert.match(appSource, />Salir</);
});

test('el menú principal apunta a rutas completas y la nueva paleta está definida', () => {
  for (const route of ['/', '/cursos', '/retos', '/panel', '/clasificacion', '/planes']) assert.match(indexSource, new RegExp(`href="${route.replace('/', '\\/')}"`));
  assert.match(indexSource, /theme-color" content="#12131f"/);
  assert.match(fs.readFileSync(path.join(__dirname, '..', 'public', 'css', 'styles.css'), 'utf8'), /--cyan: #f3b562/);
});
