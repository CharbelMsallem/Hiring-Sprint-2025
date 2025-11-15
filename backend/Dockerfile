# --- Build Stage ---
FROM python:3.10 AS builder

# ADDED: Install OpenCV's system dependencies
# We now add libgl1 AND libglib2.0-0
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0

WORKDIR /app

# Create a virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download the Hugging Face model
COPY backend/model_integration.py .
RUN python -c "from model_integration import DamageDetector; DamageDetector()"

# --- Final Stage ---
FROM python:3.10-slim

# ADDED: Install the same dependencies for the final, slim image
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user for security
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
ENV HOME=/home/appuser

# Copy the virtual environment from the builder
COPY --from=builder --chown=appuser:appgroup /opt/venv /opt/venv

# Copy the pre-downloaded model cache from the builder
COPY --from=builder --chown=appuser:appgroup /root/.cache/huggingface $HOME/.cache/huggingface

# Set up the app directory
WORKDIR $HOME/app
COPY backend/main.py backend/model_integration.py ./
RUN chown -R appuser:appgroup $HOME

# Switch to the non-root user
USER appuser

# Set environment variables for the venv
ENV PATH="/opt/venv/bin:$PATH"

# Expose the port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]