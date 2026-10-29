const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const appSource = fs.readFileSync(path.join(__dirname, '..', 'public', 'js', 'app.js'), 'utf8');

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
