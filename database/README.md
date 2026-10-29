# Base de datos de SkillVerse

El archivo [`schema.sql`](./schema.sql) crea la base `skillverse`, sus tablas, índices y datos iniciales. La aplicación utiliza `utf8mb4` y guarda las fechas en UTC.

## Configuración local

1. Instala MySQL Community Server y confirma que el servicio `MySQL80` esté iniciado.
2. Abre PowerShell en la raíz del proyecto y ejecuta:

```powershell
mysql -u root -p < database/schema.sql
```

3. Copia `.env.example` como `.env` y cambia `DB_MODE=mysql`, el usuario y la contraseña. No subas `.env` a GitHub.
4. Comprueba la conexión:

```powershell
npm run db:check
```

Para una instalación rápida de desarrollo puede mantenerse `DB_MODE=demo`; ese modo no persiste usuarios, progreso ni sesiones cuando se reinicia el servidor.

## Producción

Render necesita una instancia MySQL accesible desde internet o una base compatible administrada. Instalar MySQL en este PC no conecta automáticamente el servicio público: en Render deben configurarse `DB_MODE=mysql`, `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD` y un `SESSION_SECRET` nuevo.
