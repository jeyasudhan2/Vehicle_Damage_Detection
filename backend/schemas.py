# backend/schemas.py
from __future__ import annotations
import uuid
from typing import Literal, Optional
from pydantic import BaseModel, Field


class BoundingBox(BaseModel):
    x:          float
    y:          float
    width:      float
    height:     float
    label:      str
    confidence: float


class DetectionResult(BaseModel):
    id:                 str  = Field(default_factory=lambda: str(uuid.uuid4()))
    imageUrl:           str
    processedImageUrl:  str
    damages:            list[BoundingBox]
    totalDamages:       int
    overallConfidence:  float
    estimatedCost:      float
    damageTypes:        list[str]
    timestamp:          str
    userEmail:          Optional[str] = None


class HistoryItem(BaseModel):
    id:             str
    thumbnailUrl:   str
    date:           str
    damageTypes:    list[str]
    confidence:     float
    estimatedCost:  float
    status:         Literal["completed", "processing", "failed"] = "completed"
    userEmail:      Optional[str] = None


class HealthResponse(BaseModel):
    status:   str
    database: str
    version:  str