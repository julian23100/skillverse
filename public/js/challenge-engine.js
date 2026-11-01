const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value)));

const languageChallengeDefinitions = [
  ['python', 'Python', 'Escribe una función que reciba una lista y devuelva su suma.', ['def', 'return'], 'def total(numeros): return sum(numeros)'],
  ['java', 'Java', 'Escribe el punto de entrada de un programa Java.', ['class', 'static void main'], 'class Main { public static void main(String[] args) {} }'],
  ['c', 'C', 'Escribe un programa C que tenga una función main.', ['#include', 'int main'], '#include <stdio.h>\nint main(void) { return 0; }'],
  ['cpp', 'C++', 'Escribe un programa C++ que use la salida estándar.', ['#include', 'std::'], '#include <iostream>\nint main() { std::cout << "Hola"; }'],
  ['csharp', 'C#', 'Escribe un punto de entrada en C#.', ['class', 'static void main'], 'class Program { static void Main() {} }'],
  ['php', 'PHP', 'Escribe una salida sencilla desde PHP.', ['<?php', 'echo'], '<?php echo "Hola"; ?>'],
  ['ruby', 'Ruby', 'Define una función Ruby que termine correctamente.', ['def', 'end'], 'def saludar\n  puts "Hola"\nend'],
  ['go', 'Go', 'Escribe el programa mínimo ejecutable de Go.', ['package main', 'func main'], 'package main\nfunc main() {}'],
  ['rust', 'Rust', 'Escribe el punto de entrada de un programa Rust.', ['fn main', 'println!'], 'fn main() { println!("Hola"); }'],
  ['kotlin', 'Kotlin', 'Escribe una función main en Kotlin.', ['fun main', 'println'], 'fun main() { println("Hola") }'],
  ['swift', 'Swift', 'Escribe una salida en Swift.', ['print('], 'print("Hola, SkillVerse")'],
  ['typescript', 'TypeScript', 'Declara un texto con un tipo explícito.', [': string', 'const'], 'const mensaje: string = "Hola";'],
  ['sql', 'SQL', 'Consulta los nombres de estudiantes adultos.', ['select', 'from', 'where'], 'SELECT nombre FROM estudiantes WHERE edad >= 18;'],
  ['r', 'R', 'Crea un valor y muéstralo en R.', ['<-', 'print'], 'mensaje <- "Hola"\nprint(mensaje)'],
  ['dart', 'Dart', 'Escribe el punto de entrada de Dart.', ['void main', 'print'], 'void main() { print("Hola"); }']
].map(([slug, language, objective, requiredTokens, starter]) => ({
  slug: `reto-${slug}`,
  language,
  kind: 'language',
  symbol: '</>',
  title: `Reto ${language}`,
  level: 'Ruta de lenguajes',
  xp: 70,
  description: `Practica una solución breve y segura usando ${language}.`,
  objective,
  hint: `Incluye estas piezas en tu respuesta: ${requiredTokens.join(', ')}. No se ejecuta código; se valida la estructura.`,
  explanation: `El reto comprueba la presencia de ${requiredTokens.join(', ')} para que puedas practicar la forma básica de ${language} sin ejecutar código enviado por estudiantes.`,
  requiredTokens,
  starter
}));

export const challengeDefinitions = [
  {
    slug: 'fisica-del-salto', symbol: '⌁', title: 'Física del salto', level: 'Inicial', xp: 80,
    description: 'Ajusta la trayectoria para que el personaje aterrice sobre la plataforma.',
    objective: 'Haz que el personaje llegue a la plataforma mientras desciende.',
    hint: 'La posición horizontal determina el instante del encuentro. Prueba primero con gravedad 9.8, velocidad inicial 12 y velocidad horizontal 5.5.',
    explanation: 'La trayectoria se calcula con y(t) = v₀t − ½gt². La solución solo vale si el personaje está descendiendo al pasar por x = 9 y su altura queda dentro de la plataforma.'
  },
  {
    slug: 'puerta-automatica', symbol: '↔', title: 'Puerta automática', level: 'Inicial', xp: 90,
    description: 'Configura sensores y motor para que una puerta responda sin cerrar sobre una persona.',
    objective: 'Abre con presencia y vuelve a abrirse si el sensor de seguridad detecta un obstáculo.',
    hint: 'Activa ambos sensores y el motor. Usa “Simular presencia” para abrir, retira la presencia para iniciar el cierre y activa un obstáculo durante el cierre.',
    explanation: 'Una puerta segura necesita un sensor de presencia para abrir y un sensor de seguridad que interrumpa el cierre. El motor debe estar habilitado para ejecutar las transiciones.'
  },
  {
    slug: 'algoritmo-secreto', symbol: '⌘', title: 'Algoritmo secreto', level: 'Inicial', xp: 85,
    description: 'Experimenta con entradas y descubre la regla matemática que transforma los valores.',
    objective: 'Predice la salida para x = 5 e y = 2.',
    hint: 'Compara las muestras: la salida combina tres veces x, el cuadrado de y y una corrección de −2.',
    explanation: 'La regla secreta es salida = (3 × x) + (y²) − 2. Experimentar con diferentes entradas ayuda a separar cada parte de la expresión.'
  },
  {
    slug: 'circuito-logico', symbol: '⊕', title: 'Circuito lógico', level: 'Intermedio', xp: 100,
    description: 'Conecta interruptores a una puerta lógica y consigue la salida solicitada.',
    objective: 'Enciende A, apaga B, selecciona XOR y deja la salida sin invertir.',
    hint: 'XOR produce verdadero cuando exactamente una de sus entradas está encendida.',
    explanation: 'Con A encendido y B apagado, XOR produce verdadero. AND necesita las dos entradas, OR acepta cualquiera y NOT invierte el resultado.'
  },
  {
    slug: 'equilibrio', symbol: '╱', title: 'Sistema de equilibrio', level: 'Intermedio', xp: 95,
    description: 'Mueve los pesos para que los momentos de fuerza de ambos lados se igualen.',
    objective: 'Equilibra la barra con una diferencia de momentos inferior a 0.1.',
    hint: 'Momento = peso × distancia. Si un peso es mayor, colócalo más cerca del centro.',
    explanation: 'La barra está equilibrada cuando el momento izquierdo y el derecho son iguales. La tolerancia evita exigir una precisión imposible con los controles.'
  },
  {
    slug: 'depura-el-sistema', symbol: '⌁', title: 'Depura el sistema', level: 'Intermedio', xp: 110,
    description: 'Corrige una secuencia de instrucciones sin ejecutar código arbitrario.',
    objective: 'Haz que el bucle sume 0 + 1 + 2 y produzca total = 3.',
    hint: 'El contador debe empezar en cero, avanzar hacia arriba y detenerse antes de 3.',
    explanation: 'El evaluador simula los pasos permitidos en lugar de ejecutar texto introducido por el usuario. Así comprueba la lógica sin usar eval ni ejecutar código arbitrario.'
  },
  ...languageChallengeDefinitions
];

// Orden pedagógico explícito: la navegación no depende de títulos ni de IDs.
export const challengeSequence = challengeDefinitions.map(({ slug }) => slug);

export function nextChallengeSlug(slug) {
  const index = challengeSequence.indexOf(slug);
  return index >= 0 ? challengeSequence[index + 1] || null : null;
}

export function challengeSequenceProgress(completedSlugs = []) {
  const completed = new Set(completedSlugs);
  return {
    completed: challengeSequence.filter((slug) => completed.has(slug)),
    total: challengeSequence.length,
    current: challengeSequence.find((slug) => !completed.has(slug)) || null
  };
}

export const challengeDefaults = {
  'fisica-del-salto': { gravity: 9.8, initialVelocity: 12, horizontalVelocity: 5.5 },
  'puerta-automatica': { presenceSensor: true, safetySensor: true, motor: true, presence: false, obstacle: false, doorState: { phase: 'cerrada', progress: 0 } },
  'algoritmo-secreto': { x: 5, y: 2, answer: '', lastOutput: null },
  'circuito-logico': { inputA: true, inputB: false, gate: 'XOR', invert: false },
  equilibrio: { leftWeight: 4, leftDistance: 2, rightWeight: 8, rightDistance: 1 },
  'depura-el-sistema': { initial: '0', condition: '<', increment: 'i++', operation: 'total += i' },
  ...Object.fromEntries(languageChallengeDefinitions.map((challenge) => [challenge.slug, { code: '' }]))
};

export const physicsTarget = { x: 9, y: 6.5 };

export function cloneDefault(slug) {
  return JSON.parse(JSON.stringify(challengeDefaults[slug]));
}

export function evaluateLanguageChallenge(slug, draft = {}) {
  const challenge = languageChallengeDefinitions.find((item) => item.slug === slug);
  if (!challenge) return { isCorrect: false, message: 'Reto no encontrado.' };
  const source = String(draft.code || '').toLowerCase();
  const isCorrect = source.trim().length > 0 && challenge.requiredTokens.every((token) => source.includes(token.toLowerCase()));
  return {
    isCorrect,
    message: isCorrect ? `Estructura válida para ${challenge.language}.` : `Aún faltan piezas del reto de ${challenge.language}.`
  };
}

export function normalizePhysics(params = {}) {
  return {
    gravity: clamp(params.gravity ?? 9.8, 6, 14),
    initialVelocity: clamp(params.initialVelocity ?? 12, 8, 16),
    horizontalVelocity: clamp(params.horizontalVelocity ?? 5.5, 3, 8)
  };
}

export function simulateJump(params = {}, target = physicsTarget) {
  const values = normalizePhysics(params);
  const flightTime = (2 * values.initialVelocity) / values.gravity;
  const sampleCount = 28;
  const points = Array.from({ length: sampleCount + 1 }, (_, index) => {
    const time = (flightTime * index) / sampleCount;
    return { time, x: values.horizontalVelocity * time, y: Math.max(0, values.initialVelocity * time - 0.5 * values.gravity * time * time) };
  });
  const targetTime = target.x / values.horizontalVelocity;
  const targetY = values.initialVelocity * targetTime - 0.5 * values.gravity * targetTime * targetTime;
  const verticalVelocity = values.initialVelocity - values.gravity * targetTime;
  return { ...values, flightTime, points, targetTime, targetY, verticalVelocity, horizontalDistance: values.horizontalVelocity * flightTime };
}

export function evaluateJump(params = {}, target = physicsTarget) {
  const result = simulateJump(params, target);
  const inFlight = result.targetTime > 0 && result.targetTime < result.flightTime;
  const heightError = Math.abs(result.targetY - target.y);
  const isCorrect = inFlight && result.verticalVelocity < 0 && heightError <= 0.3;
  return { isCorrect, heightError, targetY: result.targetY, targetTime: result.targetTime, message: isCorrect ? 'Aterrizaje confirmado: la trayectoria cruza la plataforma durante el descenso.' : 'La trayectoria no alcanza la plataforma en un descenso válido.' };
}

export function createDoorState(value = {}) {
  const phase = ['cerrada', 'abriendo', 'abierta', 'cerrando'].includes(value.phase) ? value.phase : 'cerrada';
  return { phase, progress: clamp(value.progress ?? 0, 0, 1) };
}

export function stepDoor(stateValue, sensors = {}, seconds = 1) {
  const state = createDoorState(stateValue);
  const input = { motor: Boolean(sensors.motor), presence: Boolean(sensors.presence), obstacle: Boolean(sensors.obstacle), safetySensor: Boolean(sensors.safetySensor) };
  const step = clamp(seconds, 0.1, 2) / 2;
  if (!input.motor) return { phase: 'cerrada', progress: 0 };
  if (state.phase === 'cerrada' && input.presence) return { phase: 'abriendo', progress: Math.max(state.progress, step) };
  if (state.phase === 'abriendo') return state.progress + step >= 1 ? { phase: 'abierta', progress: 1 } : { phase: 'abriendo', progress: state.progress + step };
  if (state.phase === 'abierta' && !input.presence) return { phase: 'cerrando', progress: Math.max(0, 1 - step) };
  if (state.phase === 'cerrando' && input.safetySensor && input.obstacle) return { phase: 'abriendo', progress: state.progress };
  if (state.phase === 'cerrando') return state.progress - step <= 0 ? { phase: 'cerrada', progress: 0 } : { phase: 'cerrando', progress: state.progress - step };
  return state;
}

export function evaluateDoor(config = {}) {
  if (!config.motor || !config.presenceSensor || !config.safetySensor) return { isCorrect: false, message: 'Activa el motor y los dos sensores de seguridad.' };
  let state = createDoorState();
  state = stepDoor(state, { motor: true, presence: true, safetySensor: true }, 1);
  const opened = state.phase === 'abriendo';
  state = stepDoor(state, { motor: true, presence: true, safetySensor: true }, 1);
  state = stepDoor(state, { motor: true, presence: true, safetySensor: true }, 1);
  const fullyOpen = state.phase === 'abierta';
  state = stepDoor(state, { motor: true, presence: false, safetySensor: true }, 1);
  const startedClosing = state.phase === 'cerrando';
  state = stepDoor(state, { motor: true, presence: false, obstacle: true, safetySensor: true }, 1);
  const reopened = state.phase === 'abriendo';
  const isCorrect = opened && fullyOpen && startedClosing && reopened;
  return { isCorrect, message: isCorrect ? 'Secuencia segura confirmada: presencia abre y un obstáculo interrumpe el cierre.' : 'La puerta no completó toda la secuencia segura.' };
}

export function secretRule(x, y) { return (3 * Number(x)) + (Number(y) ** 2) - 2; }
export function evaluateSecret(draft = {}) {
  const expected = secretRule(5, 2);
  const answer = Number(draft.answer);
  const isCorrect = Number.isFinite(answer) && answer === expected;
  return { isCorrect, expected, output: secretRule(draft.x, draft.y), message: isCorrect ? 'Regla identificada: tu predicción coincide con la salida objetivo.' : 'La predicción no coincide. Haz más pruebas con las entradas de ejemplo.' };
}

export function logicOutput(a, b, gate, invert = false) {
  const left = Boolean(a); const right = Boolean(b);
  let result = gate === 'AND' ? left && right : gate === 'OR' ? left || right : gate === 'NOT' ? !left : left !== right;
  return Boolean(invert ? !result : result);
}

export function evaluateCircuit(draft = {}) {
  const output = logicOutput(draft.inputA, draft.inputB, draft.gate, draft.invert);
  const isCorrect = Boolean(draft.inputA) && !Boolean(draft.inputB) && draft.gate === 'XOR' && !Boolean(draft.invert) && output;
  return { isCorrect, output, message: isCorrect ? 'Circuito correcto: XOR detecta exactamente una entrada encendida.' : 'La salida no cumple la combinación objetivo.' };
}

export function balanceMoments(draft = {}) {
  const leftMoment = Number(draft.leftWeight) * Number(draft.leftDistance);
  const rightMoment = Number(draft.rightWeight) * Number(draft.rightDistance);
  return { leftMoment, rightMoment, difference: Math.abs(leftMoment - rightMoment), tilt: clamp((rightMoment - leftMoment) * 2, -18, 18) };
}

export function evaluateBalance(draft = {}) {
  const result = balanceMoments(draft);
  const isCorrect = [draft.leftWeight, draft.leftDistance, draft.rightWeight, draft.rightDistance].every((value) => Number(value) > 0) && result.difference <= 0.1;
  return { ...result, isCorrect, message: isCorrect ? 'Equilibrio conseguido: ambos momentos están dentro de la tolerancia.' : 'La barra todavía tiene un momento mayor en uno de sus lados.' };
}

export function evaluateDebug(draft = {}) {
  const isCorrect = draft.initial === '0' && draft.condition === '<' && draft.increment === 'i++' && draft.operation === 'total += i';
  const total = isCorrect ? 3 : draft.initial === '0' && draft.increment === 'i++' && draft.operation === 'total += i' && draft.condition === '<=' ? 3 : null;
  return { isCorrect, total, message: isCorrect ? 'Depuración correcta: el evaluador seguro obtiene total = 3.' : 'La secuencia todavía contiene un error lógico.' };
}

export function evaluateChallenge(slug, draft) {
  if (slug === 'fisica-del-salto') return evaluateJump(draft);
  if (slug === 'puerta-automatica') return evaluateDoor(draft);
  if (slug === 'algoritmo-secreto') return evaluateSecret(draft);
  if (slug === 'circuito-logico') return evaluateCircuit(draft);
  if (slug === 'equilibrio') return evaluateBalance(draft);
  if (slug === 'depura-el-sistema') return evaluateDebug(draft);
  if (languageChallengeDefinitions.some((challenge) => challenge.slug === slug)) return evaluateLanguageChallenge(slug, draft);
  return { isCorrect: false, message: 'Reto no encontrado.' };
}
