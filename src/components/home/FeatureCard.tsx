import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  desc: string;
  image: string;
  icon: LucideIcon;
}

export function FeatureCard({ title, desc, image, icon: Icon }: FeatureCardProps) {
  return (
    <GlassCard hover className="overflow-hidden">
      <div className="relative h-48 w-full sm:h-52">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-700/40 to-cyan-400/10" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(59,130,246,0.15)_0%,transparent_50%,rgba(34,211,238,0.1)_100%)]" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/95 text-primary-600 shadow-lg ring-2 ring-cyan-300/40 backdrop-blur-sm">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-semibold text-white drop-shadow-sm sm:text-xl">
              {title}
            </h3>
          </div>
        </div>
      </div>
      <div className="border-t border-white/40 bg-white/50 p-5 backdrop-blur-sm">
        <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
      </div>
    </GlassCard>
  );
}
