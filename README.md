# 🚀 Day 1 - Setup Instructions

## Project Structure

```
vehicle-damage-detection/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── README.md
└── frontend/
    ├── src/
    │   └── App.jsx
    ├── package.json
    └── README.md
```

---

## 🔧 Backend Setup (FastAPI)

### 1. Create Backend Directory
```bash
mkdir -p vehicle-damage-detection/backend
cd vehicle-damage-detection/backend
```

### 2. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the Server
```bash
python main.py
```

Server will run on: **http://localhost:8000**

Test it: http://localhost:8000/docs (Swagger UI)

---

## 🎨 Frontend Setup (React + Vite)

### 1. Create React App with Vite
```bash
cd ..
npm create vite@latest frontend -- --template react
cd frontend
```

### 2. Install Dependencies
```bash
npm install
npm install lucide-react
```

### 3. Replace `src/App.jsx` with the provided code

### 4. Update `src/index.css` (optional styling)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 5. Install Tailwind CSS
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 6. Configure `tailwind.config.js`
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 7. Run Development Server
```bash
npm run dev
```

Frontend will run on: **http://localhost:5173**

---

## 🧪 Test the Application

1. **Backend**: Open http://localhost:8000/docs
   - Test `/health` endpoint
   - Try `/api/detect` with an image

2. **Frontend**: Open http://localhost:5173
   - Upload a car image
   - Click "Detect Damage"
   - View mock results

---

## 🤖 Next Steps (Integrate Real AI Model)

### Option 1: Hugging Face Inference API (Easiest)
```python
import requests

HF_API_URL = "https://api-inference.huggingface.co/models/keremberke/yolov8m-car-damage-detection"
HF_TOKEN = "your_token_here"  # Get from huggingface.co/settings/tokens

def detect_damage_hf(image_bytes):
    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    response = requests.post(HF_API_URL, headers=headers, data=image_bytes)
    return response.json()
```

### Option 2: Load Model Locally
```python
from transformers import pipeline

# Initialize once at startup
damage_detector = pipeline(
    "object-detection",
    model="keremberke/yolov8m-car-damage-detection"
)

def detect_damage_local(image):
    results = damage_detector(image)
    return results
```

### Popular Models to Try:
1. `keremberke/yolov8m-car-damage-detection` ⭐ Recommended
2. `keremberke/yolov5m-car-damage-detection`
3. `nickmuchi/yolos-small-finetuned-car-damage-detection`

---

## 📝 Day 1 Checklist

- [x] FastAPI backend with `/detect` endpoint
- [x] React frontend with image upload
- [x] Drag & drop functionality
- [x] Mock damage detection working
- [x] Results display with severity colors
- [ ] Integrate real HF model
- [ ] Test with actual car damage images

---

## 🐛 Common Issues

**CORS Error?**
- Backend is already configured with CORS middleware
- Make sure backend is running on port 8000

**Module not found?**
- Activate virtual environment
- Run `pip install -r requirements.txt`

**Frontend not connecting?**
- Check `API_URL` in App.jsx matches backend URL
- Ensure backend is running

---

## 🎯 Tomorrow (Day 2)

1. Implement comparison feature (pickup vs return)
2. Add bounding box visualization
3. Create report/export functionality
4. Deploy to Vercel + Render
5. Polish UI/UX

Good luck! 🚀