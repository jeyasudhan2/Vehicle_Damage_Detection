"use client";
// frontend/src/context/AuthContext.tsx
// ──────────────────────────────────────────────────────────────────
// Global authentication context.
// Wraps the entire app and provides user/session to every component.
//
// Usage:
//   const { user, session, signIn, signUp, signOut } = useAuthContext();
// ──────────────────────────────────────────────────────────────────

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    type ReactNode,
} from 'react';
import type { Session, User, AuthError } from '@supabase/supabase-js';

import { supabase } from '../lib/supabaseClient';

// ── Context shape ─────────────────────────────────────────────────
interface AuthContextValue {
    user:         User    | null;
    session:      Session | null;
    loading:      boolean;
    signIn:        (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signUp:        (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signOut:       () => Promise<void>;
    resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ── Provider ──────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user,    setUser]    = useState<User    | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    // On mount: read existing session, then listen for auth changes
    useEffect(() => {
        // Get current session from localStorage (Supabase persists it)
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for login / logout / token refresh
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    // ── Sign In ───────────────────────────────────────────────────
    const signIn = useCallback(async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error };
    }, []);

    // ── Sign Up ───────────────────────────────────────────────────
    const signUp = useCallback(async (email: string, password: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                // Supabase sends a confirmation email automatically
                emailRedirectTo: `${window.location.origin}/login`,
            },
        });
        return { error };
    }, []);

    // ── Sign Out ──────────────────────────────────────────────────
    const signOut = useCallback(async () => {
        await supabase.auth.signOut();
    }, []);

    // ── Reset Password ────────────────────────────────────────────
    const resetPassword = useCallback(async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        return { error };
    }, []);

    return (
        <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, resetPassword }}>
            {children}
        </AuthContext.Provider>
    );
}

// ── Hook ──────────────────────────────────────────────────────────

export function useAuthContext(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuthContext must be used inside <AuthProvider>');
    return ctx;
}