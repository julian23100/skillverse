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
// Cada curso público debe tener contenido navegable también en modo demo.
// Estos micro-módulos mantienen la vista previa alineada con el catálogo MySQL.
const learningModules = [
  { course_id: 2, lessons: [
    ['Sintaxis que da vida', 'Reconocer cómo una instrucción cambia el estado de una página.', 'JavaScript conecta datos, decisiones y acciones. Empieza leyendo de arriba abajo y nombra cada pieza con claridad.', 'const mensaje = "Hola";\nconsole.log(mensaje);'],
    ['Eventos y respuestas', 'Relacionar una acción de la persona con una respuesta de la interfaz.', 'Un evento representa algo que ocurre: un clic, una tecla o un cambio. Escucha el evento y actualiza solo lo necesario.', 'const boton = document.querySelector("button");\nboton.addEventListener("click", () => {\n  console.log("Listo");\n});'],
    ['Datos que viajan', 'Usar funciones pequeñas para transformar datos antes de mostrarlos.', 'Separar la transformación de la presentación hace que el código sea más fácil de probar y reutilizar.', 'const nombres = ["Ada", "Linus"];\nconst saludos = nombres.map((nombre) => `Hola, ${nombre}`);']
  ] },
  { course_id: 3, lessons: [
    ['Estructura semántica', 'Organizar una página con elementos que explican su propósito.', 'HTML no es solo apariencia: encabezados, navegación, secciones y botones ayudan a las personas y a las tecnologías de asistencia.', '<main>\n  <h1>Mi proyecto</h1>\n  <section>Contenido</section>\n</main>'],
    ['Composición con CSS', 'Aplicar espacio, contraste y jerarquía visual a una interfaz.', 'Primero define la relación entre bloques; después ajusta colores y detalles. Grid y flexbox te ayudan a construir una composición estable.', '.card {\n  display: grid;\n  gap: 1rem;\n  padding: 1.5rem;\n}'],
    ['Responsive y accesibilidad', 'Crear una interfaz que funcione en distintos tamaños y formas de interacción.', 'Una buena interfaz se adapta, conserva el foco visible y usa texto que describe la acción. Prueba con teclado antes de darla por terminada.', '@media (max-width: 700px) {\n  .layout { grid-template-columns: 1fr; }\n}']
  ] },
  { course_id: 4, lessons: [
    ['Nombrar para entender', 'Declarar variables con nombres que comuniquen su intención.', 'Una variable no es solo un contenedor: es una decisión de diseño. Usa nombres que expliquen qué representa el dato.', 'const minutosDeEstudio = 10;\nlet progreso = 0;'],
    ['Tipos en acción', 'Distinguir texto, números y booleanos para evitar mezclas inesperadas.', 'Conocer el tipo de cada valor te permite elegir operaciones seguras y detectar errores antes de que crezcan.', 'const titulo = "SkillVerse";\nconst lecciones = 3;\nconst publicado = true;'],
    ['Transformar datos', 'Convertir y combinar valores con una intención explícita.', 'Convierte solo cuando sabes por qué. Una transformación clara es más fácil de leer que una cadena de conversiones ocultas.', 'const entrada = "42";\nconst numero = Number(entrada);\nconsole.log(numero + 1);']
  ] },
  { course_id: 5, lessons: [
    ['Comparar estados', 'Elegir operadores que expresen exactamente la condición buscada.', 'Una comparación clara evita sorpresas. Prefiere igualdad estricta y escribe la condición como una frase que puedas leer en voz alta.', 'const edad = 18;\nconst puedeEntrar = edad >= 18;'],
    ['Rutas alternativas', 'Diseñar respuestas diferentes sin duplicar la lógica principal.', 'if, else if y else forman un mapa de decisiones. Ordena primero los casos más específicos y deja un camino de respaldo.', 'if (nivel === "inicial") {\n  mostrarRuta();\n} else {\n  mostrarDesafio();\n}'],
    ['Validar antes de actuar', 'Comprobar datos antes de ejecutar una acción importante.', 'Validar temprano protege la experiencia: explica qué falta y conserva la información que la persona ya ingresó.', 'if (!correo.includes("@")) {\n  mostrarError("Revisa tu correo");\n}']
  ] },
  { course_id: 6, lessons: [
    ['Contadores con intención', 'Construir un bucle que avance y termine de forma visible.', 'Un contador necesita inicio, condición y cambio. Si una de las tres piezas falla, el bucle puede repetir demasiado o no ejecutarse.', 'for (let intento = 1; intento <= 3; intento++) {\n  probar(intento);\n}'],
    ['Recorrer colecciones', 'Visitar cada elemento de una colección sin perder el contexto.', 'Usa la herramienta que mejor explique la tarea: for…of para leer, map para transformar y filter para seleccionar.', 'for (const reto of retos) {\n  mostrar(reto);\n}'],
    ['Detener y continuar', 'Controlar un recorrido cuando aparece una condición especial.', 'break termina el recorrido y continue salta a la siguiente vuelta. Úsalos para expresar una regla, no para esconder una lógica difícil.', 'for (const valor of valores) {\n  if (valor < 0) continue;\n  sumar(valor);\n}']
  ] },
  { course_id: 7, lessons: [
    ['Parámetros útiles', 'Diseñar funciones que reciban solo los datos que necesitan.', 'Un parámetro hace explícita la entrada de una función. Si una función necesita demasiados datos, quizá convenga dividirla.', 'function saludar(nombre) {\n  return `Hola, ${nombre}`;\n}'],
    ['Devolver resultados', 'Usar return para convertir una operación en un valor reutilizable.', 'Una función puede hacer algo y además producir un resultado. Devuelve datos para que otra pieza decida cómo mostrarlos.', 'function duplicar(numero) {\n  return numero * 2;\n}'],
    ['Componer ideas', 'Combinar funciones pequeñas para resolver una tarea mayor.', 'La composición reduce el tamaño mental del problema: cada función tiene una responsabilidad y la siguiente recibe un resultado claro.', 'const limpio = limpiar(texto);\nconst resumen = resumir(limpio);\nmostrar(resumen);']
  ] },
  { course_id: 8, lessons: [
    ['Leer una colección', 'Crear arreglos y acceder a sus valores por posición.', 'Los arreglos agrupan valores relacionados. Recuerda que el primer índice es 0 y que length te dice cuántos elementos hay.', 'const rutas = ["JS", "HTML", "CSS"];\nconsole.log(rutas[0]);'],
    ['Transformar y filtrar', 'Usar métodos de arreglo para expresar transformaciones sin bucles innecesarios.', 'map crea una nueva colección transformada y filter conserva los elementos que cumplen una condición.', 'const cortas = rutas.filter((ruta) => ruta.length <= 3);'],
    ['Proyecto: colección de retos', 'Combinar arreglos, funciones y decisiones en una vista pequeña.', 'Una colección útil tiene datos claros, una transformación y un estado vacío pensado. Diseña primero el recorrido de la información.', 'const pendientes = retos.filter((reto) => !reto.completado);\nmostrar(pendientes);']
  ] }
];
const extraLessons = learningModules.flatMap(({ course_id, lessons: moduleLessons }) => moduleLessons.map((lesson, index) => ({
  id: 11 + (course_id - 2) * 3 + index,
  course_id,
  title: lesson[0],
  objective: lesson[1],
  content: lesson[2],
  example_code: lesson[3],
  position: index + 1,
  estimated_minutes: 10
})));
const allLessons = [...lessons, ...extraLessons];
const exercises = exerciseDefinitions.map((item, index) => ({ id: index + 1, lesson_id: index + 1 <= 10 ? index + 1 : 3, title: item[0], instructions: item[1], exercise_type: item[2], validation_json: item[3], hint: item[4], feedback: item[5], xp_reward: item[6], difficulty: 'Inicial' }));
const achievements = [
  { id: 1, name: 'Primer paso', description: 'Completa tu primera lección.', icon: '✦' },
  { id: 2, name: 'Mente lógica', description: 'Resuelve diez ejercicios correctamente.', icon: '⌘' },
  { id: 3, name: 'Constancia', description: 'Estudia en tres días distintos.', icon: '◒' },
  { id: 4, name: 'Cazador de errores', description: 'Supera un ejercicio de detección de errores.', icon: '⌁' },
  { id: 5, name: 'Constructor', description: 'Completa tu primer proyecto.', icon: '◆' }
];

const store = { users: [], courses, lessons: allLessons, exercises, achievements, progress: [], attempts: [], stats: new Map(), userAchievements: new Map(), nextUserId: 1 };

module.exports = { store, courses, lessons: allLessons, exercises, achievements };
