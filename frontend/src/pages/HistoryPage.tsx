"use client";
// frontend/src/pages/HistoryPage.tsx
// ──────────────────────────────────────────────────────────────────
// Shows the current user's detection history fetched from Supabase.
// Displays user email badge + per-card details.
// ──────────────────────────────────────────────────────────────────

import React from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from '../hooks/useHistory';
import { useScrollFadeIn, useStaggerIn } from '../animations/gsapEffects';
import type { HistoryItem } from '../services/api';
import { SlCalender } from 'react-icons/sl';
import { BiSolidImageAdd } from 'react-icons/bi';

export default function HistoryPage() {
    const { data: history, isLoading, isError, refetch } = useHistory();

    const headerRef = useScrollFadeIn<HTMLDivElement>(0);
    const gridRef   = useStaggerIn<HTMLDivElement>(0.1);

    // ── Skeleton loader ───────────────────────────────────────────
    const SkeletonCard = () => (
        <div className="glass rounded-2xl overflow-hidden animate-pulse">
            <div className="h-40 bg-white/5" />
            <div className="p-5 space-y-3">
                <div className="flex gap-3">
                    <div className="h-5 bg-white/5 rounded w-3/4" />
                    <div className="h-5 bg-white/5 rounded w-1/4" />
                </div>
                <div className="flex gap-3 pt-2">
                    <div className="h-6 bg-white/5 rounded-lg w-16" />
                    <div className="h-6 bg-white/5 rounded-lg w-20" />
                </div>
                <div className="flex gap-3 pt-6">
                    <div className="h-3 bg-white/5 rounded w-16" />
                    <div className="h-5 bg-white/5 rounded w-20" />
                </div>
            </div>
        </div>
    );

    // ── Status badge ──────────────────────────────────────────────
    const statusBadge = (s: HistoryItem['status']) => {
        const styles = {
            completed:  'bg-purple-500/10 text-purple-400 border-purple-500/20',
            processing: 'bg-amber-500/10  text-amber-400  border-amber-500/20',
            failed:     'bg-red-500/10    text-red-400    border-red-500/20',
        };
        return (
            <span className={`px-2 py-0.5 rounded text-xs font-medium border ${styles[s]}`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
        );
    };

    return (
        <div className="min-h-screen pt-28 pb-20">
            <div className="max-w-6xl mx-auto px-6">

                {/* ── Header ── */}
                <div
                    ref={headerRef}
                    className="flex flex-col sm:flex-row items-start sm:items-center
                               justify-between gap-4 mb-10"
                >
                    <div>
                        <p className="text-violet-400 font-[Zangezi] text-2xl font-semibold
                                      tracking-widest mb-2">
                            Detection Log
                        </p>
                        <h1 className="text-3xl font-bold text-white">Detection History</h1>
                        <p className="text-slate-400 text-xs mt-2">
                            Your previous vehicle damage analyses
                        </p>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        {/* New Detection button */}
                        <Link
                            to="/upload"
                            className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-500
                                       text-white text-sm font-semibold rounded-xl
                                       hover:shadow-lg hover:shadow-violet-500/25
                                       hover:-translate-y-0.5 transition-all duration-300
                                       flex items-center gap-2"
                        >
                            <BiSolidImageAdd size={18} />
                            New Detection
                        </Link>
                    </div>
                </div>

                

                {/* ── Loading ── */}
                {isLoading && (
                    <div className="grid pt-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                )}

                {/* ── Error ── */}
                {isError && (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10
                                        flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                            </svg>
                        </div>
                        <h3 className="text-white font-semibold text-lg mb-2">
                            Failed to load history
                        </h3>
                        <p className="text-slate-400 text-sm mb-4">
                            Please check your connection and try again.
                        </p>
                        <button
                            onClick={() => refetch()}
                            className="px-5 py-2 glass rounded-xl text-sm text-slate-300
                                       hover:text-white transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* ── Empty state ── */}
                {!isLoading && !isError && history?.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-violet-500/10
                                        flex items-center justify-center">
                            <svg className="w-10 h-10 text-violet-400" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 6.75v12a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                        </div>
                        <h3 className="text-white font-semibold text-lg mb-2">
                            No detections yet
                        </h3>
                        <p className="text-slate-400 text-sm mb-6">
                            Upload your first vehicle image to get started.
                        </p>
                        <Link
                            to="/upload"
                            className="inline-flex items-center gap-2 px-6 py-3
                                       bg-gradient-to-r from-violet-500 to-purple-500
                                       text-white font-semibold rounded-xl
                                       hover:shadow-lg hover:shadow-violet-500/25
                                       transition-all duration-300"
                        >
                            <BiSolidImageAdd size={18} />
                            Upload Image
                        </Link>
                    </div>
                )}

                {/* ── History grid ── */}
                {!isLoading && history && history.length > 0 && (
                    <div ref={gridRef}
                         className="grid pt-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {history.map((item: HistoryItem) => (
                            <div
                                key={item.id}
                                className="glass w-70 h-85 rounded-2xl  group
                                           hover:-translate-y-1 hover:shadow-xl
                                           hover:shadow-violet-500/5 transition-all
                                           duration-500 cursor-pointer"
                            >
                                {/* Thumbnail */}
                                <div className="relative h-40 bg-surface-light overflow-hidden">
                                    {item.thumbnailUrl && !item.thumbnailUrl.includes('demo') ? (
                                        <img
                                            src={item.thumbnailUrl}
                                            alt="damage preview"
                                            className="w-full h-full object-cover opacity-50
                                                       group-hover:opacity-100 group-hover:scale-105
                                                       transition-all duration-500"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br
                                                        from-violet-500/5 to-purple-500/5
                                                        flex items-center justify-center">
                                            <svg className="w-12 h-12 text-white/10" fill="none"
                                                 viewBox="0 0 24 24" stroke="currentColor"
                                                 strokeWidth={1}>
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 6.75v12a2.25 2.25 0 002.25 2.25z" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3">
                                        {statusBadge(item.status)}
                                    </div>
                                </div>

                                {/* Card body */}
                                <div className="p-5 flex flex-col gap-3">

                                    {/* User email badge */}
                                    {item.userEmail && (
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-violet-500/30
                                                            flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 rounded-full
                                                                bg-violet-400" />
                                            </div>
                                            <span className="text-violet-400/70 text-[10px]
                                                             font-mono truncate max-w-[180px]">
                                                {item.userEmail}
                                            </span>
                                        </div>
                                    )}

                                    {/* Date */}
                                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                                        <SlCalender />
                                        <span>
                                            {new Date(item.date).toLocaleDateString('en-US', {
                                                year:  'numeric',
                                                month: 'short',
                                                day:   'numeric',
                                            })}
                                        </span>
                                    </div>

                                    {/* Damage tags */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {item.damageTypes.map((type: string) => (
                                            <span
                                                key={type}
                                                className="px-2 py-0.5 rounded bg-cyan-500/10
                                                           text-violet-400 text-xs font-medium"
                                            >
                                                {type}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Confidence + Cost */}
                                    <div className="flex items-center justify-between pt-3
                                                    border-t border-white/5">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-purple-400" />
                                            <span className="text-slate-400 text-xs">
                                                {Math.round(item.confidence * 100)}% conf
                                            </span>
                                        </div>
                                        <span className="text-white font-bold text-sm">
                                            ₹{item.estimatedCost.toLocaleString()}
                                        </span>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}