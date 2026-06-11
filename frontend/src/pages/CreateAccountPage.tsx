"use client";
// frontend/src/pages/CreateAccountPage.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export default function CreateAccountPage() {
    const navigate = useNavigate();
    const { signUp } = useAuthContext();

    const [email,     setEmail]     = useState('');
    const [password,  setPassword]  = useState('');
    const [confirm,   setConfirm]   = useState('');
    const [error,     setError]     = useState('');
    const [success,   setSuccess]   = useState('');
    const [loading,   setLoading]   = useState(false);
    const [showPass,  setShowPass]  = useState(false);

    // Password strength
    const strength = (() => {
        if (password.length === 0) return 0;
        let s = 0;
        if (password.length >= 8)          s++;
        if (/[A-Z]/.test(password))         s++;
        if (/[0-9]/.test(password))         s++;
        if (/[^A-Za-z0-9]/.test(password))  s++;
        return s;
    })();

    const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
    const strengthColor = ['', 'bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'][strength];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirm) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        setLoading(true);
        const { error } = await signUp(email, password);
        setLoading(false);

        if (error) {
            setError(error.message);
        } else {
            setSuccess(
                'Account created! Check your email for a confirmation link, then sign in.'
            );
            setTimeout(() => navigate('/login'), 4000);
        }
    };

    return (
        <div className="min-h-screen bg-[#030408] flex items-center justify-center px-4 py-12">

            {/* Background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2
                                w-[600px] h-[600px] rounded-full opacity-10
                                bg-purple-600 blur-[120px]" />
            </div>

            <div className="relative w-full max-w-md">

                {/* Brand */}
                <div className="text-center mb-10">
                    <p className="text-violet-400 font-mono text-xs tracking-[0.4em] uppercase mb-3">
                        Vehicle Damage Detection
                    </p>
                    <h1 className="text-3xl font-bold text-white">Create Account</h1>
                    <p className="text-slate-500 text-sm mt-2">
                        Start detecting vehicle damage instantly
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8
                                backdrop-blur-sm">

                    {/* Success */}
                    {success && (
                        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border
                                        border-emerald-500/20 text-emerald-400 text-sm text-center">
                            <svg className="w-5 h-5 mx-auto mb-2" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-mono tracking-widest
                                              text-slate-400 uppercase mb-2">
                                Email
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

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-mono tracking-widest
                                              text-slate-400 uppercase mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    placeholder="Min 8 characters"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl
                                               px-4 py-3 text-white text-sm placeholder-slate-600
                                               focus:outline-none focus:border-violet-500/60
                                               focus:ring-1 focus:ring-violet-500/30 transition-all pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2
                                               text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showPass ? (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {/* Strength bar */}
                            {password.length > 0 && (
                                <div className="mt-2">
                                    <div className="flex gap-1 mb-1">
                                        {[1, 2, 3, 4].map(i => (
                                            <div
                                                key={i}
                                                className={`h-1 flex-1 rounded-full transition-all duration-300
                                                    ${i <= strength ? strengthColor : 'bg-white/10'}`}
                                            />
                                        ))}
                                    </div>
                                    <p className={`text-xs ${
                                        strength <= 1 ? 'text-red-400' :
                                        strength === 2 ? 'text-amber-400' :
                                        strength === 3 ? 'text-blue-400' : 'text-emerald-400'
                                    }`}>
                                        {strengthLabel}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-xs font-mono tracking-widest
                                              text-slate-400 uppercase mb-2">
                                Confirm Password
                            </label>
                            <input
                                type={showPass ? 'text' : 'password'}
                                value={confirm}
                                onChange={e => setConfirm(e.target.value)}
                                required
                                placeholder="Repeat password"
                                className={`w-full bg-white/5 border rounded-xl px-4 py-3
                                            text-white text-sm placeholder-slate-600
                                            focus:outline-none transition-all
                                            ${confirm && password !== confirm
                                                ? 'border-red-500/50 focus:border-red-500/60'
                                                : 'border-white/10 focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30'
                                            }`}
                            />
                            {confirm && password !== confirm && (
                                <p className="text-red-400 text-xs mt-1">Passwords don't match</p>
                            )}
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
                            disabled={loading || !!success}
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
                                    Creating account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>

                    </form>

                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-white/5" />
                        <span className="text-slate-600 text-xs">or</span>
                        <div className="flex-1 h-px bg-white/5" />
                    </div>

                    <p className="text-center text-slate-500 text-sm">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="text-violet-400 hover:text-violet-300 font-semibold
                                       transition-colors"
                        >
                            Sign in
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
}