const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

let engine;
test.before(async () => {
  const source = await fs.readFile(path.join(__dirname, '..', 'public', 'js', 'challenge-engine.js'), 'utf8');
  engine = await import(`data:text/javascript,${encodeURIComponent(source)}`);
});

test('física del salto valida una trayectoria que aterriza durante el descenso', () => {
  assert.equal(engine.evaluateJump({ gravity: 9.8, initialVelocity: 12, horizontalVelocity: 5.5 }).isCorrect, true);
  assert.equal(engine.evaluateJump({ gravity: 6, initialVelocity: 8, horizontalVelocity: 3 }).isCorrect, false);
});

test('puerta automática exige sensores y respeta un obstáculo durante el cierre', () => {
  assert.equal(engine.evaluateDoor({ motor: true, presenceSensor: true, safetySensor: true }).isCorrect, true);
  assert.equal(engine.evaluateDoor({ motor: true, presenceSensor: true, safetySensor: false }).isCorrect, false);
  const opening = engine.stepDoor({ phase: 'cerrada', progress: 0 }, { motor: true, presence: true, safetySensor: true }, 1);
  assert.equal(opening.phase, 'abriendo');
  const safeReopen = engine.stepDoor({ phase: 'cerrando', progress: .5 }, { motor: true, presence: false, obstacle: true, safetySensor: true }, 1);
  assert.equal(safeReopen.phase, 'abriendo');
});

test('algoritmo secreto devuelve la predicción correcta y rechaza otra', () => {
  assert.equal(engine.evaluateSecret({ x: 5, y: 2, answer: 17 }).isCorrect, true);
  assert.equal(engine.evaluateSecret({ x: 5, y: 2, answer: 18 }).isCorrect, false);
});

test('circuito lógico evalúa XOR y cambios de salida', () => {
  assert.equal(engine.evaluateCircuit({ inputA: true, inputB: false, gate: 'XOR', invert: false }).isCorrect, true);
  assert.equal(engine.logicOutput(true, true, 'AND', false), true);
  assert.equal(engine.logicOutput(true, true, 'XOR', false), false);
});

test('sistema de equilibrio compara momentos con tolerancia', () => {
  assert.equal(engine.evaluateBalance({ leftWeight: 4, leftDistance: 2, rightWeight: 8, rightDistance: 1 }).isCorrect, true);
  assert.equal(engine.evaluateBalance({ leftWeight: 4, leftDistance: 2, rightWeight: 8, rightDistance: 2 }).isCorrect, false);
});

test('depura el sistema simula la secuencia segura esperada', () => {
  assert.equal(engine.evaluateDebug({ initial: '0', condition: '<', increment: 'i++', operation: 'total += i' }).isCorrect, true);
  assert.equal(engine.evaluateDebug({ initial: '0', condition: '<=', increment: 'i++', operation: 'total += i' }).isCorrect, false);
});
