from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import uvicorn
from io import BytesIO  
from model_integration import DamageDetector

app = FastAPI(
    title="Vehicle Condition Assessment API",
    description="AI-powered vehicle damage detection and assessment",
    version="1.0.0"
)

# CORS middleware to allow your frontend to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the detector
detector = DamageDetector()

@app.get("/")
async def root():
    return {"message": "AutoInspect.AI Backend is running!"}

@app.post("/api/analyze")
async def analyze_images(
    pickup_image: UploadFile = File(...),
    return_image: UploadFile = File(...)
):
    """
    This single endpoint handles the comparison.
    It matches the frontend's 'analyzeImages' function
    """
    try:
        # Process pickup image
        pickup_contents = await pickup_image.read()
        pickup_img = Image.open(BytesIO(pickup_contents))
        pickup_detections = detector.detect(pickup_img)
        
        # Process return image
        return_contents = await return_image.read()
        return_img = Image.open(BytesIO(return_contents))
        return_detections = detector.detect(return_img)
        
        # Compare detections to find new damages
        new_damages = detector.compare_detections(pickup_detections, return_detections)
        
        # Calculate summary metrics
        total_cost = sum(d['cost'] for d in new_damages)
        
        severity_score = 0.0
        if new_damages:
            # Create a simple severity score (e.g., average of confidences)
            severity_score = sum(d['confidence'] for d in new_damages) / len(new_damages) * 10
            

        # Return the exact JSON structure the frontend expects
        #
        return {
            "pickup_damages": pickup_detections,
            "return_damages": return_detections,
            "new_damages": new_damages,
            "severity_score": round(severity_score, 1),
            "estimated_cost": round(total_cost, 2)
        }
        
    except Exception as e:
        # Send a clear error message
        print(f"Error during analysis: {e}")
        raise HTTPException(status_code=500, detail=f"Error analyzing images: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)