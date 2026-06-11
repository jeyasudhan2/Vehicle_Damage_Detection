"use client";
// frontend/src/pages/LoginPage.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

export default function LoginPage() {
    const navigate = useNavigate();
    const { signIn } = useAuthContext();

    const [email,    setEmail]    = useState('');
    const [password, setPassword] = useState('');
    const [error,    setError]    = useState('');
    const [loading,  setLoading]  = useState(false);
    const [showPass, setShowPass] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { error } = await signIn(email, password);
        setLoading(false);

        if (error) {
            setError(error.message);
        } else {
             const { data: { session } } = await supabase.auth.getSession();
        console.log('✅ Logged in! Token:', session?.access_token?.slice(0, 30));
        navigate('/');  // redirect to main app after login
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#030408] flex justify-center items-center  px-4">

            {/* Background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2
                                w-[600px] h-[600px] rounded-full opacity-10
                                bg-violet-600 blur-[120px]" />
            </div>

            <div className="relative flex  w-full ">

                {/* Logo / Brand */}
                <div className="text-center   mb-10">
                    <p className= "  text-violet-400  text-2xl font-bold  tracking-tight  mb-3">
                        <span className=' font-[Zangezi] text-5xl'>V</span>ehicle-
                        <span className=' font-[Zangezi] text-5xl'>D</span>
                        amage-
                        <span className=' font-[Zangezi] text-5xl'>D</span>
                         etection
                    </p>
                      <div className="inline-flex items-center gap-2 px-3 py-1  rounded-full glass text-xs text-purple-400 font-medium mb-8">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        Powered by YOLOv8 Deep Learning
                    </div>
                </div>

                {/* Card */}
                <div className="bg-white/[0.03]  w-80 h-100 border p-8 border-white/10 rounded-2xl 
                                backdrop-blur-sm">

                    <form  onSubmit={handleSubmit} className="  py-5">

                        {/* Email */}
                        <div>

                                                <h1 className=' text-2xl text-center  '>Login Your Account</h1>
                    <p className="text-white/60 text-center text-xs pb-2">Sign in to your account</p>

                            <label className="block text-xs font-mono tracking-widest
                                              text-slate-400 uppercase pb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                placeholder="useremail@example.com"
                                className="  w-full  bg-white/5 border border-white/10 rounded-xl
                                           px-2 py-2 text-white text-sm placeholder-slate-600
                                           focus:outline-none focus:border-violet-500/60
                                           focus:ring-1 focus:ring-violet-500/30 transition-all"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <div className="pb-2">
                                <label className="text-xs font-mono tracking-widest
                                                  text-slate-400 uppercase">
                                    Password
                                </label>
                           
                            </div>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl
                                               px-2 py-2 text-white text-sm placeholder-slate-600
                                               focus:outline-none focus:border-violet-500/60
                                               focus:ring-1 focus:ring-violet-500/30 transition-all
                                               pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 top-1/3 -translate-y-1/2
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
                                     <Link
                                    to="/forgot-password"
                                    className="text-xs text-violet-400 hover:text-violet-300
                                               transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
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
                            className="w-full py-3   rounded-xl font-semibold text-sm text-white
                                       bg-gradient-to-r from-violet-500 to-purple-600
                                       hover:shadow-lg hover:shadow-violet-500/25
                                       hover:-translate-y-0.5 transition-all duration-300
                                       disabled:opacity-50 disabled:cursor-not-allowed
                                       disabled:hover:translate-y-0 disabled:hover:shadow-none
                                       flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white
                                                    rounded-full animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>

                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-white/5" />
                        <span className="text-slate-600 text-xs">or</span>
                        <div className="flex-1 h-px bg-white/5" />
                    </div>

                    {/* Sign up link */}
                    <p className="text-center text-slate-500 text-xs">
                        Don&apos;t have an account?{' '}
                        <Link
                            to="/create-account"
                            className="text-violet-400 hover:text-violet-300 font-semibold
                                       transition-colors"
                        >
                            Create one
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
}