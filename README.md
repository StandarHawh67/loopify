# Looply

Looply es una red social full-stack construida con Next.js, Prisma y Tailwind CSS. Mezcla un feed visual estilo Instagram con interacciones rápidas tipo Twitter/X, manteniendo una UI oscura, minimalista y responsive.

## Stack

- Next.js App Router + React + TypeScript
- Prisma ORM
- PostgreSQL (recomendado para local y producción/Vercel)
- JWT en cookie `httpOnly` para autenticación
- Tailwind CSS para estilos
- Subida de imágenes a almacenamiento local en `public/uploads`

## Funcionalidades incluidas

- Registro, login y logout
- Perfil de usuario con avatar, bio y edición
- Feed cronológico con carga infinita
- Publicaciones con texto e imagen
- Likes y comentarios
- Follow / unfollow entre usuarios
- Búsqueda de usuarios por username
- Notificaciones de follows, likes y comentarios
- Seed de datos demo

## Puesta en marcha

1. Instala dependencias:

```bash
npm install
```

2. Crea tu archivo de entorno a partir de `.env.example`.

3. Crea el esquema en tu base de datos:

```bash
npm run db:push
```

Si estás en un entorno Windows donde `prisma db push` falla al crear SQLite, usa este fallback:

```bash
npm run db:init
```

4. Carga datos demo opcionales:

```bash
npm run db:seed
```

5. Arranca el entorno de desarrollo:

```bash
npm run dev
```

La app quedará disponible en `http://localhost:3000`.

## Variables de entorno

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Usuarios demo

Después de ejecutar `npm run db:seed`, puedes entrar con cualquiera de estas cuentas:

- `nova@looply.dev` / `looply123`
- `atlas@looply.dev` / `looply123`
- `sol@looply.dev` / `looply123`

## Scripts útiles

- `npm run dev` inicia el entorno local
- `npm run build` genera una build de producción (incluye `prisma db push`)
- `npm run start` levanta la build compilada
- `npm run db:push` sincroniza el esquema Prisma con PostgreSQL
- `npm run db:init` conserva el fallback histórico de SQLite para local
- `npm run db:seed` carga datos demo
- `npm run prisma:generate` regenera el cliente Prisma

## Estructura

```text
app/
  (auth)/              login y registro
  (app)/               feed, búsqueda, perfil, ajustes, notificaciones
  api/                 rutas backend
components/
  auth/                formularios de acceso
  feed/                composer, cards y comentarios
  layout/              shell, sidebar y navegación móvil
  profile/             perfil, búsqueda y notificaciones
lib/
  auth.ts              JWT, cookies y sesión
  queries.ts           consultas reutilizables de Prisma
  notifications.ts     creación y lectura de notificaciones
  upload.ts            subida local de imágenes
prisma/
  schema.prisma
  seed.ts
```

## Notas de despliegue

- En local, las imágenes se guardan en `public/uploads`.
- Para producción real en Vercel conviene sustituir la subida local por Cloudinary o S3.
- Configura `DATABASE_URL` de PostgreSQL en Vercel para evitar errores 500 en rutas API.

### Vercel (monorepo)

La app Next.js vive en `looply/`. Si el **Root Directory** del proyecto en Vercel es la raíz del repositorio (por ejemplo `./`), el build genera `looply/.next`, no `.next` en la raíz. En ese caso el repositorio incluye `vercel.json` en la raíz con `outputDirectory` apuntando a `looply/.next`.

Alternativa recomendada: en Vercel, **Settings → General → Root Directory = `looply`** (sin `./`). Así el directorio de salida por defecto es el `.next` correcto y no hace falta tocar el Output Directory en el panel. No actives override de "Output Directory" salvo que sepas qué ruta necesitas.

## Verificación recomendada

Después de instalar dependencias:

```bash
npm run build
```

Eso valida Prisma, genera el cliente y compila la aplicación completa.
