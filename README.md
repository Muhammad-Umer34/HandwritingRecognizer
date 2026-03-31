# ✍️ HandwritingRecognizer (Handwriting Recognition with FastAPI)

## 📌 Overview
HandwritingRecognizer is a full-stack AI application that allows users to draw characters on a digital canvas and converts them into text using a trained EMNIST model. The frontend captures the drawing, sends it to a FastAPI backend, where image processing and character prediction are performed.

---

## 🚀 Features
- 🖊️ Interactive drawing canvas (frontend)
- ⚡ FastAPI backend for high-performance APIs
- 🔍 Character segmentation using OpenCV (contours)
- 🤖 EMNIST-trained model for prediction
- 🔠 Converts handwritten input into digital text

---

## 🧠 Tech Stack
**Frontend:**
- HTML, CSS, JavaScript (Canvas API)

**Backend:**
- FastAPI
- Uvicorn

**Machine Learning:**
- EMNIST Dataset
- TensorFlow / PyTorch

**Image Processing:**
- OpenCV

---

## ⚙️ How It Works
1. User draws on the canvas.
2. Image is sent to FastAPI backend.
3. Backend processes image:
   - Grayscale conversion
   - Thresholding
   - Contour detection (character segmentation)
4. Each character is resized (28x28) and passed to the model.
5. Model predicts characters.
6. Final text is returned to frontend.

---

## 📁 Project Structure
```
project-root/
│── handwritting-app
│── backend/           # FastAPI server
│   │── main.py        # FastAPI app
│   │── routes/        # API endpoints
│   │── utils/         # Image processing
│── README.md
```

---

## ▶️ Getting Started

### 1. Clone Repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Backend Setup (FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend will run at:
```
http://127.0.0.1:8000
```

Swagger Docs:
```
http://127.0.0.1:8000/docs
```

---

### 3. Frontend Setup
- Open `frontend/index.html` in browser  
**OR**
- Use Live Server in VS Code

---

## 📡 API Endpoint Example

### POST `/predict`
**Description:** Sends image and returns predicted text  

**Request:**  
- Image (base64 or file)

**Response:**
```json
{
  "prediction": "HELLO"
}
```

---

## 📦 Requirements
- Python 3.x
- FastAPI
- Uvicorn
- OpenCV
- NumPy
- TensorFlow 

---

## 📊 Model Details
- Dataset: EMNIST
- Input size: 28x28
- Preprocessing:
  - Grayscale
  - Normalization
  - Resizing

---

## ⚠️ Notes
- Works best with clearly separated characters.
- Large model files may require Git LFS.
- Accuracy depends on handwriting quality.

---

## 🔮 Future Improvements
- Word-level recognition
- Improved segmentation for cursive writing
- Real-time predictions
- Better UI/UX

