import type { BoundingBox } from '../services/api';

interface DamageResultCardProps {
    damage: BoundingBox;
    index: number;
}

/**
 * Individual damage result card showing label + confidence.
 */
export default function DamageResultCard({ damage, index }: DamageResultCardProps) {
    const confidencePercent = Math.round(damage.confidence * 100);

    const severityColor =
        confidencePercent >= 90
            ? 'text-red-400 bg-red-500/10 border-red-500/20'
            : confidencePercent >= 70
                ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';

    const barColor =
        confidencePercent >= 90
            ? 'bg-gradient-to-r from-red-500 to-orange-500'
            : confidencePercent >= 70
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                : 'bg-gradient-to-r from-emerald-500 to-cyan-500';

    return (
        <div className="glass rounded-xl p-5 hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-3">
                {/* Damage number badge */}
                <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 text-sm font-bold flex items-center justify-center">
                        {index + 1}
                    </span>
                    <div>
                        <h4 className="text-white font-semibold">{damage.label}</h4>
                        <p className="text-slate-500 text-xs">
                            Position: ({damage.x}, {damage.y})
                        </p>
                    </div>
                </div>

                {/* Confidence badge */}
                <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${severityColor}`}>
                    {confidencePercent}%
                </span>
            </div>

            {/* Confidence bar */}
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
                    style={{ width: `${confidencePercent}%` }}
                />
            </div>
        </div>
    );
}
