# Work Go

Marketplace de empleos local — **proyecto escolar demo**. Sin base de datos, sin registro real.

## Demo en internet

1. Conecta el repo en **https://vercel.com** (importa `deivys1225-droid/workgo1234`)
2. Clic en **Deploy** — no necesitas variables de entorno
3. Tu URL: `https://workgo1234-a6gq.vercel.app`

## Probar localmente

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## Cómo usar la demo

1. **Ver empleos** → `/jobs` (mapa + lista por proximidad)
2. **Entrar** → `/login` → elige empleador o candidato (sin contraseña)
3. **Postularse** → entra como candidato → abre un empleo → Postularme
4. **Panel empleador** → ver postulaciones, aceptar/rechazar

## Stack

Next.js 15 · Tailwind CSS · Leaflet · Datos demo en memoria

## APK móvil

```bash
$env:CAPACITOR_SERVER_URL="https://tu-url.vercel.app"
npm run apk:build
```
