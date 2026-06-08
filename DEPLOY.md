# Desplegar Work Go en internet (gratis)

La app quedará en una URL pública tipo `https://workgo1234.vercel.app` sin depender de tu PC.

## Paso 1 — Base de datos PostgreSQL (Neon, gratis)

1. Ve a **https://neon.tech** y crea cuenta
2. **New Project** → nombre `workgo`
3. Copia el **Connection string** (PostgreSQL)
   - Debe verse así: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`

## Paso 2 — Desplegar en Vercel (gratis)

1. Ve a **https://vercel.com** e inicia sesión con GitHub
2. **Add New → Project**
3. Importa el repo **`deivys1225-droid/workgo1234`**
4. En **Environment Variables** agrega:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Tu connection string de Neon |
| `JWT_SECRET` | Un texto aleatorio largo (ej. `workgo-prod-secret-2026-xK9m`) |

5. Clic en **Deploy** (espera 2-3 minutos)

## Paso 3 — Vercel Blob (subida de PDFs)

1. En tu proyecto Vercel → **Storage** → **Create Database** → **Blob**
2. Conecta Blob al proyecto
3. Vercel agrega `BLOB_READ_WRITE_TOKEN` automáticamente
4. **Redeploy** el proyecto (Deployments → ⋯ → Redeploy)

## Paso 4 — Datos demo

Después del primer deploy, ejecuta el seed **una vez** contra la BD de producción:

```powershell
cd "d:\Work Go\onni-jobs"
$env:DATABASE_URL="postgresql://..."   # tu URL de Neon
npm run db:push
npm run db:seed
```

## Paso 5 — APK apuntando a internet

Cuando tengas tu URL de Vercel (ej. `https://workgo1234.vercel.app`):

```powershell
$env:CAPACITOR_SERVER_URL="https://workgo1234.vercel.app"
npm run apk:build
```

La APK funcionará desde cualquier lugar, sin tu PC.

---

## Cuentas demo (después del seed)

| Rol | Email | Contraseña |
|-----|-------|------------|
| Empleador | empleador@workgo.com | demo1234 |
| Candidato | candidato@workgo.com | demo1234 |

## Alternativa rápida desde terminal

```powershell
npx vercel login
npx vercel link
npx vercel env add DATABASE_URL
npx vercel env add JWT_SECRET
npx vercel --prod
```
