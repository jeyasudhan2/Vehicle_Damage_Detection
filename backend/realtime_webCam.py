from ultralytics import YOLO
import cv2

# -- Load trained model
model = YOLO("runs/detect/train15/weights/best.pt")

# -- Open webcam (0 = default camera)
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("<========== Cannot open webcam=============>")
    exit()

print("<=============== Webcam started. Press 'Q' to exit==================================>.")

while True:
    ret, frame = cap.read()
    if not ret:
        print("<================ Failed to grab frame=======================>")
        break

    #  -- Run YOLO prediction
    results = model(frame, conf=0.25)

    r = results[0]
    damage_count = {}

    if r.boxes is not None and len(r.boxes) > 0:
        names = model.names

        for cls in r.boxes.cls:
            label = names[int(cls)]
            damage_count[label] = damage_count.get(label, 0) + 1

    # -- Draw bounding boxes + labels
    annotated_frame = r.plot()

    # -- Create summary text
    y_position = 30
    for damage, count in damage_count.items():
        text = f"{damage}: {count}"
        cv2.putText(annotated_frame, text, (10, y_position),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7,
                    (0, 0, 255), 2)
        y_position += 30

    # -- Show total damage
    total_damage = sum(damage_count.values())
    cv2.putText(annotated_frame,
                f"Total Damage: {total_damage}",
                (10, y_position),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (255, 0, 0),
                2)

    # -- Show window
    cv2.imshow("Vehicle Damage Detection - Live", annotated_frame)

    # --  Press Q to exit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# -- Release camera
cap.release()
cv2.destroyAllWindows()

print("<=============== Webcam closed successfully.============================>")
