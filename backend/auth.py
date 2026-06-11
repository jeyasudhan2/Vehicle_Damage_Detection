# backend/auth.py
# ──────────────────────────────────────────────────────────────────
# Supabase JWT Authentication (FIXED VERSION)
#
# ✔ Uses dedicated ANON client (correct way)
# ✔ No dependency confusion
# ✔ Better error handling & debug logs
# ✔ Safe for production
# ──────────────────────────────────────────────────────────────────

from __future__ import annotations

import os
from dataclasses import dataclass

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from supabase import create_client, Client
from dotenv import load_dotenv

# ──────────────────────────────────────────────────────────────────
# Load environment variables
# ──────────────────────────────────────────────────────────────────
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_KEY")  # must be ANON key

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    raise RuntimeError(" Missing SUPABASE_URL or SUPABASE_KEY in .env")

# ──────────────────────────────────────────────────────────────────
# Create dedicated AUTH client (IMPORTANT)
# ──────────────────────────────────────────────────────────────────
auth_client: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

bearer_scheme = HTTPBearer()


# ──────────────────────────────────────────────────────────────────
# Auth User Model
# ──────────────────────────────────────────────────────────────────
@dataclass
class AuthUser:
    id: str
    email: str


# ──────────────────────────────────────────────────────────────────
# Dependency: Get Current User
# ──────────────────────────────────────────────────────────────────
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> AuthUser:
    """
    Verifies Supabase JWT token using:
        supabase.auth.get_user(token)

    Frontend must send:
        Authorization: Bearer <access_token>
    """

  
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=" Missing authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials

    try:
     
        response = auth_client.auth.get_user(token)

        if not response or not response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=" Invalid or expired token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user = response.user

        uid = str(user.id)
        email = user.email or ""

        print(f"[AUTH]  Verified: {email} ({uid[:8]}...)")

        return AuthUser(id=uid, email=email)

    except HTTPException:
        raise

    except Exception as e:
    
        print("\n[AUTH ERROR]")
        print("URL:", SUPABASE_URL)
        print("ERROR:", repr(e))
        print()

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=" Authentication service unreachable",
            headers={"WWW-Authenticate": "Bearer"},
        )