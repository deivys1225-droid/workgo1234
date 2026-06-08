# Work Go

Plataforma de contratación local inteligente con geolocalización en tiempo real.

## Inicio rápido

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
