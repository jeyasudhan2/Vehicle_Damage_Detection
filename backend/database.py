# backend/database.py
# ──────────────────────────────────────────────────────────────────
# Two Supabase clients:
#
#   supabase       (anon key)         → used in auth.py for token verify
#   supabase_admin (service role key) → used in all DB reads/writes
#
# Why two clients?
#   The anon key respects RLS — backend can't insert without user context.
#   The service role key bypasses RLS — backend can insert freely.
#   We still filter by user_id manually in every query, so data is safe.
# ──────────────────────────────────────────────────────────────────

import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL         = os.environ.get("SUPABASE_URL",         "")
SUPABASE_KEY         = os.environ.get("SUPABASE_KEY",         "")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError(
        "\n[VDD] SUPABASE_URL and SUPABASE_KEY must be set in .env\n"
        "  Get them from: Supabase Dashboard → Settings → API\n"
    )

# ── Anon client — for auth.get_user() token verification ─────────
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ── Admin client — bypasses RLS for all DB operations ────────────
# Falls back to anon key if service key not set (RLS must be disabled)
_admin_key = SUPABASE_SERVICE_KEY if SUPABASE_SERVICE_KEY else SUPABASE_KEY
supabase_admin: Client = create_client(SUPABASE_URL, _admin_key)

if not SUPABASE_SERVICE_KEY:
    print("[VDD] ⚠️  SUPABASE_SERVICE_KEY not set — using anon key for DB ops.")
    print("[VDD]     Make sure RLS is DISABLED on detections table.")
else:
    print("[VDD] ✅ Service role key loaded — admin client ready.")


def get_db() -> Client:
    """
    Returns anon Supabase client.
    Used in auth.py for token verification ONLY.
    """
    return supabase


def get_admin_db() -> Client:
    """
    Returns service-role Supabase client.
    Used in all route handlers for DB reads/writes.
    Bypasses RLS — safe because we filter by user_id manually.
    """
    return supabase_admin


def ping_db() -> bool:
    """Quick health check — returns True if Supabase is reachable."""
    try:
        supabase_admin.table("detections").select("id").limit(1).execute()
        return True
    except Exception:
        return False