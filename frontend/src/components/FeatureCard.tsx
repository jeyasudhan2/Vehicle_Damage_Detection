import type { ReactNode } from 'react';

interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    accentColor?: string;
}

/**
 * Glassmorphism feature card with hover glow effect.
 * Each card is a child inside a stagger-animated container.
 */
export default function FeatureCard({
    icon,
    title,
    description,
    accentColor = 'purple',
}: FeatureCardProps) {
    const glowColors: Record<string, string> = {
        purple: 'hover:shadow-purple-500/20 hover:border-purple-500/30',
        emerald: 'hover:shadow-emerald-500/20 hover:border-emerald-500/30',
        amber: 'hover:shadow-amber-500/20 hover:border-amber-500/30',
        violet: 'hover:shadow-violet-500/20 hover:border-violet-500/30',
    };

    const iconBg: Record<string, string> = {
        purple: 'from-purple-500/20 to-purple-500/5 text-purple-400',
        emerald: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400',
        amber: 'from-amber-500/20 to-amber-500/5 text-amber-400',
        violet: 'from-violet-500/20 to-violet-500/5 text-violet-400',
    };

    return (
        <div
            className={`group relative glass rounded-2xl p-8  transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-default ${glowColors[accentColor] || glowColors.purple}`}
        >
            {/* Icon container */}
            <div
                className={`w-13 h-13  rounded-2xl bg-gradient-to-br ${iconBg[accentColor] || iconBg.purple} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}
            >
                {icon}
            </div>

            {/* Title */}
            <h3 className="text-white text-lg pt-3 font-semibold mb-3">{title}</h3>

            {/* Description */}
            <p className="text-slate-400 text-sm leading-relaxed">{description}</p>

            {/* Bottom accent line */}
            <div
                className={`absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent ${accentColor === 'purple'
                    ? 'via-yellow-500/40'
                    : accentColor === 'emerald'
                        ? 'via-emerald-500/40'
                        : accentColor === 'amber'
                            ? 'via-amber-500/40'
                            : 'via-violet-500/40'
                    } to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            />
        </div>
    );
}
