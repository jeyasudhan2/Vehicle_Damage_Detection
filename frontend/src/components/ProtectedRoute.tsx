"use client";
// frontend/src/components/ProtectedRoute.tsx
// ──────────────────────────────────────────────────────────────────
// Wraps any route that requires the user to be logged in.
// If not authenticated → redirects to /login.
// Shows a spinner while the auth state is loading.
// ──────────────────────────────────────────────────────────────────

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

interface Props {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
    const { user, loading } = useAuthContext();

    // Still checking localStorage / Supabase session
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#030408]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-violet-500/30 border-t-violet-500
                                    rounded-full animate-spin" />
                    <p className="text-slate-500 text-xs font-mono tracking-widest uppercase">
                        Verifying session...
                    </p>
                </div>
            </div>
        );
    }

    // Not logged in → send to login page
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}