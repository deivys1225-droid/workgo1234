# APK para Android — Work Go

Work Go es una app web con servidor (Next.js + API). La APK es un **contenedor nativo** que abre la app en tu celular conectándose al servidor en tu PC (misma red WiFi) o a una URL desplegada.

## Opción A: Generar APK (recomendado)

### Requisitos
- **Android Studio** instalado (ya lo tienes)
- PC y celular en la **misma red WiFi**

### Pasos

**1. Inicia el servidor accesible desde la red:**
```bash
npm run dev:mobile
```

**2. Genera la APK:**
```bash
npm run apk:build
```

Si tu IP es distinta, especifícala:
```bash
node scripts/build-apk.mjs 192.168.1.50
```

**3. Instala en el celular**

La APK queda en:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

Cópiala al teléfono (USB, WhatsApp, Drive) e instálala. Activa **"Orígenes desconocidos"** si Android lo pide.

**4. Usa la app**
- Mantén `npm run dev:mobile` corriendo en la PC
- Abre Work Go en el celular (misma WiFi)

---

## Opción B: Android Studio (si el build falla)

```bash
npm run dev:mobile
set CAPACITOR_SERVER_URL=http://TU_IP:3000
npm run cap:sync
npm run cap:open
```

En Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**

---

## Opción C: Sin APK — usar desde el navegador del celular

1. En la PC: `npm run dev:mobile`
2. Averigua tu IP local (ej. `10.64.193.207`)
3. En el celular (misma WiFi): abre `http://TU_IP:3000`
4. En Chrome: menú → **"Añadir a pantalla de inicio"** (funciona como app)

---

## Cuentas demo
- Empleador: `empleador@workgo.com` / `demo1234`
- Candidato: `candidato@workgo.com` / `demo1234`

## Nota sobre producción

Para una APK que funcione **sin la PC encendida**, despliega la app (Vercel, Railway, etc.) y genera la APK apuntando a esa URL:

```bash
set CAPACITOR_SERVER_URL=https://tu-app.vercel.app
npm run cap:sync
npm run apk:build
```
