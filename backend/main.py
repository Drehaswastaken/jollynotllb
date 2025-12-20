import os
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

# 1. Load Environment Variables
from dotenv import load_dotenv
load_dotenv()

# --- IMPORT YOUR AGENTS ---
# Ensure your Hugging Face class is in a file named 'agents.py'
from agents import MootCourtAgents

# 2. Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Legal Strategy AI")

# 3. CORS Setup (Crucial for Vercel -> Render communication)
# Allowing "*" is fine for prototypes. For production, strictly limit to your Vercel domain.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Initialize Agents
# We use a global variable to persist the connection
court_system = None

@app.on_event("startup")
def startup_event():
    global court_system
    try:
        # Check if token exists before initializing to prevent crash loops
        if not os.getenv("HF_TOKEN"):
            logger.warning("HF_TOKEN not found in environment variables! Agents will not start.")
            return

        court_system = MootCourtAgents()
        logger.info("Legal Agents (Hugging Face) initialized successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize agents: {e}")

# 5. Data Models
class SimulationRequest(BaseModel):
    question: str

class MessageResponse(BaseModel):
    agent_name: str
    role: str
    content: str
    metadata: Optional[Dict[str, Any]] = None

# 6. Routes
@app.get("/")
def read_root():
    return {"status": "Legal Strategy AI Online", "backend": "Render + HuggingFace"}

@app.post("/analyze", response_model=List[MessageResponse])
async def run_analysis(request: SimulationRequest):
    logger.info(f"--- Received Case: {request.question} ---")

    # Guard clause: Check if agents are initialized
    if not court_system:
        logger.error("Attempted to run analysis but court_system is None.")
        raise HTTPException(
            status_code=500, 
            detail="AI Agents are not initialized. Please check server logs for HF_TOKEN errors."
        )

    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Case description cannot be empty")
    
    try:
        # Run the strategic analysis
        # Note: The Hugging Face client calls are synchronous, but FastAPI handles this 
        # seamlessly in standard def functions.
        results = court_system.run_simulation(request.question)
        
        # Debug logs
        logger.info(f"Agents returned {len(results)} insights")

        # Convert to API Response format
        response_data = []
        for msg in results:
            response_data.append({
                "agent_name": msg.agent_name,
                "role": msg.role,
                "content": msg.content,
                "metadata": msg.metadata
            })
            
        return response_data

    except Exception as e:
        logger.error(f"Analysis Error: {e}", exc_info=True)
        # Return a clean error message to the frontend
        raise HTTPException(status_code=500, detail=f"Internal Analysis Error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    # Render provides the PORT environment variable automatically
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run(app, host="0.0.0.0", port=port)