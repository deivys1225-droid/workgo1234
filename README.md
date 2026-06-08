# Work Go

Plataforma de contratación local inteligente con geolocalización en tiempo real.

## Desplegar en internet (sin depender de tu PC)

Guía completa en **[DEPLOY.md](./DEPLOY.md)** — Vercel + Neon PostgreSQL (gratis).

Resumen:
1. Crea base de datos en **https://neon.tech**
2. Importa el repo en **https://vercel.com** → conecta GitHub
3. Agrega variables `DATABASE_URL` y `JWT_SECRET`
4. Deploy → tu app queda en `https://tu-proyecto.vercel.app`

## Inicio rápido (local)

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Cuentas demo

| Rol | Email | Contraseña |
|-----|-------|------------|
| Empleador | empleador@workgo.com | demo1234 |
| Candidato | candidato@workgo.com | demo1234 |

## Stack

- **Next.js 15** + TypeScript + Tailwind CSS v4
- **Prisma** + SQLite (local, sin configuración externa)
- **Leaflet** + OpenStreetMap (mapas sin API key)
- **JWT** auth con cookies httpOnly
- Glassmorphism UI

## Funcionalidades

- Registro/login por roles (empleador / candidato)
- Publicar y buscar empleos por proximidad geográfica
- Mapa interactivo + lista ordenada por distancia
- Postulación en 3 clics con envío automático de perfil
- Panel empleador: gestionar candidatos, aceptar/rechazar
- Panel candidato: ver postulaciones, editar perfil, subir CV
- Chat interno por postulación
- Notificaciones de nuevas postulaciones
