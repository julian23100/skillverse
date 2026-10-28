const courses = [
  { id: 1, title: 'Lógica de programación', description: 'Piensa paso a paso y convierte una idea en instrucciones claras.', difficulty: 'Inicial', estimated_minutes: 100, is_premium: 0 },
  { id: 2, title: 'Fundamentos de JavaScript', description: 'Conoce las piezas que hacen que una página cobre vida.', difficulty: 'Inicial', estimated_minutes: 80, is_premium: 0 },
  { id: 3, title: 'HTML y CSS', description: 'Construye interfaces limpias y expresivas desde cero.', difficulty: 'Inicial', estimated_minutes: 70, is_premium: 0 },
  { id: 4, title: 'Variables y tipos de datos', description: 'Aprende a nombrar y transformar la información de tus programas.', difficulty: 'Inicial', estimated_minutes: 40, is_premium: 0 },
  { id: 5, title: 'Condicionales', description: 'Haz que tu código tome decisiones con claridad.', difficulty: 'Inicial', estimated_minutes: 50, is_premium: 0 },
  { id: 6, title: 'Bucles', description: 'Automatiza tareas repetitivas sin perder el control.', difficulty: 'Intermedio', estimated_minutes: 55, is_premium: 1 },
  { id: 7, title: 'Funciones', description: 'Divide ideas complejas en piezas reutilizables.', difficulty: 'Intermedio', estimated_minutes: 60, is_premium: 1 },
  { id: 8, title: 'Arreglos', description: 'Organiza colecciones de datos y recórrelas con confianza.', difficulty: 'Intermedio', estimated_minutes: 60, is_premium: 1 }
];

const lessonTitles = ['¿Qué es programar?', '¿Qué es un algoritmo?', 'Variables y tipos de datos', 'Operadores', 'Condicionales', 'Bucles', 'Funciones', 'Arreglos', 'Resolución de problemas', 'Primer proyecto práctico'];
const lessonContent = [
  ['Reconocer la programación como una forma de dar instrucciones precisas.', 'Programar es escribir instrucciones para que una computadora resuelva una tarea. Como una receta, cada paso debe ser claro y estar en un orden útil.', 'const saludo = "Hola, SkillVerse";\nconsole.log(saludo);'],
  ['Describir una solución como una secuencia finita de pasos.', 'Un algoritmo es un plan que transforma una entrada en un resultado. Preparar un sándwich u ordenar una lista son ejemplos cotidianos.', '1. Leer el problema\n2. Separar sus pasos\n3. Probar el resultado'],
  ['Crear variables y distinguir texto, números y valores booleanos.', 'Una variable es una caja con nombre donde guardas un dato. El nombre te permite volver a encontrarlo y cambiarlo cuando el programa lo necesite.', 'let nombre = "Alex";\nlet edad = 18;\nconst aprende = true;'],
  ['Usar operadores aritméticos y de comparación.', 'Los operadores permiten transformar o comparar valores. === compara si dos valores son iguales y también del mismo tipo.', 'const total = 8 + 4;\nconst esMayor = total > 10;'],
  ['Elegir una acción según una condición.', 'Un condicional pregunta algo y decide qué camino seguir. Mantén cada camino corto para que sea fácil de leer.', 'const edad = 18;\nif (edad >= 18) {\n  console.log("Puede entrar");\n}'],
  ['Repetir una tarea con un límite claro.', 'Un bucle evita copiar la misma instrucción muchas veces. Identifica cómo empieza, cuándo termina y qué cambia.', 'for (let i = 1; i <= 3; i++) {\n  console.log(i);\n}'],
  ['Agrupar instrucciones reutilizables.', 'Una función tiene un nombre, puede recibir datos y puede devolver un resultado.', 'function duplicar(numero) {\n  return numero * 2;\n}'],
  ['Guardar varios valores y acceder a ellos por posición.', 'Un arreglo es una colección ordenada. En JavaScript la primera posición es 0.', 'const colores = ["cian", "azul", "violeta"];\nconsole.log(colores[0]);'],
  ['Aplicar una estrategia antes de escribir código.', 'Antes de programar: entiende la entrada, describe la salida, crea un ejemplo pequeño y divide el problema en partes.', 'Entrada: 3, 5\nProceso: sumar\nSalida esperada: 8'],
  ['Combinar variables, condicionales y funciones en una idea pequeña.', 'Tu primer proyecto no tiene que ser enorme. Un generador de mensajes, una lista de tareas o un contador ya te enseñan a conectar piezas.', 'function mensaje(nombre) {\n  return `Hola, ${nombre}`;\n}']
];
const exerciseDefinitions = [
  ['Ordena el pensamiento', '¿Qué describe mejor a un algoritmo?', 'choice', { answer: 'pasos' }, 'Piensa en una receta: tiene una secuencia.', 'Un algoritmo es una secuencia de pasos para resolver una tarea.', 10],
  ['Identifica la entrada', 'En un programa que suma dos números, ¿qué representa la entrada?', 'choice', { answer: 'datos' }, 'Es la información que recibe el programa.', 'La entrada son los datos con los que comienza el proceso.', 10],
  ['Crea una variable', 'Escribe código JavaScript que cree una variable llamada edad con el valor 18.', 'code', { kind: 'variable', name: 'edad', value: '18' }, 'Puedes usar let o const.', 'Hay varias respuestas válidas: la declaración debe crear edad con el número 18.', 20],
  ['Elige el operador', '¿Qué operador comprueba igualdad estricta en JavaScript?', 'choice', { answer: '===' }, 'Tiene tres signos de igualdad.', '=== compara valor y tipo.', 10],
  ['Decide el camino', '¿Qué palabra inicia una condición en JavaScript?', 'choice', { answer: 'if' }, 'Se lee como “si”.', 'if permite ejecutar un bloque cuando una condición se cumple.', 10],
  ['Repite con cuidado', 'Escribe un for que incluya la variable i y que llegue hasta 3.', 'code', { kind: 'loop', variable: 'i', limit: '3' }, 'Busca las tres partes de un for.', 'El bucle debe tener un límite claro y usar i.', 20],
  ['Devuelve el resultado', '¿Qué palabra envía un resultado desde una función?', 'choice', { answer: 'return' }, 'Aparece antes del valor.', 'return entrega el resultado de una función.', 10],
  ['Primera posición', '¿Qué índice tiene el primer elemento de un arreglo en JavaScript?', 'choice', { answer: '0' }, 'Las posiciones empiezan a contar desde cero.', 'En JavaScript, el primer elemento está en la posición 0.', 10],
  ['Prueba pequeña', '¿Qué conviene hacer antes de optimizar un programa?', 'choice', { answer: 'probar' }, 'Primero necesitas saber si funciona.', 'Probar casos pequeños ayuda a descubrir y entender errores.', 10],
  ['Une las piezas', 'Escribe una función llamada mensaje que use el parámetro nombre.', 'code', { kind: 'function', name: 'mensaje', parameter: 'nombre' }, 'Empieza con function mensaje(nombre).', 'La función debe tener el nombre y el parámetro solicitados.', 20],
  ['Tipos en contexto', '¿Qué tipo de dato representa el texto "Alex"?', 'choice', { answer: 'texto' }, 'Está escrito entre comillas.', 'Un texto entre comillas es una cadena (string).', 10]
];

const lessons = lessonTitles.map((title, index) => ({ id: index + 1, course_id: 1, title, objective: lessonContent[index][0], content: lessonContent[index][1], example_code: lessonContent[index][2], position: index + 1, estimated_minutes: 10 }));
const exercises = exerciseDefinitions.map((item, index) => ({ id: index + 1, lesson_id: index + 1 <= 10 ? index + 1 : 3, title: item[0], instructions: item[1], exercise_type: item[2], validation_json: item[3], hint: item[4], feedback: item[5], xp_reward: item[6], difficulty: 'Inicial' }));
const achievements = [
  { id: 1, name: 'Primer paso', description: 'Completa tu primera lección.', icon: '✦' },
  { id: 2, name: 'Mente lógica', description: 'Resuelve diez ejercicios correctamente.', icon: '⌘' },
  { id: 3, name: 'Constancia', description: 'Estudia en tres días distintos.', icon: '◒' },
  { id: 4, name: 'Cazador de errores', description: 'Supera un ejercicio de detección de errores.', icon: '⌁' },
  { id: 5, name: 'Constructor', description: 'Completa tu primer proyecto.', icon: '◆' }
];

const store = { users: [], courses, lessons, exercises, achievements, progress: [], attempts: [], stats: new Map(), userAchievements: new Map(), nextUserId: 1 };

module.exports = { store, courses, lessons, exercises, achievements };
