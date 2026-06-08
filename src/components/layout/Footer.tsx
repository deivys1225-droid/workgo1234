import Link from "next/link";
import { Briefcase } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/30 glass">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
                <Briefcase className="h-4 w-4" />
              </div>
              <span className="font-display text-lg font-bold text-gray-900">
                Work Go
              </span>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Conectamos talento local con oportunidades cercanas. Encuentra tu
              próximo empleo a la vuelta de la esquina.
            </p>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold text-gray-900">
              Plataforma
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/jobs" className="hover:text-primary-600">
                  Buscar empleos
                </Link>
              </li>
              <li>
                <Link href="/register?role=employer" className="hover:text-primary-600">
                  Publicar oferta
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold text-gray-900">
              Cuenta
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/login" className="hover:text-primary-600">
                  Iniciar sesión
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-primary-600">
                  Crear cuenta
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200/50 pt-8 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Work Go. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
