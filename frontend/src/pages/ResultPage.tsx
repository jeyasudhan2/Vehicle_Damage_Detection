import { useLocation, useNavigate, Link } from 'react-router-dom';
import DamageResultCard from '../components/DamageResultCard';
import { useScrollFadeIn } from '../animations/gsapEffects';
import type { DetectionResult, BoundingBox } from '../services/api';

/**
 * Detection Result Page
 * - Displays the uploaded image with bounding-box overlays
 * - Shows damage type cards, confidence, and estimated cost
 */
export default function ResultPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const headerRef = useScrollFadeIn<HTMLDivElement>(0);

    // Result passed via router state from UploadPage
    const result: DetectionResult | undefined = location.state?.result;

    // Redirect to upload if no result available
    if (!result) {
        return (
            <div className="min-h-screen pt-28 pb-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                        <svg className="w-10 h-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">No Results Found</h2>
                    <p className="text-slate-400 mb-6">Upload an image first to see detection results.</p>
                    <Link
                        to="/upload"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-zinc-900 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                    >
                        Go to Upload
                    </Link>
                </div>
            </div>
        );
    }

    const overallPercent = Math.round(result.overallConfidence * 100);

    // Color-code bounding boxes
    const boxColors = ['#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899'];

    return (
        <div className="min-h-screen pt-28 pb-20">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <div ref={headerRef} className="mb-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-white text-sm bg-purple-600 px-5 py-3 rounded-2xl hover:text-black transition-colors mb-6"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Back
                    </button>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className='pb-5 pr-50'>
                            <p className="text-purple-400 text-sm font-semibold uppercase tracking-widest  pb-2">
                                Analysis Complete
                            </p>
                            <h1 className="text-3xl font-bold text-white">Detection Results</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                to="/upload"
                                className="px-5 py-2.5 glass rounded-xl text-sm text-slate-300 font-medium hover:text-white hover:bg-white/10 transition-all duration-300"
                            >
                                New Scan
                            </Link>
                            <Link
                                to="/history"
                                className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-zinc-900 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                            >
                                View History
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* ── Left: Image with bounding boxes ── */}
                    <div className="lg:col-span-2">
                        <div className="glass rounded-2xl overflow-hidden">
                            <div className="relative">
                                <img
                                    src={result.processedImageUrl || result.imageUrl}
                                    alt="Detected damages"
                                    className="w-160 h-100"
                                />
                                {/* Bounding box overlays */}
                                {result.damages.map((dmg: BoundingBox, i: number) => (
                                    <div
                                        key={i}
                                        className="absolute border-2 rounded-lg flex items-start transition-all duration-300"
                                        style={{
                                            left: `${(dmg.x / 800) * 100}%`,
                                            top: `${(dmg.y / 600) * 100}%`,
                                            width: `${(dmg.width / 800) * 100}%`,
                                            height: `${(dmg.height / 600) * 100}%`,
                                            borderColor: boxColors[i % boxColors.length],
                                        }}
                                    >
                                        <span
                                            className="absolute -top-6 left-0 px-2 py-0.5 text-xs font-bold rounded text-white whitespace-nowrap"
                                            style={{ backgroundColor: boxColors[i % boxColors.length] }}
                                        >
                                            {dmg.label} {Math.round(dmg.confidence * 100)}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Summary and damage cards ── */}
                    <div className="space-y-6">
                        {/* Summary card */}
                        <div className="glass rounded-2xl p-6">
                            <h3 className="text-white font-semibold mb-4">Summary</h3>
                            <div className="space-y-4">
                                {/* Damages found */}
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400 text-sm">Damages Found</span>
                                    <span className="text-white font-bold text-lg">{result.totalDamages}</span>
                                </div>
                                {/* Overall confidence */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-slate-400 text-sm">Overall Confidence</span>
                                        <span className="text-purple-400 font-bold">{overallPercent}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-zinc-900 transition-all duration-1000"
                                            style={{ width: `${overallPercent}%` }}
                                        />
                                    </div>
                                </div>
                                {/* Estimated cost */}
                                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                    <span className="text-slate-400 text-sm">Estimated Repair Cost</span>
                                    <span className="text-2xl font-bold gradient-text-warm">
                                        ₹{result.estimatedCost.toLocaleString()}
                                    </span>
                                </div>
                                {/* Damage types */}
                                <div className="pt-3 border-t border-white/5">
                                    <span className="text-slate-400 text-sm block mb-2">Damage Types</span>
                                    <div className="flex flex-wrap gap-2">
                                        {result.damageTypes.map((type: string) => (
                                            <span
                                                key={type}
                                                className="px-3 py-1 rounded-lg bg-purple-500/10 text-purple-400 text-xs font-medium border border-purple-500/20"
                                            >
                                                {type}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Individual damage cards */}
                        <div>
                            <h3 className="text-white font-semibold mb-4">Detected Damages</h3>
                            <div className="space-y-3">
                                {result.damages.map((dmg: BoundingBox, i: number) => (
                                    <DamageResultCard key={i} damage={dmg} index={i} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
