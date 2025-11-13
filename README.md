# 🚗 AutoInspect.AI 

AI-powered vehicle damage detection for rental businesses.

## WHAT HAS BEEN DONE TILL NOW?

Scafoldded the project using AI and installed all dependencies.

## What is this?

A web app that lets you:

1. Upload 2 vehicle images (pick-up and return)
2. Detect damages using AI
3. Get a comparison report

## Project Setup

### Backend (FastAPI)

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

Server runs at: http://localhost:8000

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

App runs at: http://localhost:3000

---

## Stack

- **Backend:** FastAPI + Python
- **Frontend:** React + Vite + Tailwind CSS
- **AI Model:** Hugging Face (facebook/detr-resnet50)
- **Styling:** Tailwind CSS + Lucide Icons
