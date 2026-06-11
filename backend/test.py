from ultralytics import YOLO
import cv2
import os

# Load YOLO model once
model = YOLO("runs/detect/train17/weights/best.pt")


def detect_damage(image_path: str):

    # Run prediction
    results = model.predict(
        source=image_path,
        conf=0.05,
        save=False
    )

    r = results[0]

    damage_count = {}

    if r.boxes is None or len(r.boxes) == 0:
        print("\n <======================= No damages detected =======================>")
    else:
        names = model.names

        for cls in r.boxes.cls:
            label = names[int(cls)]
            damage_count[label] = damage_count.get(label, 0) + 1

    # Print summary
    if damage_count:
        print("\n <================= Damage Summary ========================>")
        for k, v in damage_count.items():
            print(f"{k} : {v}")
    else:
        print("\n <================== Damage Summary Empty ==================>")

    # Get annotated image (boxes + labels)
    annotated_image = r.plot()

    annotated_image = cv2.resize(annotated_image, (800, 800))

    # Create results folder if not exists
    os.makedirs("results", exist_ok=True)

    filename = os.path.basename(image_path)
    output_path = os.path.join("results", filename)

    # Save output image
    cv2.imwrite(output_path, annotated_image)

    print(f"\n <=========== Output image saved as: {output_path} ==============>")

    return output_path


# Optional testing (only runs if file executed directly)
if __name__ == "__main__":

    test_image = "Dataset/test/images/002961.jpg"

    result = detect_damage(test_image)

    print("\nSaved result at:", result)