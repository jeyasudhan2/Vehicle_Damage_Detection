# backend/main.py
# ──────────────────────────────────────────────────────────────────
# Vehicle Damage Detection — FastAPI + Supabase + JWT Auth
# Version 4.1 — Fixed RLS issue using service role key
#
# Key fix: All DB operations use get_admin_db() (service role key)
#          which bypasses RLS. User filtering is done manually via
#          .eq("user_id", user.id) in every query.
#
# Endpoints:
#   GET    /                        → health check (public)
#   POST   /detect                  → upload + YOLO + save (auth required)
#   GET    /api/history             → current user's history (auth required)
#   GET    /api/detect/{id}         → single detection (auth required)
#   DELETE /api/detect/{id}         → delete own detection (auth required)
#   GET    /uploads/{filename}      → serve original images
#   GET    /results/{filename}      → serve annotated images
# ──────────────────────────────────────────────────────────────────

from __future__ import annotations

import os
import shutil
import uuid
from datetime import datetime, timezone

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, File, HTTPException, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from supabase import Client

from auth     import AuthUser, get_current_user
from database import get_db, get_admin_db, ping_db
from detector import DamageBox, run_detection
from schemas  import BoundingBox, DetectionResult, HealthResponse, HistoryItem

load_dotenv()

# ── Config ────────────────────────────────────────────────────────
BASE_URL    = os.getenv("BASE_URL",    "http://127.0.0.1:8000")
UPLOAD_DIR  = os.getenv("UPLOAD_DIR",  "uploads")
RESULTS_DIR = os.getenv("RESULTS_DIR", "results")

CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

os.makedirs(UPLOAD_DIR,  exist_ok=True)
os.makedirs(RESULTS_DIR, exist_ok=True)

# ── App ───────────────────────────────────────────────────────────
app = FastAPI(
    title       = "Vehicle Damage Detection API",
    description = "YOLO + Supabase + JWT Auth — v4.1",
    version     = "4.1.0",
    docs_url    = "/docs",
)

# CORS — hardcoded to avoid env parsing issues
app.add_middleware(
    CORSMiddleware,
    allow_origins     = CORS_ORIGINS,
    allow_credentials = True,
    allow_methods     = ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers     = ["*"],
    expose_headers    = ["*"],
)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR),  name="uploads")
app.mount("/results", StaticFiles(directory=RESULTS_DIR), name="results")


# ── Converters ────────────────────────────────────────────────────
def _box_to_schema(b: DamageBox) -> BoundingBox:
    return BoundingBox(
        x=b.x, y=b.y, width=b.width, height=b.height,
        label=b.label, confidence=b.confidence,
    )


def _row_to_result(row: dict) -> DetectionResult:
    return DetectionResult(
        id                = row["id"],
        imageUrl          = f"{BASE_URL}/uploads/{row['original_filename']}",
        processedImageUrl = f"{BASE_URL}/results/{row['processed_image_path']}",
        damages           = [BoundingBox(**b) for b in row["damages"]],
        totalDamages      = row["total_damages"],
        overallConfidence = row["overall_confidence"],
        estimatedCost     = row["estimated_cost"],
        damageTypes       = row["damage_types"],
        timestamp         = row["timestamp"],
        userEmail         = row.get("user_email"),
    )


def _row_to_history(row: dict) -> HistoryItem:
    return HistoryItem(
        id            = row["id"],
        thumbnailUrl  = f"{BASE_URL}/results/{row['processed_image_path']}",
        date          = row["timestamp"][:10],
        damageTypes   = row["damage_types"],
        confidence    = row["overall_confidence"],
        estimatedCost = row["estimated_cost"],
        status        = row["status"],
        userEmail     = row.get("user_email"),
    )


# ════════════════════════════════════════════════════════════════
# ROUTES
# ════════════════════════════════════════════════════════════════

# ── GET / — Health check (public) ────────────────────────────────
@app.get("/", response_model=HealthResponse, tags=["System"])
def health_check():
    db_ok = ping_db()
    return HealthResponse(
        status   = "ok" if db_ok else "degraded",
        database = "connected" if db_ok else "unreachable",
        version  = "4.1.0",
    )


# ── POST /detect — Upload + YOLO + Save ──────────────────────────
@app.post(
    "/detect",
    response_model = DetectionResult,
    status_code    = status.HTTP_201_CREATED,
    tags           = ["Detection"],
    summary        = "Upload vehicle image and detect damage",
)
async def detect_vehicle_damage(
    file: UploadFile = File(..., description="Vehicle photo (JPEG/PNG/WebP)"),
    db:   Client     = Depends(get_admin_db),      # ← service role — bypasses RLS
    user: AuthUser   = Depends(get_current_user),  # ← auth required
):
    """
    1. Validate file is an image
    2. Save to /uploads/ with UUID filename
    3. Run YOLO inference
    4. Insert result into Supabase linked to user_id
    5. Return DetectionResult JSON
    """

    # Validate
    content_type = file.content_type or ""
    if not content_type.startswith("image/"):
        raise HTTPException(
            status_code = status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail      = f"Must be an image. Got: '{content_type}'",
        )

    # Save upload
    ext         = os.path.splitext(file.filename or "img.jpg")[-1].lower() or ".jpg"
    saved_name  = f"{uuid.uuid4()}{ext}"
    upload_path = os.path.join(UPLOAD_DIR, saved_name)

    with open(upload_path, "wb") as buf:
        shutil.copyfileobj(file.file, buf)

    # YOLO inference
    output = run_detection(upload_path, results_dir=RESULTS_DIR)

    # Build Supabase row
    damages_json = [
        {
            "x": b.x, "y": b.y,
            "width": b.width, "height": b.height,
            "label": b.label, "confidence": b.confidence,
        }
        for b in output.damages
    ]

    row = {
        "id":                   output.image_id,
        "user_id":              str(user.id),     # UUID string
        "user_email":           user.email,
        "original_filename":    saved_name,
        "processed_image_path": os.path.basename(output.processed_path),
        "damages":              damages_json,
        "damage_types":         output.damage_types,
        "total_damages":        output.total_damages,
        "overall_confidence":   output.overall_confidence,
        "estimated_cost":       output.estimated_cost,
        "timestamp":            datetime.now(timezone.utc).isoformat(),
        "status":               "completed",
    }

    # INSERT into Supabase (admin client bypasses RLS)
    resp = db.table("detections").insert(row).execute()

    if not resp.data:
        raise HTTPException(
            status_code = status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail      = "Failed to save detection result to Supabase.",
        )

    saved = resp.data[0]

    return DetectionResult(
        id                = saved["id"],
        imageUrl          = f"{BASE_URL}/uploads/{saved_name}",
        processedImageUrl = f"{BASE_URL}/results/{os.path.basename(output.processed_path)}",
        damages           = [_box_to_schema(b) for b in output.damages],
        totalDamages      = saved["total_damages"],
        overallConfidence = saved["overall_confidence"],
        estimatedCost     = saved["estimated_cost"],
        damageTypes       = saved["damage_types"],
        timestamp         = saved["timestamp"],
        userEmail         = saved.get("user_email"),
    )


# ── GET /api/history — Current user's detections ─────────────────
@app.get(
    "/api/history",
    response_model = list[HistoryItem],
    tags           = ["Detection"],
    summary        = "Get current user's detection history",
)
def get_history(
    limit: int   = 20,
    skip:  int   = 0,
    db:    Client    = Depends(get_admin_db),      # ← service role
    user:  AuthUser  = Depends(get_current_user),  # ← auth required
):
    """Returns only the current user's detections, newest first."""
    resp = (
        db.table("detections")
        .select(
            "id, processed_image_path, timestamp, user_email, "
            "damage_types, overall_confidence, estimated_cost, status"
        )
        .eq("user_id", str(user.id))          # ← filter by current user
        .order("timestamp", desc=True)
        .range(skip, skip + min(limit, 100) - 1)
        .execute()
    )

    return [_row_to_history(row) for row in resp.data]


# ── GET /api/detect/{id} — Single detection ───────────────────────
@app.get(
    "/api/detect/{detection_id}",
    response_model = DetectionResult,
    tags           = ["Detection"],
    summary        = "Get a single detection by ID",
)
def get_detection_by_id(
    detection_id: str,
    db:   Client   = Depends(get_admin_db),
    user: AuthUser = Depends(get_current_user),
):
    resp = (
        db.table("detections")
        .select("*")
        .eq("id", detection_id)
        .eq("user_id", str(user.id))   # ← must belong to this user
        .execute()
    )

    if not resp.data:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail      = f"Detection '{detection_id}' not found.",
        )

    return _row_to_result(resp.data[0])


# ── DELETE /api/detect/{id} — Delete own detection ───────────────
@app.delete(
    "/api/detect/{detection_id}",
    status_code = status.HTTP_204_NO_CONTENT,
    tags        = ["Detection"],
    summary     = "Delete a detection and its image files",
)
def delete_detection(
    detection_id: str,
    db:   Client   = Depends(get_admin_db),
    user: AuthUser = Depends(get_current_user),
):
    resp = (
        db.table("detections")
        .select("original_filename, processed_image_path")
        .eq("id", detection_id)
        .eq("user_id", str(user.id))
        .execute()
    )

    if not resp.data:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail      = f"Detection '{detection_id}' not found.",
        )

    row = resp.data[0]

    # Delete image files from disk
    for path in (
        os.path.join(UPLOAD_DIR,  row["original_filename"]),
        os.path.join(RESULTS_DIR, row["processed_image_path"]),
    ):
        try:
            os.remove(path)
        except FileNotFoundError:
            pass

    db.table("detections").delete().eq("id", detection_id).eq("user_id", str(user.id)).execute()