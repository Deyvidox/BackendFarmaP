# 🏥 FarmaPatria - Instrucciones de Setup

## Pasos para configurar en la otra PC (con PostgreSQL)

### Paso 1: Crear la base de datos
Abre una terminal/CMD y ejecuta:
```bash
psql -U postgres
```
Dentro de psql:
```sql
CREATE DATABASE farmapatria;
\q
```

### Paso 2: Crear las tablas
```bash
psql -U postgres -d farmapatria -f FarmaPatria.sql
```

### Paso 3: Configurar el .env
Abre el archivo `.env` en la carpeta `BackendFarmaP` y ajusta si es necesario:
```
USER=postgres
HOST=localhost
DATABASE=farmapatria
PASSWORD=tu_password_de_postgres
PORT_DB=5432
PORT=4000
SECRET=FarmaPatria_JWT_Secret_2026_S3cur3!
```
> ⚠️ Cambia `PASSWORD` por la contraseña que configuraste en PostgreSQL.

### Paso 4: Instalar dependencias (si no están)
```bash
cd BackendFarmaP
npm install
```

### Paso 5: Ejecutar el seed automático
```bash
node setup-db.js
```
Esto creará:
- ✅ Tablas (si no existen)
- ✅ Columnas adicionales necesarias (UsuContrasena, RolPermisos)
- ✅ Roles: Administrador, Farmacéutico, Operador
- ✅ 3 Usuarios con contraseña `Admin123`
- ✅ 5 Comunidades de Caracas
- ✅ 3 Laboratorios
- ✅ 6 Formas farmacéuticas
- ✅ 6 Categorías de medicamentos
- ✅ 5 Enfermedades
- ✅ 5 Beneficiarios
- ✅ 5 Medicamentos

### Paso 6: Iniciar el backend
```bash
node index.js
```
Deberías ver:
```
✅ Conexión a PostgreSQL/Supabase establecida
🚀 Servidor FarmaPatria corriendo en http://localhost:4000
```

### Paso 7: Iniciar el frontend (en otra terminal)
```bash
cd FrontendFarmaP
npm install
npm start
```
Abre: http://localhost:3000

---

## Credenciales de Login
| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@farmapatria.com | Admin123 |
| Farmacia | farmacia@farmapatria.com | Admin123 |
| Operador | operador@farmapatria.com | Admin123 |

---

## Solución de problemas

### "Cannot find package 'express'"
→ Ejecuta `npm install` en la carpeta BackendFarmaP

### "Error de conexión a PostgreSQL"
→ Verifica que PostgreSQL esté corriendo:
```bash
pg_isready
```
→ Verifica las credenciales en `.env`

### "relation does not exist"
→ Ejecuta primero el schema: `psql -U postgres -d farmapatria -f FarmaPatria.sql`
→ Luego el seed: `node setup-db.js`
