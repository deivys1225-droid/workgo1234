import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass rounded-2xl transition-all duration-300",
        hover && "hover:shadow-[0_8px_40px_rgba(59,130,246,0.12)] hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </div>
  );
}
