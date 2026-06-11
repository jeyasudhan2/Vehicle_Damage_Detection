// frontend/src/lib/supabaseClient.ts
// ──────────────────────────────────────────────────────────────────
// Single Supabase client instance shared across the entire frontend.
// Import this wherever you need auth or direct DB access.
//
// Install:  npm install @supabase/supabase-js
// ──────────────────────────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL  as string;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON) {
    throw new Error(
        '[VDD] VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in frontend/.env'
    );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);