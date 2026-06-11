# backend/detector.py
from __future__ import annotations

import os
import uuid
from dataclasses import dataclass, field

import cv2
from ultralytics import YOLO

MODEL_PATH  = os.getenv("YOLO_MODEL_PATH", "runs/detect/train17/weights/best.pt")
model       = YOLO(MODEL_PATH)
OUTPUT_SIZE = 800

DAMAGE_COST: dict[str, float] = {
    "Dent":          850.0,
    "Scratch":       280.0,
    "Crack":         420.0,
    "Broken Glass":  650.0,
    "Paint Chip":    190.0,
    "Bumper Damage": 950.0,
    "Rust":          500.0,
    "Flat Tyre":     200.0,
    "Mirror_Damage": 400.0,
    "Roof_Damage":   750.0,
}
DEFAULT_COST = 400.0


@dataclass
class DamageBox:
    x:          float
    y:          float
    width:      float
    height:     float
    label:      str
    confidence: float


@dataclass
class DetectionOutput:
    image_id:           str
    processed_path:     str
    original_path:      str
    damages:            list[DamageBox] = field(default_factory=list)
    total_damages:      int             = 0
    overall_confidence: float           = 0.0
    estimated_cost:     float           = 0.0
    damage_types:       list[str]       = field(default_factory=list)


def run_detection(image_path: str, results_dir: str = "results") -> DetectionOutput:
    os.makedirs(results_dir, exist_ok=True)

    results = model.predict(source=image_path, conf=0.05, save=False, verbose=False)
    r       = results[0]
    names   = model.names
    img_id  = str(uuid.uuid4())

    damage_boxes: list[DamageBox] = []

    if r.boxes is not None and len(r.boxes) > 0:
        orig_h, orig_w = r.orig_shape
        scale_x = OUTPUT_SIZE / orig_w
        scale_y = OUTPUT_SIZE / orig_h

        for box, cls, conf in zip(
            r.boxes.xyxy.tolist(),
            r.boxes.cls.tolist(),
            r.boxes.conf.tolist(),
        ):
            x_min, y_min, x_max, y_max = box
            damage_boxes.append(DamageBox(
                x          = round(x_min * scale_x, 2),
                y          = round(y_min * scale_y, 2),
                width      = round((x_max - x_min) * scale_x, 2),
                height     = round((y_max - y_min) * scale_y, 2),
                label      = names[int(cls)],
                confidence = round(float(conf), 4),
            ))

    total    = len(damage_boxes)
    avg_conf = round(sum(b.confidence for b in damage_boxes) / total, 4) if total > 0 else 0.0
    types    = sorted({b.label for b in damage_boxes})
    cost     = round(sum(DAMAGE_COST.get(b.label, DEFAULT_COST) for b in damage_boxes), 2)

    annotated      = cv2.resize(r.plot(), (OUTPUT_SIZE, OUTPUT_SIZE))
    proc_filename  = f"{img_id}.jpg"
    processed_path = os.path.join(results_dir, proc_filename)
    cv2.imwrite(processed_path, annotated)

    if damage_boxes:
        print(f"[VDD] {total} damage(s) | conf={avg_conf:.0%} | cost=${cost:,.0f}")
        for b in damage_boxes:
            print(f"      • {b.label:<20} {b.confidence:.0%}")
    else:
        print("[VDD] No damages detected.")

    return DetectionOutput(
        image_id           = img_id,
        processed_path     = os.path.abspath(processed_path),
        original_path      = os.path.abspath(image_path),
        damages            = damage_boxes,
        total_damages      = total,
        overall_confidence = avg_conf,
        estimated_cost     = cost,
        damage_types       = types,
    )