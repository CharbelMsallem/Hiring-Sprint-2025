from ultralytics import YOLO
from huggingface_hub import hf_hub_download
from PIL import Image

from typing import List, Dict

class DamageDetector:
    """
    YOLOv8 model wrapper for vehicle damage detection
    """
    
    # Damage classes and their properties
    # These names MUST match the order from your data.yaml fix
    DAMAGE_CLASSES = {
        0: {"name": "crack", "severity": "medium", "base_cost": 150},
        1: {"name": "dent", "severity": "medium", "base_cost": 200},
        2: {"name": "glass_shatter", "severity": "high", "base_cost": 400},
        3: {"name": "lamp_broken", "severity": "high", "base_cost": 250},
        4: {"name": "scratch", "severity": "low", "base_cost": 100},
        5: {"name": "tire_flat", "severity": "medium", "base_cost": 120}
    }
    
    def __init__(self, model_repo: str = "CharbelMsalem/yolov8m-finetuned-datamatics-damage"):
        """
        Initialize the damage detector
        """
        self.model = None
        self.model_repo = model_repo
        self._load_model()
    
    def _load_model(self):
        """
        Download and load the YOLOv8 model from Hugging Face
        """
        try:
            print(f"Downloading model from {self.model_repo}...")
            model_path = hf_hub_download(
                repo_id=self.model_repo,
                filename="best.pt"
            )
            print(f"Model downloaded to: {model_path}")
            self.model = YOLO(model_path)
            # The line that was here is gone
            print("Model loaded successfully!")
            
        except Exception as e:
            print(f"Error loading model: {e}")
            raise
    
    def is_loaded(self) -> bool:
        """Check if model is loaded"""
        return self.model is not None
    
    def detect(self, image: Image.Image, conf_threshold: float = 0.25) -> List[Dict]:
        """
        Detect damages in an image
        """
        if not self.is_loaded():
            raise RuntimeError("Model not loaded")
        
        results = self.model.predict(image, conf=conf_threshold, verbose=False)
        
        detections = []
        for result in results:
            for box in result.boxes:
                class_id = int(box.cls[0])
                confidence = float(box.conf[0])
                bbox_normalized = box.xyxyn.tolist()[0] # [x1_norm, y1_norm, x2_norm, y2_norm]
                
                damage_info = self.DAMAGE_CLASSES.get(class_id, {
                    "name": f"unknown_{class_id}",
                    "severity": "unknown",
                    "base_cost": 0
                })
                
                # Mocked cost/severity for the frontend
                estimated_cost = damage_info["base_cost"] * (1 + confidence)

                detections.append({
                    "type": damage_info["name"],
                    "confidence": round(confidence, 3),
                    "box": [round(x, 2) for x in bbox_normalized], # Use normalized coordinates
                    "severity": damage_info["severity"],
                    "cost": round(estimated_cost, 2),
                    "location": "Mocked Location" # Frontend expects this
                })
        
        return detections
    
    def compare_detections(
        self, 
        pickup_detections: List[Dict], 
        return_detections: List[Dict],
        iou_threshold: float = 0.3
    ) -> List[Dict]:
        """
        Compare pickup and return detections to find new damages
        """
        new_damages = []
        
        for return_det in return_detections:
            is_new = True
            return_bbox = return_det["box"]
            return_class = return_det["type"]
            
            for pickup_det in pickup_detections:
                pickup_bbox = pickup_det["box"]
                pickup_class = pickup_det["type"]
                
                if return_class != pickup_class:
                    continue
                
                iou = self._calculate_iou(return_bbox, pickup_bbox)
                
                if iou > iou_threshold:
                    is_new = False
                    break
            
            if is_new:
                new_damages.append(return_det)
        
        return new_damages
    
    @staticmethod
    def _calculate_iou(box1: List[float], box2: List[float]) -> float:
        """
        Calculate IoU between two *normalized* boxes [x1, y1, x2, y2]
        """
        x1 = max(box1[0], box2[0])
        y1 = max(box1[1], box2[1])
        x2 = min(box1[2], box2[2])
        y2 = min(box1[3], box2[3])
        
        intersection = max(0, x2 - x1) * max(0, y2 - y1)
        
        area1 = (box1[2] - box1[0]) * (box1[3] - box1[1])
        area2 = (box2[2] - box2[0]) * (box2[3] - box2[1])
        union = area1 + area2 - intersection
        
        if union == 0:
            return 0.0
        
        return intersection / union