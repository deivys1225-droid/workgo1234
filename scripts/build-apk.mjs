/**
 * Genera APK de Work Go.
 *
 * Uso:
 *   node scripts/build-apk.mjs                                          → IP local (dev)
 *   node scripts/build-apk.mjs https://workgo1234-a6gq.vercel.app       → producción
 *   CAPACITOR_SERVER_URL=https://... npm run apk:build                  → producción
 */
import { execSync } from "child_process";
import { networkInterfaces } from "os";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function detectJavaHome() {
  if (process.env.JAVA_HOME && existsSync(process.env.JAVA_HOME)) {
    return process.env.JAVA_HOME;
  }
  const candidates = [
    "C:\\Program Files\\Android\\Android Studio\\jbr",
    "C:\\Program Files\\Java\\jdk-17",
    "C:\\Program Files\\Eclipse Adoptium\\jdk-17",
  ];
  return candidates.find((p) => existsSync(p));
}

function detectAndroidHome() {
  if (process.env.ANDROID_HOME && existsSync(process.env.ANDROID_HOME)) {
    return process.env.ANDROID_HOME;
  }
  const local = process.env.LOCALAPPDATA;
  if (local) {
    const sdk = join(local, "Android", "Sdk");
    if (existsSync(sdk)) return sdk;
  }
  return null;
}

function getLocalIp() {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "192.168.1.1";
}

const arg = process.argv[2];
const serverUrl =
  process.env.CAPACITOR_SERVER_URL ||
  (arg?.startsWith("http") ? arg : arg ? `http://${arg}:3000` : `http://${getLocalIp()}:3000`);

console.log("\n📱 Work Go — Build APK");
console.log("─────────────────────────────");
console.log(`Servidor: ${serverUrl}`);
console.log("─────────────────────────────\n");

process.env.CAPACITOR_SERVER_URL = serverUrl;

const javaHome = detectJavaHome();
const androidHome = detectAndroidHome();
if (javaHome) process.env.JAVA_HOME = javaHome;
if (androidHome) {
  process.env.ANDROID_HOME = androidHome;
  process.env.ANDROID_SDK_ROOT = androidHome;
}

if (!javaHome) {
  console.error("❌ No se encontró Java JDK. Instala Android Studio o JDK 17+.");
  process.exit(1);
}
if (!androidHome) {
  console.error("❌ No se encontró Android SDK. Instala Android Studio.");
  process.exit(1);
}

console.log(`Java:    ${javaHome}`);
console.log(`Android: ${androidHome}\n`);

try {
  execSync("node scripts/generate-icons.mjs", { cwd: root, stdio: "inherit" });
  execSync("npx cap sync android", { cwd: root, stdio: "inherit", env: process.env });

  const gradlew = join(root, "android", process.platform === "win32" ? "gradlew.bat" : "gradlew");
  if (!existsSync(gradlew)) {
    console.error("\n❌ No se encontró el proyecto Android. Ejecuta primero: npx cap add android");
    process.exit(1);
  }

  console.log("\n🔨 Compilando APK (debug)...\n");
  const gradleCmd =
    process.platform === "win32"
      ? `"${gradlew}" assembleDebug`
      : `"${gradlew}" assembleDebug`;
  execSync(gradleCmd, {
    cwd: join(root, "android"),
    stdio: "inherit",
    shell: true,
  });

  const apkPath = join(root, "android", "app", "build", "outputs", "apk", "debug", "app-debug.apk");
  console.log("\n✅ APK generada:");
  console.log(`   ${apkPath}`);
  console.log("\n📋 Pasos para usar en el celular:");
  console.log("   1. Copia la APK al teléfono e instálala");
  if (serverUrl.includes("vercel.app") || serverUrl.startsWith("https://")) {
    console.log("   2. Abre la app — funciona con internet, sin PC");
    console.log(`   3. Conecta a ${serverUrl}\n`);
  } else {
    console.log("   2. En la PC ejecuta: npm run dev:mobile");
    console.log("   3. Celular y PC en la misma red WiFi");
    console.log(`   4. La app se conectará a ${serverUrl}\n`);
  }
} catch (err) {
  console.error("\n❌ Error al generar APK:", err.message);
  console.log("\nRequisitos:");
  console.log("  • Java JDK 17+");
  console.log("  • Android SDK (Android Studio)");
  console.log("  • Variables ANDROID_HOME y JAVA_HOME configuradas");
  process.exit(1);
}
