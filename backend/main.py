# main.py
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
import numpy as np
import cv2
from PIL import Image
import io

# =======================
# 1️⃣ Initialize FastAPI
# =======================
app = FastAPI()

# Allow requests from React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =======================
# 2️⃣ Load EMNIST Model
# =======================
MODEL_PATH = "./emnist_byclass_model.keras"
model = load_model(MODEL_PATH)
print("✅ EMNIST model loaded successfully!")

# EMNIST classes (0–61 for EMNIST ByClass)
# These mappings depend on how your model was trained
# Here’s a standard one for EMNIST ByClass:
emnist_labels = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
    'U', 'V', 'W', 'X', 'Y', 'Z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z'
]

# =======================
# 3️⃣ Helper: Preprocess
# =======================
def preprocess_image(image_bytes):
    """Convert uploaded image to grayscale numpy array."""
    image = Image.open(io.BytesIO(image_bytes)).convert("L")  # grayscale
    img = np.array(image)
    return img

# =======================
# 4️⃣ Helper: Find Characters
# =======================
def extract_characters(img):
    """Detect and crop each character using contours."""
    # Threshold the image (invert: black background, white text)
    _, thresh = cv2.threshold(img, 128, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    # Find contours of each character
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Sort contours from left to right (based on x-coordinate)
    contours = sorted(contours, key=lambda ctr: cv2.boundingRect(ctr)[0])

    chars = []
    for ctr in contours:
        x, y, w, h = cv2.boundingRect(ctr)
        if w > 5 and h > 5:  # filter noise
            char_crop = thresh[y:y + h, x:x + w]
            char_resized = cv2.resize(char_crop, (28, 28))
            char_resized = char_resized / 255.0
            char_resized = np.expand_dims(char_resized, axis=(0, -1))  # (1,28,28,1)
            chars.append(char_resized)
    return chars

# =======================
# 5️⃣ Routes
# =======================

@app.get("/")
def root():
    return {"message": "✍️ EMNIST Handwriting Recognition API is running!"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """Predict word from uploaded handwritten image."""
    image_bytes = await file.read()
    img = preprocess_image(image_bytes)
    characters = extract_characters(img)

    if not characters:
        return {"error": "No characters detected!"}

    predictions = []
    for ch in characters:
        pred = model.predict(ch)
        predicted_idx = int(np.argmax(pred))
        predictions.append(emnist_labels[predicted_idx])

    predicted_text = "".join(predictions)
    return {"predicted_text": predicted_text, "characters_detected": len(predictions)}



