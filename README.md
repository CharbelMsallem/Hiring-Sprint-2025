# 🚗 AutoInspect.AI

**AutoInspect.AI** is a full-stack web application designed for vehicle rental businesses to automate and accurately track vehicle damage.

It allows an agent to upload a "pickup" image of a vehicle before rental and a "return" image after. The application's AI backend analyzes both images, identifies all damages, and then compares them to generate a report highlighting only the **new damages** that occurred during the rental period.

This provides an unbiased, fast, and auditable record, helping to resolve disputes and accurately assess repair costs.

# Deployed App

* **Frontend (Vercel):** `https://hiring-sprint-2025-autoinspect.vercel.app/`

* **Backend (Render):** `https://hiring-sprint-2025-autoinspect.onrender.com/`

*(Note: The backend may "spin down" on Render's free plan and take 30-60 seconds to "wake up" on the first request.)*

# 🏛️ Project Architecture

The application is built with a modern decoupled "frontend/backend" architecture.

* **Frontend (React + Vite):** A responsive user interface built in React and bundled with Vite. It handles image uploads and displays the final damage report.

* **Backend (Python + FastAPI):** A powerful API built with FastAPI that receives the images. It uses a **YOLOv8** model (loaded from Hugging Face) to run object detection, identify damages, and compare the two sets of results.

* **Containerization (Docker):** The backend and frontend are both containerized with Docker, allowing for consistent, isolated environments for development and production.

# 🚀 How to Run Locally

You can run the application in two ways:

## 1. Docker Compose (Recommended)

This is the simplest method and mimics the production setup. It builds and runs both the frontend and backend containers.

1. **Prerequisite:** Ensure you have [Docker](https://www.docker.com/products/docker-desktop/) installed and running.

2. From the root of the project, run:

   ```bash
   docker-compose up --build
   ```

3. Open your browser to `http://localhost:8080` (for the Nginx-served frontend).

   * The backend API will be available at `http://localhost:8000`.

## 2. Manual (Individual Services)

This method is useful for development and debugging.

### Backend (FastAPI Server)

1. Navigate to the `backend` directory:

   ```bash
   cd backend
   ```

2. (Recommended) Create and activate a virtual environment:

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install the required Python packages:

   ```bash
   pip install -r requirements.txt
   ```

4. Run the FastAPI server:

   ```bash
   python main.py
   ```

   The backend will be running on `http://localhost:8000`.

### Frontend (Vite Dev Server)

1. Open a **new terminal** and navigate to the `frontend` directory:

   ```bash
   cd frontend
   ```

2. Install the Node.js packages:

   ```bash
   npm install
   ```

3. Run the Vite development server:

   ```bash
   npm run dev
   ```

   The frontend will be running on `http://localhost:3000`. The `vite.config.js` is already set up to proxy API requests from `/api` to your backend at `http://localhost:8000`.

# 🌐 Deployment Explained

The live application is deployed using a "best-of-both-worlds" approach, playing to the strengths of two different platforms:

1. **Backend (Render):**

   * **Service:** The FastAPI backend is deployed on **Render** as a **Docker Web Service**.

   * **Why:** Render is ideal for long-running stateful services. It can run our Docker container, keep the large AI model (PyTorch, YOLOv8) loaded in memory, and handle persistent API requests.

   * **URL:** `https://hiring-sprint-2025-autoinspect.onrender.com/`

2. **Frontend (Vercel):**

   * **Service:** The React frontend is deployed on **Vercel**.

   * **Why:** Vercel is optimized for high-performance static site hosting and serving. It deploys our React app's static files (HTML, JS, CSS) to a global CDN, making the user interface load instantly.

   * **URL:** `https://hiring-sprint-2025-autoinspect.vercel.app/`

## How They Connect

A file named `frontend/vercel.json` tells the Vercel deployment how to handle API calls. It uses a **rewrite rule** to invisibly proxy any request made to `/api/...` on the frontend directly to our backend service running on Render.

**`frontend/vercel.json`:**

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://hiring-sprint-2025-autoinspect.onrender.com/api/:path*"
    }
  ]
}
```

This gives us a seamless user experience (one URL) while using two specialized platforms for the best performance.