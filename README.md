# SkillVerse

SkillVerse es una primera versión funcional de una plataforma de microaprendizaje gamificado para programación. Está construida con HTML, CSS y JavaScript moderno en el navegador, Node.js + Express en el servidor y MySQL como almacenamiento persistente.

## Qué está implementado

- Página de inicio responsive con navegación móvil funcional.
- Rutas reales para cursos, lecciones, laboratorio, retos, progreso, clasificación, perfil, precios y administración.
- Registro, inicio de sesión y cierre de sesión con contraseñas protegidas con `bcryptjs`.
- Sesiones con cookie `HttpOnly`, `SameSite=Lax`, límite de intentos en autenticación y protección CSRF para mutaciones autenticadas.
- Ruta inicial de lógica de programación con 10 lecciones y 11 ejercicios en español.
- Ejercicios de opción múltiple y validación estructural de código. El servidor no ejecuta JavaScript enviado por estudiantes.
- XP, niveles, racha, progreso por lección, insignias y clasificación.
- Panel admin protegido en backend para consultar, crear, editar y eliminar cursos sin lecciones, crear lecciones y editar ejercicios.
- Esquema MySQL con claves foráneas, índices, restricciones y datos iniciales.
- Pruebas automatizadas de los flujos críticos en `tests/api.test.js`.

El archivo original del logo no estaba incluido en los adjuntos disponibles. La interfaz deja el espacio preparado y lo documenta en `public/images/README.md`; no se afirma que el logo original esté integrado.

## Requisitos

1. Instala Node.js LTS desde [nodejs.org](https://nodejs.org/). La versión mínima del proyecto es Node 20.
2. Instala MySQL 8 o compatible.
3. Abre una terminal dentro de la carpeta del proyecto.

Comprueba las instalaciones:

```bash
node --version
npm --version
mysql --version
```

## Instalación rápida en modo demo

El modo demo permite conocer la interfaz sin instalar MySQL. Los datos viven en memoria y se pierden cuando se detiene el servidor; no es un modo de producción.

```bash
npm install
copy .env.example .env
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). En macOS o Linux, usa `cp .env.example .env` en lugar de `copy`.

## Instalación con MySQL

1. Crea la base de datos y su contenido inicial:

   ```bash
   mysql -u root -p < database/schema.sql
   ```

2. Crea un usuario MySQL específico para la aplicación. No uses `root` en producción. Por ejemplo, dentro del cliente MySQL:

   ```sql
   CREATE USER 'skillverse_app'@'localhost' IDENTIFIED BY 'elige-una-clave-larga';
   GRANT SELECT, INSERT, UPDATE, DELETE ON skillverse.* TO 'skillverse_app'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. Edita `.env` y cambia estas variables:

   ```env
   DB_MODE=mysql
   MYSQL_HOST=127.0.0.1
   MYSQL_PORT=3306
   MYSQL_DATABASE=skillverse
   MYSQL_USER=skillverse_app
   MYSQL_PASSWORD=elige-una-clave-larga
   SESSION_SECRET=una-clave-aleatoria-muy-larga
   ```

4. Inicia el servidor:

   ```bash
   npm start
   ```

5. Abre [http://localhost:3000](http://localhost:3000).

## Crear el administrador inicial

No hay una contraseña de administrador fija en el código. Con `DB_MODE=mysql` configurado, ejecuta:

```bash
npm run admin
```

El script solicita usuario, correo y contraseña sin guardarlos en el repositorio. Después podrás entrar y abrir `#admin`.

## Probar el proyecto

Ejecuta:

```bash
npm test
```

Las pruebas levantan la API en modo demo y comprueban cursos públicos, registro, hash de contraseña, acceso autenticado, validación de código, XP y protección contra completar una lección dos veces.

## Estructura principal

```text
public/
  index.html
  css/styles.css
  js/api.js
  js/app.js
  images/README.md
src/
  server.js
  config/database.js
  data/demo-store.js
  middleware/auth.js
  repositories/platform.repository.js
  routes/
database/schema.sql
scripts/create-admin.js
tests/api.test.js
```

`src/repositories/platform.repository.js` mantiene separada la lógica de negocio y ofrece una implementación demo y otra MySQL. En modo MySQL, las sesiones se guardan en la tabla que crea `express-mysql-session`; en modo demo se usa memoria únicamente para la vista previa local. En producción usa HTTPS y un `SESSION_SECRET` único.

## Contenido y seguridad

El laboratorio comprueba patrones permitidos y pruebas esperadas; no evalúa código arbitrario con `eval`, `vm` ni en el proceso Node.js. La experiencia se calcula en el servidor y los endpoints privados no aceptan un `user_id` enviado por el navegador.

Antes de publicar, sustituye el contacto de ejemplo, los textos legales, el logo pendiente y configura un proveedor de pagos real. El botón Premium es informativo y no cobra.
