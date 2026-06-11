"use client";
// frontend/src/pages/ForgotPasswordPage.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export default function ForgotPasswordPage() {
    const { resetPassword } = useAuthContext();

    const [email,   setEmail]   = useState('');
    const [sent,    setSent]    = useState(false);
    const [error,   setError]   = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { error } = await resetPassword(email);
        setLoading(false);

        if (error) {
            setError(error.message);
        } else {
            setSent(true);
        }
    };

    return (
        <div className="min-h-screen bg-[#030408] flex items-center justify-center px-4">

            {/* Background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2
                                w-[500px] h-[500px] rounded-full opacity-10
                                bg-cyan-600 blur-[120px]" />
            </div>

            <div className="relative w-full max-w-md">

                {/* Brand */}
                <div className="text-center mb-10">
                    <p className="text-violet-400 font-mono text-xs tracking-[0.4em] uppercase mb-3">
                        Vehicle Damage Detection
                    </p>
                    <h1 className="text-3xl font-bold text-white">Reset Password</h1>
                    <p className="text-slate-500 text-sm mt-2">
                        We'll send a reset link to your email
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8
                                backdrop-blur-sm">

                    {/* Success state */}
                    {sent ? (
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-emerald-500/10
                                            flex items-center justify-center">
                                <svg className="w-8 h-8 text-emerald-400" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                            </div>
                            <h3 className="text-white font-semibold text-lg mb-2">
                                Check your email
                            </h3>
                            <p className="text-slate-400 text-sm mb-6">
                                We sent a password reset link to{' '}
                                <span className="text-violet-400 font-medium">{email}</span>.
                                Check your inbox (and spam folder).
                            </p>
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 text-sm text-slate-400
                                           hover:text-white transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
                                     stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                </svg>
                                Back to Sign In
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-mono tracking-widest
                                                  text-slate-400 uppercase mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    placeholder="you@example.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl
                                               px-4 py-3 text-white text-sm placeholder-slate-600
                                               focus:outline-none focus:border-violet-500/60
                                               focus:ring-1 focus:ring-violet-500/30 transition-all"
                                />
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20
                                                text-red-400 text-sm text-center">
                                    {error}
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 rounded-xl font-semibold text-sm text-white
                                           bg-gradient-to-r from-violet-500 to-purple-600
                                           hover:shadow-lg hover:shadow-violet-500/25
                                           hover:-translate-y-0.5 transition-all duration-300
                                           disabled:opacity-50 disabled:cursor-not-allowed
                                           flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white
                                                        rounded-full animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </button>

                            {/* Back */}
                            <div className="text-center">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-1.5 text-sm
                                               text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
                                         stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                    </svg>
                                    Back to Sign In
                                </Link>
                            </div>

                        </form>
                    )}

                </div>
            </div>
        </div>
    );
}