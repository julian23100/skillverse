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
  (8, 'Arreglos', 'Organiza colecciones de datos y recórrelas con confianza.', 'Intermedio', 60, TRUE),
  (9, 'Python desde cero', 'Automatiza tareas y expresa ideas con una sintaxis clara.', 'Inicial', 60, FALSE),
  (10, 'Java esencial', 'Construye programas robustos con tipos, clases y métodos.', 'Inicial', 65, FALSE),
  (11, 'C fundamental', 'Comprende memoria, tipos y control de bajo nivel.', 'Intermedio', 70, FALSE),
  (12, 'C++ práctico', 'Combina rendimiento, abstracciones y estructuras modernas.', 'Intermedio', 70, FALSE),
  (13, 'C# y .NET', 'Crea aplicaciones con clases, colecciones y herramientas .NET.', 'Intermedio', 65, FALSE),
  (14, 'PHP para web', 'Genera páginas dinámicas y trabaja con datos del servidor.', 'Inicial', 55, FALSE),
  (15, 'Ruby expresivo', 'Resuelve problemas con una sintaxis legible y flexible.', 'Inicial', 55, FALSE),
  (16, 'Go concurrente', 'Aprende servicios rápidos con simplicidad y concurrencia.', 'Intermedio', 65, FALSE),
  (17, 'Rust seguro', 'Explora rendimiento y seguridad de memoria desde el diseño.', 'Avanzado', 80, FALSE),
  (18, 'Kotlin moderno', 'Escribe código conciso para backend y Android.', 'Intermedio', 60, FALSE),
  (19, 'Swift para apps', 'Modela datos y crea lógica para el ecosistema Apple.', 'Intermedio', 60, FALSE),
  (20, 'TypeScript con tipos', 'Haz proyectos JavaScript más claros y mantenibles.', 'Intermedio', 60, FALSE),
  (21, 'SQL y datos', 'Consulta, filtra y relaciona información con precisión.', 'Inicial', 50, FALSE),
  (22, 'R para análisis', 'Convierte datos en preguntas, gráficos y conclusiones.', 'Intermedio', 60, FALSE),
  (23, 'Dart y Flutter', 'Prepara la lógica que alimenta experiencias multiplataforma.', 'Intermedio', 60, FALSE)
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
  (10, 1, 'Primer proyecto práctico', 'Combinar variables, condicionales y funciones en una idea pequeña.', 'Tu primer proyecto no tiene que ser enorme. Un generador de mensajes, una lista de tareas o un contador ya te enseñan a conectar piezas. Empieza pequeño y mejora una decisión a la vez.', 'function mensaje(nombre) {\n  return `Hola, ${nombre}`;\n}', 10, 10),
  (11, 2, 'Sintaxis que da vida', 'Reconocer cómo una instrucción cambia el estado de una página.', 'JavaScript conecta datos, decisiones y acciones. Empieza leyendo de arriba abajo y nombra cada pieza con claridad.', 'const mensaje = "Hola";\nconsole.log(mensaje);', 1, 10),
  (12, 2, 'Eventos y respuestas', 'Relacionar una acción de la persona con una respuesta de la interfaz.', 'Un evento representa algo que ocurre: un clic, una tecla o un cambio. Escucha el evento y actualiza solo lo necesario.', 'const boton = document.querySelector("button");\nboton.addEventListener("click", () => console.log("Listo"));', 2, 10),
  (13, 2, 'Datos que viajan', 'Usar funciones pequeñas para transformar datos antes de mostrarlos.', 'Separar la transformación de la presentación hace que el código sea más fácil de probar y reutilizar.', 'const nombres = ["Ada", "Linus"];\nconst saludos = nombres.map((nombre) => `Hola, ${nombre}`);', 3, 10),
  (14, 3, 'Estructura semántica', 'Organizar una página con elementos que explican su propósito.', 'HTML no es solo apariencia: encabezados, navegación, secciones y botones ayudan a las personas y a las tecnologías de asistencia.', '<main>\n  <h1>Mi proyecto</h1>\n  <section>Contenido</section>\n</main>', 1, 10),
  (15, 3, 'Composición con CSS', 'Aplicar espacio, contraste y jerarquía visual a una interfaz.', 'Primero define la relación entre bloques; después ajusta colores y detalles. Grid y flexbox te ayudan a construir una composición estable.', '.card {\n  display: grid;\n  gap: 1rem;\n  padding: 1.5rem;\n}', 2, 10),
  (16, 3, 'Responsive y accesibilidad', 'Crear una interfaz que funcione en distintos tamaños y formas de interacción.', 'Una buena interfaz se adapta, conserva el foco visible y usa texto que describe la acción. Prueba con teclado antes de darla por terminada.', '@media (max-width: 700px) { .layout { grid-template-columns: 1fr; } }', 3, 10),
  (17, 4, 'Nombrar para entender', 'Declarar variables con nombres que comuniquen su intención.', 'Una variable no es solo un contenedor: es una decisión de diseño. Usa nombres que expliquen qué representa el dato.', 'const minutosDeEstudio = 10;\nlet progreso = 0;', 1, 10),
  (18, 4, 'Tipos en acción', 'Distinguir texto, números y booleanos para evitar mezclas inesperadas.', 'Conocer el tipo de cada valor te permite elegir operaciones seguras y detectar errores antes de que crezcan.', 'const titulo = "SkillVerse";\nconst lecciones = 3;\nconst publicado = true;', 2, 10),
  (19, 4, 'Transformar datos', 'Convertir y combinar valores con una intención explícita.', 'Convierte solo cuando sabes por qué. Una transformación clara es más fácil de leer que una cadena de conversiones ocultas.', 'const entrada = "42";\nconst numero = Number(entrada);\nconsole.log(numero + 1);', 3, 10),
  (20, 5, 'Comparar estados', 'Elegir operadores que expresen exactamente la condición buscada.', 'Una comparación clara evita sorpresas. Prefiere igualdad estricta y escribe la condición como una frase que puedas leer en voz alta.', 'const edad = 18;\nconst puedeEntrar = edad >= 18;', 1, 10),
  (21, 5, 'Rutas alternativas', 'Diseñar respuestas diferentes sin duplicar la lógica principal.', 'if, else if y else forman un mapa de decisiones. Ordena primero los casos más específicos y deja un camino de respaldo.', 'if (nivel === "inicial") { mostrarRuta(); } else { mostrarDesafio(); }', 2, 10),
  (22, 5, 'Validar antes de actuar', 'Comprobar datos antes de ejecutar una acción importante.', 'Validar temprano protege la experiencia: explica qué falta y conserva la información que la persona ya ingresó.', 'if (!correo.includes("@")) { mostrarError("Revisa tu correo"); }', 3, 10),
  (23, 6, 'Contadores con intención', 'Construir un bucle que avance y termine de forma visible.', 'Un contador necesita inicio, condición y cambio. Si una de las tres piezas falla, el bucle puede repetir demasiado o no ejecutarse.', 'for (let intento = 1; intento <= 3; intento++) { probar(intento); }', 1, 10),
  (24, 6, 'Recorrer colecciones', 'Visitar cada elemento de una colección sin perder el contexto.', 'Usa la herramienta que mejor explique la tarea: for…of para leer, map para transformar y filter para seleccionar.', 'for (const reto of retos) { mostrar(reto); }', 2, 10),
  (25, 6, 'Detener y continuar', 'Controlar un recorrido cuando aparece una condición especial.', 'break termina el recorrido y continue salta a la siguiente vuelta. Úsalos para expresar una regla.', 'for (const valor of valores) { if (valor < 0) continue; sumar(valor); }', 3, 10),
  (26, 7, 'Parámetros útiles', 'Diseñar funciones que reciban solo los datos que necesitan.', 'Un parámetro hace explícita la entrada de una función. Si una función necesita demasiados datos, quizá convenga dividirla.', 'function saludar(nombre) { return `Hola, ${nombre}`; }', 1, 10),
  (27, 7, 'Devolver resultados', 'Usar return para convertir una operación en un valor reutilizable.', 'Una función puede hacer algo y además producir un resultado. Devuelve datos para que otra pieza decida cómo mostrarlos.', 'function duplicar(numero) { return numero * 2; }', 2, 10),
  (28, 7, 'Componer ideas', 'Combinar funciones pequeñas para resolver una tarea mayor.', 'La composición reduce el tamaño mental del problema: cada función tiene una responsabilidad y la siguiente recibe un resultado claro.', 'const limpio = limpiar(texto);\nconst resumen = resumir(limpio);', 3, 10),
  (29, 8, 'Leer una colección', 'Crear arreglos y acceder a sus valores por posición.', 'Los arreglos agrupan valores relacionados. Recuerda que el primer índice es 0 y que length te dice cuántos elementos hay.', 'const rutas = ["JS", "HTML", "CSS"];\nconsole.log(rutas[0]);', 1, 10),
  (30, 8, 'Transformar y filtrar', 'Usar métodos de arreglo para expresar transformaciones sin bucles innecesarios.', 'map crea una nueva colección transformada y filter conserva los elementos que cumplen una condición.', 'const cortas = rutas.filter((ruta) => ruta.length <= 3);', 2, 10),
  (31, 8, 'Proyecto: colección de retos', 'Combinar arreglos, funciones y decisiones en una vista pequeña.', 'Una colección útil tiene datos claros, una transformación y un estado vacío pensado.', 'const pendientes = retos.filter((reto) => !reto.completado);', 3, 10),
  (32, 9, 'Primer programa en Python', 'Reconocer la estructura mínima de un programa escrito en Python.', 'Python tiene una sintaxis clara para recibir datos, transformarlos y producir un resultado.', 'print("Hola, SkillVerse")', 1, 10),
  (33, 9, 'Datos y decisiones en Python', 'Usar variables y una decisión para expresar una regla en Python.', 'Las variables guardan información y las condiciones permiten elegir un camino.', 'edad = 18\nif edad >= 18:\n    print("Puede entrar")', 2, 10),
  (34, 9, 'Pequeño proyecto con Python', 'Combinar una función y una colección para resolver una tarea concreta.', 'Un proyecto pequeño conecta una función, una colección y un resultado verificable.', 'def total(numeros):\n    return sum(numeros)', 3, 10),
  (35, 10, 'Primer programa en Java', 'Reconocer la estructura mínima de un programa escrito en Java.', 'Java organiza el punto de entrada dentro de una clase y exige declarar la intención del programa.', 'class Main {\n  public static void main(String[] args) {\n    System.out.println("Hola");\n  }\n}', 1, 10),
  (36, 10, 'Datos y decisiones en Java', 'Usar variables y una decisión para expresar una regla en Java.', 'Las variables tipadas y las condiciones hacen explícito qué datos acepta el programa.', 'int edad = 18;\nif (edad >= 18) { System.out.println("Puede entrar"); }', 2, 10),
  (37, 10, 'Pequeño proyecto con Java', 'Combinar un método y un arreglo para resolver una tarea concreta.', 'Un método con una responsabilidad clara es una unidad fácil de probar y reutilizar.', 'static int total(int[] numeros) { return numeros[0] + numeros[1]; }', 3, 10),
  (38, 11, 'Primer programa en C', 'Reconocer la estructura mínima de un programa escrito en C.', 'C expone con claridad la función principal y la relación entre código y memoria.', '#include <stdio.h>\nint main(void) { return 0; }', 1, 10),
  (39, 11, 'Datos y decisiones en C', 'Usar variables y una decisión para expresar una regla en C.', 'En C debes elegir tipos y controlar con cuidado el flujo del programa.', 'int edad = 18;\nif (edad >= 18) { printf("Puede entrar"); }', 2, 10),
  (40, 11, 'Pequeño proyecto con C', 'Combinar una función y un arreglo para resolver una tarea concreta.', 'Los índices y los límites son esenciales cuando recorres memoria en C.', 'int total(int valores[], int cantidad) { return valores[0] + valores[1]; }', 3, 10),
  (41, 12, 'Primer programa en C++', 'Reconocer la estructura mínima de un programa escrito en C++.', 'C++ añade abstracciones sin perder el control sobre el rendimiento.', '#include <iostream>\nint main() { std::cout << "Hola"; }', 1, 10),
  (42, 12, 'Datos y decisiones en C++', 'Usar variables y una decisión para expresar una regla en C++.', 'Las condiciones y los tipos expresan reglas que luego pueden convertirse en clases o funciones.', 'int edad = 18;\nif (edad >= 18) { std::cout << "Puede entrar"; }', 2, 10),
  (43, 12, 'Pequeño proyecto con C++', 'Combinar una función y una colección para resolver una tarea concreta.', 'Las colecciones de la biblioteca estándar ayudan a escribir soluciones seguras y expresivas.', 'int total(const std::vector<int>& valores) { return valores[0] + valores[1]; }', 3, 10),
  (44, 13, 'Primer programa en C#', 'Reconocer la estructura mínima de un programa escrito en C#.', 'C# combina tipos, clases y una biblioteca amplia para crear aplicaciones .NET.', 'class Program { static void Main() { System.Console.WriteLine("Hola"); } }', 1, 10),
  (45, 13, 'Datos y decisiones en C#', 'Usar variables y una decisión para expresar una regla en C#.', 'Una condición clara ayuda a separar la validación de la acción principal.', 'int edad = 18;\nif (edad >= 18) { System.Console.WriteLine("Puede entrar"); }', 2, 10),
  (46, 13, 'Pequeño proyecto con C#', 'Combinar un método y una colección para resolver una tarea concreta.', 'Los métodos y las colecciones de .NET permiten construir piezas reutilizables.', 'int Total(int[] valores) => valores.Sum();', 3, 10),
  (47, 14, 'Primer programa en PHP', 'Reconocer la estructura mínima de un programa escrito en PHP.', 'PHP genera contenido en el servidor y puede integrarse directamente con una página web.', '<?php echo "Hola, SkillVerse"; ?>', 1, 10),
  (48, 14, 'Datos y decisiones en PHP', 'Usar variables y una decisión para expresar una regla en PHP.', 'Valida la entrada antes de usarla para que cada respuesta del servidor sea predecible.', '$edad = 18;\nif ($edad >= 18) { echo "Puede entrar"; }', 2, 10),
  (49, 14, 'Pequeño proyecto con PHP', 'Combinar una función y un arreglo para resolver una tarea concreta.', 'Una función pequeña hace más fácil probar la lógica de una página dinámica.', 'function total(array $valores): int { return array_sum($valores); }', 3, 10),
  (50, 15, 'Primer programa en Ruby', 'Reconocer la estructura mínima de un programa escrito en Ruby.', 'Ruby favorece una sintaxis legible para expresar la intención del programa.', 'puts "Hola, SkillVerse"', 1, 10),
  (51, 15, 'Datos y decisiones en Ruby', 'Usar variables y una decisión para expresar una regla en Ruby.', 'Las condiciones pueden leerse casi como una frase y ayudan a comunicar la regla.', 'edad = 18\nputs "Puede entrar" if edad >= 18', 2, 10),
  (52, 15, 'Pequeño proyecto con Ruby', 'Combinar un método y una colección para resolver una tarea concreta.', 'Los métodos de colección de Ruby permiten escribir transformaciones compactas y claras.', 'def total(valores)\n  valores.sum\nend', 3, 10),
  (53, 16, 'Primer programa en Go', 'Reconocer la estructura mínima de un programa escrito en Go.', 'Go comienza en package main y usa una función main para ejecutar el programa.', 'package main\nimport "fmt"\nfunc main() { fmt.Println("Hola") }', 1, 10),
  (54, 16, 'Datos y decisiones en Go', 'Usar variables y una decisión para expresar una regla en Go.', 'La simplicidad de Go funciona mejor cuando los datos y los errores son explícitos.', 'edad := 18\nif edad >= 18 { fmt.Println("Puede entrar") }', 2, 10),
  (55, 16, 'Pequeño proyecto con Go', 'Combinar una función y un slice para resolver una tarea concreta.', 'Los slices y los bucles permiten procesar colecciones sin esconder la operación.', 'func total(valores []int) int { suma := 0; for _, valor := range valores { suma += valor }; return suma }', 3, 10),
  (56, 17, 'Primer programa en Rust', 'Reconocer la estructura mínima de un programa escrito en Rust.', 'Rust busca que la seguridad de memoria forme parte del diseño antes de ejecutar el programa.', 'fn main() { println!("Hola, SkillVerse"); }', 1, 10),
  (57, 17, 'Datos y decisiones en Rust', 'Usar variables y una decisión para expresar una regla en Rust.', 'La inmutabilidad por defecto invita a cambiar datos solo cuando existe una razón clara.', 'let edad = 18;\nif edad >= 18 { println!("Puede entrar"); }', 2, 10),
  (58, 17, 'Pequeño proyecto con Rust', 'Combinar una función y un slice para resolver una tarea concreta.', 'Los tipos y las referencias describen cómo se comparte una colección de forma segura.', 'fn total(valores: &[i32]) -> i32 { valores.iter().sum() }', 3, 10),
  (59, 18, 'Primer programa en Kotlin', 'Reconocer la estructura mínima de un programa escrito en Kotlin.', 'Kotlin reduce el código repetitivo sin renunciar a tipos y herramientas modernas.', 'fun main() { println("Hola, SkillVerse") }', 1, 10),
  (60, 18, 'Datos y decisiones en Kotlin', 'Usar variables y una decisión para expresar una regla en Kotlin.', 'Usa val cuando el dato no deba cambiar y expresa la condición con una frase corta.', 'val edad = 18\nif (edad >= 18) println("Puede entrar")', 2, 10),
  (61, 18, 'Pequeño proyecto con Kotlin', 'Combinar una función y una lista para resolver una tarea concreta.', 'Las funciones de extensión y las colecciones hacen que el recorrido sea fácil de leer.', 'fun total(valores: List<Int>) = valores.sum()', 3, 10),
  (62, 19, 'Primer programa en Swift', 'Reconocer la estructura mínima de un programa escrito en Swift.', 'Swift combina inferencia de tipos con herramientas para crear aplicaciones seguras.', 'import Foundation\nprint("Hola, SkillVerse")', 1, 10),
  (63, 19, 'Datos y decisiones en Swift', 'Usar variables y una decisión para expresar una regla en Swift.', 'La claridad de una condición ayuda a mantener la lógica de una app predecible.', 'let edad = 18\nif edad >= 18 { print("Puede entrar") }', 2, 10),
  (64, 19, 'Pequeño proyecto con Swift', 'Combinar una función y un arreglo para resolver una tarea concreta.', 'Los tipos y las funciones de orden superior simplifican operaciones sobre colecciones.', 'func total(_ valores: [Int]) -> Int { valores.reduce(0, +) }', 3, 10),
  (65, 20, 'Primer programa en TypeScript', 'Reconocer cómo TypeScript añade tipos a JavaScript.', 'Los tipos documentan las formas esperadas de los datos y ayudan a detectar errores antes.', 'const mensaje: string = "Hola, SkillVerse";\nconsole.log(mensaje);', 1, 10),
  (66, 20, 'Datos y decisiones en TypeScript', 'Usar un tipo y una condición para expresar una regla en TypeScript.', 'Una anotación simple hace más explícita la intención de una variable.', 'const edad: number = 18;\nif (edad >= 18) console.log("Puede entrar");', 2, 10),
  (67, 20, 'Pequeño proyecto con TypeScript', 'Combinar una función tipada y una colección para resolver una tarea.', 'Las firmas de función ayudan a que cada pieza del proyecto tenga un contrato claro.', 'function total(valores: number[]): number { return valores.reduce((a, b) => a + b, 0); }', 3, 10),
  (68, 21, 'Primer programa en SQL', 'Reconocer una consulta que lee datos de una tabla.', 'SQL describe qué información necesitas y deja que el motor decida cómo encontrarla.', 'SELECT nombre FROM estudiantes;', 1, 10),
  (69, 21, 'Datos y decisiones en SQL', 'Filtrar registros con una condición clara en SQL.', 'WHERE convierte una pregunta en un filtro que reduce el conjunto de resultados.', 'SELECT nombre FROM estudiantes WHERE edad >= 18;', 2, 10),
  (70, 21, 'Pequeño proyecto con SQL', 'Combinar una función de agregado y una consulta para resumir datos.', 'Las funciones de agregado convierten muchas filas en una respuesta útil.', 'SELECT SUM(valor) AS total FROM registros;', 3, 10),
  (71, 22, 'Primer programa en R', 'Reconocer cómo crear y mostrar un valor en R.', 'R está diseñado para explorar datos y expresar operaciones de análisis de forma directa.', 'mensaje <- "Hola, SkillVerse"\nprint(mensaje)', 1, 10),
  (72, 22, 'Datos y decisiones en R', 'Usar una variable y una condición para expresar una regla en R.', 'Una condición permite documentar qué debe ocurrir cuando un dato supera un umbral.', 'edad <- 18\nif (edad >= 18) print("Puede entrar")', 2, 10),
  (73, 22, 'Pequeño proyecto con R', 'Combinar una función y un vector para resolver una tarea.', 'Los vectores y las funciones hacen posible resumir datos con pocas líneas claras.', 'total <- function(valores) sum(valores)\ntotal(c(2, 3))', 3, 10),
  (74, 23, 'Primer programa en Dart', 'Reconocer la estructura mínima de un programa escrito en Dart.', 'Dart prepara la lógica de aplicaciones que pueden ejecutarse en más de una plataforma.', 'void main() { print("Hola, SkillVerse"); }', 1, 10),
  (75, 23, 'Datos y decisiones en Dart', 'Usar variables y una decisión para expresar una regla en Dart.', 'Las variables finales y las condiciones hacen que el estado de la interfaz sea más fácil de seguir.', 'final edad = 18;\nif (edad >= 18) print("Puede entrar");', 2, 10),
  (76, 23, 'Pequeño proyecto con Dart', 'Combinar una función y una lista para resolver una tarea.', 'Las listas y las funciones permiten preparar la lógica antes de conectarla con Flutter.', 'int total(List<int> valores) => valores.reduce((a, b) => a + b);', 3, 10)
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
  (11, 3, 'Tipos en contexto', '¿Qué tipo de dato representa el texto "Alex"?', 'choice', 'Inicial', 10, JSON_OBJECT('answer', 'texto'), 'Está escrito entre comillas.', 'Un texto entre comillas es una cadena (string).'),
  (12, 34, 'Escribe una base de Python', 'Escribe una solución breve de Python que incluya su estructura principal.', 'code', 'Inicial', 20, JSON_OBJECT('kind', 'tokens', 'tokens', JSON_ARRAY('def', 'return')), 'Incluye def y return.', 'La estructura básica de Python está presente.'),
  (13, 37, 'Escribe una base de Java', 'Escribe una solución breve de Java que incluya su estructura principal.', 'code', 'Inicial', 20, JSON_OBJECT('kind', 'tokens', 'tokens', JSON_ARRAY('class', 'static void main')), 'Incluye class y static void main.', 'La estructura básica de Java está presente.'),
  (14, 40, 'Escribe una base de C', 'Escribe una solución breve de C que incluya su estructura principal.', 'code', 'Inicial', 20, JSON_OBJECT('kind', 'tokens', 'tokens', JSON_ARRAY('#include', 'int main')), 'Incluye #include e int main.', 'La estructura básica de C está presente.'),
  (15, 43, 'Escribe una base de C++', 'Escribe una solución breve de C++ que incluya su estructura principal.', 'code', 'Inicial', 20, JSON_OBJECT('kind', 'tokens', 'tokens', JSON_ARRAY('#include', 'std::')), 'Incluye #include y std::.', 'La estructura básica de C++ está presente.'),
  (16, 46, 'Escribe una base de C#', 'Escribe una solución breve de C# que incluya su estructura principal.', 'code', 'Inicial', 20, JSON_OBJECT('kind', 'tokens', 'tokens', JSON_ARRAY('class', 'static void main')), 'Incluye class y static void Main.', 'La estructura básica de C# está presente.'),
  (17, 49, 'Escribe una base de PHP', 'Escribe una solución breve de PHP que incluya su estructura principal.', 'code', 'Inicial', 20, JSON_OBJECT('kind', 'tokens', 'tokens', JSON_ARRAY('<?php', 'echo')), 'Incluye <?php y echo.', 'La estructura básica de PHP está presente.'),
  (18, 52, 'Escribe una base de Ruby', 'Escribe una solución breve de Ruby que incluya su estructura principal.', 'code', 'Inicial', 20, JSON_OBJECT('kind', 'tokens', 'tokens', JSON_ARRAY('def', 'end')), 'Incluye def y end.', 'La estructura básica de Ruby está presente.'),
  (19, 55, 'Escribe una base de Go', 'Escribe una solución breve de Go que incluya su estructura principal.', 'code', 'Inicial', 20, JSON_OBJECT('kind', 'tokens', 'tokens', JSON_ARRAY('package main', 'func main')), 'Incluye package main y func main.', 'La estructura básica de Go está presente.'),
  (20, 58, 'Escribe una base de Rust', 'Escribe una solución breve de Rust que incluya su estructura principal.', 'code', 'Inicial', 20, JSON_OBJECT('kind', 'tokens', 'tokens', JSON_ARRAY('fn main', 'println!')), 'Incluye fn main y println!.', 'La estructura básica de Rust está presente.'),
  (21, 61, 'Escribe una base de Kotlin', 'Escribe una solución breve de Kotlin que incluya su estructura principal.', 'code', 'Inicial', 20, JSON_OBJECT('kind', 'tokens', 'tokens', JSON_ARRAY('fun main', 'println')), 'Incluye fun main y println.', 'La estructura básica de Kotlin está presente.'),
  (22, 64, 'Escribe una base de Swift', 'Escribe una solución breve de Swift que incluya su estructura principal.', 'code', 'Inicial', 20, JSON_OBJECT('kind', 'tokens', 'tokens', JSON_ARRAY('print(')), 'Incluye print(.', 'La estructura básica de Swift está presente.'),
  (23, 67, 'Escribe una base de TypeScript', 'Escribe una solución breve de TypeScript que incluya su estructura principal.', 'code', 'Inicial', 20, JSON_OBJECT('kind', 'tokens', 'tokens', JSON_ARRAY(': string', 'const')), 'Incluye : string y const.', 'La estructura básica de TypeScript está presente.'),
  (24, 70, 'Escribe una base de SQL', 'Escribe una solución breve de SQL que incluya su estructura principal.', 'code', 'Inicial', 20, JSON_OBJECT('kind', 'tokens', 'tokens', JSON_ARRAY('select', 'from', 'where')), 'Incluye SELECT, FROM y WHERE.', 'La estructura básica de SQL está presente.'),
  (25, 73, 'Escribe una base de R', 'Escribe una solución breve de R que incluya su estructura principal.', 'code', 'Inicial', 20, JSON_OBJECT('kind', 'tokens', 'tokens', JSON_ARRAY('<-', 'print')), 'Incluye <- y print.', 'La estructura básica de R está presente.'),
  (26, 76, 'Escribe una base de Dart', 'Escribe una solución breve de Dart que incluya su estructura principal.', 'code', 'Inicial', 20, JSON_OBJECT('kind', 'tokens', 'tokens', JSON_ARRAY('void main', 'print')), 'Incluye void main y print.', 'La estructura básica de Dart está presente.')
ON DUPLICATE KEY UPDATE title = VALUES(title), instructions = VALUES(instructions), validation_json = VALUES(validation_json), hint = VALUES(hint), feedback = VALUES(feedback);
