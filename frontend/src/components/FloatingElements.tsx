import { useParallax, useFloatingAnimation, useRotateIn } from '../animations/gsapEffects';

/**
 * Decorative floating shapes for the hero section.
 * Each shape moves at a different parallax speed for depth.
 */
export default function FloatingElements() {
    // Parallax refs at different speeds for depth effect
    const float1 = useFloatingAnimation<HTMLDivElement>(15, 4);
    const float2 = useFloatingAnimation<HTMLDivElement>(25, 5);
    const float3 = useFloatingAnimation<HTMLDivElement>(10, 3.5);
    const float4 = useFloatingAnimation<HTMLDivElement>(20, 6);
    const float5 = useFloatingAnimation<HTMLDivElement>(18, 4.5);

    const parallax1 = useParallax<HTMLDivElement>(0.2);
    const parallax2 = useParallax<HTMLDivElement>(0.4);
    const parallax3 = useParallax<HTMLDivElement>(0.3);

    const rotate1 = useRotateIn<HTMLDivElement>(360, 25);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Large blurred purple orb — top-right */}
            <div
                ref={parallax1}
                className="absolute -top-20 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
            />

            {/* purple orb — bottom-left */}
            <div
                ref={parallax2}
                className="absolute -bottom-32 -left-32 w-125 h-125 bg-purple-500/8 rounded-full blur-3xl"
            />

            {/* Small floating diamond shapes */}
            <div
                ref={float1}
                className="absolute top-1/4 left-[10%] w-4 h-4 bg-purple-400/30 rotate-45 rounded-sm"
            />
            <div
                ref={float2}
                className="absolute top-1/3 right-[15%] w-3 h-3 bg-purple-400/30 rotate-45 rounded-sm"
            />
            <div
                ref={float3}
                className="absolute bottom-1/4 left-[25%] w-10 h-10 bg-violet-400/20 rotate-45 rounded-sm"
            />

            {/* Floating ring */}
            <div
                ref={float4}
                className="absolute top-[20%] right-[25%] w-30 h-30 border-2 border-purple-500/15 rounded-full"
            />

            {/* Floating cross */}
            <div
                ref={float5}
                className="absolute bottom-[30%] right-[10%] w-8 h-8 flex items-center justify-center"
            >
                <div className="absolute w-full h-0.5 bg-purple-400/20 rounded-full" />
                <div className="absolute h-full w-0.5 bg-purple-400/20 rounded-full" />
            </div>

            {/* Slowly rotating hexagonal ring */}
            <div
                ref={rotate1}
                className="absolute top-[60%] left-[8%] w-24 h-24 border border-white/5 rounded-2xl"
            />

            {/* Grid lines overlay on hero (parallax) */}
            <div
                ref={parallax3}
                className="absolute inset-0 grid-bg opacity-50"
            />

            {/* Gradient line — horizontal */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/10 to-transparent" />
        </div>
    );
}
