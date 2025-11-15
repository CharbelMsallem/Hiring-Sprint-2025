import React, { useRef, useEffect, useState } from 'react';

const SEVERITY_COLORS = {
  low: { primary: '#10b981', glow: '#34d399', wave: '#6ee7b7' },      // green
  medium: { primary: '#f59e0b', glow: '#fbbf24', wave: '#fcd34d' },   // orange
  high: { primary: '#ef4444', glow: '#f87171', wave: '#fca5a5' },     // red
  unknown: { primary: '#6b7280', glow: '#9ca3af', wave: '#d1d5db' }   // gray
};

export const AnnotatedImage = ({ imageSrc, detections = [], showLabels = true }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.src = imageSrc;
    
    img.onload = () => {
      // Start animation loop
      const animate = () => {
        setTime(prev => (prev + 0.03) % (Math.PI * 2));
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    };

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [imageSrc]);

  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.src = imageSrc;
    
    img.onload = () => {
      drawAnnotations(img);
    };
  }, [imageSrc, detections, showLabels, time]);

  const drawAnnotations = (img) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match image
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw the image
    ctx.drawImage(img, 0, 0);

    // Draw bounding boxes with futuristic effects
    detections.forEach((detection, index) => {
      const { box_pixels, severity, type, confidence } = detection;
      
      if (!box_pixels || box_pixels.length !== 4) return;

      const [x1, y1, x2, y2] = box_pixels;
      const width = x2 - x1;
      const height = y2 - y1;
      const centerX = (x1 + x2) / 2;
      const centerY = (y1 + y2) / 2;

      // Get colors based on severity
      const colors = SEVERITY_COLORS[severity] || SEVERITY_COLORS.unknown;
      
      // Animated wave offset for this detection
      const waveOffset = Math.sin(time + index * 0.5) * 0.3 + 0.7;

      // Draw outer glow
      ctx.shadowBlur = 25;
      ctx.shadowColor = colors.glow;
      
      // Draw corner brackets (futuristic style)
      const cornerLength = Math.min(width, height) * 0.2;
      ctx.strokeStyle = colors.glow;
      ctx.lineWidth = 4;
      
      // Top-left corner
      ctx.beginPath();
      ctx.moveTo(x1 + cornerLength, y1);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x1, y1 + cornerLength);
      ctx.stroke();
      
      // Top-right corner
      ctx.beginPath();
      ctx.moveTo(x2 - cornerLength, y1);
      ctx.lineTo(x2, y1);
      ctx.lineTo(x2, y1 + cornerLength);
      ctx.stroke();
      
      // Bottom-right corner
      ctx.beginPath();
      ctx.moveTo(x2, y2 - cornerLength);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x2 - cornerLength, y2);
      ctx.stroke();
      
      // Bottom-left corner
      ctx.beginPath();
      ctx.moveTo(x1 + cornerLength, y2);
      ctx.lineTo(x1, y2);
      ctx.lineTo(x1, y2 - cornerLength);
      ctx.stroke();

      // Draw crosshair at center
      ctx.strokeStyle = colors.wave;
      ctx.lineWidth = 2;
      const crossSize = 12;
      ctx.beginPath();
      ctx.moveTo(centerX - crossSize, centerY);
      ctx.lineTo(centerX + crossSize, centerY);
      ctx.moveTo(centerX, centerY - crossSize);
      ctx.lineTo(centerX, centerY + crossSize);
      ctx.stroke();

      // Draw pulsing glow effect
      ctx.shadowBlur = 20 * waveOffset;
      ctx.shadowColor = colors.glow;
      ctx.strokeStyle = colors.primary + Math.floor(waveOffset * 200 + 55).toString(16).padStart(2, '0');
      ctx.lineWidth = 3;
      ctx.strokeRect(x1, y1, width, height);

      // Draw organic/freeform highlight overlay (like your image)
      ctx.save();
      ctx.globalAlpha = 0.15 + waveOffset * 0.1;
      ctx.fillStyle = colors.glow;
      
      // Create organic shape by drawing irregular polygon
      const numPoints = 8;
      const angleStep = (Math.PI * 2) / numPoints;
      ctx.beginPath();
      
      for (let i = 0; i <= numPoints; i++) {
        const angle = i * angleStep + time * 0.2;
        const radiusX = (width / 2) * (0.85 + Math.sin(angle * 3 + time) * 0.15);
        const radiusY = (height / 2) * (0.85 + Math.cos(angle * 2 + time) * 0.15);
        const px = centerX + Math.cos(angle) * radiusX;
        const py = centerY + Math.sin(angle) * radiusY;
        
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Reset shadow
      ctx.shadowBlur = 0;

      if (showLabels) {
        // Draw futuristic label
        const label = `${type.replace('_', ' ').toUpperCase()}`;
        
        ctx.font = 'bold 14px "Courier New", monospace';
        const labelWidth = ctx.measureText(label).width;
        const padding = 12;
        const labelHeight = 28;
        
        // Position label above box, or below if too close to top
        const labelY = y1 > labelHeight + 10 ? y1 - labelHeight - 5 : y2 + 5;
        
        // Draw label background with gradient and glow
        const bgGradient = ctx.createLinearGradient(x1, labelY, x1, labelY + labelHeight);
        bgGradient.addColorStop(0, colors.primary + 'ee');
        bgGradient.addColorStop(1, colors.primary + 'aa');
        
        ctx.shadowBlur = 10;
        ctx.shadowColor = colors.glow;
        ctx.fillStyle = bgGradient;
        
        // Hexagonal label shape
        const hexPath = new Path2D();
        hexPath.moveTo(x1 + 8, labelY);
        hexPath.lineTo(x1 + labelWidth + padding * 2 - 8, labelY);
        hexPath.lineTo(x1 + labelWidth + padding * 2, labelY + labelHeight / 2);
        hexPath.lineTo(x1 + labelWidth + padding * 2 - 8, labelY + labelHeight);
        hexPath.lineTo(x1 + 8, labelY + labelHeight);
        hexPath.lineTo(x1, labelY + labelHeight / 2);
        hexPath.closePath();
        ctx.fill(hexPath);
        
        // Draw border
        ctx.strokeStyle = colors.wave;
        ctx.lineWidth = 1;
        ctx.stroke(hexPath);
        
        ctx.shadowBlur = 0;

        // Draw label text
        ctx.fillStyle = '#ffffff';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 12px "Courier New", monospace';
        ctx.fillText(label, x1 + padding, labelY + labelHeight / 2);
        
        // Draw small pulse indicator
        const pulseSize = 4 + waveOffset * 2;
        ctx.fillStyle = colors.wave;
        ctx.beginPath();
        ctx.arc(x1 + labelWidth + padding * 1.5, labelY + labelHeight / 2, pulseSize, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  };

  return (
    <div className="relative w-full">
      <canvas
        ref={canvasRef}
        className="w-full h-auto rounded-lg"
        style={{ 
          filter: 'contrast(1.05) brightness(1.02)',
          imageRendering: 'crisp-edges'
        }}
      />
      {detections.length > 0 && (
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-cyan-400/30">
          <span className="text-cyan-400 text-xs font-mono font-bold">
            {detections.length} DETECTED
          </span>
        </div>
      )}
    </div>
  );
};