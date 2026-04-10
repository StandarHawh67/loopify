# Plan de migracion de Looply a Framer

Este plan separa claramente que se migra a Framer (UI/UX) y que se mantiene fuera de Framer (backend y datos) para evitar bloqueos.

## 1) Estado actual del proyecto

- Frontend actual: Next.js App Router + React + TypeScript + Tailwind.
- Backend actual: rutas en `app/api/*` + Prisma + SQLite.
- Auth: JWT en cookie `httpOnly`.
- Funcionalidad principal: feed, posts, likes, comentarios, follow, busqueda, notificaciones, perfil, login/registro.

## 2) Decision clave: arquitectura objetivo

Framer no reemplaza 1:1 el backend de Next.js/Prisma.

Arquitectura recomendada:

- Framer: paginas, componentes visuales, animaciones, branding.
- Backend externo (mantener Looply como API): autenticacion, base de datos, logica de negocio.
- Integracion: Framer consume endpoints REST de Looply.

## 3) Que SI migra a Framer

- Landing/home publica.
- Login y registro (UI y validaciones cliente basicas).
- Feed visual y tarjetas de post.
- Perfil de usuario y vistas de notificaciones.
- Sidebar, navegacion movil, estados vacios, botones y formularios.
- Todo el rebranding (logo, colores, tipografia, assets).

## 4) Que NO migra directamente (se mantiene backend)

- `app/api/*` (auth, feed, posts, users, notifications, upload).
- `prisma/*` (schema, seed, acceso DB).
- Cookies `httpOnly` y manejo seguro de sesion.
- Carga de imagenes en servidor (`/api/upload`).

## 5) Mapeo pantalla a pantalla

- `app/page.tsx` -> Landing en Framer.
- `app/(auth)/login/page.tsx` -> Pagina Login en Framer.
- `app/(auth)/register/page.tsx` -> Pagina Registro en Framer.
- `app/(app)/feed/page.tsx` + `components/feed/*` -> Feed page + Post Card + Composer en Framer.
- `app/(app)/search/page.tsx` -> Search page en Framer.
- `app/(app)/notifications/page.tsx` -> Notifications page en Framer.
- `app/(app)/u/[username]/page.tsx` -> Profile page dinamica en Framer.
- `app/(app)/settings/profile/page.tsx` -> Settings/Profile page en Framer.
- `app/not-found.tsx` -> 404 page en Framer.

## 6) Endpoints backend a conservar para Framer

Base URL sugerida: `https://tu-api.looply.com` (o tu entorno local/publicado).

- Auth:
  - `POST /api/auth/login`
  - `POST /api/auth/register`
  - `POST /api/auth/logout`
  - `GET /api/auth/me`
- Feed y posts:
  - `GET /api/feed?cursor=...`
  - `POST /api/posts`
  - `POST /api/posts/:postId/like`
  - `POST /api/posts/:postId/comments`
- Usuarios:
  - `GET /api/users/me`
  - `GET /api/users/search?q=...`
  - `GET /api/users/:username`
  - `POST /api/users/:username/follow`
- Notificaciones:
  - `GET /api/notifications`
- Upload:
  - `POST /api/upload`

## 7) Fases recomendadas (orden de trabajo)

### Fase 1 - Rebranding y Design System en Framer

- Definir tokens globales: colores, tipografia, radios, sombras, spacing.
- Crear componentes base: Button, Input, Card, Avatar, Badge, Tabs, EmptyState.
- Aplicar nueva marca (logo, iconografia, estilos de copy y microinteracciones).

### Fase 2 - Pantallas estaticas

- Montar Home, 404, estados vacios y skeletons.
- Revisar responsive mobile/tablet/desktop.

### Fase 3 - Auth conectada

- Conectar Login/Register con API real.
- Gestionar estado de sesion con `GET /api/auth/me`.
- Redirecciones segun autenticacion.

### Fase 4 - Feed funcional

- Listar posts desde `GET /api/feed`.
- Publicar post (texto/imagen) con `POST /api/posts` + `POST /api/upload`.
- Likes/comentarios con endpoints existentes.
- Paginacion infinita (cursor-based).

### Fase 5 - Search, Profile y Notifications

- Busqueda de usuarios.
- Perfil propio/ajeno con follow/unfollow.
- Notificaciones y estados de lectura.

### Fase 6 - QA, performance y lanzamiento

- Smoke tests de flujo completo.
- Revision de errores de red, estados loading/error/empty.
- Hardening de CORS/cookies y dominio final.

## 8) Riesgos frecuentes y como evitarlos

- Cookies de sesion no viajan desde Framer por configuracion CORS/cookie.
  - Mitigacion: backend con `credentials` habilitado y politica de cookies correcta.
- Diferencias de estado entre UI Framer y API.
  - Mitigacion: estandarizar contrato de respuestas y errores JSON.
- Upload de imagenes falla por limites o rutas.
  - Mitigacion: validar tamaño/tipo y migrar luego a S3/Cloudinary.

## 9) Checklist minimo para arrancar ahora

- [ ] Congelar branding final (logo, paleta, tipografia).
- [ ] Definir dominio de API y CORS para Framer.
- [ ] Implementar en Framer: Login + Feed read-only primero.
- [ ] Luego habilitar crear post, likes y comentarios.
- [ ] Cerrar con perfil, busqueda y notificaciones.

## 10) Alcance realista

Si buscas velocidad:

- Semana 1: rebranding + auth + feed lectura.
- Semana 2: publicar post + perfil + busqueda.
- Semana 3: notificaciones + QA + deploy.

---

Si quieres, el siguiente paso te lo puedo dejar listo como "Sprint 1 ejecutable":

1) lista de componentes Framer a crear,  
2) contrato JSON por endpoint (request/response),  
3) orden exacto de implementacion por dia.
