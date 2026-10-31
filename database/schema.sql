-- SkillVerse · esquema base de producción
-- Ejecuta este archivo con un usuario administrador de MySQL una sola vez.
-- La aplicación usa el usuario de la app definido en .env y no necesita permisos DDL diarios.
CREATE DATABASE IF NOT EXISTS skillverse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE skillverse;
SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(40) NOT NULL UNIQUE,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student', 'admin') NOT NULL DEFAULT 'student',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS courses (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  difficulty ENUM('Inicial', 'Intermedio', 'Avanzado') NOT NULL DEFAULT 'Inicial',
  estimated_minutes SMALLINT UNSIGNED NOT NULL DEFAULT 10,
  is_premium BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS lessons (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  course_id INT UNSIGNED NOT NULL,
  title VARCHAR(160) NOT NULL,
  objective TEXT NOT NULL,
  content TEXT NOT NULL,
  example_code TEXT NULL,
  position SMALLINT UNSIGNED NOT NULL,
  estimated_minutes SMALLINT UNSIGNED NOT NULL DEFAULT 10,
  CONSTRAINT fk_lessons_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE KEY uq_lesson_position (course_id, position),
  INDEX idx_lessons_course (course_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS exercises (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  lesson_id INT UNSIGNED NOT NULL,
  title VARCHAR(160) NOT NULL,
  instructions TEXT NOT NULL,
  exercise_type ENUM('choice', 'code', 'text') NOT NULL DEFAULT 'choice',
  difficulty ENUM('Inicial', 'Intermedio', 'Avanzado') NOT NULL DEFAULT 'Inicial',
  xp_reward SMALLINT UNSIGNED NOT NULL DEFAULT 10,
  validation_json JSON NOT NULL,
  hint TEXT NOT NULL,
  feedback TEXT NOT NULL,
  CONSTRAINT fk_exercises_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS lesson_progress (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  lesson_id INT UNSIGNED NOT NULL,
  status ENUM('started', 'completed') NOT NULL DEFAULT 'started',
  score TINYINT UNSIGNED NOT NULL DEFAULT 0,
  completed_at TIMESTAMP NULL,
  CONSTRAINT fk_progress_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_progress_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
  UNIQUE KEY uq_user_lesson (user_id, lesson_id),
  INDEX idx_progress_user (user_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS exercise_attempts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  exercise_id INT UNSIGNED NOT NULL,
  is_correct BOOLEAN NOT NULL,
  attempted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_attempt_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_attempt_exercise FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
  INDEX idx_attempt_user (user_id),
  INDEX idx_attempt_exercise_time (exercise_id, attempted_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_stats (
  user_id INT UNSIGNED PRIMARY KEY,
  total_xp INT UNSIGNED NOT NULL DEFAULT 0,
  current_level VARCHAR(60) NOT NULL DEFAULT 'Explorador',
  current_streak SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  last_activity_date DATE NULL,
  CONSTRAINT fk_stats_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS achievements (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE,
  description VARCHAR(255) NOT NULL,
  icon VARCHAR(20) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_achievements (
  user_id INT UNSIGNED NOT NULL,
  achievement_id INT UNSIGNED NOT NULL,
  unlocked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, achievement_id),
  CONSTRAINT fk_user_ach_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_ach_achievement FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE,
  INDEX idx_user_achievements_achievement (achievement_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS subscriptions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  plan ENUM('free', 'premium') NOT NULL DEFAULT 'free',
  status ENUM('active', 'paused', 'cancelled') NOT NULL DEFAULT 'active',
  started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NULL,
  CONSTRAINT fk_subscription_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_subscription_user (user_id)
) ENGINE=InnoDB;

INSERT INTO achievements (name, description, icon) VALUES
  ('Primer paso', 'Completa tu primera lección.', '✦'),
  ('Mente lógica', 'Resuelve diez ejercicios correctamente.', '⌘'),
  ('Constancia', 'Estudia en tres días distintos.', '◒'),
  ('Cazador de errores', 'Supera un ejercicio de detección de errores.', '⌁'),
  ('Constructor', 'Completa tu primer proyecto.', '◆')
ON DUPLICATE KEY UPDATE description = VALUES(description), icon = VALUES(icon);

INSERT INTO courses (id, title, description, difficulty, estimated_minutes, is_premium) VALUES
  (1, 'Lógica de programación', 'Piensa paso a paso y convierte una idea en instrucciones claras.', 'Inicial', 100, FALSE),
  (2, 'Fundamentos de JavaScript', 'Conoce las piezas que hacen que una página cobre vida.', 'Inicial', 80, FALSE),
  (3, 'HTML y CSS', 'Construye interfaces limpias y expresivas desde cero.', 'Inicial', 70, FALSE),
  (4, 'Variables y tipos de datos', 'Aprende a nombrar y transformar la información de tus programas.', 'Inicial', 40, FALSE),
  (5, 'Condicionales', 'Haz que tu código tome decisiones con claridad.', 'Inicial', 50, FALSE),
  (6, 'Bucles', 'Automatiza tareas repetitivas sin perder el control.', 'Intermedio', 55, TRUE),
  (7, 'Funciones', 'Divide ideas complejas en piezas reutilizables.', 'Intermedio', 60, TRUE),
  (8, 'Arreglos', 'Organiza colecciones de datos y recórrelas con confianza.', 'Intermedio', 60, TRUE)
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description), difficulty = VALUES(difficulty), estimated_minutes = VALUES(estimated_minutes), is_premium = VALUES(is_premium);

INSERT INTO lessons (id, course_id, title, objective, content, example_code, position, estimated_minutes) VALUES
  (1, 1, '¿Qué es programar?', 'Reconocer la programación como una forma de dar instrucciones precisas.', 'Programar es escribir instrucciones para que una computadora resuelva una tarea. Como una receta, cada paso debe ser claro y estar en un orden útil. No necesitas memorizarlo todo: necesitas aprender a descomponer una idea.', 'const saludo = "Hola, SkillVerse";\nconsole.log(saludo);', 1, 10),
  (2, 1, '¿Qué es un algoritmo?', 'Describir una solución como una secuencia finita de pasos.', 'Un algoritmo es un plan que transforma una entrada en un resultado. Preparar un sándwich, ordenar una lista o decidir qué transporte tomar son ejemplos cotidianos de algoritmos.', '1. Leer el problema\n2. Separar sus pasos\n3. Probar el resultado', 2, 10),
  (3, 1, 'Variables y tipos de datos', 'Crear variables y distinguir texto, números y valores booleanos.', 'Una variable es una caja con nombre donde guardas un dato. El nombre te permite volver a encontrarlo y cambiarlo cuando el programa lo necesite.', 'let nombre = "Alex";\nlet edad = 18;\nconst aprende = true;', 3, 10),
  (4, 1, 'Operadores', 'Usar operadores aritméticos y de comparación.', 'Los operadores permiten transformar o comparar valores. El signo + puede sumar números o unir textos; === compara si dos valores son iguales y también del mismo tipo.', 'const total = 8 + 4;\nconst esMayor = total > 10;', 4, 10),
  (5, 1, 'Condicionales', 'Elegir una acción según una condición.', 'Un condicional pregunta algo y decide qué camino seguir. Escribe la condición de forma positiva y mantén cada camino corto para que sea fácil de leer.', 'const edad = 18;\nif (edad >= 18) {\n  console.log("Puede entrar");\n}', 5, 10),
  (6, 1, 'Bucles', 'Repetir una tarea con un límite claro.', 'Un bucle evita copiar la misma instrucción muchas veces. Antes de usarlo, identifica cómo empieza, cuándo termina y qué cambia en cada vuelta.', 'for (let i = 1; i <= 3; i++) {\n  console.log(i);\n}', 6, 10),
  (7, 1, 'Funciones', 'Agrupar instrucciones reutilizables.', 'Una función tiene un nombre, puede recibir datos y puede devolver un resultado. Es una herramienta para expresar una idea una sola vez y usarla donde haga falta.', 'function duplicar(numero) {\n  return numero * 2;\n}', 7, 10),
  (8, 1, 'Arreglos', 'Guardar varios valores y acceder a ellos por posición.', 'Un arreglo es una colección ordenada. En JavaScript la primera posición es 0, así que el elemento [0] es el primero.', 'const colores = ["cian", "azul", "violeta"];\nconsole.log(colores[0]);', 8, 10),
  (9, 1, 'Resolución de problemas', 'Aplicar una estrategia antes de escribir código.', 'Antes de programar: entiende la entrada, describe la salida, crea un ejemplo pequeño y divide el problema en partes. Probar con casos sencillos revela errores pronto.', 'Entrada: 3, 5\nProceso: sumar\nSalida esperada: 8', 9, 10),
  (10, 1, 'Primer proyecto práctico', 'Combinar variables, condicionales y funciones en una idea pequeña.', 'Tu primer proyecto no tiene que ser enorme. Un generador de mensajes, una lista de tareas o un contador ya te enseñan a conectar piezas. Empieza pequeño y mejora una decisión a la vez.', 'function mensaje(nombre) {\n  return `Hola, ${nombre}`;\n}', 10, 10)
ON DUPLICATE KEY UPDATE title = VALUES(title), objective = VALUES(objective), content = VALUES(content), example_code = VALUES(example_code);

INSERT INTO exercises (id, lesson_id, title, instructions, exercise_type, difficulty, xp_reward, validation_json, hint, feedback) VALUES
  (1, 1, 'Ordena el pensamiento', '¿Qué describe mejor a un algoritmo?', 'choice', 'Inicial', 10, JSON_OBJECT('answer', 'pasos'), 'Piensa en una receta: tiene una secuencia.', 'Un algoritmo es una secuencia de pasos para resolver una tarea.'),
  (2, 2, 'Identifica la entrada', 'En un programa que suma dos números, ¿qué representa la entrada?', 'choice', 'Inicial', 10, JSON_OBJECT('answer', 'datos'), 'Es la información que recibe el programa.', 'La entrada son los datos con los que comienza el proceso.'),
  (3, 3, 'Crea una variable', 'Escribe código JavaScript que cree una variable llamada edad con el valor 18.', 'code', 'Inicial', 20, JSON_OBJECT('kind', 'variable', 'name', 'edad', 'value', '18'), 'Puedes usar let o const; lo importante es el nombre y el valor.', 'Hay varias respuestas válidas. La declaración debe crear edad con el número 18.'),
  (4, 4, 'Elige el operador', '¿Qué operador comprueba igualdad estricta en JavaScript?', 'choice', 'Inicial', 10, JSON_OBJECT('answer', '==='), 'Tiene tres signos de igualdad.', '=== compara valor y tipo.'),
  (5, 5, 'Decide el camino', '¿Qué palabra inicia una condición en JavaScript?', 'choice', 'Inicial', 10, JSON_OBJECT('answer', 'if'), 'Se lee como “si”.', 'if permite ejecutar un bloque cuando una condición se cumple.'),
  (6, 6, 'Repite con cuidado', 'Escribe un for que incluya la variable i y que llegue hasta 3.', 'code', 'Inicial', 20, JSON_OBJECT('kind', 'loop', 'variable', 'i', 'limit', '3'), 'Busca las tres partes de un for: inicio, condición y cambio.', 'El bucle debe tener un límite claro y usar i.'),
  (7, 7, 'Devuelve el resultado', '¿Qué palabra envía un resultado desde una función?', 'choice', 'Inicial', 10, JSON_OBJECT('answer', 'return'), 'Es la palabra que aparece antes del valor.', 'return entrega el resultado de una función.'),
  (8, 8, 'Primera posición', '¿Qué índice tiene el primer elemento de un arreglo en JavaScript?', 'choice', 'Inicial', 10, JSON_OBJECT('answer', '0'), 'Las posiciones empiezan a contar desde cero.', 'En JavaScript, el primer elemento está en la posición 0.'),
  (9, 9, 'Prueba pequeña', '¿Qué conviene hacer antes de optimizar un programa?', 'choice', 'Inicial', 10, JSON_OBJECT('answer', 'probar'), 'Primero necesitas saber si funciona.', 'Probar casos pequeños ayuda a descubrir y entender errores.'),
  (10, 10, 'Une las piezas', 'Escribe una función llamada mensaje que use el parámetro nombre.', 'code', 'Inicial', 20, JSON_OBJECT('kind', 'function', 'name', 'mensaje', 'parameter', 'nombre'), 'Empieza con function mensaje(nombre).', 'La función debe tener el nombre y el parámetro solicitados.'),
  (11, 3, 'Tipos en contexto', '¿Qué tipo de dato representa el texto "Alex"?', 'choice', 'Inicial', 10, JSON_OBJECT('answer', 'texto'), 'Está escrito entre comillas.', 'Un texto entre comillas es una cadena (string).')
ON DUPLICATE KEY UPDATE title = VALUES(title), instructions = VALUES(instructions), validation_json = VALUES(validation_json), hint = VALUES(hint), feedback = VALUES(feedback);

-- Contenido inicial de las rutas 2–8. Se mantiene el mismo catálogo en demo y MySQL.
INSERT INTO lessons (id, course_id, title, objective, content, example_code, position, estimated_minutes) VALUES
  (11, 2, 'Sintaxis que da vida', 'Reconocer cómo una instrucción cambia el estado de una página.', 'JavaScript conecta datos, decisiones y acciones. Empieza leyendo de arriba abajo y nombra cada pieza con claridad.', 'const mensaje = "Hola";\nconsole.log(mensaje);', 1, 10),
  (12, 2, 'Eventos y respuestas', 'Relacionar una acción de la persona con una respuesta de la interfaz.', 'Un evento representa algo que ocurre: un clic, una tecla o un cambio. Escucha el evento y actualiza solo lo necesario.', 'const boton = document.querySelector("button");\nboton.addEventListener("click", () => {\n  console.log("Listo");\n});', 2, 10),
  (13, 2, 'Datos que viajan', 'Usar funciones pequeñas para transformar datos antes de mostrarlos.', 'Separar la transformación de la presentación hace que el código sea más fácil de probar y reutilizar.', 'const nombres = ["Ada", "Linus"];\nconst saludos = nombres.map((nombre) => `Hola, ${nombre}`);', 3, 10),
  (14, 3, 'Estructura semántica', 'Organizar una página con elementos que explican su propósito.', 'HTML no es solo apariencia: encabezados, navegación, secciones y botones ayudan a las personas y a las tecnologías de asistencia.', '<main>\n  <h1>Mi proyecto</h1>\n  <section>Contenido</section>\n</main>', 1, 10),
  (15, 3, 'Composición con CSS', 'Aplicar espacio, contraste y jerarquía visual a una interfaz.', 'Primero define la relación entre bloques; después ajusta colores y detalles. Grid y flexbox te ayudan a construir una composición estable.', '.card {\n  display: grid;\n  gap: 1rem;\n  padding: 1.5rem;\n}', 2, 10),
  (16, 3, 'Responsive y accesibilidad', 'Crear una interfaz que funcione en distintos tamaños y formas de interacción.', 'Una buena interfaz se adapta, conserva el foco visible y usa texto que describe la acción. Prueba con teclado antes de darla por terminada.', '@media (max-width: 700px) {\n  .layout { grid-template-columns: 1fr; }\n}', 3, 10),
  (17, 4, 'Nombrar para entender', 'Declarar variables con nombres que comuniquen su intención.', 'Una variable no es solo un contenedor: es una decisión de diseño. Usa nombres que expliquen qué representa el dato.', 'const minutosDeEstudio = 10;\nlet progreso = 0;', 1, 10),
  (18, 4, 'Tipos en acción', 'Distinguir texto, números y booleanos para evitar mezclas inesperadas.', 'Conocer el tipo de cada valor te permite elegir operaciones seguras y detectar errores antes de que crezcan.', 'const titulo = "SkillVerse";\nconst lecciones = 3;\nconst publicado = true;', 2, 10),
  (19, 4, 'Transformar datos', 'Convertir y combinar valores con una intención explícita.', 'Convierte solo cuando sabes por qué. Una transformación clara es más fácil de leer que una cadena de conversiones ocultas.', 'const entrada = "42";\nconst numero = Number(entrada);\nconsole.log(numero + 1);', 3, 10),
  (20, 5, 'Comparar estados', 'Elegir operadores que expresen exactamente la condición buscada.', 'Una comparación clara evita sorpresas. Prefiere igualdad estricta y escribe la condición como una frase que puedas leer en voz alta.', 'const edad = 18;\nconst puedeEntrar = edad >= 18;', 1, 10),
  (21, 5, 'Rutas alternativas', 'Diseñar respuestas diferentes sin duplicar la lógica principal.', 'if, else if y else forman un mapa de decisiones. Ordena primero los casos más específicos y deja un camino de respaldo.', 'if (nivel === "inicial") {\n  mostrarRuta();\n} else {\n  mostrarDesafio();\n}', 2, 10),
  (22, 5, 'Validar antes de actuar', 'Comprobar datos antes de ejecutar una acción importante.', 'Validar temprano protege la experiencia: explica qué falta y conserva la información que la persona ya ingresó.', 'if (!correo.includes("@")) {\n  mostrarError("Revisa tu correo");\n}', 3, 10),
  (23, 6, 'Contadores con intención', 'Construir un bucle que avance y termine de forma visible.', 'Un contador necesita inicio, condición y cambio. Si una de las tres piezas falla, el bucle puede repetir demasiado o no ejecutarse.', 'for (let intento = 1; intento <= 3; intento++) {\n  probar(intento);\n}', 1, 10),
  (24, 6, 'Recorrer colecciones', 'Visitar cada elemento de una colección sin perder el contexto.', 'Usa la herramienta que mejor explique la tarea: for…of para leer, map para transformar y filter para seleccionar.', 'for (const reto of retos) {\n  mostrar(reto);\n}', 2, 10),
  (25, 6, 'Detener y continuar', 'Controlar un recorrido cuando aparece una condición especial.', 'break termina el recorrido y continue salta a la siguiente vuelta. Úsalos para expresar una regla, no para esconder una lógica difícil.', 'for (const valor of valores) {\n  if (valor < 0) continue;\n  sumar(valor);\n}', 3, 10),
  (26, 7, 'Parámetros útiles', 'Diseñar funciones que reciban solo los datos que necesitan.', 'Un parámetro hace explícita la entrada de una función. Si una función necesita demasiados datos, quizá convenga dividirla.', 'function saludar(nombre) {\n  return `Hola, ${nombre}`;\n}', 1, 10),
  (27, 7, 'Devolver resultados', 'Usar return para convertir una operación en un valor reutilizable.', 'Una función puede hacer algo y además producir un resultado. Devuelve datos para que otra pieza decida cómo mostrarlos.', 'function duplicar(numero) {\n  return numero * 2;\n}', 2, 10),
  (28, 7, 'Componer ideas', 'Combinar funciones pequeñas para resolver una tarea mayor.', 'La composición reduce el tamaño mental del problema: cada función tiene una responsabilidad y la siguiente recibe un resultado claro.', 'const limpio = limpiar(texto);\nconst resumen = resumir(limpio);\nmostrar(resumen);', 3, 10),
  (29, 8, 'Leer una colección', 'Crear arreglos y acceder a sus valores por posición.', 'Los arreglos agrupan valores relacionados. Recuerda que el primer índice es 0 y que length te dice cuántos elementos hay.', 'const rutas = ["JS", "HTML", "CSS"];\nconsole.log(rutas[0]);', 1, 10),
  (30, 8, 'Transformar y filtrar', 'Usar métodos de arreglo para expresar transformaciones sin bucles innecesarios.', 'map crea una nueva colección transformada y filter conserva los elementos que cumplen una condición.', 'const cortas = rutas.filter((ruta) => ruta.length <= 3);', 2, 10),
  (31, 8, 'Proyecto: colección de retos', 'Combinar arreglos, funciones y decisiones en una vista pequeña.', 'Una colección útil tiene datos claros, una transformación y un estado vacío pensado. Diseña primero el recorrido de la información.', 'const pendientes = retos.filter((reto) => !reto.completado);\nmostrar(pendientes);', 3, 10)
ON DUPLICATE KEY UPDATE title = VALUES(title), objective = VALUES(objective), content = VALUES(content), example_code = VALUES(example_code), position = VALUES(position), estimated_minutes = VALUES(estimated_minutes);
