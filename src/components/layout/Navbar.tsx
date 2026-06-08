import Link from "next/link";
import {
  Briefcase,
  Bell,
  User,
  LayoutDashboard,
} from "lucide-react";
import { getSession } from "@/lib/auth";
import { unreadNotificationCount } from "@/lib/store";
import { NavbarClient } from "./NavbarClient";

export async function Navbar() {
  const session = await getSession();
  const unreadCount = session ? unreadNotificationCount(session.userId) : 0;

  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-white/30 safe-header">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 sm:py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white shadow-lg shadow-primary-600/30 transition-transform group-hover:scale-105">
            <Briefcase className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-bold text-gray-900">
            Work<span className="text-primary-600"> Go</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/jobs" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-white/50 hover:text-primary-600">
            Empleos
          </Link>
          {session?.role === "employer" && (
            <Link href="/dashboard/employer" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-white/50 hover:text-primary-600">
              Panel empleador
            </Link>
          )}
          {session?.role === "candidate" && (
            <Link href="/dashboard/candidate" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-white/50 hover:text-primary-600">
              Mis postulaciones
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {session ? (
            <>
              <Link
                href={session.role === "employer" ? "/dashboard/employer/notifications" : "/dashboard/candidate/notifications"}
                className="relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-white/50 hover:text-primary-600"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
              <Link
                href={session.role === "employer" ? "/dashboard/employer/profile" : "/dashboard/candidate/profile"}
                className="hidden rounded-lg p-2 text-gray-600 transition-colors hover:bg-white/50 hover:text-primary-600 sm:block"
              >
                <User className="h-5 w-5" />
              </Link>
              <Link
                href={session.role === "employer" ? "/dashboard/employer" : "/dashboard/candidate"}
                className="hidden rounded-lg p-2 text-gray-600 transition-colors hover:bg-white/50 hover:text-primary-600 sm:block"
              >
                <LayoutDashboard className="h-5 w-5" />
              </Link>
              <NavbarClient authenticated />
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-white/50 hover:text-primary-600">
                Entrar
              </Link>
              <Link href="/jobs" className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-700">
                Empleos
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
